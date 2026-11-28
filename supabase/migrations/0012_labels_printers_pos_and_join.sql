-- ============================================================================
-- Migration: 0012_labels_printers_pos_and_join.sql
-- Purpose:   Extend Printers, Receipt Templates, Sales, Members & Settings;
--            add Label Templates, Pending Label Batches (LB-*), POS Favorites,
--            Staff Invitations (/join), Couriers, and Messaging/Chatbot tables.
-- Notes:     Idempotent & additive on top of migrations 0001-0011.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ALTER EXISTING TABLES (PRINTERS, RECEIPTS, SALES, SECURITY & SETTINGS)
-- ============================================================================

-- 1.1 printers: receipt vs label roles, DPI, media size, transport details
ALTER TABLE public.printers
  ADD COLUMN IF NOT EXISTS printer_role TEXT NOT NULL DEFAULT 'receipt',
  ADD COLUMN IF NOT EXISTS dpi INTEGER NOT NULL DEFAULT 203,
  ADD COLUMN IF NOT EXISTS label_media_size TEXT DEFAULT '38x25',
  ADD COLUMN IF NOT EXISTS print_mode TEXT NOT NULL DEFAULT 'browser',
  ADD COLUMN IF NOT EXISTS network_host TEXT,
  ADD COLUMN IF NOT EXISTS network_port INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_printers_role' AND conrelid = 'public.printers'::regclass
  ) THEN
    ALTER TABLE public.printers
      ADD CONSTRAINT chk_printers_role CHECK (printer_role IN ('receipt', 'label', 'both'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_printers_dpi' AND conrelid = 'public.printers'::regclass
  ) THEN
    ALTER TABLE public.printers
      ADD CONSTRAINT chk_printers_dpi CHECK (dpi IN (203, 300, 600));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_printers_print_mode' AND conrelid = 'public.printers'::regclass
  ) THEN
    ALTER TABLE public.printers
      ADD CONSTRAINT chk_printers_print_mode
      CHECK (print_mode IN ('browser', 'escpos_usb', 'escpos_network', 'tspl_label', 'zpl_label', 'bluetooth'));
  END IF;
END $$;

-- 1.2 receipt_templates: full Print Studio / thermal receipt customization
ALTER TABLE public.receipt_templates
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS logo_attachment_id UUID REFERENCES public.files_attachments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS show_logo BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_ntn BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_customer BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_powered_by BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS return_window_days INTEGER NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS template_version INTEGER NOT NULL DEFAULT 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_receipt_templates_return_days' AND conrelid = 'public.receipt_templates'::regclass
  ) THEN
    ALTER TABLE public.receipt_templates
      ADD CONSTRAINT chk_receipt_templates_return_days CHECK (return_window_days >= 0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_receipt_templates_language' AND conrelid = 'public.receipt_templates'::regclass
  ) THEN
    ALTER TABLE public.receipt_templates
      ADD CONSTRAINT chk_receipt_templates_language CHECK (language IN ('en', 'ur', 'bilingual'));
  END IF;
END $$;

-- 1.3 sales & sale_items: rounding & M8 offer tracking
ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS rounding_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS offer_discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS applied_offers JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.sale_items
  ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offer_discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_sale_items_offer_id
  ON public.sale_items (offer_id)
  WHERE offer_id IS NOT NULL;

-- 1.4 business_members: hashed counter PIN (never store plaintext PINs)
ALTER TABLE public.business_members
  ADD COLUMN IF NOT EXISTS counter_pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS pin_updated_at TIMESTAMPTZ;

-- 1.5 business_settings: security thresholds, khata limit, rounding & login policy
ALTER TABLE public.business_settings
  ADD COLUMN IF NOT EXISTS cashier_max_refund_amount NUMERIC(14,2) NOT NULL DEFAULT 2000,
  ADD COLUMN IF NOT EXISTS cashier_max_cashout_amount NUMERIC(14,2) NOT NULL DEFAULT 5000,
  ADD COLUMN IF NOT EXISTS require_approval_price_override BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS require_approval_void BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS approval_mode TEXT NOT NULL DEFAULT 'pin',
  ADD COLUMN IF NOT EXISTS default_khata_limit NUMERIC(14,2) NOT NULL DEFAULT 50000,
  ADD COLUMN IF NOT EXISTS rounding_increment NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS phone_login_bypass_enabled BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_business_settings_approval_mode' AND conrelid = 'public.business_settings'::regclass
  ) THEN
    ALTER TABLE public.business_settings
      ADD CONSTRAINT chk_business_settings_approval_mode
      CHECK (approval_mode IN ('pin', 'owner_only', 'disabled'));
  END IF;
END $$;

-- ============================================================================
-- 2. LABELS STUDIO: TEMPLATES & PENDING STICKER BATCHES (LB-*)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.label_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  media_size TEXT NOT NULL DEFAULT '38x25',
  dpi INTEGER NOT NULL DEFAULT 203 CHECK (dpi IN (203, 300, 600)),
  barcode_format TEXT NOT NULL DEFAULT 'CODE128' CHECK (barcode_format IN ('CODE128', 'EAN13', 'QR')),
  show_shop_name BOOLEAN NOT NULL DEFAULT true,
  show_sku BOOLEAN NOT NULL DEFAULT true,
  show_size BOOLEAN NOT NULL DEFAULT true,
  show_price BOOLEAN NOT NULL DEFAULT true,
  show_sale_price BOOLEAN NOT NULL DEFAULT true,
  layout_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_label_templates_business_id ON public.label_templates (business_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_label_templates_single_default
  ON public.label_templates (business_id)
  WHERE is_default = true;

DROP TRIGGER IF EXISTS trg_label_templates_updated_at ON public.label_templates;
CREATE TRIGGER trg_label_templates_updated_at
  BEFORE UPDATE ON public.label_templates
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.label_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS label_templates_select_member ON public.label_templates;
CREATE POLICY label_templates_select_member ON public.label_templates
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS label_templates_manage ON public.label_templates;
CREATE POLICY label_templates_manage ON public.label_templates
  FOR ALL
  USING (
    public.has_permission(business_id, 'settings.manage')
    OR public.has_permission(business_id, 'inventory.manage')
  )
  WITH CHECK (
    public.has_permission(business_id, 'settings.manage')
    OR public.has_permission(business_id, 'inventory.manage')
  );

CREATE TABLE IF NOT EXISTS public.label_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  batch_number TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'manual'
    CHECK (source_type IN ('receive', 'carton', 'manual', 'price_change', 'reprint')),
  source_id UUID,
  template_id UUID REFERENCES public.label_templates(id) ON DELETE SET NULL,
  printer_id UUID REFERENCES public.printers(id) ON DELETE SET NULL,
  media_size TEXT NOT NULL DEFAULT '38x25',
  dpi INTEGER NOT NULL DEFAULT 203 CHECK (dpi IN (203, 300, 600)),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'partially_printed', 'printed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  printed_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  printed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_label_batches_business_no UNIQUE (business_id, batch_number)
);

CREATE INDEX IF NOT EXISTS idx_label_batches_branch_status
  ON public.label_batches (branch_id, status, created_at DESC);

DROP TRIGGER IF EXISTS trg_label_batches_updated_at ON public.label_batches;
CREATE TRIGGER trg_label_batches_updated_at
  BEFORE UPDATE ON public.label_batches
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.label_batches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS label_batches_select_branch ON public.label_batches;
CREATE POLICY label_batches_select_branch ON public.label_batches
  FOR SELECT USING (public.has_branch_access(business_id, branch_id));
DROP POLICY IF EXISTS label_batches_manage ON public.label_batches;
CREATE POLICY label_batches_manage ON public.label_batches
  FOR ALL
  USING (
    public.has_branch_access(business_id, branch_id)
    AND (
      public.has_permission(business_id, 'inventory.manage')
      OR public.has_permission(business_id, 'purchasing.receive')
      OR public.has_permission(business_id, 'pos.sell')
    )
  )
  WITH CHECK (
    public.has_branch_access(business_id, branch_id)
    AND (
      public.has_permission(business_id, 'inventory.manage')
      OR public.has_permission(business_id, 'purchasing.receive')
      OR public.has_permission(business_id, 'pos.sell')
    )
  );

CREATE TABLE IF NOT EXISTS public.label_batch_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  label_batch_id UUID NOT NULL REFERENCES public.label_batches(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  requested_qty INTEGER NOT NULL CHECK (requested_qty > 0),
  printed_qty INTEGER NOT NULL DEFAULT 0 CHECK (printed_qty >= 0),
  cancelled_qty INTEGER NOT NULL DEFAULT 0 CHECK (cancelled_qty >= 0),
  barcode_snapshot TEXT NOT NULL,
  sku_snapshot TEXT,
  product_name_snapshot TEXT NOT NULL,
  variant_label_snapshot TEXT NOT NULL DEFAULT '',
  price_snapshot NUMERIC(14,2) NOT NULL DEFAULT 0,
  sale_price_snapshot NUMERIC(14,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_label_batch_items_counts CHECK ((printed_qty + cancelled_qty) <= requested_qty)
);

CREATE INDEX IF NOT EXISTS idx_label_batch_items_batch_id ON public.label_batch_items (label_batch_id);
CREATE INDEX IF NOT EXISTS idx_label_batch_items_business_id ON public.label_batch_items (business_id);

DROP TRIGGER IF EXISTS trg_label_batch_items_updated_at ON public.label_batch_items;
CREATE TRIGGER trg_label_batch_items_updated_at
  BEFORE UPDATE ON public.label_batch_items
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.label_batch_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS label_batch_items_select_member ON public.label_batch_items;
CREATE POLICY label_batch_items_select_member ON public.label_batch_items
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS label_batch_items_manage ON public.label_batch_items;
CREATE POLICY label_batch_items_manage ON public.label_batch_items
  FOR ALL
  USING (
    public.has_permission(business_id, 'inventory.manage')
    OR public.has_permission(business_id, 'purchasing.receive')
    OR public.has_permission(business_id, 'pos.sell')
  )
  WITH CHECK (
    public.has_permission(business_id, 'inventory.manage')
    OR public.has_permission(business_id, 'purchasing.receive')
    OR public.has_permission(business_id, 'pos.sell')
  );

-- Link print_jobs to label_batches for unified print history
ALTER TABLE public.print_jobs
  ADD COLUMN IF NOT EXISTS label_batch_id UUID REFERENCES public.label_batches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_print_jobs_label_batch_id
  ON public.print_jobs (label_batch_id)
  WHERE label_batch_id IS NOT NULL;

-- ============================================================================
-- 3. POS FAVORITES BAR (SELL SCREEN)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pos_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_pos_favorites_target
  ON public.pos_favorites (
    business_id,
    COALESCE(branch_id, '00000000-0000-0000-0000-000000000000'::uuid),
    product_id,
    COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

CREATE INDEX IF NOT EXISTS idx_pos_favorites_business_sort
  ON public.pos_favorites (business_id, branch_id, sort_order);

ALTER TABLE public.pos_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pos_favorites_select_member ON public.pos_favorites;
CREATE POLICY pos_favorites_select_member ON public.pos_favorites
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS pos_favorites_manage_pos ON public.pos_favorites;
CREATE POLICY pos_favorites_manage_pos ON public.pos_favorites
  FOR ALL
  USING (
    public.has_permission(business_id, 'pos.sell')
    OR public.has_permission(business_id, 'inventory.manage')
  )
  WITH CHECK (
    public.has_permission(business_id, 'pos.sell')
    OR public.has_permission(business_id, 'inventory.manage')
  );

-- ============================================================================
-- 4. STAFF INVITATIONS (/join SHOP CODE FLOW)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.staff_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  branch_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  invite_code TEXT NOT NULL,
  invited_name TEXT,
  invited_phone TEXT,
  max_uses INTEGER NOT NULL DEFAULT 1 CHECK (max_uses > 0),
  used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0 AND used_count <= max_uses),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'redeemed', 'revoked', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_staff_invitations_active_code
  ON public.staff_invitations (upper(invite_code))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_staff_invitations_business_status
  ON public.staff_invitations (business_id, status, expires_at DESC);

DROP TRIGGER IF EXISTS trg_staff_invitations_updated_at ON public.staff_invitations;
CREATE TRIGGER trg_staff_invitations_updated_at
  BEFORE UPDATE ON public.staff_invitations
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.staff_invitations ENABLE ROW LEVEL SECURITY;
-- Only managers/owners with staff.manage or settings.manage can list or edit codes;
-- joining staff redeem codes exclusively via SECURITY DEFINER RPC redeem_staff_invitation().
DROP POLICY IF EXISTS staff_invitations_manage ON public.staff_invitations;
CREATE POLICY staff_invitations_manage ON public.staff_invitations
  FOR ALL
  USING (
    public.has_permission(business_id, 'staff.manage')
    OR public.has_permission(business_id, 'settings.manage')
  )
  WITH CHECK (
    public.has_permission(business_id, 'staff.manage')
    OR public.has_permission(business_id, 'settings.manage')
  );

-- ============================================================================
-- 5. COURIERS REGISTRY (/couriers)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.couriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  account_number TEXT,
  contact_phone TEXT,
  api_mode TEXT NOT NULL DEFAULT 'manual' CHECK (api_mode IN ('manual', 'api_connected')),
  default_delivery_fee NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (default_delivery_fee >= 0),
  default_cod_fee_pct NUMERIC(6,3) NOT NULL DEFAULT 0 CHECK (default_cod_fee_pct >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_couriers_business_code UNIQUE (business_id, code)
);

CREATE INDEX IF NOT EXISTS idx_couriers_business_active
  ON public.couriers (business_id)
  WHERE is_active = true;

DROP TRIGGER IF EXISTS trg_couriers_updated_at ON public.couriers;
CREATE TRIGGER trg_couriers_updated_at
  BEFORE UPDATE ON public.couriers
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS couriers_select_member ON public.couriers;
CREATE POLICY couriers_select_member ON public.couriers
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS couriers_manage ON public.couriers;
CREATE POLICY couriers_manage ON public.couriers
  FOR ALL
  USING (
    public.has_permission(business_id, 'orders.manage')
    OR public.has_permission(business_id, 'settings.manage')
  )
  WITH CHECK (
    public.has_permission(business_id, 'orders.manage')
    OR public.has_permission(business_id, 'settings.manage')
  );

-- Optional link on shipments without breaking existing courier_name text column
ALTER TABLE public.shipments
  ADD COLUMN IF NOT EXISTS courier_id UUID REFERENCES public.couriers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_shipments_courier_id
  ON public.shipments (courier_id)
  WHERE courier_id IS NOT NULL;

-- ============================================================================
-- 6. CHATS INBOX & AUTO-REPLY RULES (/chats, /chatbot)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'whatsapp'
    CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'sms', 'web')),
  external_contact_id TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'archived')),
  unread_count INTEGER NOT NULL DEFAULT 0 CHECK (unread_count >= 0),
  assigned_member_id UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  last_message_preview TEXT,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_chat_conversations_ext UNIQUE (business_id, channel, external_contact_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_business_recent
  ON public.chat_conversations (business_id, status, last_message_at DESC);

DROP TRIGGER IF EXISTS trg_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER trg_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS chat_conversations_select_member ON public.chat_conversations;
CREATE POLICY chat_conversations_select_member ON public.chat_conversations
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS chat_conversations_manage ON public.chat_conversations;
CREATE POLICY chat_conversations_manage ON public.chat_conversations
  FOR ALL
  USING (
    public.has_permission(business_id, 'orders.manage')
    OR public.has_permission(business_id, 'khata.manage')
    OR public.has_permission(business_id, 'settings.manage')
  )
  WITH CHECK (
    public.has_permission(business_id, 'orders.manage')
    OR public.has_permission(business_id, 'khata.manage')
    OR public.has_permission(business_id, 'settings.manage')
  );

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'bot')),
  body TEXT NOT NULL,
  media_attachment_id UUID REFERENCES public.files_attachments(id) ON DELETE SET NULL,
  external_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
  sent_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_date
  ON public.chat_messages (conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_business_id
  ON public.chat_messages (business_id);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS chat_messages_select_member ON public.chat_messages;
CREATE POLICY chat_messages_select_member ON public.chat_messages
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS chat_messages_manage ON public.chat_messages;
CREATE POLICY chat_messages_manage ON public.chat_messages
  FOR ALL
  USING (
    public.has_permission(business_id, 'orders.manage')
    OR public.has_permission(business_id, 'khata.manage')
    OR public.has_permission(business_id, 'settings.manage')
  )
  WITH CHECK (
    public.has_permission(business_id, 'orders.manage')
    OR public.has_permission(business_id, 'khata.manage')
    OR public.has_permission(business_id, 'settings.manage')
  );

CREATE TABLE IF NOT EXISTS public.chatbot_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL DEFAULT 'keyword'
    CHECK (trigger_type IN ('greeting', 'keyword', 'after_hours', 'order_status', 'fallback')),
  keywords TEXT[] NOT NULL DEFAULT '{}'::text[],
  reply_template TEXT NOT NULL,
  channels TEXT[] NOT NULL DEFAULT ARRAY['whatsapp']::text[],
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_rules_business_active
  ON public.chatbot_rules (business_id, priority DESC)
  WHERE is_active = true;

DROP TRIGGER IF EXISTS trg_chatbot_rules_updated_at ON public.chatbot_rules;
CREATE TRIGGER trg_chatbot_rules_updated_at
  BEFORE UPDATE ON public.chatbot_rules
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.chatbot_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS chatbot_rules_select_member ON public.chatbot_rules;
CREATE POLICY chatbot_rules_select_member ON public.chatbot_rules
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS chatbot_rules_manage ON public.chatbot_rules;
CREATE POLICY chatbot_rules_manage ON public.chatbot_rules
  FOR ALL
  USING (public.has_permission(business_id, 'settings.manage'))
  WITH CHECK (public.has_permission(business_id, 'settings.manage'));

COMMIT;
