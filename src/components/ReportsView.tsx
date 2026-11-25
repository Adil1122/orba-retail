import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import type { WorkspacePayload } from '../types/pos.ts';
import { downloadCsv, formatMoney, isSameDay, paymentMethodLabel } from '../lib/format.ts';

export function ReportsView({ workspace }: { workspace: WorkspacePayload }) {
  const cur = workspace.settings.currency || 'Rs';
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('30d');
  const [tab, setTab] = useState<'overview' | 'payments' | 'products' | 'inventory'>('overview');

  const filteredSales = useMemo(() => {
    const now = Date.now();
    return workspace.sales.filter((s) => {
      if (range === 'all') return true;
      if (range === 'today') return isSameDay(s.createdAt);
      const days = range === '7d' ? 7 : 30;
      return now - new Date(s.createdAt).getTime() <= days * 86400 * 1000;
    });
  }, [workspace.sales, range]);

  const analytics = useMemo(() => {
    const grossSales = filteredSales.reduce((s, x) => s + x.total, 0);
    const totalDiscounts = filteredSales.reduce((s, x) => s + x.discountAmount, 0);
    const totalCost = filteredSales.reduce(
      (s, x) => s + x.items.reduce((a, i) => a + i.costPrice * (i.qty - i.returnedQty), 0),
      0
    );
    const totalExpenses = workspace.expenses.reduce((s, e) => s + e.amount, 0);
    const grossProfit = Math.max(0, grossSales - totalCost);
    const netProfit = grossProfit - totalExpenses;
    const avgBill = filteredSales.length > 0 ? Math.round(grossSales / filteredSales.length) : 0;

    // Payment breakdown
    const payMap = new Map<string, { method: string; total: number; count: number }>();
    for (const s of filteredSales) {
      if (s.paymentMethod === 'split' && s.paymentSplit) {
        for (const leg of s.paymentSplit) {
          const prev = payMap.get(leg.method) || { method: leg.method, total: 0, count: 0 };
          prev.total += leg.amount;
          prev.count += 1;
          payMap.set(leg.method, prev);
        }
      } else {
        const prev = payMap.get(s.paymentMethod) || { method: s.paymentMethod, total: 0, count: 0 };
        prev.total += s.total;
        prev.count += 1;
        payMap.set(s.paymentMethod, prev);
      }
    }
    const paymentRows = Array.from(payMap.values()).sort((a, b) => b.total - a.total);

    // Product performance
    const prodMap = new Map<
      string,
      { name: string; sku: string; qty: number; revenue: number; profit: number }
    >();
    for (const s of filteredSales) {
      for (const it of s.items) {
        const netQty = Math.max(0, it.qty - it.returnedQty);
        const rev = it.lineTotal;
        const prof = rev - it.costPrice * netQty;
        const prev = prodMap.get(it.productId) || {
          name: it.name,
          sku: it.sku,
          qty: 0,
          revenue: 0,
          profit: 0,
        };
        prev.qty += netQty;
        prev.revenue += rev;
        prev.profit += prof;
        prodMap.set(it.productId, prev);
      }
    }
    const topProducts = Array.from(prodMap.values()).sort((a, b) => b.revenue - a.revenue);

    return {
      grossSales,
      totalDiscounts,
      totalCost,
      totalExpenses,
      grossProfit,
      netProfit,
      avgBill,
      paymentRows,
      topProducts,
    };
  }, [filteredSales, workspace.expenses]);

  function exportCurrentCsv() {
    if (tab === 'inventory') {
      downloadCsv(
        'zyro-inventory-report.csv',
        ['SKU', 'Product', 'Variant', 'Stock Qty', 'Cost Price', 'Sale Price', 'Stock Cost Value'],
        workspace.products.map((p) => [
          p.sku,
          p.name,
          p.variant,
          p.stockQty,
          p.costPrice,
          p.salePrice,
          p.stockQty * p.costPrice,
        ])
      );
      return;
    }
    downloadCsv(
      `zyro-sales-report-${range}.csv`,
      ['Bill #', 'Date', 'Customer', 'Cashier', 'Payment', 'Discount', 'Total'],
      filteredSales.map((s) => [
        s.billNo,
        s.createdAt,
        s.customerName,
        s.cashierName,
        paymentMethodLabel(s.paymentMethod),
        s.discountAmount,
        s.total,
      ])
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#5B6585]">
            {workspace.settings.branchName} · Business Intelligence
          </p>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#162660] leading-tight">
            Reports & Analytics
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex gap-1 p-1 rounded-[12px] bg-[#ECE4D8]">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: 'all', label: 'All Time' },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                className={`h-8 px-3 rounded-[9px] text-[12px] font-semibold ${
                  range === r.id ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={exportCurrentCsv}
            className="h-10 px-4 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[13px] font-bold inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Total Revenue</p>
          <p className="text-[24px] font-bold text-[#162660] tabular-num mt-1">
            {formatMoney(analytics.grossSales, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585] tabular-num">
            {filteredSales.length} bills · Avg {formatMoney(analytics.avgBill, cur)}
          </p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Gross Margin</p>
          <p className="text-[24px] font-bold text-[#14532D] tabular-num mt-1">
            {formatMoney(analytics.grossProfit, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585] tabular-num">
            COGS: {formatMoney(analytics.totalCost, cur)}
          </p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Operating Expenses</p>
          <p className="text-[24px] font-bold text-[#B42318] tabular-num mt-1">
            {formatMoney(analytics.totalExpenses, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">Logged expenses</p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Est. Net Profit</p>
          <p
            className={`text-[24px] font-bold tabular-num mt-1 ${
              analytics.netProfit >= 0 ? 'text-[#162660]' : 'text-[#B42318]'
            }`}
          >
            {formatMoney(analytics.netProfit, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585] tabular-num">
            Discounts given: {formatMoney(analytics.totalDiscounts, cur)}
          </p>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="inline-flex gap-1 p-1 rounded-[12px] bg-[#ECE4D8] max-w-full overflow-x-auto">
        {(
          [
            { id: 'overview', label: 'Payment Breakdown' },
            { id: 'products', label: 'Top Products' },
            { id: 'inventory', label: 'Inventory Valuation' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`h-9 px-4 rounded-[9px] text-[13px] font-semibold whitespace-nowrap ${
              tab === t.id ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 space-y-4">
          <h2 className="text-[17px] font-bold text-[#162660]">Collections by Payment Method</h2>
          {analytics.paymentRows.length === 0 ? (
            <p className="text-[14px] text-[#5B6585] py-6 text-center">No sales in selected period.</p>
          ) : (
            <div className="space-y-3.5">
              {analytics.paymentRows.map((row) => {
                const pct =
                  analytics.grossSales > 0
                    ? Math.round((row.total / analytics.grossSales) * 100)
                    : 0;
                return (
                  <div key={row.method} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="font-bold text-[#162660]">
                        {paymentMethodLabel(row.method)}{' '}
                        <span className="text-[12px] font-medium text-[#5B6585] tabular-num">
                          ({row.count} txns)
                        </span>
                      </span>
                      <span className="font-bold text-[#162660] tabular-num">
                        {formatMoney(row.total, cur)}{' '}
                        <span className="text-[12px] font-medium text-[#5B6585]">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-[#F6F0E7] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#162660]"
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'products' && (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#F6F0E7] bg-[#F8F2E9]/70 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3 text-right">Units Sold</th>
                  <th className="py-3 px-3 text-right">Revenue</th>
                  <th className="py-3 px-4 text-right">Est. Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
                {analytics.topProducts.map((p) => (
                  <tr key={p.sku}>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#162660]">{p.name}</p>
                      <p className="text-[12px] text-[#5B6585]">{p.sku}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold tabular-num">{p.qty}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#162660] tabular-num">
                      {formatMoney(p.revenue, cur)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#14532D] tabular-num">
                      {formatMoney(p.profit, cur)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'inventory' && (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#F6F0E7] bg-[#F8F2E9]/70 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-3 text-right">On Hand</th>
                  <th className="py-3 px-3 text-right">Unit Cost</th>
                  <th className="py-3 px-3 text-right">Cost Valuation</th>
                  <th className="py-3 px-4 text-right">Retail Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
                {workspace.products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#162660]">{p.name}</p>
                      <p className="text-[12px] text-[#5B6585]">{p.sku}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold tabular-num">{p.stockQty}</td>
                    <td className="py-3 px-3 text-right tabular-num">{formatMoney(p.costPrice, cur)}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#162660] tabular-num">
                      {formatMoney(p.stockQty * p.costPrice, cur)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#14532D] tabular-num">
                      {formatMoney(p.stockQty * p.salePrice, cur)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
