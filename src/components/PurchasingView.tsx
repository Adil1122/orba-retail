import React, { useState } from 'react';
import { Plus, Truck, CheckCircle2, XCircle, Building2, Trash2 } from 'lucide-react';
import type { WorkspacePayload } from '../types/pos.ts';
import { api } from '../lib/api.ts';
import { formatDateTime, formatMoney } from '../lib/format.ts';
import { Modal } from './BrandMark.tsx';

export function PurchasingView({
  workspace,
  onRefresh,
  notify,
}: {
  workspace: WorkspacePayload;
  onRefresh: () => Promise<void>;
  notify: (type: 'ok' | 'err', msg: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const [tab, setTab] = useState<'orders' | 'suppliers'>('orders');
  const [saving, setSaving] = useState(false);

  // Add Supplier modal
  const [supOpen, setSupOpen] = useState(false);
  const [sName, setSName] = useState('');
  const [sContact, setSContact] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sCity, setSCity] = useState('Lahore');
  const [sCat, setSCat] = useState('Apparel & Fabrics');

  // New PO modal
  const [poOpen, setPoOpen] = useState(false);
  const [poSupplierId, setPoSupplierId] = useState('');
  const [poNotes, setPoNotes] = useState('');
  const [poLines, setPoLines] = useState<{ productId: string; qty: number; unitCost: number }[]>([]);

  function openNewPo() {
    const firstSup = workspace.suppliers[0]?.id || '';
    const firstProd = workspace.products[0];
    setPoSupplierId(firstSup);
    setPoNotes('');
    setPoLines(
      firstProd
        ? [{ productId: firstProd.id, qty: 10, unitCost: firstProd.costPrice }]
        : []
    );
    setPoOpen(true);
  }

  async function saveSupplier(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createSupplier({
        name: sName,
        contactName: sContact,
        phone: sPhone,
        city: sCity,
        category: sCat,
      });
      setSupOpen(false);
      setSName('');
      setSContact('');
      setSPhone('');
      await onRefresh();
      notify('ok', 'Supplier added.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to add supplier.');
    } finally {
      setSaving(false);
    }
  }

  async function createPo(e: React.FormEvent) {
    e.preventDefault();
    if (!poSupplierId || poLines.length === 0) {
      notify('err', 'Select a supplier and add at least one product line.');
      return;
    }
    setSaving(true);
    try {
      await api.createPurchaseOrder({
        supplierId: poSupplierId,
        items: poLines,
        notes: poNotes,
      });
      setPoOpen(false);
      await onRefresh();
      notify('ok', 'Purchase order created.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not create purchase order.');
    } finally {
      setSaving(false);
    }
  }

  async function receivePo(id: string, poNumber: string) {
    try {
      await api.receivePurchaseOrder(id);
      await onRefresh();
      notify('ok', `Received ${poNumber} — inventory quantities updated.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to receive goods.');
    }
  }

  async function cancelPo(id: string) {
    try {
      await api.cancelPurchaseOrder(id);
      await onRefresh();
      notify('ok', 'Purchase order cancelled.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not cancel PO.');
    }
  }

  const poTotalPreview = poLines.reduce((sum, l) => sum + l.qty * l.unitCost, 0);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#5B6585]">
            {workspace.settings.branchName} · Purchasing & receiving
          </p>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#162660] leading-tight tracking-[-0.02em]">
            Suppliers
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSupOpen(true)}
            className="zyro-bs h-12 px-4 rounded-[12px] border border-[#D9CFC0] bg-white hover:bg-[#F8F2E9] text-[#162660] text-[14px] font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add supplier
          </button>
          <button
            type="button"
            onClick={openNewPo}
            className="zyro-bp h-12 px-5 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[14px] font-bold inline-flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            New purchase order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex gap-1 p-1 rounded-[12px] bg-[#ECE4D8]">
        <button
          type="button"
          onClick={() => setTab('orders')}
          className={`h-9 px-4 rounded-[9px] text-[13px] font-semibold ${
            tab === 'orders' ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]'
          }`}
        >
          Purchase Orders ({workspace.purchaseOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('suppliers')}
          className={`h-9 px-4 rounded-[9px] text-[13px] font-semibold ${
            tab === 'suppliers' ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]'
          }`}
        >
          Suppliers ({workspace.suppliers.length})
        </button>
      </div>

      {tab === 'orders' ? (
        <div className="space-y-3">
          {workspace.purchaseOrders.map((po) => (
            <div
              key={po.id}
              className="bg-white border border-[#E9E1D5] rounded-[18px] p-4 sm:p-5 flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[17px] font-bold text-[#162660] tabular-num">
                      {po.poNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold capitalize ${
                        po.status === 'received'
                          ? 'bg-[#E8F6EE] text-[#14532D]'
                          : po.status === 'ordered'
                            ? 'bg-[#FFF3C4] text-[#6B4E00]'
                            : 'bg-[#F6F0E7] text-[#5B6585]'
                      }`}
                    >
                      {po.status}
                    </span>
                  </div>
                  <p className="text-[14px] font-semibold text-[#454F70] mt-1">{po.supplierName}</p>
                  <p className="text-[12px] text-[#5B6585]">
                    Created {formatDateTime(po.createdAt)} by {po.createdBy}
                    {po.receivedAt ? ` · Received ${formatDateTime(po.receivedAt)}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <p className="text-[11px] uppercase font-semibold text-[#5B6585]">Total Cost</p>
                    <p className="text-[18px] font-bold text-[#162660] tabular-num">
                      {formatMoney(po.totalCost, cur)}
                    </p>
                  </div>
                  {po.status === 'ordered' && (
                    <>
                      <button
                        type="button"
                        onClick={() => receivePo(po.id, po.poNumber)}
                        className="h-10 px-3.5 rounded-[10px] bg-[#162660] hover:bg-[#111E50] text-white text-[13px] font-bold inline-flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Receive Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelPo(po.id)}
                        aria-label="Cancel purchase order"
                        className="w-10 h-10 rounded-[10px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-[#F6F0E7] pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {po.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 rounded-[10px] bg-[#F8F2E9] flex items-center justify-between gap-2 text-[13px]"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[#162660] truncate">{it.name}</p>
                      <p className="text-[11px] text-[#5B6585] tabular-num">
                        {it.qty} units @ {formatMoney(it.unitCost, cur)}
                      </p>
                    </div>
                    <span className="font-bold text-[#162660] tabular-num shrink-0">
                      {formatMoney(it.lineTotal, cur)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {workspace.suppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-white border border-[#E9E1D5] rounded-[18px] p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-[12px] bg-[#EEF5FE] text-[#2E46A0] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-bold text-[#162660] truncate">{sup.name}</h3>
                    <p className="text-[13px] text-[#5B6585]">
                      {sup.contactName} · {sup.city}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await api.deleteSupplier(sup.id);
                    await onRefresh();
                    notify('ok', 'Supplier removed.');
                  }}
                  aria-label={`Remove ${sup.name}`}
                  className="w-8 h-8 rounded-[8px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-[#F6F0E7] text-[13px]">
                <span className="text-[#5B6585] tabular-num">{sup.phone}</span>
                <span className="font-semibold text-[#162660]">{sup.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      <Modal open={supOpen} onClose={() => setSupOpen(false)} title="Add Supplier" maxWidth="max-w-md">
        <form onSubmit={saveSupplier} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
              Supplier / Mill Name
            </label>
            <input
              required
              value={sName}
              onChange={(e) => setSName(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                Contact Person
              </label>
              <input
                value={sContact}
                onChange={(e) => setSContact(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Phone</label>
              <input
                required
                value={sPhone}
                onChange={(e) => setSPhone(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">City</label>
              <input
                value={sCity}
                onChange={(e) => setSCity(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Specialty</label>
              <input
                value={sCat}
                onChange={(e) => setSCat(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSupOpen(false)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>

      {/* New Purchase Order Modal */}
      <Modal
        open={poOpen}
        onClose={() => setPoOpen(false)}
        title="New Purchase Order"
        subtitle="Create a supplier order and receive items directly into stock"
        maxWidth="max-w-xl"
      >
        <form onSubmit={createPo} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Supplier</label>
            <select
              required
              value={poSupplierId}
              onChange={(e) => setPoSupplierId(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
            >
              {workspace.suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-[#162660]">Order Items</p>
              <button
                type="button"
                onClick={() => {
                  const p = workspace.products[0];
                  if (p) setPoLines((prev) => [...prev, { productId: p.id, qty: 10, unitCost: p.costPrice }]);
                }}
                className="text-[13px] font-bold text-[#2E46A0] hover:underline"
              >
                + Add Line
              </button>
            </div>

            {poLines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <select
                  value={line.productId}
                  onChange={(e) => {
                    const prod = workspace.products.find((p) => p.id === e.target.value);
                    const next = [...poLines];
                    next[idx] = {
                      ...line,
                      productId: e.target.value,
                      unitCost: prod?.costPrice ?? line.unitCost,
                    };
                    setPoLines(next);
                  }}
                  className="col-span-6 h-10 px-2.5 rounded-[10px] border border-[#D9CFC0] bg-white text-[13px]"
                >
                  {workspace.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={line.qty}
                  onChange={(e) => {
                    const next = [...poLines];
                    next[idx] = { ...line, qty: Math.max(1, Number(e.target.value) || 1) };
                    setPoLines(next);
                  }}
                  placeholder="Qty"
                  className="col-span-2 h-10 px-2 rounded-[10px] border border-[#D9CFC0] text-[13px] font-bold tabular-num"
                />
                <input
                  type="number"
                  min={0}
                  value={line.unitCost}
                  onChange={(e) => {
                    const next = [...poLines];
                    next[idx] = { ...line, unitCost: Math.max(0, Number(e.target.value) || 0) };
                    setPoLines(next);
                  }}
                  placeholder="Cost"
                  className="col-span-3 h-10 px-2 rounded-[10px] border border-[#D9CFC0] text-[13px] font-bold tabular-num"
                />
                <button
                  type="button"
                  onClick={() => setPoLines((prev) => prev.filter((_, i) => i !== idx))}
                  className="col-span-1 h-10 rounded-[10px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Notes</label>
            <input
              value={poNotes}
              onChange={(e) => setPoNotes(e.target.value)}
              placeholder="Delivery timeline or instructions"
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>

          <div className="p-3.5 rounded-[14px] bg-[#F8F2E9] flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#454F70]">Estimated Order Total</span>
            <span className="text-[19px] font-bold text-[#162660] tabular-num">
              {formatMoney(poTotalPreview, cur)}
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPoOpen(false)}
              className="h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Create Purchase Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
