import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Package,
  PackagePlus,
  ShoppingBag,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import { api } from '../lib/api.ts';
import type { ApprovalItem, NavSection, Sale, StaffUser, WorkspacePayload } from '../types/pos.ts';
import { formatDateTime, formatMoney, isSameDay, paymentMethodLabel } from '../lib/format.ts';
import { SlideDrawer } from './BrandMark.tsx';
import { ProductArtThumb } from './ProductArt.tsx';

export function DashboardView({
  workspace,
  user,
  onNavigate,
  onOpenAddStock,
  onOpenReceipt,
  onRefresh,
  notify,
}: {
  workspace: WorkspacePayload;
  user: StaffUser;
  onNavigate: (section: NavSection) => void;
  onOpenAddStock: () => void;
  onOpenReceipt: (sale: Sale) => void;
  onRefresh: () => Promise<void>;
  notify: (type: 'ok' | 'err', message: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const [reviewItem, setReviewItem] = useState<ApprovalItem | null>(null);
  const [resolving, setResolving] = useState(false);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const metrics = useMemo(() => {
    const today = new Date();
    const todaySales = workspace.sales.filter((s) => isSameDay(s.createdAt, today));
    const todayRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);

    let cashSales = 0;
    let digitalSales = 0;
    let khataSales = 0;
    for (const s of todaySales) {
      if (s.paymentMethod === 'cash') cashSales += s.total;
      else if (s.paymentMethod === 'khata') khataSales += s.total;
      else if (s.paymentMethod === 'split' && s.paymentSplit) {
        for (const p of s.paymentSplit) {
          if (p.method === 'cash') cashSales += p.amount;
          else if (p.method === 'khata') khataSales += p.amount;
          else digitalSales += p.amount;
        }
      } else {
        digitalSales += s.total;
      }
    }

    const todayReturns = workspace.returns.filter((r) => isSameDay(r.createdAt, today));
    const todayRefunds = todayReturns.reduce((acc, r) => acc + r.totalRefund, 0);

    const totalReceivables = workspace.customers.reduce((acc, c) => acc + c.balanceDue, 0);
    const khataDebtors = workspace.customers.filter((c) => c.balanceDue > 0).length;
    const totalPayables = workspace.suppliers.reduce((acc, s) => acc + s.payableBalance, 0);
    const activeShift = workspace.shifts.find((s) => s.status === 'open');
    const drawerCash = activeShift?.expectedCash ?? activeShift?.openingFloat ?? 0;

    const soldOut = workspace.products.filter((p) => p.active && p.stockQty === 0);
    const lowStock = workspace.products
      .filter((p) => p.active && p.stockQty > 0 && p.stockQty <= p.minStock)
      .sort((a, b) => a.stockQty - b.stockQty);
    const inStock = workspace.products.filter((p) => p.active && p.stockQty > p.minStock);

    const pendingApprovals = (workspace.approvals || []).filter((a) => a.status === 'pending');
    const incomingPos = workspace.purchaseOrders.filter((po) => po.status === 'ordered');

    const khataCollectedToday = workspace.khataEntries
      .filter((k) => k.type === 'payment' && isSameDay(k.createdAt, today))
      .reduce((a, k) => a + k.amount, 0);

    return {
      todaySales,
      todayRevenue,
      cashSales,
      digitalSales,
      khataSales,
      todayRefunds,
      totalReceivables,
      khataDebtors,
      totalPayables,
      activeShift,
      drawerCash,
      soldOut,
      lowStock,
      inStock,
      pendingApprovals,
      incomingPos,
      khataCollectedToday,
    };
  }, [workspace]);

  const catNameMap = useMemo(
    () => new Map(workspace.categories.map((c) => [c.id, c.name])),
    [workspace.categories]
  );

  async function handleResolveApproval(decision: 'approved' | 'dismissed') {
    if (!reviewItem) return;
    setResolving(true);
    try {
      await api.resolveApproval(reviewItem.id, decision);
      await onRefresh();
      notify('ok', decision === 'approved' ? 'Item approved and posted.' : 'Item dismissed.');
      setReviewItem(null);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not update review item.');
    } finally {
      setResolving(false);
    }
  }

  async function handleQuickReceivePo(poId: string) {
    try {
      await api.receivePurchaseOrder(poId);
      await onRefresh();
      notify('ok', 'Delivery received and added to stock.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to receive delivery.');
    }
  }

  // ==================== CASHIER HOME (CashierHome.jsx) ====================
  if (user.role === 'cashier') {
    const firstName = user.name.split(' ')[0];
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1360px] w-full mx-auto space-y-5 anim-zup">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-[#5B6585]">
              {todayDateStr} · {workspace.settings.branchName}
            </p>
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#162660] tracking-[-0.02em] leading-tight mt-0.5">
              Good day, {firstName}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('pos')}
            className="zyro-bp h-[56px] px-6 rounded-[14px] bg-[#162660] text-white text-[17px] font-bold inline-flex items-center gap-2.5 shadow-[0_10px_24px_rgba(22,38,96,0.2)]"
          >
            <ShoppingBag className="w-5 h-5" />
            Open register
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <section className="lg:col-span-7 bg-white border border-[#E9E1D5] rounded-[20px] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-[20px] font-bold text-[#162660]">Your shift</h2>
              <span
                className={`h-7 px-3 rounded-full text-[13px] font-semibold inline-flex items-center gap-1.5 ${
                  metrics.activeShift
                    ? 'bg-[#E8F6EE] text-[#14532D]'
                    : 'bg-[#FFF3C4] text-[#6B4E00]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    metrics.activeShift ? 'bg-[#2F9E63]' : 'bg-[#C99A06]'
                  }`}
                />
                {metrics.activeShift ? `Open · ${metrics.activeShift.shiftNo}` : 'Shift closed'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'Opening float', val: formatMoney(metrics.activeShift?.openingFloat ?? 0, cur) },
                { label: 'Cash sales', val: formatMoney(metrics.cashSales, cur) },
                { label: 'Khata collected', val: formatMoney(metrics.khataCollectedToday, cur) },
                { label: 'Expected in drawer', val: formatMoney(metrics.drawerCash, cur), strong: true },
              ].map((st) => (
                <div key={st.label} className="rounded-[14px] bg-[#F8F2E9] p-3">
                  <p className="text-[12px] font-medium text-[#5B6585]">{st.label}</p>
                  <p
                    className={`text-[18px] font-bold tabular-num mt-1 ${
                      st.strong ? 'text-[#14532D]' : 'text-[#162660]'
                    }`}
                  >
                    {st.val}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-5 bg-white border border-[#E9E1D5] rounded-[20px] p-5 flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-bold text-[#162660]">Quick shortcuts</h2>
              <p className="text-[13px] text-[#5B6585] mt-0.5">
                {workspace.heldBills.length} held bill(s) waiting · {metrics.todaySales.length} bills today
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Bill book', icon: BookOpen, nav: 'orders' as NavSection },
                { label: 'Khata', icon: Users, nav: 'customers' as NavSection },
                { label: 'Cash drawer', icon: Wallet, nav: 'cash' as NavSection },
                { label: 'Check stock', icon: Package, nav: 'stock' as NavSection },
              ].map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => onNavigate(q.nav)}
                    className="zyro-opt h-14 px-3.5 rounded-[14px] bg-[#EEF5FE] hover:bg-[#D0E6FD] text-[#162660] font-bold text-[14px] flex items-center gap-2.5"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{q.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <section className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#162660]">Recent bills</h2>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-[13px] font-bold text-[#2E46A0] hover:underline"
            >
              View bill book
            </button>
          </div>
          <div className="divide-y divide-[#F6F0E7]">
            {workspace.sales.slice(0, 6).map((sale) => (
              <button
                key={sale.id}
                type="button"
                onClick={() => onOpenReceipt(sale)}
                className="w-full px-5 py-3.5 hover:bg-[#F8F2E9] flex items-center justify-between gap-3 text-left transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-[#162660] truncate">
                    {sale.billNo} · {sale.customerName}
                  </p>
                  <p className="text-[13px] text-[#5B6585]">
                    {formatDateTime(sale.createdAt)} · {paymentMethodLabel(sale.paymentMethod)}
                  </p>
                </div>
                <span className="text-[15px] font-bold tabular-num text-[#162660]">
                  {formatMoney(sale.total, cur)}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ==================== STOCKKEEPER HOME (StockHome.jsx) ====================
  if (user.role === 'stock') {
    const firstName = user.name.split(' ')[0];
    const attention = [...metrics.soldOut, ...metrics.lowStock].slice(0, 8);
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1360px] w-full mx-auto space-y-5 anim-zup">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-[#5B6585]">
              {todayDateStr} · {workspace.settings.branchName}
            </p>
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#162660] tracking-[-0.02em] mt-0.5">
              Good day, {firstName}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onOpenAddStock}
              className="zyro-bp h-[52px] px-5 rounded-[14px] bg-[#162660] text-white text-[15px] font-bold inline-flex items-center gap-2"
            >
              <PackagePlus className="w-5 h-5" />
              Add stock (Scan)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('stock')}
              className="zyro-bs h-[52px] px-5 rounded-[14px] border border-[#D9CFC0] bg-white text-[#162660] text-[15px] font-semibold inline-flex items-center gap-2"
            >
              <ClipboardCheck className="w-5 h-5" />
              Count stock
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
            <p className="text-[13px] font-semibold text-[#454F70]">Sold out</p>
            <p className="text-[30px] font-bold tabular-num text-[#B42318] mt-1">
              {metrics.soldOut.length}
            </p>
            <p className="text-[13px] text-[#5B6585]">Needs urgent restock</p>
          </div>
          <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
            <p className="text-[13px] font-semibold text-[#454F70]">Running low</p>
            <p className="text-[30px] font-bold tabular-num text-[#6B4E00] mt-1">
              {metrics.lowStock.length}
            </p>
            <p className="text-[13px] text-[#5B6585]">At or below reorder level</p>
          </div>
          <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
            <p className="text-[13px] font-semibold text-[#454F70]">In stock</p>
            <p className="text-[30px] font-bold tabular-num text-[#14532D] mt-1">
              {metrics.inStock.length}
            </p>
            <p className="text-[13px] text-[#5B6585]">Healthy shelves</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <section className="lg:col-span-7 bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#162660]">Needs attention</h2>
              <button
                type="button"
                onClick={() => onNavigate('stock')}
                className="text-[13px] font-bold text-[#2E46A0] hover:underline"
              >
                Open stock
              </button>
            </div>
            <div className="divide-y divide-[#F6F0E7]">
              {attention.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                  <ProductArtThumb product={p} categoryName={catNameMap.get(p.categoryId)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#162660] truncate">{p.name}</p>
                    <p className="text-[12px] text-[#5B6585] font-mono">
                      {p.sku} · Min {p.minStock}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[12px] font-bold tabular-num ${
                      p.stockQty === 0
                        ? 'bg-[#FDF0EF] text-[#B42318]'
                        : 'bg-[#FFF3C4] text-[#6B4E00]'
                    }`}
                  >
                    {p.stockQty === 0 ? 'Sold out' : `${p.stockQty} left`}
                  </span>
                </div>
              ))}
              {attention.length === 0 && (
                <p className="p-6 text-[14px] text-[#5B6585] text-center">All products are well stocked.</p>
              )}
            </div>
          </section>

          <section className="lg:col-span-5 bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#162660]">Incoming deliveries</h2>
              <button
                type="button"
                onClick={() => onNavigate('purchasing')}
                className="text-[13px] font-bold text-[#2E46A0] hover:underline"
              >
                Suppliers
              </button>
            </div>
            <div className="divide-y divide-[#F6F0E7]">
              {metrics.incomingPos.map((po) => (
                <div key={po.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#162660] truncate">
                      {po.poNumber} · {po.supplierName}
                    </p>
                    <p className="text-[12px] text-[#5B6585]">
                      {po.items.reduce((a, i) => a + i.qty, 0)} units · {formatMoney(po.totalCost, cur)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickReceivePo(po.id)}
                    className="zyro-bp h-9 px-3.5 rounded-[10px] bg-[#162660] text-white text-[13px] font-bold shrink-0"
                  >
                    Receive
                  </button>
                </div>
              ))}
              {metrics.incomingPos.length === 0 && (
                <p className="p-6 text-[14px] text-[#5B6585] text-center">No open deliveries pending.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ==================== OWNER HOME (OwnerHome.jsx 100% Parity) ====================
  const lowAndSoldOut = [...metrics.soldOut, ...metrics.lowStock].slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:px-8 lg:py-6 max-w-[1360px] w-full mx-auto space-y-5 anim-zup">
      {/* 1. Deep Navy Gradient Hero with Overlapping Floating Quick Actions Dock */}
      <div>
        <section
          aria-labelledby="owner-home-heading"
          className="relative overflow-hidden rounded-[24px] text-white px-5 sm:px-7 pt-5 sm:pt-6 pb-[78px]"
          style={{ background: 'linear-gradient(160deg, #0F1B47 0%, #162660 72%)' }}
        >
          {/* Exact Circular Open-Ring Watermark from OwnerHome.jsx */}
          <svg
            aria-hidden="true"
            width="300"
            height="300"
            viewBox="0 0 64 64"
            className="absolute -right-10 -top-16 pointer-events-none select-none"
          >
            <circle
              cx="30"
              cy="35"
              r="16"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="9.5"
              strokeLinecap="round"
              strokeDasharray="76 24.5"
              transform="rotate(8 30 35)"
            />
          </svg>

          <div className="relative flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#BFD0EE]">
                {todayDateStr} · {workspace.settings.branchName}
              </p>
              <h1
                id="owner-home-heading"
                className="text-[24px] sm:text-[30px] font-bold tracking-[-0.02em] leading-[1.2] mt-0.5"
              >
                Today at {workspace.settings.shopName}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('cash')}
              className="num h-8 px-3 rounded-full bg-white/10 hover:bg-white/15 text-[13px] font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  metrics.activeShift ? 'bg-[#7FD6A4]' : 'bg-[#F7A59B]'
                }`}
              />
              {metrics.activeShift
                ? `${metrics.activeShift.shiftNo} open · ${metrics.activeShift.openedBy.split(' ')[0]}`
                : 'No open shift'}
            </button>
          </div>

          <div className="relative mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[14px] font-semibold text-[#BFD0EE] num">
                Recorded sales today · {metrics.todaySales.length} bills
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-[22px] font-medium text-[#D0E6FD]">{cur}</span>
                <span className="num text-[38px] sm:text-[46px] font-bold tracking-[-0.02em] leading-none">
                  {Math.round(metrics.todayRevenue).toLocaleString('en-PK')}
                </span>
              </div>
              <p className="text-[13px] text-[#BFD0EE] mt-1.5">
                {metrics.todayRefunds > 0
                  ? `After ${formatMoney(metrics.todayRefunds, cur)} in returns today`
                  : 'All bills settled cleanly today'}
              </p>
            </div>

            {/* Payment Split Breakdown */}
            <div className="flex flex-wrap gap-5 sm:gap-7 pb-1">
              {[
                { label: 'Cash', val: metrics.cashSales },
                { label: 'Digital & Card', val: metrics.digitalSales },
                { label: 'On Khata', val: metrics.khataSales },
                { label: 'Refunds', val: metrics.todayRefunds },
              ].map((col) => (
                <div key={col.label}>
                  <p className="text-[12px] font-medium text-[#A9BCE0]">{col.label}</p>
                  <p className="num text-[17px] font-bold text-white mt-0.5">
                    {formatMoney(col.val, cur)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Floating Overlapping Quick Actions Dock (-mt-[58px] mx-[14px] sm:mx-[18px]) */}
        <div className="relative z-10 -mt-[56px] mx-3 sm:mx-5 rounded-[20px] bg-white border border-[#E9E1D5] shadow-[0_14px_34px_rgba(12,20,50,0.09)] p-3 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('pos')}
            className="zyro-bp h-[60px] px-4 rounded-[14px] bg-[#162660] text-white flex items-center gap-3 text-left"
          >
            <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#D0E6FD]" />
            </span>
            <div className="min-w-0">
              <span className="block text-[15px] font-bold leading-tight">New sale</span>
              <span className="block text-[12px] text-[#BFD0EE] truncate">Open POS register</span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenAddStock}
            className="zyro-opt h-[60px] px-4 rounded-[14px] bg-[#EEF5FE] hover:bg-[#D0E6FD] border border-transparent text-[#162660] flex items-center gap-3 text-left"
          >
            <span className="w-10 h-10 rounded-full bg-[#D0E6FD] flex items-center justify-center shrink-0">
              <PackagePlus className="w-5 h-5 text-[#162660]" />
            </span>
            <div className="min-w-0">
              <span className="block text-[15px] font-bold leading-tight">Add stock</span>
              <span className="block text-[12px] text-[#454F70] truncate">Barcode scan-in</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('cash')}
            className="zyro-opt h-[60px] px-4 rounded-[14px] bg-[#EEF5FE] hover:bg-[#D0E6FD] border border-transparent text-[#162660] flex items-center gap-3 text-left"
          >
            <span className="w-10 h-10 rounded-full bg-[#D0E6FD] flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-[#162660]" />
            </span>
            <div className="min-w-0">
              <span className="block text-[15px] font-bold leading-tight">Close the day</span>
              <span className="block text-[12px] text-[#454F70] truncate">Cash count & shift</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="zyro-opt h-[60px] px-4 rounded-[14px] bg-[#EEF5FE] hover:bg-[#D0E6FD] border border-transparent text-[#162660] flex items-center gap-3 text-left"
          >
            <span className="w-10 h-10 rounded-full bg-[#D0E6FD] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#162660]" />
            </span>
            <div className="min-w-0">
              <span className="block text-[15px] font-bold leading-tight">Bill book</span>
              <span className="block text-[12px] text-[#454F70] truncate">
                {workspace.sales.length} bills & returns
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Three KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <button
          type="button"
          onClick={() => onNavigate('customers')}
          className="zyro-opt bg-white border border-[#E9E1D5] rounded-[18px] p-4 sm:p-5 text-left flex flex-col gap-1"
        >
          <span className="text-[13px] font-semibold text-[#454F70]">Customers owe you</span>
          <span className="num text-[28px] font-bold text-[#162660] tracking-[-0.02em]">
            {formatMoney(metrics.totalReceivables, cur)}
          </span>
          <span className="text-[13px] text-[#5B6585]">
            Across {metrics.khataDebtors} Khata customer{metrics.khataDebtors === 1 ? '' : 's'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('purchasing')}
          className="zyro-opt bg-white border border-[#E9E1D5] rounded-[18px] p-4 sm:p-5 text-left flex flex-col gap-1"
        >
          <span className="text-[13px] font-semibold text-[#454F70]">You owe suppliers</span>
          <span className="num text-[28px] font-bold text-[#7A5320] tracking-[-0.02em]">
            {formatMoney(metrics.totalPayables, cur)}
          </span>
          <span className="text-[13px] text-[#5B6585]">
            {metrics.incomingPos.length} open purchase order{metrics.incomingPos.length === 1 ? '' : 's'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('cash')}
          className="zyro-opt bg-white border border-[#E9E1D5] rounded-[18px] p-4 sm:p-5 text-left flex flex-col gap-1"
        >
          <span className="text-[13px] font-semibold text-[#454F70]">Cash in the ledger</span>
          <span className="num text-[28px] font-bold text-[#14532D] tracking-[-0.02em]">
            {formatMoney(metrics.drawerCash, cur)}
          </span>
          <span className="text-[13px] text-[#5B6585]">
            {metrics.activeShift
              ? `Live expected in ${metrics.activeShift.shiftNo}`
              : 'Open a shift to track drawer'}
          </span>
        </button>
      </div>

      {/* 3. Two-Column Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Waiting for your review + What you owe */}
        <div className="lg:col-span-6 space-y-4">
          <section className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-bold text-[#162660]">Waiting for your review</h2>
                {metrics.pendingApprovals.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF3C4] text-[#6B4E00] text-[12px] font-bold tabular-num">
                    {metrics.pendingApprovals.length}
                  </span>
                )}
              </div>
              <span className="text-[12px] text-[#5B6585]">Tap to inspect</span>
            </div>

            {metrics.pendingApprovals.length === 0 ? (
              <div className="p-6 flex items-center gap-3 text-[#14532D] bg-[#E8F6EE]/40">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-[14px] font-semibold">
                  All caught up — nothing waiting for owner review.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F6F0E7]">
                {metrics.pendingApprovals.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReviewItem(item)}
                    className="w-full px-5 py-3.5 hover:bg-[#F8F2E9] flex items-center gap-3 text-left transition-colors"
                  >
                    <span className="w-10 h-10 rounded-full bg-[#FFF3C4] text-[#6B4E00] flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[#162660] truncate">{item.title}</p>
                      <p className="text-[13px] text-[#5B6585] truncate">{item.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="num text-[14px] font-bold text-[#162660]">
                        {formatMoney(item.amount, cur)}
                      </p>
                      <p className="text-[11px] font-semibold text-[#2E46A0]">Review</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5B6585] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#162660]">What you owe</h2>
              <button
                type="button"
                onClick={() => onNavigate('purchasing')}
                className="text-[13px] font-bold text-[#2E46A0] hover:underline inline-flex items-center gap-1"
              >
                Suppliers <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-[#F6F0E7]">
              {workspace.suppliers.map((sup) => (
                <div key={sup.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-[10px] bg-[#F8F2E9] text-[#7A5320] flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[#162660] truncate">{sup.name}</p>
                      <p className="text-[12px] text-[#5B6585] truncate">
                        {sup.city} · {sup.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`num text-[14px] font-bold shrink-0 ${
                      sup.payableBalance > 0 ? 'text-[#7A5320]' : 'text-[#14532D]'
                    }`}
                  >
                    {sup.payableBalance > 0 ? formatMoney(sup.payableBalance, cur) : 'Settled'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Running low + Activity */}
        <div className="lg:col-span-6 space-y-4">
          <section className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#162660]">Running low</h2>
              <button
                type="button"
                onClick={() => onNavigate('stock')}
                className="text-[13px] font-bold text-[#2E46A0] hover:underline inline-flex items-center gap-1"
              >
                All stock <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-[#F6F0E7]">
              {lowAndSoldOut.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                  <ProductArtThumb
                    product={p}
                    categoryName={catNameMap.get(p.categoryId)}
                    boxClass="w-11 h-11 rounded-[12px]"
                    svgSize={32}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#162660] truncate">{p.name}</p>
                    <p className="text-[12px] text-[#5B6585] truncate">
                      {p.variant} · <span className="font-mono">{p.sku}</span>
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[12px] font-bold tabular-num shrink-0 ${
                      p.stockQty === 0
                        ? 'bg-[#FDF0EF] text-[#B42318]'
                        : 'bg-[#FFF3C4] text-[#6B4E00]'
                    }`}
                  >
                    {p.stockQty === 0 ? 'Sold out' : `${p.stockQty} left`}
                  </span>
                </div>
              ))}
              {lowAndSoldOut.length === 0 && (
                <div className="p-6 text-center text-[14px] text-[#14532D] font-semibold">
                  Every item is above reorder level.
                </div>
              )}
            </div>
          </section>

          <section className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#162660]">Activity</h2>
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="text-[13px] font-bold text-[#2E46A0] hover:underline"
              >
                All bills
              </button>
            </div>
            <div className="divide-y divide-[#F6F0E7]">
              {workspace.sales.slice(0, 5).map((sale) => (
                <button
                  key={sale.id}
                  type="button"
                  onClick={() => onOpenReceipt(sale)}
                  className="w-full px-5 py-3 hover:bg-[#F8F2E9] flex items-center gap-3 text-left transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#EEF5FE] text-[#162660] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#162660] truncate">
                      {sale.billNo} · {sale.customerName}
                    </p>
                    <p className="text-[12px] text-[#5B6585] truncate">
                      {sale.cashierName} · {paymentMethodLabel(sale.paymentMethod)} · {formatDateTime(sale.createdAt)}
                    </p>
                  </div>
                  <span className="num text-[14px] font-bold text-[#162660] shrink-0">
                    {formatMoney(sale.total, cur)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Owner Review Slide-Over Drawer (OwnerHome.jsx) */}
      <SlideDrawer
        open={Boolean(reviewItem)}
        onClose={() => setReviewItem(null)}
        eyebrow="Waiting for your review"
        title={reviewItem?.title || ''}
        footer={
          <>
            <button
              type="button"
              disabled={resolving}
              onClick={() => handleResolveApproval('dismissed')}
              className="zyro-bs h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[14px] font-semibold"
            >
              Dismiss
            </button>
            <button
              type="button"
              disabled={resolving}
              onClick={() => handleResolveApproval('approved')}
              className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold inline-flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {resolving ? 'Saving...' : 'Approve & post'}
            </button>
          </>
        }
      >
        {reviewItem && (
          <div className="space-y-4">
            <div className="rounded-[16px] bg-[#F8F2E9] p-4 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#5B6585]">Requested by</span>
                <span className="font-bold text-[#162660]">{reviewItem.requestedBy}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#5B6585]">Amount</span>
                <span className="num font-bold text-[#162660]">
                  {formatMoney(reviewItem.amount, cur)}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#5B6585]">Logged</span>
                <span className="font-medium text-[#454F70]">{formatDateTime(reviewItem.createdAt)}</span>
              </div>
            </div>
            <p className="text-[15px] text-[#454F70] leading-relaxed">{reviewItem.detail}</p>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
