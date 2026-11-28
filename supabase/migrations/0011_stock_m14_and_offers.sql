-- ============================================================================
-- Migration: 0011_stock_m14_and_offers.sql
-- Purpose:   Extend existing inventory/product tables for Stock M1-M14 and add
--            Offers (M8), Carton Packs (M5), Quarantine, Supplier Returns,
--            Replenishment Rules (M9), Cost Basis Adjustments (M10), and
--            Transfer/PO Event timelines.
-- Notes:     Idempotent & additive on top of migrations 0001-0010.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 0. Shared updated_at trigger helper (self-contained & idempotent)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.zyro_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 1. ALTER EXISTING TABLES (STOCK M1-M14 ALIGNMENT)
-- ============================================================================

-- 1.1 branches: distinguish retail shop floor vs warehouse/godown (M7)
ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS location_type TEXT NOT NULL DEFAULT 'shop';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_branches_location_type' AND conrelid = 'public.branches'::regclass
  ) THEN
    ALTER TABLE public.branches
      ADD CONSTRAINT chk_branches_location_type
      CHECK (location_type IN ('shop', 'warehouse'));
  END IF;
END $$;

-- 1.2 categories: department & audience taxonomy (Footwear & Bags: Men/Women/Kids)
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS audience TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_categories_audience' AND conrelid = 'public.categories'::regclass
  ) THEN
    ALTER TABLE public.categories
      ADD CONSTRAINT chk_categories_audience
      CHECK (audience IS NULL OR audience IN ('men', 'women', 'kids', 'unisex'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_categories_business_dept_audience
  ON public.categories (business_id, department, audience)
  WHERE deleted_at IS NULL;

-- 1.3 products: Footwear/Bags profile (M11), sale pricing, core sizes, archive
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_kind TEXT NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS sale_price NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS size_system TEXT,
  ADD COLUMN IF NOT EXISTS core_sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS retail_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_products_sale_price_nonneg' AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT chk_products_sale_price_nonneg
      CHECK (sale_price IS NULL OR sale_price >= 0);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_business_archived
  ON public.products (business_id, archived_at)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_products_business_kind_dept
  ON public.products (business_id, product_kind, department)
  WHERE deleted_at IS NULL;

-- 1.4 product_variants: variant-level sale price & archive flag
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS sale_price NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_product_variants_sale_price_nonneg' AND conrelid = 'public.product_variants'::regclass
  ) THEN
    ALTER TABLE public.product_variants
      ADD CONSTRAINT chk_product_variants_sale_price_nonneg
      CHECK (sale_price IS NULL OR sale_price >= 0);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_product_variants_product_archived
  ON public.product_variants (product_id, is_archived)
  WHERE deleted_at IS NULL;

-- 1.5 product_barcodes: supplier aliases, label codes, and retirement lifecycle
ALTER TABLE public.product_barcodes
  ADD COLUMN IF NOT EXISTS barcode_source TEXT NOT NULL DEFAULT 'internal',
  ADD COLUMN IF NOT EXISTS label_code TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS retired_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS retire_reason TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_product_barcodes_source' AND conrelid = 'public.product_barcodes'::regclass
  ) THEN
    ALTER TABLE public.product_barcodes
      ADD CONSTRAINT chk_product_barcodes_source
      CHECK (barcode_source IN ('internal', 'supplier_alias', 'manufacturer'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_product_barcodes_business_active
  ON public.product_barcodes (business_id, barcode)
  WHERE is_active = true;

-- 1.6 stock_levels: quarantined & in-transit buckets (M7 / Quarantine)
ALTER TABLE public.stock_levels
  ADD COLUMN IF NOT EXISTS quantity_quarantined NUMERIC(14,3) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity_in_transit NUMERIC(14,3) NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_stock_levels_quarantined_nonneg' AND conrelid = 'public.stock_levels'::regclass
  ) THEN
    ALTER TABLE public.stock_levels
      ADD CONSTRAINT chk_stock_levels_quarantined_nonneg CHECK (quantity_quarantined >= 0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_stock_levels_in_transit_nonneg' AND conrelid = 'public.stock_levels'::regclass
  ) THEN
    ALTER TABLE public.stock_levels
      ADD CONSTRAINT chk_stock_levels_in_transit_nonneg CHECK (quantity_in_transit >= 0);
  END IF;
END $$;

-- 1.7 stock_counts: scoped stocktake sessions (full/article/core/custom/cycle)
ALTER TABLE public.stock_counts
  ADD COLUMN IF NOT EXISTS scope_mode TEXT NOT NULL DEFAULT 'full',
  ADD COLUMN IF NOT EXISTS scope_target JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS total_variance_qty NUMERIC(14,3) NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_stock_counts_scope_mode' AND conrelid = 'public.stock_counts'::regclass
  ) THEN
    ALTER TABLE public.stock_counts
      ADD CONSTRAINT chk_stock_counts_scope_mode
      CHECK (scope_mode IN ('full', 'article', 'core', 'custom', 'cycle'));
  END IF;
END $$;

-- 1.8 stock_transfer_items: partial cancellation & return-to-origin tracking (M7)
ALTER TABLE public.stock_transfer_items
  ADD COLUMN IF NOT EXISTS quantity_cancelled NUMERIC(14,3) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity_returned NUMERIC(14,3) NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_stock_transfer_items_cancel_return' AND conrelid = 'public.stock_transfer_items'::regclass
  ) THEN
    ALTER TABLE public.stock_transfer_items
      ADD CONSTRAINT chk_stock_transfer_items_cancel_return
      CHECK (
        quantity_cancelled >= 0
        AND quantity_returned >= 0
        AND (quantity_received + quantity_cancelled + quantity_returned) <= quantity_sent
      );
  END IF;
END $$;

-- 1.9 goods_receipts: track source mode (PO / carton / manual) & carton count
ALTER TABLE public.goods_receipts
  ADD COLUMN IF NOT EXISTS source_mode TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS carton_count INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_goods_receipts_source_mode' AND conrelid = 'public.goods_receipts'::regclass
  ) THEN
    ALTER TABLE public.goods_receipts
      ADD CONSTRAINT chk_goods_receipts_source_mode
      CHECK (source_mode IN ('manual', 'po', 'carton', 'quick_receive'));
  END IF;
END $$;

-- ============================================================================
-- 2. M8 OFFERS ENGINE (MIX-AND-MATCH, WHOLESALE TIERS, FIXED BUNDLES)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  code TEXT,
  name TEXT NOT NULL,
  offer_type TEXT NOT NULL CHECK (offer_type IN ('mix_match', 'wholesale', 'bundle')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  bundle_price NUMERIC(14,2) CHECK (bundle_price IS NULL OR bundle_price >= 0),
  priority INTEGER NOT NULL DEFAULT 0,
  stackable BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_offers_window CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_offers_business_code
  ON public.offers (business_id, lower(code))
  WHERE code IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_offers_business_status_type
  ON public.offers (business_id, status, offer_type)
  WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
CREATE TRIGGER trg_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS offers_select_member ON public.offers;
CREATE POLICY offers_select_member ON public.offers
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS offers_manage_inv ON public.offers;
CREATE POLICY offers_manage_inv ON public.offers
  FOR ALL
  USING (public.has_permission(business_id, 'inventory.manage'))
  WITH CHECK (public.has_permission(business_id, 'inventory.manage'));

-- 2.2 offer_members: products or exact variants belonging to an offer / bundle
CREATE TABLE IF NOT EXISTS public.offer_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  required_qty NUMERIC(14,3) NOT NULL DEFAULT 1 CHECK (required_qty > 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_offer_members_target CHECK (product_id IS NOT NULL OR variant_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_offer_members_pair
  ON public.offer_members (
    offer_id,
    COALESCE(product_id, '00000000-0000-0000-0000-000000000000'::uuid),
    COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

CREATE INDEX IF NOT EXISTS idx_offer_members_business_id ON public.offer_members (business_id);
CREATE INDEX IF NOT EXISTS idx_offer_members_variant_id ON public.offer_members (variant_id) WHERE variant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_offer_members_product_id ON public.offer_members (product_id) WHERE product_id IS NOT NULL;

ALTER TABLE public.offer_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS offer_members_select_member ON public.offer_members;
CREATE POLICY offer_members_select_member ON public.offer_members
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS offer_members_manage_inv ON public.offer_members;
CREATE POLICY offer_members_manage_inv ON public.offer_members
  FOR ALL
  USING (public.has_permission(business_id, 'inventory.manage'))
  WITH CHECK (public.has_permission(business_id, 'inventory.manage'));

-- 2.3 offer_tiers: quantity breakpoints for mix_match & wholesale pricing
CREATE TABLE IF NOT EXISTS public.offer_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  min_qty NUMERIC(14,3) NOT NULL CHECK (min_qty > 0),
  pricing_mode TEXT NOT NULL DEFAULT 'unit_price'
    CHECK (pricing_mode IN ('unit_price', 'total_price', 'discount_pct', 'discount_amount')),
  tier_value NUMERIC(14,2) NOT NULL CHECK (tier_value >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_offer_tiers_min_qty UNIQUE (offer_id, min_qty)
);

CREATE INDEX IF NOT EXISTS idx_offer_tiers_business_id ON public.offer_tiers (business_id);

ALTER TABLE public.offer_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS offer_tiers_select_member ON public.offer_tiers;
CREATE POLICY offer_tiers_select_member ON public.offer_tiers
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS offer_tiers_manage_inv ON public.offer_tiers;
CREATE POLICY offer_tiers_manage_inv ON public.offer_tiers
  FOR ALL
  USING (public.has_permission(business_id, 'inventory.manage'))
  WITH CHECK (public.has_permission(business_id, 'inventory.manage'));

-- ============================================================================
-- 3. M5 CARTON PACKS & SIZE-RUN DEFINITIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.carton_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  carton_barcode TEXT NOT NULL,
  pack_name TEXT NOT NULL,
  colour_name TEXT,
  total_units_per_carton INTEGER NOT NULL DEFAULT 1 CHECK (total_units_per_carton > 0),
  default_unit_cost NUMERIC(14,4) NOT NULL DEFAULT 0 CHECK (default_unit_cost >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'retired')),
  retired_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_carton_packs_business_barcode_active
  ON public.carton_packs (business_id, carton_barcode)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_carton_packs_product_id ON public.carton_packs (product_id);
CREATE INDEX IF NOT EXISTS idx_carton_packs_business_status ON public.carton_packs (business_id, status);

DROP TRIGGER IF EXISTS trg_carton_packs_updated_at ON public.carton_packs;
CREATE TRIGGER trg_carton_packs_updated_at
  BEFORE UPDATE ON public.carton_packs
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.carton_packs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS carton_packs_select_member ON public.carton_packs;
CREATE POLICY carton_packs_select_member ON public.carton_packs
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS carton_packs_manage_inv ON public.carton_packs;
CREATE POLICY carton_packs_manage_inv ON public.carton_packs
  FOR ALL
  USING (
    public.has_permission(business_id, 'inventory.manage')
    OR public.has_permission(business_id, 'purchasing.receive')
  )
  WITH CHECK (
    public.has_permission(business_id, 'inventory.manage')
    OR public.has_permission(business_id, 'purchasing.receive')
  );

CREATE TABLE IF NOT EXISTS public.carton_pack_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  carton_pack_id UUID NOT NULL REFERENCES public.carton_packs(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  units_per_carton INTEGER NOT NULL CHECK (units_per_carton > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_carton_pack_items_pair UNIQUE (carton_pack_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_carton_pack_items_business_id ON public.carton_pack_items (business_id);
CREATE INDEX IF NOT EXISTS idx_carton_pack_items_variant_id ON public.carton_pack_items (variant_id);

ALTER TABLE public.carton_pack_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS carton_pack_items_select_member ON public.carton_pack_items;
CREATE POLICY carton_pack_items_select_member ON public.carton_pack_items
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS carton_pack_items_manage_inv ON public.carton_pack_items;
CREATE POLICY carton_pack_items_manage_inv ON public.carton_pack_items
  FOR ALL
  USING (
    public.has_permission(business_id, 'inventory.manage')
    OR public.has_permission(business_id, 'purchasing.receive')
  )
  WITH CHECK (
    public.has_permission(business_id, 'inventory.manage')
    OR public.has_permission(business_id, 'purchasing.receive')
  );

-- ============================================================================
-- 4. SUPPLIER RETURNS & QUARANTINE LIFECYCLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.supplier_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  goods_receipt_id UUID REFERENCES public.goods_receipts(id) ON DELETE SET NULL,
  supplier_credit_note_id UUID REFERENCES public.supplier_credit_notes(id) ON DELETE SET NULL,
  return_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'dispatched'
    CHECK (status IN ('draft', 'dispatched', 'credited', 'cancelled')),
  total_quantity NUMERIC(14,3) NOT NULL DEFAULT 0 CHECK (total_quantity >= 0),
  total_cost_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (total_cost_amount >= 0),
  reason TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  returned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_supplier_returns_business_no UNIQUE (business_id, return_number)
);

CREATE INDEX IF NOT EXISTS idx_supplier_returns_branch_date
  ON public.supplier_returns (branch_id, returned_at DESC);
CREATE INDEX IF NOT EXISTS idx_supplier_returns_supplier_id
  ON public.supplier_returns (supplier_id);

DROP TRIGGER IF EXISTS trg_supplier_returns_updated_at ON public.supplier_returns;
CREATE TRIGGER trg_supplier_returns_updated_at
  BEFORE UPDATE ON public.supplier_returns
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.supplier_returns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS supplier_returns_select_branch ON public.supplier_returns;
CREATE POLICY supplier_returns_select_branch ON public.supplier_returns
  FOR SELECT USING (
    public.has_branch_access(business_id, branch_id)
    AND (
      public.has_permission(business_id, 'purchasing.view')
      OR public.has_permission(business_id, 'purchasing.manage')
      OR public.has_permission(business_id, 'inventory.manage')
    )
  );
DROP POLICY IF EXISTS supplier_returns_manage ON public.supplier_returns;
CREATE POLICY supplier_returns_manage ON public.supplier_returns
  FOR ALL
  USING (
    public.has_branch_access(business_id, branch_id)
    AND (
      public.has_permission(business_id, 'purchasing.manage')
      OR public.has_permission(business_id, 'inventory.manage')
    )
  )
  WITH CHECK (
    public.has_branch_access(business_id, branch_id)
    AND (
      public.has_permission(business_id, 'purchasing.manage')
      OR public.has_permission(business_id, 'inventory.manage')
    )
  );

CREATE TABLE IF NOT EXISTS public.supplier_return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  supplier_return_id UUID NOT NULL REFERENCES public.supplier_returns(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  batch_id UUID REFERENCES public.product_batches(id) ON DELETE SET NULL,
  source_bucket TEXT NOT NULL DEFAULT 'on_hand' CHECK (source_bucket IN ('on_hand', 'quarantined')),
  quantity NUMERIC(14,3) NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(14,4) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (line_total >= 0),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_return_items_return_id ON public.supplier_return_items (supplier_return_id);
CREATE INDEX IF NOT EXISTS idx_supplier_return_items_business_id ON public.supplier_return_items (business_id);

ALTER TABLE public.supplier_return_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS supplier_return_items_select ON public.supplier_return_items;
CREATE POLICY supplier_return_items_select ON public.supplier_return_items
  FOR SELECT USING (
    public.has_permission(business_id, 'purchasing.view')
    OR public.has_permission(business_id, 'purchasing.manage')
    OR public.has_permission(business_id, 'inventory.manage')
  );
DROP POLICY IF EXISTS supplier_return_items_manage ON public.supplier_return_items;
CREATE POLICY supplier_return_items_manage ON public.supplier_return_items
  FOR ALL
  USING (
    public.has_permission(business_id, 'purchasing.manage')
    OR public.has_permission(business_id, 'inventory.manage')
  )
  WITH CHECK (
    public.has_permission(business_id, 'purchasing.manage')
    OR public.has_permission(business_id, 'inventory.manage')
  );

-- 4.3 quarantine_records: damaged / defective stock awaiting disposition
CREATE TABLE IF NOT EXISTS public.quarantine_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  batch_id UUID REFERENCES public.product_batches(id) ON DELETE SET NULL,
  source_type TEXT NOT NULL DEFAULT 'manual'
    CHECK (source_type IN ('manual', 'sales_return', 'goods_receipt', 'stocktake', 'transfer')),
  source_id UUID,
  quantity NUMERIC(14,3) NOT NULL CHECK (quantity > 0),
  resolved_quantity NUMERIC(14,3) NOT NULL DEFAULT 0 CHECK (resolved_quantity >= 0 AND resolved_quantity <= quantity),
  unit_cost NUMERIC(14,4) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'restocked', 'returned_to_supplier', 'written_off')),
  reason TEXT NOT NULL,
  disposition_note TEXT,
  supplier_return_id UUID REFERENCES public.supplier_returns(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  resolved_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quarantine_records_branch_status
  ON public.quarantine_records (branch_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quarantine_records_variant_id
  ON public.quarantine_records (variant_id);

DROP TRIGGER IF EXISTS trg_quarantine_records_updated_at ON public.quarantine_records;
CREATE TRIGGER trg_quarantine_records_updated_at
  BEFORE UPDATE ON public.quarantine_records
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.quarantine_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS quarantine_records_select_branch ON public.quarantine_records;
CREATE POLICY quarantine_records_select_branch ON public.quarantine_records
  FOR SELECT USING (public.has_branch_access(business_id, branch_id));
DROP POLICY IF EXISTS quarantine_records_manage_inv ON public.quarantine_records;
CREATE POLICY quarantine_records_manage_inv ON public.quarantine_records
  FOR ALL
  USING (
    public.has_branch_access(business_id, branch_id)
    AND public.has_permission(business_id, 'inventory.manage')
  )
  WITH CHECK (
    public.has_branch_access(business_id, branch_id)
    AND public.has_permission(business_id, 'inventory.manage')
  );

-- ============================================================================
-- 5. M9 REPLENISHMENT RULES & M10 COST BASIS ADJUSTMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.replenishment_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  min_stock NUMERIC(14,3) NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  target_stock NUMERIC(14,3) NOT NULL DEFAULT 0 CHECK (target_stock >= 0),
  safety_stock NUMERIC(14,3) NOT NULL DEFAULT 0 CHECK (safety_stock >= 0),
  lead_time_days INTEGER NOT NULL DEFAULT 7 CHECK (lead_time_days >= 0),
  coverage_days INTEGER NOT NULL DEFAULT 21 CHECK (coverage_days >= 0),
  demand_override_daily NUMERIC(12,4) CHECK (demand_override_daily IS NULL OR demand_override_daily >= 0),
  preferred_supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  preferred_unit_cost NUMERIC(14,4) CHECK (preferred_unit_cost IS NULL OR preferred_unit_cost >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_replenishment_rules_branch_variant UNIQUE (branch_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_replenishment_rules_business_branch
  ON public.replenishment_rules (business_id, branch_id)
  WHERE is_active = true;

DROP TRIGGER IF EXISTS trg_replenishment_rules_updated_at ON public.replenishment_rules;
CREATE TRIGGER trg_replenishment_rules_updated_at
  BEFORE UPDATE ON public.replenishment_rules
  FOR EACH ROW EXECUTE FUNCTION public.zyro_touch_updated_at();

ALTER TABLE public.replenishment_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS replenishment_rules_select_branch ON public.replenishment_rules;
CREATE POLICY replenishment_rules_select_branch ON public.replenishment_rules
  FOR SELECT USING (public.has_branch_access(business_id, branch_id));
DROP POLICY IF EXISTS replenishment_rules_manage_inv ON public.replenishment_rules;
CREATE POLICY replenishment_rules_manage_inv ON public.replenishment_rules
  FOR ALL
  USING (
    public.has_branch_access(business_id, branch_id)
    AND (
      public.has_permission(business_id, 'inventory.manage')
      OR public.has_permission(business_id, 'purchasing.manage')
    )
  )
  WITH CHECK (
    public.has_branch_access(business_id, branch_id)
    AND (
      public.has_permission(business_id, 'inventory.manage')
      OR public.has_permission(business_id, 'purchasing.manage')
    )
  );

-- 5.2 cost_basis_adjustments (M10 manual valuation checkpoints)
CREATE TABLE IF NOT EXISTS public.cost_basis_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  previous_cost NUMERIC(14,4) NOT NULL DEFAULT 0 CHECK (previous_cost >= 0),
  new_cost NUMERIC(14,4) NOT NULL CHECK (new_cost >= 0),
  on_hand_qty_snapshot NUMERIC(14,3) NOT NULL DEFAULT 0,
  valuation_delta NUMERIC(14,2) NOT NULL DEFAULT 0,
  reason TEXT NOT NULL,
  adjusted_by UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cost_basis_adjustments_branch_variant
  ON public.cost_basis_adjustments (branch_id, variant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cost_basis_adjustments_business_date
  ON public.cost_basis_adjustments (business_id, created_at DESC);

ALTER TABLE public.cost_basis_adjustments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cost_basis_adjustments_select ON public.cost_basis_adjustments;
CREATE POLICY cost_basis_adjustments_select ON public.cost_basis_adjustments
  FOR SELECT USING (
    public.has_branch_access(business_id, branch_id)
    AND (
      public.has_permission(business_id, 'inventory.manage')
      OR public.has_permission(business_id, 'reports.view')
    )
  );
DROP POLICY IF EXISTS cost_basis_adjustments_insert ON public.cost_basis_adjustments;
CREATE POLICY cost_basis_adjustments_insert ON public.cost_basis_adjustments
  FOR INSERT WITH CHECK (
    public.has_branch_access(business_id, branch_id)
    AND public.has_permission(business_id, 'inventory.manage')
  );

-- ============================================================================
-- 6. M7 TRANSFER & M4 PURCHASE ORDER AUDIT TIMELINES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.stock_transfer_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  transfer_id UUID NOT NULL REFERENCES public.stock_transfers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('created', 'approved', 'dispatched', 'partially_received', 'received', 'returned', 'cancelled', 'note')),
  actor_member_id UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_transfer_events_transfer_id
  ON public.stock_transfer_events (transfer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_transfer_events_business_id
  ON public.stock_transfer_events (business_id);

ALTER TABLE public.stock_transfer_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stock_transfer_events_select_member ON public.stock_transfer_events;
CREATE POLICY stock_transfer_events_select_member ON public.stock_transfer_events
  FOR SELECT USING (public.is_business_member(business_id));
DROP POLICY IF EXISTS stock_transfer_events_insert_inv ON public.stock_transfer_events;
CREATE POLICY stock_transfer_events_insert_inv ON public.stock_transfer_events
  FOR INSERT WITH CHECK (public.has_permission(business_id, 'inventory.manage'));

CREATE TABLE IF NOT EXISTS public.purchase_order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('created', 'approved', 'sent', 'partially_received', 'received', 'billed', 'cancelled', 'note')),
  actor_member_id UUID REFERENCES public.business_members(id) ON DELETE SET NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_purchase_order_events_po_id
  ON public.purchase_order_events (purchase_order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_order_events_business_id
  ON public.purchase_order_events (business_id);

ALTER TABLE public.purchase_order_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS purchase_order_events_select ON public.purchase_order_events;
CREATE POLICY purchase_order_events_select ON public.purchase_order_events
  FOR SELECT USING (
    public.has_permission(business_id, 'purchasing.view')
    OR public.has_permission(business_id, 'purchasing.manage')
  );
DROP POLICY IF EXISTS purchase_order_events_insert ON public.purchase_order_events;
CREATE POLICY purchase_order_events_insert ON public.purchase_order_events
  FOR INSERT WITH CHECK (
    public.has_permission(business_id, 'purchasing.manage')
    OR public.has_permission(business_id, 'purchasing.receive')
  );

COMMIT;
