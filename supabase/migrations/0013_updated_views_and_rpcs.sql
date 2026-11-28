-- ============================================================================
-- Migration: 0013_updated_views_and_rpcs.sql
-- Purpose:   Updated security-invoker reporting views (v_stock_valuation,
--            v_pending_label_batches, v_replenishment_alerts) and atomic
--            PL/pgSQL RPCs for Carton Receive, Stocktake Commit, Quarantine
--            Resolution, Supplier Returns, Cost Basis Adjustments, Exchanges,
--            and Staff Invitation Redemption.
-- Notes:     All RPCs enforce auth.uid(), business membership, branch access,
--            RBAC permissions, and cross-tenant FK ownership explicitly with
--            search_path locked down.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. REPORTING VIEWS (security_invoker = true)
-- ============================================================================

-- 1.1 Updated Stock Valuation View (DROP first so extended column layout applies cleanly)
DROP VIEW IF EXISTS public.v_stock_valuation;
CREATE VIEW public.v_stock_valuation
WITH (security_invoker = true) AS
SELECT
  sl.business_id,
  sl.branch_id,
  b.name AS branch_name,
  b.location_type,
  p.id AS product_id,
  p.name AS product_name,
  p.sku AS product_sku,
  p.product_kind,
  p.department,
  p.archived_at AS product_archived_at,
  pv.id AS variant_id,
  pv.sku AS variant_sku,
  pv.variant_name,
  pv.colour_name,
  pv.size_name,
  pv.is_archived AS variant_archived,
  sl.quantity_on_hand,
  sl.quantity_reserved,
  sl.quantity_quarantined,
  sl.quantity_in_transit,
  GREATEST(sl.quantity_on_hand - sl.quantity_reserved, 0) AS quantity_available,
  sl.reorder_level,
  sl.average_cost,
  COALESCE(pv.selling_price, p.base_selling_price, 0) AS regular_selling_price,
  COALESCE(pv.sale_price, p.sale_price) AS sale_price,
  COALESCE(pv.sale_price, pv.selling_price, p.sale_price, p.base_selling_price, 0) AS effective_selling_price,
  ROUND((sl.quantity_on_hand * sl.average_cost)::numeric, 2) AS cost_value,
  ROUND((sl.quantity_on_hand * COALESCE(pv.sale_price, pv.selling_price, p.sale_price, p.base_selling_price, 0))::numeric, 2) AS retail_value,
  ROUND((sl.quantity_quarantined * sl.average_cost)::numeric, 2) AS quarantined_cost_value,
  sl.updated_at
FROM public.stock_levels sl
JOIN public.branches b ON b.id = sl.branch_id
JOIN public.product_variants pv ON pv.id = sl.variant_id
JOIN public.products p ON p.id = pv.product_id
WHERE p.deleted_at IS NULL
  AND pv.deleted_at IS NULL
  AND b.deleted_at IS NULL;

-- 1.2 Pending Label Batches View (Labels Hub queue)
DROP VIEW IF EXISTS public.v_pending_label_batches;
CREATE VIEW public.v_pending_label_batches
WITH (security_invoker = true) AS
SELECT
  lb.id AS label_batch_id,
  lb.business_id,
  lb.branch_id,
  b.name AS branch_name,
  lb.batch_number,
  lb.source_type,
  lb.source_id,
  lb.media_size,
  lb.dpi,
  lb.status,
  COUNT(lbi.id)::INTEGER AS line_count,
  COALESCE(SUM(lbi.requested_qty), 0)::INTEGER AS total_requested_qty,
  COALESCE(SUM(lbi.printed_qty), 0)::INTEGER AS total_printed_qty,
  COALESCE(SUM(lbi.cancelled_qty), 0)::INTEGER AS total_cancelled_qty,
  COALESCE(SUM(lbi.requested_qty - lbi.printed_qty - lbi.cancelled_qty), 0)::INTEGER AS remaining_qty,
  lb.created_at,
  lb.updated_at
FROM public.label_batches lb
JOIN public.branches b ON b.id = lb.branch_id
LEFT JOIN public.label_batch_items lbi ON lbi.label_batch_id = lb.id
GROUP BY lb.id, b.name;

-- 1.3 Replenishment Alerts View (M9 Reorder Planner)
DROP VIEW IF EXISTS public.v_replenishment_alerts;
CREATE VIEW public.v_replenishment_alerts
WITH (security_invoker = true) AS
SELECT
  rr.id AS rule_id,
  rr.business_id,
  rr.branch_id,
  b.name AS branch_name,
  p.id AS product_id,
  p.name AS product_name,
  pv.id AS variant_id,
  pv.sku AS variant_sku,
  pv.variant_name,
  pv.colour_name,
  pv.size_name,
  COALESCE(sl.quantity_on_hand, 0) AS quantity_on_hand,
  COALESCE(sl.quantity_reserved, 0) AS quantity_reserved,
  COALESCE(sl.quantity_in_transit, 0) AS quantity_in_transit,
  GREATEST(COALESCE(sl.quantity_on_hand, 0) - COALESCE(sl.quantity_reserved, 0), 0) AS quantity_available,
  rr.min_stock,
  rr.target_stock,
  rr.safety_stock,
  rr.lead_time_days,
  rr.coverage_days,
  rr.demand_override_daily,
  rr.preferred_supplier_id,
  s.name AS preferred_supplier_name,
  COALESCE(rr.preferred_unit_cost, sl.average_cost, pv.cost_price, p.base_cost_price, 0) AS suggested_unit_cost,
  GREATEST(
    rr.target_stock - (GREATEST(COALESCE(sl.quantity_on_hand, 0) - COALESCE(sl.quantity_reserved, 0), 0) + COALESCE(sl.quantity_in_transit, 0)),
    0
  ) AS suggested_order_qty,
  (GREATEST(COALESCE(sl.quantity_on_hand, 0) - COALESCE(sl.quantity_reserved, 0), 0) <= rr.min_stock) AS is_below_min
FROM public.replenishment_rules rr
JOIN public.branches b ON b.id = rr.branch_id
JOIN public.product_variants pv ON pv.id = rr.variant_id
JOIN public.products p ON p.id = pv.product_id
LEFT JOIN public.stock_levels sl ON sl.branch_id = rr.branch_id AND sl.variant_id = rr.variant_id
LEFT JOIN public.suppliers s ON s.id = rr.preferred_supplier_id
WHERE rr.is_active = true
  AND p.deleted_at IS NULL
  AND p.archived_at IS NULL
  AND pv.deleted_at IS NULL
  AND pv.is_archived = false;

-- ============================================================================
-- 2. ATOMIC RPC: receive_carton(p_payload JSONB)  [M5 Carton Receive]
-- ============================================================================
CREATE OR REPLACE FUNCTION public.receive_carton(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_business_id UUID := (p_payload->>'business_id')::UUID;
  v_branch_id UUID := (p_payload->>'branch_id')::UUID;
  v_carton_pack_id UUID := NULLIF(p_payload->>'carton_pack_id', '')::UUID;
  v_carton_barcode TEXT := NULLIF(trim(p_payload->>'carton_barcode'), '');
  v_carton_count INTEGER := COALESCE((p_payload->>'carton_count')::INTEGER, 1);
  v_supplier_id UUID := NULLIF(p_payload->>'supplier_id', '')::UUID;
  v_po_id UUID := NULLIF(p_payload->>'purchase_order_id', '')::UUID;
  v_override_cost NUMERIC(14,4) := NULLIF(p_payload->>'unit_cost', '')::NUMERIC;
  v_grn_number TEXT := NULLIF(trim(p_payload->>'grn_number'), '');
  v_create_labels BOOLEAN := COALESCE((p_payload->>'create_label_batch')::BOOLEAN, true);
  v_notes TEXT := NULLIF(p_payload->>'notes', '');
  v_actor_member_id UUID;
  v_pack RECORD;
  v_item RECORD;
  v_grn_id UUID;
  v_label_batch_id UUID;
  v_label_batch_no TEXT;
  v_qty_add NUMERIC(14,3);
  v_unit_cost NUMERIC(14,4);
  v_cur_qty NUMERIC(14,3);
  v_cur_avg NUMERIC(14,4);
  v_new_avg NUMERIC(14,4);
  v_total_units NUMERIC(14,3) := 0;
  v_primary_barcode TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF v_business_id IS NULL OR v_branch_id IS NULL THEN
    RAISE EXCEPTION 'business_id and branch_id are required';
  END IF;
  IF v_carton_count <= 0 THEN
    RAISE EXCEPTION 'carton_count must be greater than zero';
  END IF;
  IF NOT public.has_branch_access(v_business_id, v_branch_id)
     OR NOT (
       public.has_permission(v_business_id, 'purchasing.receive')
       OR public.has_permission(v_business_id, 'inventory.manage')
     ) THEN
    RAISE EXCEPTION 'Insufficient permissions to receive carton stock';
  END IF;

  v_actor_member_id := public.current_business_member_id(v_business_id);

  -- Resolve active carton pack owned by this business
  SELECT * INTO v_pack
  FROM public.carton_packs cp
  WHERE cp.business_id = v_business_id
    AND cp.status = 'active'
    AND (
      (v_carton_pack_id IS NOT NULL AND cp.id = v_carton_pack_id)
      OR (v_carton_pack_id IS NULL AND v_carton_barcode IS NOT NULL AND cp.carton_barcode = v_carton_barcode)
    )
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active carton pack not found';
  END IF;

  v_supplier_id := COALESCE(v_supplier_id, v_pack.supplier_id);
  IF v_supplier_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.suppliers s
    WHERE s.id = v_supplier_id AND s.business_id = v_business_id AND s.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Valid supplier_id for this business is required';
  END IF;

  IF v_po_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.purchase_orders po
    WHERE po.id = v_po_id AND po.business_id = v_business_id AND po.branch_id = v_branch_id
  ) THEN
    RAISE EXCEPTION 'purchase_order_id does not belong to this business and branch';
  END IF;

  v_unit_cost := COALESCE(v_override_cost, v_pack.default_unit_cost, 0);
  IF v_unit_cost < 0 THEN
    RAISE EXCEPTION 'unit_cost cannot be negative';
  END IF;

  IF v_grn_number IS NULL THEN
    v_grn_number := 'GRN-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 4);
  END IF;

  INSERT INTO public.goods_receipts (
    business_id, branch_id, purchase_order_id, supplier_id,
    grn_number, source_mode, carton_count, received_by, notes
  ) VALUES (
    v_business_id, v_branch_id, v_po_id, v_supplier_id,
    v_grn_number, 'carton', v_carton_count, v_actor_member_id, v_notes
  ) RETURNING id INTO v_grn_id;

  IF v_create_labels THEN
    v_label_batch_no := 'LB-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 4);
    INSERT INTO public.label_batches (
      business_id, branch_id, batch_number, source_type, source_id, status, created_by
    ) VALUES (
      v_business_id, v_branch_id, v_label_batch_no, 'carton', v_grn_id, 'pending', v_actor_member_id
    ) RETURNING id INTO v_label_batch_id;
  END IF;

  FOR v_item IN
    SELECT cpi.variant_id, cpi.units_per_carton, pv.sku, pv.variant_name, pv.selling_price, pv.sale_price,
           p.name AS product_name, p.base_selling_price, p.sale_price AS product_sale_price
    FROM public.carton_pack_items cpi
    JOIN public.product_variants pv ON pv.id = cpi.variant_id AND pv.business_id = v_business_id
    JOIN public.products p ON p.id = pv.product_id AND p.business_id = v_business_id
    WHERE cpi.carton_pack_id = v_pack.id
      AND cpi.business_id = v_business_id
    ORDER BY cpi.id
  LOOP
    v_qty_add := (v_item.units_per_carton * v_carton_count)::NUMERIC(14,3);
    v_total_units := v_total_units + v_qty_add;

    INSERT INTO public.goods_receipt_items (
      business_id, goods_receipt_id, variant_id, quantity_received, actual_unit_cost
    ) VALUES (
      v_business_id, v_grn_id, v_item.variant_id, v_qty_add, v_unit_cost
    );

    INSERT INTO public.stock_levels (business_id, branch_id, variant_id, quantity_on_hand, average_cost)
    VALUES (v_business_id, v_branch_id, v_item.variant_id, 0, v_unit_cost)
    ON CONFLICT (branch_id, variant_id) DO NOTHING;

    SELECT quantity_on_hand, average_cost INTO v_cur_qty, v_cur_avg
    FROM public.stock_levels
    WHERE branch_id = v_branch_id AND variant_id = v_item.variant_id
    FOR UPDATE;

    IF (GREATEST(v_cur_qty, 0) + v_qty_add) > 0 THEN
      v_new_avg := ROUND(
        ((GREATEST(v_cur_qty, 0) * v_cur_avg) + (v_qty_add * v_unit_cost))
        / (GREATEST(v_cur_qty, 0) + v_qty_add),
        4
      );
    ELSE
      v_new_avg := v_unit_cost;
    END IF;

    UPDATE public.stock_levels
    SET quantity_on_hand = quantity_on_hand + v_qty_add,
        average_cost = v_new_avg,
        updated_at = now()
    WHERE branch_id = v_branch_id AND variant_id = v_item.variant_id;

    INSERT INTO public.stock_movements (
      business_id, branch_id, variant_id, movement_type, quantity_delta,
      unit_cost, reference_type, reference_id, reason, performed_by
    ) VALUES (
      v_business_id, v_branch_id, v_item.variant_id, 'carton_receive', v_qty_add,
      v_unit_cost, 'goods_receipt', v_grn_id,
      'Carton receive (' || v_carton_count || 'x ' || v_pack.pack_name || ')',
      v_actor_member_id
    );

    IF v_create_labels AND v_label_batch_id IS NOT NULL THEN
      SELECT pb.barcode INTO v_primary_barcode
      FROM public.product_barcodes pb
      WHERE pb.variant_id = v_item.variant_id
        AND pb.business_id = v_business_id
        AND pb.is_active = true
      ORDER BY pb.is_primary DESC, pb.created_at ASC
      LIMIT 1;

      INSERT INTO public.label_batch_items (
        business_id, label_batch_id, variant_id, requested_qty,
        barcode_snapshot, sku_snapshot, product_name_snapshot, variant_label_snapshot,
        price_snapshot, sale_price_snapshot
      ) VALUES (
        v_business_id, v_label_batch_id, v_item.variant_id, v_qty_add::INTEGER,
        COALESCE(v_primary_barcode, v_item.sku, v_pack.carton_barcode),
        v_item.sku, v_item.product_name, v_item.variant_name,
        COALESCE(v_item.selling_price, v_item.base_selling_price, 0),
        COALESCE(v_item.sale_price, v_item.product_sale_price)
      );
    END IF;
  END LOOP;

  IF v_total_units <= 0 THEN
    RAISE EXCEPTION 'Carton pack has no size-run items configured';
  END IF;

  INSERT INTO public.audit_logs (
    business_id, branch_id, actor_user_id, actor_member_id,
    action, entity_type, entity_id, after_data
  ) VALUES (
    v_business_id, v_branch_id, auth.uid(), v_actor_member_id,
    'carton.received', 'goods_receipt', v_grn_id,
    jsonb_build_object(
      'grn_number', v_grn_number,
      'carton_pack_id', v_pack.id,
      'carton_count', v_carton_count,
      'total_units', v_total_units,
      'label_batch_id', v_label_batch_id
    )
  );

  RETURN jsonb_build_object(
    'goods_receipt_id', v_grn_id,
    'grn_number', v_grn_number,
    'total_units', v_total_units,
    'label_batch_id', v_label_batch_id,
    'label_batch_number', v_label_batch_no
  );
END;
$$;

-- ============================================================================
-- 3. ATOMIC RPC: commit_stocktake(p_payload JSONB)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.commit_stocktake(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_business_id UUID := (p_payload->>'business_id')::UUID;
  v_stock_count_id UUID := (p_payload->>'stock_count_id')::UUID;
  v_notes TEXT := NULLIF(p_payload->>'notes', '');
  v_actor_member_id UUID;
  v_count RECORD;
  v_line RECORD;
  v_cur_qty NUMERIC(14,3);
  v_cur_avg NUMERIC(14,4);
  v_variance NUMERIC(14,3);
  v_total_variance NUMERIC(14,3) := 0;
  v_adjusted_lines INTEGER := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO v_count
  FROM public.stock_counts
  WHERE id = v_stock_count_id AND business_id = v_business_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stock count session not found';
  END IF;
  IF v_count.status IN ('completed', 'cancelled') THEN
    RAISE EXCEPTION 'Stock count is already %', v_count.status;
  END IF;
  IF NOT public.has_branch_access(v_business_id, v_count.branch_id)
     OR NOT public.has_permission(v_business_id, 'inventory.manage') THEN
    RAISE EXCEPTION 'Insufficient permissions to commit stocktake';
  END IF;

  v_actor_member_id := public.current_business_member_id(v_business_id);

  FOR v_line IN
    SELECT sci.*
    FROM public.stock_count_items sci
    JOIN public.product_variants pv ON pv.id = sci.variant_id AND pv.business_id = v_business_id
    WHERE sci.stock_count_id = v_stock_count_id
      AND sci.business_id = v_business_id
      AND sci.counted_qty IS NOT NULL
    ORDER BY sci.id
  LOOP
    IF v_line.counted_qty < 0 THEN
      RAISE EXCEPTION 'Counted quantity cannot be negative';
    END IF;

    INSERT INTO public.stock_levels (business_id, branch_id, variant_id, quantity_on_hand)
    VALUES (v_business_id, v_count.branch_id, v_line.variant_id, 0)
    ON CONFLICT (branch_id, variant_id) DO NOTHING;

    SELECT quantity_on_hand, average_cost INTO v_cur_qty, v_cur_avg
    FROM public.stock_levels
    WHERE branch_id = v_count.branch_id AND variant_id = v_line.variant_id
    FOR UPDATE;

    v_variance := v_line.counted_qty - v_cur_qty;
    v_total_variance := v_total_variance + v_variance;

    UPDATE public.stock_count_items
    SET expected_qty = v_cur_qty,
        variance_qty = v_variance,
        updated_at = now()
    WHERE id = v_line.id;

    IF v_variance <> 0 THEN
      v_adjusted_lines := v_adjusted_lines + 1;

      UPDATE public.stock_levels
      SET quantity_on_hand = v_line.counted_qty,
          updated_at = now()
      WHERE branch_id = v_count.branch_id AND variant_id = v_line.variant_id;

      INSERT INTO public.stock_movements (
        business_id, branch_id, variant_id, batch_id, movement_type,
        quantity_delta, unit_cost, reference_type, reference_id, reason, performed_by
      ) VALUES (
        v_business_id, v_count.branch_id, v_line.variant_id, v_line.batch_id,
        'stocktake_adjustment', v_variance, v_cur_avg,
        'stock_count', v_stock_count_id,
        COALESCE(v_line.notes, 'Stocktake ' || v_count.count_number),
        v_actor_member_id
      );
    END IF;
  END LOOP;

  UPDATE public.stock_counts
  SET status = 'completed',
      approved_by = v_actor_member_id,
      completed_at = now(),
      total_variance_qty = v_total_variance,
      notes = COALESCE(v_notes, notes),
      updated_at = now()
  WHERE id = v_stock_count_id;

  INSERT INTO public.audit_logs (
    business_id, branch_id, actor_user_id, actor_member_id,
    action, entity_type, entity_id, after_data
  ) VALUES (
    v_business_id, v_count.branch_id, auth.uid(), v_actor_member_id,
    'stocktake.committed', 'stock_count', v_stock_count_id,
    jsonb_build_object(
      'count_number', v_count.count_number,
      'adjusted_lines', v_adjusted_lines,
      'total_variance_qty', v_total_variance
    )
  );

  RETURN jsonb_build_object(
    'stock_count_id', v_stock_count_id,
    'adjusted_lines', v_adjusted_lines,
    'total_variance_qty', v_total_variance,
    'status', 'completed'
  );
END;
$$;

-- ============================================================================
-- 4. ATOMIC RPC: resolve_quarantine(p_payload JSONB)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.resolve_quarantine(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_business_id UUID := (p_payload->>'business_id')::UUID;
  v_quarantine_id UUID := (p_payload->>'quarantine_id')::UUID;
  v_disposition TEXT := lower(trim(COALESCE(p_payload->>'disposition', '')));
  v_req_qty NUMERIC(14,3) := NULLIF(p_payload->>'quantity', '')::NUMERIC;
  v_supplier_return_id UUID := NULLIF(p_payload->>'supplier_return_id', '')::UUID;
  v_note TEXT := NULLIF(p_payload->>'note', '');
  v_actor_member_id UUID;
  v_q RECORD;
  v_remaining NUMERIC(14,3);
  v_resolve_qty NUMERIC(14,3);
  v_cur_q NUMERIC(14,3);
  v_new_status TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF v_disposition NOT IN ('restock', 'write_off', 'return_to_supplier') THEN
    RAISE EXCEPTION 'Invalid disposition: %', v_disposition;
  END IF;

  SELECT * INTO v_q
  FROM public.quarantine_records
  WHERE id = v_quarantine_id AND business_id = v_business_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quarantine record not found';
  END IF;
  IF v_q.status <> 'open' THEN
    RAISE EXCEPTION 'Quarantine record is already %', v_q.status;
  END IF;
  IF NOT public.has_branch_access(v_business_id, v_q.branch_id)
     OR NOT public.has_permission(v_business_id, 'inventory.manage') THEN
    RAISE EXCEPTION 'Insufficient permissions to resolve quarantine';
  END IF;

  IF v_supplier_return_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.supplier_returns sr
    WHERE sr.id = v_supplier_return_id AND sr.business_id = v_business_id
  ) THEN
    RAISE EXCEPTION 'supplier_return_id does not belong to this business';
  END IF;

  v_actor_member_id := public.current_business_member_id(v_business_id);
  v_remaining := v_q.quantity - v_q.resolved_quantity;
  v_resolve_qty := COALESCE(v_req_qty, v_remaining);

  IF v_resolve_qty <= 0 OR v_resolve_qty > v_remaining THEN
    RAISE EXCEPTION 'Resolve quantity (%) exceeds remaining quarantined quantity (%)', v_resolve_qty, v_remaining;
  END IF;

  SELECT quantity_quarantined INTO v_cur_q
  FROM public.stock_levels
  WHERE branch_id = v_q.branch_id AND variant_id = v_q.variant_id
  FOR UPDATE;

  IF COALESCE(v_cur_q, 0) < v_resolve_qty THEN
    RAISE EXCEPTION 'Insufficient quarantined stock balance on hand';
  END IF;

  IF v_disposition = 'restock' THEN
    UPDATE public.stock_levels
    SET quantity_quarantined = quantity_quarantined - v_resolve_qty,
        quantity_on_hand = quantity_on_hand + v_resolve_qty,
        updated_at = now()
    WHERE branch_id = v_q.branch_id AND variant_id = v_q.variant_id;

    INSERT INTO public.stock_movements (
      business_id, branch_id, variant_id, batch_id, movement_type,
      quantity_delta, unit_cost, reference_type, reference_id, reason, performed_by
    ) VALUES (
      v_business_id, v_q.branch_id, v_q.variant_id, v_q.batch_id, 'quarantine_restock',
      v_resolve_qty, v_q.unit_cost, 'quarantine_record', v_q.id,
      COALESCE(v_note, 'Restocked from quarantine'), v_actor_member_id
    );
    v_new_status := CASE WHEN (v_q.resolved_quantity + v_resolve_qty) >= v_q.quantity THEN 'restocked' ELSE 'open' END;
  ELSIF v_disposition = 'write_off' THEN
    UPDATE public.stock_levels
    SET quantity_quarantined = quantity_quarantined - v_resolve_qty,
        updated_at = now()
    WHERE branch_id = v_q.branch_id AND variant_id = v_q.variant_id;

    INSERT INTO public.stock_movements (
      business_id, branch_id, variant_id, batch_id, movement_type,
      quantity_delta, unit_cost, reference_type, reference_id, reason, performed_by
    ) VALUES (
      v_business_id, v_q.branch_id, v_q.variant_id, v_q.batch_id, 'damage_writeoff',
      -v_resolve_qty, v_q.unit_cost, 'quarantine_record', v_q.id,
      COALESCE(v_note, 'Damaged stock write-off'), v_actor_member_id
    );
    v_new_status := CASE WHEN (v_q.resolved_quantity + v_resolve_qty) >= v_q.quantity THEN 'written_off' ELSE 'open' END;
  ELSE
    UPDATE public.stock_levels
    SET quantity_quarantined = quantity_quarantined - v_resolve_qty,
        updated_at = now()
    WHERE branch_id = v_q.branch_id AND variant_id = v_q.variant_id;

    INSERT INTO public.stock_movements (
      business_id, branch_id, variant_id, batch_id, movement_type,
      quantity_delta, unit_cost, reference_type, reference_id, reason, performed_by
    ) VALUES (
      v_business_id, v_q.branch_id, v_q.variant_id, v_q.batch_id, 'supplier_return',
      -v_resolve_qty, v_q.unit_cost, 'quarantine_record', v_q.id,
      COALESCE(v_note, 'Returned quarantined stock to supplier'), v_actor_member_id
    );
    v_new_status := CASE WHEN (v_q.resolved_quantity + v_resolve_qty) >= v_q.quantity THEN 'returned_to_supplier' ELSE 'open' END;
  END IF;

  UPDATE public.quarantine_records
  SET resolved_quantity = resolved_quantity + v_resolve_qty,
      status = v_new_status,
      disposition_note = COALESCE(v_note, disposition_note),
      supplier_return_id = COALESCE(v_supplier_return_id, supplier_return_id),
      resolved_by = CASE WHEN v_new_status <> 'open' THEN v_actor_member_id ELSE resolved_by END,
      resolved_at = CASE WHEN v_new_status <> 'open' THEN now() ELSE resolved_at END,
      updated_at = now()
  WHERE id = v_q.id;

  INSERT INTO public.audit_logs (
    business_id, branch_id, actor_user_id, actor_member_id,
    action, entity_type, entity_id, after_data
  ) VALUES (
    v_business_id, v_q.branch_id, auth.uid(), v_actor_member_id,
    'quarantine.resolved', 'quarantine_record', v_q.id,
    jsonb_build_object('disposition', v_disposition, 'quantity', v_resolve_qty, 'status', v_new_status)
  );

  RETURN jsonb_build_object(
    'quarantine_id', v_q.id,
    'resolved_quantity', v_q.resolved_quantity + v_resolve_qty,
    'status', v_new_status
  );
END;
$$;

-- ============================================================================
-- 5. ATOMIC RPC: process_supplier_return(p_payload JSONB)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_supplier_return(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_business_id UUID := (p_payload->>'business_id')::UUID;
  v_branch_id UUID := (p_payload->>'branch_id')::UUID;
  v_supplier_id UUID := (p_payload->>'supplier_id')::UUID;
  v_grn_id UUID := NULLIF(p_payload->>'goods_receipt_id', '')::UUID;
  v_create_cn BOOLEAN := COALESCE((p_payload->>'create_credit_note')::BOOLEAN, true);
  v_reason TEXT := COALESCE(NULLIF(p_payload->>'reason', ''), 'Supplier return');
  v_notes TEXT := NULLIF(p_payload->>'notes', '');
  v_items JSONB := p_payload->'items';
  v_actor_member_id UUID;
  v_return_id UUID;
  v_return_no TEXT;
  v_cn_id UUID;
  v_cn_no TEXT;
  v_item JSONB;
  v_variant_id UUID;
  v_batch_id UUID;
  v_bucket TEXT;
  v_qty NUMERIC(14,3);
  v_unit_cost NUMERIC(14,4);
  v_line_total NUMERIC(14,2);
  v_total_qty NUMERIC(14,3) := 0;
  v_total_cost NUMERIC(14,2) := 0;
  v_sl RECORD;
  v_new_sup_bal NUMERIC(14,2);
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF v_business_id IS NULL OR v_branch_id IS NULL OR v_supplier_id IS NULL THEN
    RAISE EXCEPTION 'business_id, branch_id, and supplier_id are required';
  END IF;
  IF v_items IS NULL OR jsonb_typeof(v_items) <> 'array' OR jsonb_array_length(v_items) = 0 THEN
    RAISE EXCEPTION 'At least one return item is required';
  END IF;
  IF NOT public.has_branch_access(v_business_id, v_branch_id)
     OR NOT (
       public.has_permission(v_business_id, 'purchasing.manage')
       OR public.has_permission(v_business_id, 'inventory.manage')
     ) THEN
    RAISE EXCEPTION 'Insufficient permissions to process supplier return';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.suppliers s
    WHERE s.id = v_supplier_id AND s.business_id = v_business_id AND s.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Supplier does not belong to this business';
  END IF;

  IF v_grn_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.goods_receipts gr
    WHERE gr.id = v_grn_id AND gr.business_id = v_business_id AND gr.branch_id = v_branch_id
  ) THEN
    RAISE EXCEPTION 'goods_receipt_id does not belong to this business and branch';
  END IF;

  v_actor_member_id := public.current_business_member_id(v_business_id);
  v_return_no := 'SR-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 4);

  INSERT INTO public.supplier_returns (
    business_id, branch_id, supplier_id, goods_receipt_id,
    return_number, status, reason, notes, created_by
  ) VALUES (
    v_business_id, v_branch_id, v_supplier_id, v_grn_id,
    v_return_no, CASE WHEN v_create_cn THEN 'credited' ELSE 'dispatched' END,
    v_reason, v_notes, v_actor_member_id
  ) RETURNING id INTO v_return_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
  LOOP
    v_variant_id := (v_item->>'variant_id')::UUID;
    v_batch_id := NULLIF(v_item->>'batch_id', '')::UUID;
    v_bucket := COALESCE(NULLIF(v_item->>'source_bucket', ''), 'on_hand');
    v_qty := (v_item->>'quantity')::NUMERIC(14,3);
    v_unit_cost := COALESCE(NULLIF(v_item->>'unit_cost', '')::NUMERIC(14,4), 0);

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'Return item quantity must be greater than zero';
    END IF;
    IF v_unit_cost < 0 THEN
      RAISE EXCEPTION 'Return item unit_cost cannot be negative';
    END IF;
    IF v_bucket NOT IN ('on_hand', 'quarantined') THEN
      RAISE EXCEPTION 'Invalid source_bucket: %', v_bucket;
    END IF;
    IF v_batch_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.product_batches pb
      WHERE pb.id = v_batch_id AND pb.business_id = v_business_id AND pb.branch_id = v_branch_id
    ) THEN
      RAISE EXCEPTION 'batch_id does not belong to this business and branch';
    END IF;

    SELECT * INTO v_sl
    FROM public.stock_levels
    WHERE branch_id = v_branch_id AND variant_id = v_variant_id AND business_id = v_business_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock level not found for variant %', v_variant_id;
    END IF;

    IF v_unit_cost = 0 THEN
      v_unit_cost := v_sl.average_cost;
    END IF;

    IF v_bucket = 'quarantined' THEN
      IF v_sl.quantity_quarantined < v_qty THEN
        RAISE EXCEPTION 'Insufficient quarantined stock for variant %', v_variant_id;
      END IF;
      UPDATE public.stock_levels
      SET quantity_quarantined = quantity_quarantined - v_qty, updated_at = now()
      WHERE id = v_sl.id;
    ELSE
      IF v_sl.quantity_on_hand < v_qty THEN
        RAISE EXCEPTION 'Insufficient on-hand stock for variant %', v_variant_id;
      END IF;
      UPDATE public.stock_levels
      SET quantity_on_hand = quantity_on_hand - v_qty, updated_at = now()
      WHERE id = v_sl.id;
    END IF;

    v_line_total := ROUND((v_qty * v_unit_cost)::numeric, 2);
    v_total_qty := v_total_qty + v_qty;
    v_total_cost := v_total_cost + v_line_total;

    INSERT INTO public.supplier_return_items (
      business_id, supplier_return_id, variant_id, batch_id,
      source_bucket, quantity, unit_cost, line_total, reason
    ) VALUES (
      v_business_id, v_return_id, v_variant_id, v_batch_id,
      v_bucket, v_qty, v_unit_cost, v_line_total, COALESCE(v_item->>'reason', v_reason)
    );

    INSERT INTO public.stock_movements (
      business_id, branch_id, variant_id, batch_id, movement_type,
      quantity_delta, unit_cost, reference_type, reference_id, reason, performed_by
    ) VALUES (
      v_business_id, v_branch_id, v_variant_id, v_batch_id, 'supplier_return',
      -v_qty, v_unit_cost, 'supplier_return', v_return_id,
      COALESCE(v_item->>'reason', v_reason), v_actor_member_id
    );
  END LOOP;

  IF v_create_cn AND v_total_cost > 0 THEN
    v_cn_no := 'SCN-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 4);
    INSERT INTO public.supplier_credit_notes (
      business_id, supplier_id, credit_note_number, amount, reason, issued_date, created_by
    ) VALUES (
      v_business_id, v_supplier_id, v_cn_no, v_total_cost,
      'Supplier return ' || v_return_no || ': ' || v_reason, CURRENT_DATE, v_actor_member_id
    ) RETURNING id INTO v_cn_id;

    UPDATE public.suppliers
    SET current_balance = current_balance - v_total_cost,
        updated_at = now()
    WHERE id = v_supplier_id AND business_id = v_business_id
    RETURNING current_balance INTO v_new_sup_bal;

    INSERT INTO public.supplier_ledger (
      business_id, supplier_id, entry_type, reference_type, reference_id,
      debit_amount, credit_amount, running_balance, notes, recorded_by
    ) VALUES (
      v_business_id, v_supplier_id, 'credit_note', 'supplier_return', v_return_id,
      0, v_total_cost, COALESCE(v_new_sup_bal, 0),
      'Supplier return ' || v_return_no, v_actor_member_id
    );
  END IF;

  UPDATE public.supplier_returns
  SET total_quantity = v_total_qty,
      total_cost_amount = v_total_cost,
      supplier_credit_note_id = v_cn_id,
      updated_at = now()
  WHERE id = v_return_id;

  INSERT INTO public.audit_logs (
    business_id, branch_id, actor_user_id, actor_member_id,
    action, entity_type, entity_id, after_data
  ) VALUES (
    v_business_id, v_branch_id, auth.uid(), v_actor_member_id,
    'supplier_return.processed', 'supplier_return', v_return_id,
    jsonb_build_object(
      'return_number', v_return_no,
      'total_quantity', v_total_qty,
      'total_cost_amount', v_total_cost,
      'credit_note_id', v_cn_id
    )
  );

  RETURN jsonb_build_object(
    'supplier_return_id', v_return_id,
    'return_number', v_return_no,
    'total_quantity', v_total_qty,
    'total_cost_amount', v_total_cost,
    'supplier_credit_note_id', v_cn_id
  );
END;
$$;

-- ============================================================================
-- 6. ATOMIC RPC: adjust_variant_cost_basis(p_payload JSONB)  [M10]
-- ============================================================================
CREATE OR REPLACE FUNCTION public.adjust_variant_cost_basis(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_business_id UUID := (p_payload->>'business_id')::UUID;
  v_branch_id UUID := (p_payload->>'branch_id')::UUID;
  v_variant_id UUID := (p_payload->>'variant_id')::UUID;
  v_new_cost NUMERIC(14,4) := (p_payload->>'new_cost')::NUMERIC(14,4);
  v_reason TEXT := COALESCE(NULLIF(trim(p_payload->>'reason'), ''), 'Manual cost basis adjustment');
  v_actor_member_id UUID;
  v_prev_cost NUMERIC(14,4);
  v_on_hand NUMERIC(14,3);
  v_val_delta NUMERIC(14,2);
  v_adj_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF v_new_cost IS NULL OR v_new_cost < 0 THEN
    RAISE EXCEPTION 'new_cost must be zero or positive';
  END IF;
  IF NOT public.has_branch_access(v_business_id, v_branch_id)
     OR NOT public.has_permission(v_business_id, 'inventory.manage') THEN
    RAISE EXCEPTION 'Insufficient permissions to adjust cost basis';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.product_variants pv
    WHERE pv.id = v_variant_id AND pv.business_id = v_business_id AND pv.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Variant does not belong to this business';
  END IF;

  v_actor_member_id := public.current_business_member_id(v_business_id);

  INSERT INTO public.stock_levels (business_id, branch_id, variant_id, quantity_on_hand, average_cost)
  VALUES (v_business_id, v_branch_id, v_variant_id, 0, v_new_cost)
  ON CONFLICT (branch_id, variant_id) DO NOTHING;

  SELECT quantity_on_hand, average_cost INTO v_on_hand, v_prev_cost
  FROM public.stock_levels
  WHERE branch_id = v_branch_id AND variant_id = v_variant_id
  FOR UPDATE;

  v_val_delta := ROUND((v_on_hand * (v_new_cost - v_prev_cost))::numeric, 2);

  UPDATE public.stock_levels
  SET average_cost = v_new_cost, updated_at = now()
  WHERE branch_id = v_branch_id AND variant_id = v_variant_id;

  UPDATE public.product_variants
  SET cost_price = ROUND(v_new_cost::numeric, 2), updated_at = now()
  WHERE id = v_variant_id AND business_id = v_business_id;

  INSERT INTO public.cost_basis_adjustments (
    business_id, branch_id, variant_id, previous_cost, new_cost,
    on_hand_qty_snapshot, valuation_delta, reason, adjusted_by
  ) VALUES (
    v_business_id, v_branch_id, v_variant_id, v_prev_cost, v_new_cost,
    v_on_hand, v_val_delta, v_reason, v_actor_member_id
  ) RETURNING id INTO v_adj_id;

  INSERT INTO public.audit_logs (
    business_id, branch_id, actor_user_id, actor_member_id,
    action, entity_type, entity_id, before_data, after_data
  ) VALUES (
    v_business_id, v_branch_id, auth.uid(), v_actor_member_id,
    'inventory.cost_basis_adjusted', 'cost_basis_adjustment', v_adj_id,
    jsonb_build_object('average_cost', v_prev_cost),
    jsonb_build_object('average_cost', v_new_cost, 'on_hand_qty', v_on_hand, 'valuation_delta', v_val_delta, 'reason', v_reason)
  );

  RETURN jsonb_build_object(
    'adjustment_id', v_adj_id,
    'previous_cost', v_prev_cost,
    'new_cost', v_new_cost,
    'valuation_delta', v_val_delta
  );
END;
$$;

-- ============================================================================
-- 7. ATOMIC RPC: process_exchange(p_payload JSONB)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_exchange(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_business_id UUID := (p_payload->>'business_id')::UUID;
  v_branch_id UUID := (p_payload->>'branch_id')::UUID;
  v_orig_sale_id UUID := NULLIF(p_payload->>'original_sale_id', '')::UUID;
  v_customer_id UUID := NULLIF(p_payload->>'customer_id', '')::UUID;
  v_shift_id UUID := NULLIF(p_payload->>'shift_id', '')::UUID;
  v_reason TEXT := COALESCE(NULLIF(p_payload->>'reason', ''), 'Customer exchange');
  v_returned JSONB := p_payload->'returned_items';
  v_replacement JSONB := p_payload->'replacement_items';
  v_method_code TEXT := COALESCE(NULLIF(p_payload->>'settlement_method_code', ''), 'cash');
  v_actor_member_id UUID;
  v_return_id UUID;
  v_return_no TEXT;
  v_exchange_id UUID;
  v_exchange_no TEXT;
  v_refund_id UUID;
  v_refund_no TEXT;
  v_item JSONB;
  v_variant RECORD;
  v_qty NUMERIC(14,3);
  v_unit_price NUMERIC(14,2);
  v_line_total NUMERIC(14,2);
  v_condition TEXT;
  v_return_credit NUMERIC(14,2) := 0;
  v_replacement_total NUMERIC(14,2) := 0;
  v_net_diff NUMERIC(14,2) := 0;
  v_cur_qty NUMERIC(14,3);
  v_cur_avg NUMERIC(14,4);
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF v_returned IS NULL OR jsonb_typeof(v_returned) <> 'array' OR jsonb_array_length(v_returned) = 0 THEN
    RAISE EXCEPTION 'returned_items array is required';
  END IF;
  IF v_replacement IS NULL OR jsonb_typeof(v_replacement) <> 'array' OR jsonb_array_length(v_replacement) = 0 THEN
    RAISE EXCEPTION 'replacement_items array is required';
  END IF;
  IF NOT public.has_branch_access(v_business_id, v_branch_id)
     OR NOT public.has_permission(v_business_id, 'pos.returns.process') THEN
    RAISE EXCEPTION 'Insufficient permissions to process exchange';
  END IF;

  IF v_orig_sale_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.sales s
    WHERE s.id = v_orig_sale_id AND s.business_id = v_business_id AND s.branch_id = v_branch_id
  ) THEN
    RAISE EXCEPTION 'original_sale_id does not belong to this business and branch';
  END IF;

  IF v_customer_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.customers c
    WHERE c.id = v_customer_id AND c.business_id = v_business_id AND c.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'customer_id does not belong to this business';
  END IF;

  IF v_shift_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.cash_shifts cs
    WHERE cs.id = v_shift_id AND cs.business_id = v_business_id AND cs.branch_id = v_branch_id AND cs.status = 'open'
  ) THEN
    RAISE EXCEPTION 'shift_id must reference an open shift in this branch';
  END IF;

  v_actor_member_id := public.current_business_member_id(v_business_id);
  v_return_no := 'RET-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 4);
  v_exchange_no := 'EXC-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 4);

  INSERT INTO public.sales_returns (
    business_id, branch_id, original_sale_id, customer_id,
    return_number, return_type, status, reason, processed_by
  ) VALUES (
    v_business_id, v_branch_id, v_orig_sale_id, v_customer_id,
    v_return_no, CASE WHEN v_orig_sale_id IS NOT NULL THEN 'with_bill' ELSE 'no_bill' END,
    'completed', v_reason, v_actor_member_id
  ) RETURNING id INTO v_return_id;

  INSERT INTO public.exchanges (
    business_id, branch_id, sales_return_id, exchange_number, processed_by
  ) VALUES (
    v_business_id, v_branch_id, v_return_id, v_exchange_no, v_actor_member_id
  ) RETURNING id INTO v_exchange_id;

  -- 1. Process returned lines
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_returned)
  LOOP
    v_qty := (v_item->>'quantity')::NUMERIC(14,3);
    v_unit_price := (v_item->>'unit_price')::NUMERIC(14,2);
    v_condition := COALESCE(NULLIF(v_item->>'condition', ''), 'resellable');

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'Returned item quantity must be greater than zero';
    END IF;
    IF v_unit_price IS NULL OR v_unit_price < 0 THEN
      RAISE EXCEPTION 'Returned item unit_price cannot be negative';
    END IF;

    v_line_total := ROUND((v_qty * v_unit_price)::numeric, 2);
    v_return_credit := v_return_credit + v_line_total;

    SELECT pv.id, pv.variant_name, pv.cost_price, p.name AS product_name
    INTO v_variant
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id AND p.business_id = v_business_id
    WHERE pv.id = (v_item->>'variant_id')::UUID AND pv.business_id = v_business_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Returned variant not found';
    END IF;

    INSERT INTO public.sales_return_items (
      business_id, sales_return_id, original_sale_item_id, variant_id,
      product_name_snapshot, variant_label_snapshot,
      quantity, unit_price, line_total, condition, restocked
    ) VALUES (
      v_business_id, v_return_id, NULLIF(v_item->>'original_sale_item_id', '')::UUID, v_variant.id,
      v_variant.product_name, v_variant.variant_name,
      v_qty, v_unit_price, v_line_total, v_condition, (v_condition = 'resellable')
    );

    INSERT INTO public.exchange_items (
      business_id, exchange_id, direction, variant_id, quantity, unit_price, line_total
    ) VALUES (
      v_business_id, v_exchange_id, 'returned', v_variant.id, v_qty, v_unit_price, v_line_total
    );

    INSERT INTO public.stock_levels (business_id, branch_id, variant_id, quantity_on_hand, average_cost)
    VALUES (v_business_id, v_branch_id, v_variant.id, 0, COALESCE(v_variant.cost_price, 0))
    ON CONFLICT (branch_id, variant_id) DO NOTHING;

    SELECT average_cost INTO v_cur_avg
    FROM public.stock_levels
    WHERE branch_id = v_branch_id AND variant_id = v_variant.id
    FOR UPDATE;

    IF v_condition = 'resellable' THEN
      UPDATE public.stock_levels
      SET quantity_on_hand = quantity_on_hand + v_qty, updated_at = now()
      WHERE branch_id = v_branch_id AND variant_id = v_variant.id;

      INSERT INTO public.stock_movements (
        business_id, branch_id, variant_id, movement_type, quantity_delta,
        unit_cost, reference_type, reference_id, reason, performed_by
      ) VALUES (
        v_business_id, v_branch_id, v_variant.id, 'exchange_return', v_qty,
        v_cur_avg, 'exchange', v_exchange_id, v_reason, v_actor_member_id
      );
    ELSE
      UPDATE public.stock_levels
      SET quantity_quarantined = quantity_quarantined + v_qty, updated_at = now()
      WHERE branch_id = v_branch_id AND variant_id = v_variant.id;

      INSERT INTO public.quarantine_records (
        business_id, branch_id, variant_id, source_type, source_id,
        quantity, unit_cost, reason, created_by
      ) VALUES (
        v_business_id, v_branch_id, v_variant.id, 'sales_return', v_return_id,
        v_qty, v_cur_avg, 'Damaged exchange return: ' || v_reason, v_actor_member_id
      );
    END IF;
  END LOOP;

  -- 2. Process replacement lines
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_replacement)
  LOOP
    v_qty := (v_item->>'quantity')::NUMERIC(14,3);
    v_unit_price := (v_item->>'unit_price')::NUMERIC(14,2);

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'Replacement item quantity must be greater than zero';
    END IF;
    IF v_unit_price IS NULL OR v_unit_price < 0 THEN
      RAISE EXCEPTION 'Replacement item unit_price cannot be negative';
    END IF;

    v_line_total := ROUND((v_qty * v_unit_price)::numeric, 2);
    v_replacement_total := v_replacement_total + v_line_total;

    SELECT pv.id, pv.variant_name, pv.cost_price, p.allow_negative_stock
    INTO v_variant
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id AND p.business_id = v_business_id
    WHERE pv.id = (v_item->>'variant_id')::UUID AND pv.business_id = v_business_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Replacement variant not found';
    END IF;

    SELECT quantity_on_hand, average_cost INTO v_cur_qty, v_cur_avg
    FROM public.stock_levels
    WHERE branch_id = v_branch_id AND variant_id = v_variant.id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No stock level exists for replacement variant %', v_variant.id;
    END IF;
    IF NOT v_variant.allow_negative_stock AND v_cur_qty < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for replacement variant %', v_variant.id;
    END IF;

    UPDATE public.stock_levels
    SET quantity_on_hand = quantity_on_hand - v_qty, updated_at = now()
    WHERE branch_id = v_branch_id AND variant_id = v_variant.id;

    INSERT INTO public.exchange_items (
      business_id, exchange_id, direction, variant_id, quantity, unit_price, line_total
    ) VALUES (
      v_business_id, v_exchange_id, 'replacement', v_variant.id, v_qty, v_unit_price, v_line_total
    );

    INSERT INTO public.stock_movements (
      business_id, branch_id, variant_id, movement_type, quantity_delta,
      unit_cost, reference_type, reference_id, reason, performed_by
    ) VALUES (
      v_business_id, v_branch_id, v_variant.id, 'exchange_out', -v_qty,
      v_cur_avg, 'exchange', v_exchange_id, v_reason, v_actor_member_id
    );
  END LOOP;

  v_net_diff := v_replacement_total - v_return_credit;

  UPDATE public.sales_returns
  SET total_return_amount = v_return_credit, updated_at = now()
  WHERE id = v_return_id;

  UPDATE public.exchanges
  SET return_credit_amount = v_return_credit,
      replacement_total_amount = v_replacement_total,
      net_difference_amount = v_net_diff
  WHERE id = v_exchange_id;

  IF v_net_diff < 0 THEN
    v_refund_no := 'RFD-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 4);
    INSERT INTO public.refunds (
      business_id, branch_id, sales_return_id, customer_id,
      refund_number, total_amount, status, issued_by
    ) VALUES (
      v_business_id, v_branch_id, v_return_id, v_customer_id,
      v_refund_no, ABS(v_net_diff), 'owed', v_actor_member_id
    ) RETURNING id INTO v_refund_id;
  ELSIF v_net_diff > 0 AND v_method_code = 'cash' AND v_shift_id IS NOT NULL THEN
    INSERT INTO public.cash_transactions (
      business_id, branch_id, cash_shift_id, direction, category, amount,
      reference_type, reference_id, reference_label, reason, status, created_by
    ) VALUES (
      v_business_id, v_branch_id, v_shift_id, 'in', 'exchange_difference', v_net_diff,
      'exchange', v_exchange_id, v_exchange_no, v_reason, 'reviewed', v_actor_member_id
    );
  END IF;

  INSERT INTO public.audit_logs (
    business_id, branch_id, actor_user_id, actor_member_id,
    action, entity_type, entity_id, after_data
  ) VALUES (
    v_business_id, v_branch_id, auth.uid(), v_actor_member_id,
    'exchange.processed', 'exchange', v_exchange_id,
    jsonb_build_object(
      'exchange_number', v_exchange_no,
      'return_credit_amount', v_return_credit,
      'replacement_total_amount', v_replacement_total,
      'net_difference_amount', v_net_diff,
      'refund_id', v_refund_id
    )
  );

  RETURN jsonb_build_object(
    'exchange_id', v_exchange_id,
    'exchange_number', v_exchange_no,
    'sales_return_id', v_return_id,
    'return_credit_amount', v_return_credit,
    'replacement_total_amount', v_replacement_total,
    'net_difference_amount', v_net_diff,
    'refund_id', v_refund_id
  );
END;
$$;

-- ============================================================================
-- 8. ATOMIC RPC: redeem_staff_invitation(p_invite_code TEXT, p_full_name TEXT)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.redeem_staff_invitation(
  p_invite_code TEXT,
  p_full_name TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_code TEXT := upper(trim(COALESCE(p_invite_code, '')));
  v_inv RECORD;
  v_member_id UUID;
  v_branch_id UUID;
  v_is_first BOOLEAN := true;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required to join a shop';
  END IF;
  IF v_code = '' THEN
    RAISE EXCEPTION 'Invite code is required';
  END IF;

  SELECT * INTO v_inv
  FROM public.staff_invitations
  WHERE upper(invite_code) = v_code
    AND status = 'active'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or inactive invite code';
  END IF;

  IF v_inv.expires_at < now() THEN
    UPDATE public.staff_invitations SET status = 'expired', updated_at = now() WHERE id = v_inv.id;
    RAISE EXCEPTION 'Invite code has expired';
  END IF;

  IF v_inv.used_count >= v_inv.max_uses THEN
    UPDATE public.staff_invitations SET status = 'redeemed', updated_at = now() WHERE id = v_inv.id;
    RAISE EXCEPTION 'Invite code has reached its usage limit';
  END IF;

  -- Prevent silently overwriting an existing active membership/role
  IF EXISTS (
    SELECT 1 FROM public.business_members bm
    WHERE bm.business_id = v_inv.business_id
      AND bm.user_id = v_uid
      AND bm.status = 'active'
      AND bm.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'You are already an active member of this shop';
  END IF;

  -- Ensure user profile exists
  INSERT INTO public.user_profiles (id, full_name, phone)
  VALUES (
    v_uid,
    COALESCE(NULLIF(trim(p_full_name), ''), v_inv.invited_name, 'Staff Member'),
    v_inv.invited_phone
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = COALESCE(NULLIF(trim(EXCLUDED.full_name), ''), public.user_profiles.full_name),
      updated_at = now();

  -- Create or reactivate business membership
  INSERT INTO public.business_members (
    business_id, user_id, role_id, invited_name, invited_phone, status, joined_at
  ) VALUES (
    v_inv.business_id, v_uid, v_inv.role_id, v_inv.invited_name, v_inv.invited_phone, 'active', now()
  )
  ON CONFLICT (business_id, user_id) WHERE user_id IS NOT NULL AND deleted_at IS NULL
  DO UPDATE SET
    role_id = EXCLUDED.role_id,
    status = 'active',
    updated_at = now()
  RETURNING id INTO v_member_id;

  -- Grant access only to valid branches owned by v_inv.business_id (or main branch fallback)
  IF COALESCE(array_length(v_inv.branch_ids, 1), 0) > 0 THEN
    FOR v_branch_id IN
      SELECT b.id
      FROM public.branches b
      WHERE b.business_id = v_inv.business_id
        AND b.deleted_at IS NULL
        AND b.id = ANY(v_inv.branch_ids)
      ORDER BY b.is_main DESC, b.created_at ASC
    LOOP
      INSERT INTO public.member_branch_access (business_id, member_id, branch_id, is_default)
      VALUES (v_inv.business_id, v_member_id, v_branch_id, v_is_first)
      ON CONFLICT (member_id, branch_id) DO NOTHING;
      v_is_first := false;
    END LOOP;
  END IF;

  IF v_is_first THEN
    SELECT id INTO v_branch_id
    FROM public.branches
    WHERE business_id = v_inv.business_id AND deleted_at IS NULL
    ORDER BY is_main DESC, created_at ASC
    LIMIT 1;

    IF v_branch_id IS NOT NULL THEN
      INSERT INTO public.member_branch_access (business_id, member_id, branch_id, is_default)
      VALUES (v_inv.business_id, v_member_id, v_branch_id, true)
      ON CONFLICT (member_id, branch_id) DO NOTHING;
    END IF;
  END IF;

  UPDATE public.staff_invitations
  SET used_count = used_count + 1,
      status = CASE WHEN (used_count + 1) >= max_uses THEN 'redeemed' ELSE 'active' END,
      updated_at = now()
  WHERE id = v_inv.id;

  INSERT INTO public.audit_logs (
    business_id, actor_user_id, actor_member_id,
    action, entity_type, entity_id, after_data
  ) VALUES (
    v_inv.business_id, v_uid, v_member_id,
    'staff.invitation_redeemed', 'staff_invitation', v_inv.id,
    jsonb_build_object('role_id', v_inv.role_id, 'member_id', v_member_id)
  );

  RETURN jsonb_build_object(
    'business_id', v_inv.business_id,
    'member_id', v_member_id,
    'role_id', v_inv.role_id
  );
END;
$$;

-- ============================================================================
-- 9. LOCK DOWN FUNCTION EXECUTION PRIVILEGES
-- ============================================================================
REVOKE ALL ON FUNCTION public.receive_carton(JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.commit_stocktake(JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.resolve_quarantine(JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.process_supplier_return(JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.adjust_variant_cost_basis(JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.process_exchange(JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.redeem_staff_invitation(TEXT, TEXT) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.receive_carton(JSONB) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.commit_stocktake(JSONB) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.resolve_quarantine(JSONB) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.process_supplier_return(JSONB) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.adjust_variant_cost_basis(JSONB) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.process_exchange(JSONB) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.redeem_staff_invitation(TEXT, TEXT) TO authenticated, service_role;

COMMIT;
