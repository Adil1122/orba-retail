import React, { useMemo, useState } from 'react';
import {
  ShoppingBag,
  PackagePlus,
  Wallet,
  Truck,
  TrendingUp,
  Banknote,
  AlertTriangle,
  BookUser,
  ArrowUpRight,
  ReceiptText,
} from 'lucide-react';
import type { NavSection, Sale, WorkspacePayload } from '../types/pos.ts';
import { formatMoney, formatTime, isSameDay, paymentMethodLabel } from '../lib/format.ts';

export function DashboardView({
  workspace,
  onNavigate,
  onOpenReceipt,
}: {
  workspace: WorkspacePayload;
  onNavigate: (section: NavSection) => void;
  onOpenReceipt: (sale: Sale) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const metrics = useMemo(() => {
    const todaySales = workspace.sales.filter((s) => isSameDay(s.createdAt));
    const salesTodayTotal = todaySales.reduce((acc, s) => acc + s.total, 0);

    let cashToday = 0;
    let digitalToday = 0;
    let creditToday = 0;
    for (const s of todaySales) {
      if (s.paymentMethod === 'cash') cashToday += s.total;
      else if (s.paymentMethod === 'khata') creditToday += s.total;
      else if (s.paymentMethod === 'split' && s.paymentSplit) {
        for (const leg of s.paymentSplit) {
          if (leg.method === 'cash') cashToday += leg.amount;
          else if (leg.method === 'khata') creditToday += leg.amount;
          else digitalToday += leg.amount;
        }
      } else {
        digitalToday += s.total;
      }
    }

    const totalRevenue7d = workspace.sales.reduce((acc, s) => acc + s.total, 0);
    const totalCost7d = workspace.sales.reduce(
      (acc, s) =>
        acc + s.items.reduce((iAcc, it) => iAcc + it.costPrice * (it.qty - it.returnedQty), 0),
      0
    );
    const grossProfit = Math.max(0, totalRevenue7d - totalCost7d);
    const marginPct = totalRevenue7d > 0 ? Math.round((grossProfit / totalRevenue7d) * 100) : 0;

    const totalKhataDue = workspace.customers.reduce((acc, c) => acc + c.balanceDue, 0);
    const lowStockItems = workspace.products.filter((p) => p.active && p.stockQty <= p.minStock);
    const openShift = workspace.shifts.find((sh) => sh.status === 'open');
    const drawerExpected = openShift?.expectedCash ?? openShift?.openingFloat ?? 0;

    // 7-day daily sales series
    const days: { label: string; short: string; total: number; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const daySales = workspace.sales.filter((s) => isSameDay(s.createdAt, d));
      days.push({
        label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
        short: d.toLocaleDateString('en-GB', { weekday: 'short' }),
        total: daySales.reduce((sum, s) => sum + s.total, 0),
        count: daySales.length,
      });
    }

    return {
      todayCount: todaySales.length,
      salesTodayTotal,
      cashToday,
      digitalToday,
      creditToday,
      totalRevenue7d,
      grossProfit,
      marginPct,
      totalKhataDue,
      lowStockItems,
      openShift,
      drawerExpected,
      days,
    };
  }, [workspace]);

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const maxDayTotal = Math.max(1, ...metrics.days.map((d) => d.total));

  const quickActions = [
    {
      title: 'Open Sell Register',
      sub: 'Scan & bill customers',
      icon: ShoppingBag,
      bg: '#162660',
      fg: '#FFFFFF',
      target: 'pos' as NavSection,
    },
    {
      title: 'Stock & Products',
      sub: `${workspace.products.length} active items`,
      icon: PackagePlus,
      bg: '#EEF5FE',
      fg: '#2E46A0',
      target: 'stock' as NavSection,
    },
    {
      title: 'Record Expense',
      sub: 'Cash drawer or bank',
      icon: Wallet,
      bg: '#F1E4D1',
      fg: '#7A5320',
      target: 'expenses' as NavSection,
    },
    {
      title: 'Receive Purchase',
      sub: `${workspace.purchaseOrders.filter((p) => p.status === 'ordered').length} pending POs`,
      icon: Truck,
      bg: '#E8F6EE',
      fg: '#14532D',
      target: 'purchasing' as NavSection,
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      {/* Signature Deep Navy Owner Hero Card (from Orba visual design, branded ZYRO) */}
      <div>
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0F1B47] via-[#132156] to-[#162660] text-white px-5 sm:px-7 pt-5 sm:pt-6 pb-20 sm:pb-22">
          <svg
            aria-hidden="true"
            width="300"
            height="300"
            viewBox="0 0 64 64"
            className="absolute -right-10 -top-16 pointer-events-none"
          >
            <circle
              cx="30"
              cy="35"
              r="16"
              fill="none"
              stroke="rgba(255,255,255,.07)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeDasharray="76 24.5"
              transform="rotate(8 30 35)"
            />
          </svg>

          <div className="relative flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#BFD0EE]">
                {todayFormatted} · {workspace.settings.branchName}
              </p>
              <h1 className="text-[24px] sm:text-[28px] font-bold leading-tight mt-0.5">
                Today at {workspace.settings.shopName}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('cash')}
              className="h-8 px-3 rounded-full bg-white/10 hover:bg-white/15 text-[13px] font-semibold inline-flex items-center gap-2 transition-colors shrink-0"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  metrics.openShift ? 'bg-[#7FD6A4]' : 'bg-[#F2D06B]'
                }`}
              />
              <span className="tabular-num">
                {metrics.openShift
                  ? `Shift ${metrics.openShift.shiftNo} Open`
                  : 'Shift Closed · Open Now'}
              </span>
            </button>
          </div>

          <div className="relative mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[14px] font-semibold text-[#BFD0EE] tabular-num">
                Recorded sales today · {metrics.todayCount} {metrics.todayCount === 1 ? 'bill' : 'bills'}
              </p>
              <p className="text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] tabular-num mt-1">
                <span className="text-[20px] sm:text-[22px] font-medium text-[#D0E6FD] mr-2">
                  {cur}
                </span>
                {Math.round(metrics.salesTodayTotal).toLocaleString('en-US')}
              </p>
              <p className="text-[12px] sm:text-[13px] text-[#BFD0EE] mt-1">
                Gross counter sales before returns · {workspace.settings.branchName}
              </p>
            </div>

            <div className="flex flex-wrap gap-5 sm:gap-7 pb-1 tabular-num">
              <div>
                <p className="text-[12px] text-[#BFD0EE]">Cash</p>
                <p className="text-[16px] sm:text-[18px] font-bold">
                  {formatMoney(metrics.cashToday, cur)}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-[#BFD0EE]">Card & Digital</p>
                <p className="text-[16px] sm:text-[18px] font-bold">
                  {formatMoney(metrics.digitalToday, cur)}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-[#BFD0EE]">Khata Credit</p>
                <p className="text-[16px] sm:text-[18px] font-bold">
                  {formatMoney(metrics.creditToday, cur)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Overlapping Floating Quick Actions Dock */}
        <section
          aria-label="Quick actions"
          className="relative z-10 -mt-12 mx-2.5 sm:mx-5 p-2.5 rounded-[20px] bg-white border border-[#E9E1D5] shadow-[0_14px_34px_rgba(22,30,60,0.12),0_1px_2px_rgba(22,30,60,0.06)] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2"
        >
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.title}
                type="button"
                onClick={() => onNavigate(qa.target)}
                className="flex items-center gap-3 min-h-[62px] px-3 py-2 rounded-[14px] hover:bg-[#F8F2E9] text-left transition-colors group"
              >
                <span
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-[1.03]"
                  style={{ background: qa.bg, color: qa.fg }}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-[#162660] truncate">{qa.title}</p>
                  <p className="text-[13px] text-[#5B6585] truncate">{qa.sub}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#5B6585] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            );
          })}
        </section>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#454F70]">
            <span className="w-7 h-7 rounded-full bg-[#EEF5FE] text-[#2E46A0] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
            7-Day Revenue
          </div>
          <p className="text-[24px] font-bold text-[#162660] tracking-[-0.02em] tabular-num">
            {formatMoney(metrics.totalRevenue7d, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585] tabular-num">
            Est. Gross Profit: <span className="font-semibold text-[#14532D]">{formatMoney(metrics.grossProfit, cur)} ({metrics.marginPct}%)</span>
          </p>
        </div>

        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#454F70]">
            <span className="w-7 h-7 rounded-full bg-[#E8F6EE] text-[#14532D] flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </span>
            Expected Cash in Drawer
          </div>
          <p className="text-[24px] font-bold text-[#162660] tracking-[-0.02em] tabular-num">
            {formatMoney(metrics.drawerExpected, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">
            {metrics.openShift
              ? `Opened by ${metrics.openShift.openedBy}`
              : 'No active cash shift open'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('customers')}
          className="bg-white border border-[#E9E1D5] hover:border-[#B5D3F5] rounded-[18px] p-4 flex flex-col gap-1.5 text-left transition-colors"
        >
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#454F70]">
            <span className="w-7 h-7 rounded-full bg-[#F6F0E7] text-[#7A5320] flex items-center justify-center">
              <BookUser className="w-4 h-4" />
            </span>
            Khata Receivable
          </div>
          <p className="text-[24px] font-bold text-[#162660] tracking-[-0.02em] tabular-num">
            {formatMoney(metrics.totalKhataDue, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585] tabular-num">
            {workspace.customers.filter((c) => c.balanceDue > 0).length} customers with open balance
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('stock')}
          className="bg-white border border-[#E9E1D5] hover:border-[#EBD892] rounded-[18px] p-4 flex flex-col gap-1.5 text-left transition-colors"
        >
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#454F70]">
            <span className="w-7 h-7 rounded-full bg-[#FFF3C4] text-[#6B4E00] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </span>
            Low Stock Alerts
          </div>
          <p className="text-[24px] font-bold text-[#162660] tracking-[-0.02em] tabular-num">
            {metrics.lowStockItems.length} {metrics.lowStockItems.length === 1 ? 'item' : 'items'}
          </p>
          <p className="text-[12px] text-[#5B6585]">
            {metrics.lowStockItems.length > 0
              ? 'At or below reorder threshold'
              : 'All stock levels healthy'}
          </p>
        </button>
      </div>

      {/* Middle Analytical Grid: 7-Day Sales Trend + Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-white border border-[#E9E1D5] rounded-[20px] p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-[17px] font-bold text-[#162660]">7-Day Sales Trend</h2>
              <p className="text-[13px] text-[#5B6585]">Daily counter revenue across all payment methods</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className="text-[13px] font-semibold text-[#2E46A0] hover:underline shrink-0"
            >
              Full reports
            </button>
          </div>

          <div className="flex-1 flex items-end gap-2 sm:gap-3 pt-6 pb-2 min-h-[190px]">
            {metrics.days.map((d, idx) => {
              const pct = Math.max(8, Math.round((d.total / maxDayTotal) * 100));
              const isToday = idx === metrics.days.length - 1;
              const isHover = hoveredDay === idx;
              return (
                <div
                  key={d.label}
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 flex flex-col items-center gap-2 min-w-0"
                >
                  <div className="text-[11px] font-semibold tabular-num text-[#454F70] h-4 truncate max-w-full">
                    {isHover || isToday ? formatMoney(d.total, cur) : ''}
                  </div>
                  <div className="w-full h-[136px] bg-[#F6F0E7] rounded-[12px] flex items-end overflow-hidden p-1">
                    <div
                      className={`w-full rounded-[9px] transition-all duration-300 ${
                        isToday
                          ? 'bg-[#162660]'
                          : isHover
                            ? 'bg-[#2E46A0]'
                            : 'bg-[#B5D3F5]'
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span
                    className={`text-[12px] font-semibold ${
                      isToday ? 'text-[#162660]' : 'text-[#5B6585]'
                    }`}
                  >
                    {d.short}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#E9E1D5] rounded-[20px] p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-[17px] font-bold text-[#162660]">Reorder Watchlist</h2>
              <p className="text-[13px] text-[#5B6585]">Items nearing or out of stock</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('purchasing')}
              className="text-[13px] font-semibold text-[#2E46A0] hover:underline shrink-0"
            >
              Order stock
            </button>
          </div>

          {metrics.lowStockItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
              <p className="text-[15px] font-semibold text-[#162660]">All items well stocked</p>
              <p className="text-[13px] text-[#5B6585] mt-1">
                No products are below their minimum stock alert.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F6F0E7]">
              {metrics.lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-8 h-8 rounded-[10px] shrink-0 border border-black/10"
                      style={{ background: item.swatch }}
                    />
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#162660] truncate">{item.name}</p>
                      <p className="text-[12px] text-[#5B6585] truncate">
                        {item.sku} · {item.variant}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold tabular-num ${
                        item.stockQty === 0
                          ? 'bg-[#FDF0EF] text-[#B42318]'
                          : 'bg-[#FFF3C4] text-[#6B4E00]'
                      }`}
                    >
                      {item.stockQty} left
                    </span>
                    <p className="text-[11px] text-[#5B6585] mt-0.5 tabular-num">Min {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Bills Table */}
      <section className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-[#F6F0E7] text-[#162660] flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-[17px] font-bold text-[#162660]">Recent Bills</h2>
              <p className="text-[13px] text-[#5B6585]">Latest completed counter sales</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="text-[13px] font-semibold text-[#2E46A0] hover:underline"
          >
            View all bills
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#F6F0E7] bg-[#F8F2E9]/70 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                <th className="py-3 px-5">Bill #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
              {workspace.sales.slice(0, 6).map((sale) => (
                <tr
                  key={sale.id}
                  onClick={() => onOpenReceipt(sale)}
                  className="hover:bg-[#F8F2E9]/65 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-5 font-bold text-[#162660] tabular-num">{sale.billNo}</td>
                  <td className="py-3 px-4 text-[#454F70]">{sale.customerName}</td>
                  <td className="py-3 px-4 text-[#5B6585] tabular-num">
                    {sale.items.reduce((acc, i) => acc + i.qty, 0)} items
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F6F0E7] text-[#454F70]">
                      {paymentMethodLabel(sale.paymentMethod)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#5B6585] tabular-num">{formatTime(sale.createdAt)}</td>
                  <td className="py-3 px-5 text-right font-bold text-[#162660] tabular-num">
                    {formatMoney(sale.total, cur)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
