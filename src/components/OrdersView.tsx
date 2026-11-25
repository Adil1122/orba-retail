import React, { useMemo, useState } from 'react';
import { Search, Printer, RotateCcw, ReceiptText } from 'lucide-react';
import type { Sale, WorkspacePayload } from '../types/pos.ts';
import { api } from '../lib/api.ts';
import { formatDateTime, formatMoney, paymentMethodLabel } from '../lib/format.ts';
import { Modal, SlideDrawer } from './BrandMark.tsx';

export function OrdersView({
  workspace,
  onRefresh,
  onOpenReceipt,
  notify,
}: {
  workspace: WorkspacePayload;
  onRefresh: () => Promise<void>;
  onOpenReceipt: (sale: Sale) => void;
  notify: (type: 'ok' | 'err', msg: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const [tab, setTab] = useState<'sales' | 'returns'>('sales');
  const [query, setQuery] = useState('');
  const [payFilter, setPayFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Return modal state
  const [returnSale, setReturnSale] = useState<Sale | null>(null);
  const [returnQtys, setReturnQtys] = useState<Record<string, number>>({});
  const [refundMethod, setRefundMethod] = useState<'cash' | 'bank' | 'khata_credit'>('cash');
  const [returnReason, setReturnReason] = useState('Size / colour exchange');
  const [submitting, setSubmitting] = useState(false);

  const filteredSales = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workspace.sales.filter((s) => {
      if (payFilter !== 'all' && s.paymentMethod !== payFilter) return false;
      if (!q) return true;
      return (
        s.billNo.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.cashierName.toLowerCase().includes(q)
      );
    });
  }, [workspace.sales, query, payFilter]);

  function openReturnFlow(sale: Sale) {
    const initial: Record<string, number> = {};
    for (const item of sale.items) {
      const rem = item.qty - item.returnedQty;
      if (rem > 0) initial[item.productId] = 0;
    }
    setReturnQtys(initial);
    setRefundMethod(sale.customerId ? 'khata_credit' : 'cash');
    setReturnReason('Customer return');
    setReturnSale(sale);
  }

  async function processReturn(e: React.FormEvent) {
    e.preventDefault();
    if (!returnSale) return;
    const lines = Object.entries(returnQtys)
      .filter(([, qty]) => qty > 0)
      .map(([productId, qty]) => ({ productId, qty }));
    if (lines.length === 0) {
      notify('err', 'Select at least 1 item quantity to return.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createReturn(returnSale.id, {
        items: lines,
        refundMethod,
        reason: returnReason,
      });
      setReturnSale(null);
      setSelectedSale(null);
      await onRefresh();
      notify('ok', 'Return processed and stock restored.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Return failed.');
    } finally {
      setSubmitting(false);
    }
  }

  const returnRefundEstimate = useMemo(() => {
    if (!returnSale) return 0;
    return returnSale.items.reduce((sum, item) => {
      const q = returnQtys[item.productId] || 0;
      const unitRefund = Math.round(item.lineTotal / item.qty);
      return sum + unitRefund * q;
    }, 0);
  }, [returnSale, returnQtys]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#5B6585]">
            {workspace.settings.branchName} · {workspace.sales.length} bills
          </p>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#162660] leading-tight tracking-[-0.02em]">
            Bill book
          </h1>
        </div>
        <div className="inline-flex gap-1 p-1 rounded-[12px] bg-[#ECE4D8]">
          <button
            type="button"
            onClick={() => setTab('sales')}
            className={`h-9 px-4 rounded-[9px] text-[13px] font-semibold ${
              tab === 'sales' ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]'
            }`}
          >
            Sales Bills ({workspace.sales.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('returns')}
            className={`h-9 px-4 rounded-[9px] text-[13px] font-semibold ${
              tab === 'returns' ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]'
            }`}
          >
            Returns ({workspace.returns.length})
          </button>
        </div>
      </div>

      {tab === 'sales' ? (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
          <div className="p-4 border-b border-[#F6F0E7] flex flex-wrap items-center gap-3">
            <div className="zyro-field flex-1 min-w-[200px] h-11 flex items-center gap-2 px-3 rounded-[12px] border border-[#D9CFC0] bg-white">
              <Search className="w-4 h-4 text-[#5B6585]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bill #, customer, cashier..."
                className="flex-1 bg-transparent border-0 outline-none text-[14px]"
              />
            </div>
            <select
              value={payFilter}
              onChange={(e) => setPayFilter(e.target.value)}
              className="zyro-field h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="jazzcash">JazzCash</option>
              <option value="bank">Bank Transfer</option>
              <option value="khata">Khata Credit</option>
              <option value="split">Split</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="h-[42px] border-b border-[#EFE8DC] bg-[#F8F2E9] text-[11px] font-bold uppercase tracking-[0.06em] text-[#5B6585]">
                  <th className="px-4">Bill #</th>
                  <th className="px-3">Date & Time</th>
                  <th className="px-3">Customer</th>
                  <th className="px-3">Payment</th>
                  <th className="px-3">Status</th>
                  <th className="px-3 text-right">Total</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
                {filteredSales.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSale(s)}
                    className="hover:bg-[#F8F2E9]/60 cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold text-[#162660] tabular-num">{s.billNo}</td>
                    <td className="py-3 px-3 text-[#5B6585] text-[13px] tabular-num">
                      {formatDateTime(s.createdAt)}
                    </td>
                    <td className="py-3 px-3 text-[#162660] font-medium">{s.customerName}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F6F0E7] text-[#454F70]">
                        {paymentMethodLabel(s.paymentMethod)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
                          s.status === 'completed'
                            ? 'bg-[#E8F6EE] text-[#14532D]'
                            : s.status === 'partial_return'
                              ? 'bg-[#FFF3C4] text-[#6B4E00]'
                              : 'bg-[#FDF0EF] text-[#B42318]'
                        }`}
                      >
                        {s.status === 'completed'
                          ? 'Completed'
                          : s.status === 'partial_return'
                            ? 'Partial Return'
                            : 'Returned'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#162660] tabular-num">
                      {formatMoney(s.total, cur)}
                    </td>
                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenReceipt(s)}
                          title="Print 80mm Receipt"
                          className="w-8 h-8 rounded-[8px] hover:bg-[#EEF5FE] text-[#2E46A0] flex items-center justify-center"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {s.status !== 'returned' && (
                          <button
                            type="button"
                            onClick={() => openReturnFlow(s)}
                            title="Process return"
                            className="h-8 px-2.5 rounded-[8px] hover:bg-[#FFF3C4] text-[#6B4E00] text-[12px] font-bold inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Return
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
          {workspace.returns.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F6F0E7] text-[#5B6585] flex items-center justify-center mx-auto mb-3">
                <ReceiptText className="w-6 h-6" />
              </div>
              <p className="text-[16px] font-bold text-[#162660]">No returns processed yet</p>
              <p className="text-[13px] text-[#5B6585] mt-1">
                Open any bill in Sales Bills to return items and restore stock.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="h-[42px] border-b border-[#EFE8DC] bg-[#F8F2E9] text-[11px] font-bold uppercase tracking-[0.06em] text-[#5B6585]">
                    <th className="px-4">Return #</th>
                    <th className="px-3">Original Bill</th>
                    <th className="px-3">Customer</th>
                    <th className="px-3">Reason</th>
                    <th className="px-3">Refund Method</th>
                    <th className="px-4 text-right">Refunded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
                  {workspace.returns.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-4 font-bold text-[#162660] tabular-num">{r.returnNo}</td>
                      <td className="py-3 px-3 text-[#2E46A0] font-semibold tabular-num">{r.billNo}</td>
                      <td className="py-3 px-3">{r.customerName}</td>
                      <td className="py-3 px-3 text-[#5B6585]">{r.reason}</td>
                      <td className="py-3 px-3 capitalize">{r.refundMethod.replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#B42318] tabular-num">
                        -{formatMoney(r.totalRefund, cur)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Invoice Detail SlideDrawer (matches BillBook.jsx) */}
      <SlideDrawer
        open={Boolean(selectedSale)}
        onClose={() => setSelectedSale(null)}
        eyebrow={
          selectedSale
            ? `${formatDateTime(selectedSale.createdAt)} · Cashier: ${selectedSale.cashierName}`
            : ''
        }
        title={`Bill ${selectedSale?.billNo || ''}`}
        widthClass="max-w-[460px]"
        footer={
          selectedSale && (
            <>
              {selectedSale.status !== 'returned' && (
                <button
                  type="button"
                  onClick={() => openReturnFlow(selectedSale)}
                  className="zyro-bs h-11 px-4 rounded-[12px] border border-[#EBD892] bg-[#FFF3C4] text-[#6B4E00] text-[13px] font-bold inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Process Return
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenReceipt(selectedSale)}
                className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[13px] font-bold inline-flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>
            </>
          )
        }
      >
        {selectedSale && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-[14px] bg-[#F8F2E9] text-[13px]">
              <div>
                <p className="text-[#5B6585]">Customer</p>
                <p className="font-bold text-[#162660]">{selectedSale.customerName}</p>
              </div>
              <div>
                <p className="text-[#5B6585]">Payment</p>
                <p className="font-bold text-[#162660]">{paymentMethodLabel(selectedSale.paymentMethod)}</p>
              </div>
            </div>
            <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px]">
              {selectedSale.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-2 text-[14px]">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#162660] truncate">{item.name}</p>
                    <p className="text-[12px] text-[#5B6585] tabular-num">
                      {item.qty} x {formatMoney(item.unitPrice, cur)}
                      {item.returnedQty > 0 && (
                        <span className="text-[#B42318] font-semibold">
                          {' '}
                          · {item.returnedQty} returned
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="font-bold tabular-num">{formatMoney(item.lineTotal, cur)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1 text-[14px] pt-1">
              <div className="flex justify-between text-[#5B6585]">
                <span>Subtotal</span>
                <span className="tabular-num">{formatMoney(selectedSale.subtotal, cur)}</span>
              </div>
              {selectedSale.discountAmount > 0 && (
                <div className="flex justify-between text-[#14532D]">
                  <span>Discount</span>
                  <span className="tabular-num">-{formatMoney(selectedSale.discountAmount, cur)}</span>
                </div>
              )}
              <div className="flex justify-between text-[17px] font-bold text-[#162660] pt-2 border-t border-[#F6F0E7]">
                <span>Total Paid</span>
                <span className="tabular-num">{formatMoney(selectedSale.total, cur)}</span>
              </div>
            </div>
          </div>
        )}
      </SlideDrawer>

      {/* Process Return Modal */}
      <Modal
        open={Boolean(returnSale)}
        onClose={() => setReturnSale(null)}
        title={`Return Items · ${returnSale?.billNo || ''}`}
        subtitle="Returned items are automatically restored to inventory"
        maxWidth="max-w-lg"
      >
        {returnSale && (
          <form onSubmit={processReturn} className="space-y-4">
            <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px]">
              {returnSale.items.map((item) => {
                const maxRem = item.qty - item.returnedQty;
                if (maxRem <= 0) return null;
                return (
                  <div key={item.productId} className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[#162660] truncate">{item.name}</p>
                      <p className="text-[12px] text-[#5B6585] tabular-num">
                        Returnable: {maxRem} · {formatMoney(Math.round(item.lineTotal / item.qty), cur)} ea
                      </p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={maxRem}
                      value={returnQtys[item.productId] ?? 0}
                      onChange={(e) =>
                        setReturnQtys((prev) => ({
                          ...prev,
                          [item.productId]: Math.min(maxRem, Math.max(0, Number(e.target.value) || 0)),
                        }))
                      }
                      className="w-20 h-10 px-2.5 text-center rounded-[10px] border border-[#D9CFC0] font-bold tabular-num"
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                  Refund Method
                </label>
                <select
                  value={refundMethod}
                  onChange={(e) =>
                    setRefundMethod(e.target.value as 'cash' | 'bank' | 'khata_credit')
                  }
                  className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px]"
                >
                  <option value="cash">Cash from Drawer</option>
                  <option value="bank">Bank / Digital Refund</option>
                  {returnSale.customerId && <option value="khata_credit">Credit to Customer Khata</option>}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Reason</label>
                <input
                  required
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-[14px] bg-[#FDF0EF] border border-[#F2C4BE] flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#B42318]">Total Refund Amount</span>
              <span className="text-[19px] font-bold text-[#B42318] tabular-num">
                {formatMoney(returnRefundEstimate, cur)}
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReturnSale(null)}
                className="h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || returnRefundEstimate <= 0}
                className="h-11 px-5 rounded-[12px] bg-[#B42318] hover:bg-[#9A1E14] disabled:opacity-50 text-white text-[14px] font-bold"
              >
                {submitting ? 'Processing...' : 'Confirm Return'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
