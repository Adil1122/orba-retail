import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  ScanBarcode,
  Plus,
  Minus,
  Trash2,
  PauseCircle,
  Tag,
  UserPlus,
  ChevronUp,
  ChevronDown,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  BookUser,
  Split,
  Edit3,
  Clock,
  Check,
} from 'lucide-react';
import type {
  CartItem,
  Customer,
  HeldBill,
  PaymentMethod,
  PaymentSplitEntry,
  Product,
  Sale,
  StaffUser,
  WorkspacePayload,
} from '../types/pos.ts';
import { api } from '../lib/api.ts';
import { formatDateTime, formatMoney, getInitials } from '../lib/format.ts';
import { Modal } from './BrandMark.tsx';

export function PosRegisterView({
  workspace,
  user,
  onRefresh,
  onSaleCompleted,
  notify,
}: {
  workspace: WorkspacePayload;
  user: StaffUser;
  onRefresh: () => Promise<void>;
  onSaleCompleted: (sale: Sale) => void;
  notify: (type: 'ok' | 'err', msg: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [applyTax, setApplyTax] = useState<boolean>(workspace.settings.taxRate > 0);
  const [activeHeldId, setActiveHeldId] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Modals
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [heldModalOpen, setHeldModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<CartItem | null>(null);
  const [tenderOpen, setTenderOpen] = useState(false);

  // Tender state
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cash');
  const [tenderedInput, setTenderedInput] = useState<string>('');
  const [splitLegs, setSplitLegs] = useState<PaymentSplitEntry[]>([
    { method: 'cash', amount: 0 },
    { method: 'card', amount: 0 },
  ]);
  const [saleNote, setSaleNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Keyboard F2 shortcut for search/scanner
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selectedCustomer: Customer | undefined = useMemo(
    () => workspace.customers.find((c) => c.id === selectedCustomerId),
    [workspace.customers, selectedCustomerId]
  );

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workspace.products.filter((p) => {
      if (!p.active) return false;
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q)
      );
    });
  }, [workspace.products, selectedCategory, query]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + Math.max(0, Math.round(item.unitPrice * item.qty - item.discount)),
      0
    );
    const discountAmount =
      discountType === 'percent'
        ? Math.min(subtotal, Math.round((subtotal * Math.min(discountValue, 100)) / 100))
        : Math.min(subtotal, Math.round(discountValue));
    const afterDisc = Math.max(0, subtotal - discountAmount);
    const taxRate = applyTax ? workspace.settings.taxRate : 0;
    const taxAmount =
      taxRate > 0 && !workspace.settings.taxInclusive
        ? Math.round((afterDisc * taxRate) / 100)
        : 0;
    const grandTotal = afterDisc + taxAmount;
    const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);
    return { subtotal, discountAmount, taxAmount, grandTotal, itemCount };
  }, [cart, discountType, discountValue, applyTax, workspace.settings]);

  function addProductToCart(prod: Product) {
    if (prod.stockQty <= 0) {
      notify('err', `${prod.name} is currently out of stock.`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === prod.id);
      if (existing) {
        if (existing.qty >= prod.stockQty) {
          notify('err', `Only ${prod.stockQty} units of ${prod.name} available.`);
          return prev;
        }
        return prev.map((i) =>
          i.productId === prod.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: prod.id,
          name: prod.name,
          sku: prod.sku,
          variant: prod.variant,
          unitPrice: prod.salePrice,
          costPrice: prod.costPrice,
          qty: 1,
          discount: 0,
        },
      ];
    });
  }

  function updateQty(productId: string, delta: number) {
    const prod = workspace.products.find((p) => p.id === productId);
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const next = item.qty + delta;
          if (next <= 0) return null;
          if (prod && next > prod.stockQty) {
            notify('err', `Only ${prod.stockQty} units in stock.`);
            return item;
          }
          return { ...item, qty: next };
        })
        .filter((x): x is CartItem => x !== null)
    );
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearBill() {
    setCart([]);
    setSelectedCustomerId('');
    setDiscountType('fixed');
    setDiscountValue(0);
    setActiveHeldId(null);
    setSaleNote('');
    setMobileSheetOpen(false);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    const q = query.trim().toLowerCase();
    if (!q) return;
    const exact = workspace.products.find(
      (p) => p.active && (p.barcode.toLowerCase() === q || p.sku.toLowerCase() === q)
    );
    if (exact) {
      e.preventDefault();
      addProductToCart(exact);
      setQuery('');
      notify('ok', `Added ${exact.name}`);
    } else if (filteredProducts.length === 1) {
      e.preventDefault();
      addProductToCart(filteredProducts[0]);
      setQuery('');
    }
  }

  async function handleHoldBill() {
    if (cart.length === 0) {
      setHeldModalOpen(true);
      return;
    }
    try {
      const firstItem = cart[0]?.name || 'Bill';
      await api.holdBill({
        label: selectedCustomer ? `${selectedCustomer.name} · ${firstItem}` : `${firstItem} (${totals.itemCount} items)`,
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer?.name || 'Walk-in Customer',
        items: cart,
        discountType,
        discountValue,
      });
      clearBill();
      await onRefresh();
      notify('ok', 'Bill parked in Held Bills.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to hold bill.');
    }
  }

  function recallHeldBill(held: HeldBill) {
    setCart(held.items);
    setSelectedCustomerId(held.customerId || '');
    setDiscountType(held.discountType);
    setDiscountValue(held.discountValue);
    setActiveHeldId(held.id);
    setHeldModalOpen(false);
    notify('ok', `Recalled "${held.label}"`);
  }

  async function discardHeldBill(id: string) {
    try {
      await api.deleteHeldBill(id);
      await onRefresh();
      notify('ok', 'Held bill removed.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not delete held bill.');
    }
  }

  function openTenderModal() {
    if (cart.length === 0) return;
    setPayMethod('cash');
    setTenderedInput(String(totals.grandTotal));
    setSplitLegs([
      { method: 'cash', amount: Math.floor(totals.grandTotal / 2) },
      { method: 'card', amount: totals.grandTotal - Math.floor(totals.grandTotal / 2) },
    ]);
    setTenderOpen(true);
  }

  async function completeCheckout() {
    if (cart.length === 0) return;
    if (payMethod === 'khata' && !selectedCustomer) {
      notify('err', 'Select a registered customer to charge to Khata credit.');
      return;
    }
    const tendered = payMethod === 'cash' ? Number(tenderedInput) || 0 : totals.grandTotal;
    if (payMethod === 'cash' && tendered < totals.grandTotal) {
      notify('err', `Cash received must be at least ${formatMoney(totals.grandTotal, cur)}.`);
      return;
    }
    if (payMethod === 'split') {
      const splitTotal = splitLegs.reduce((s, l) => s + (Number(l.amount) || 0), 0);
      if (splitTotal < totals.grandTotal) {
        notify('err', 'Split payment total must equal or exceed the bill total.');
        return;
      }
      if (splitLegs.some((l) => l.method === 'khata' && l.amount > 0) && !selectedCustomer) {
        notify('err', 'Attach a customer to include Khata in a split payment.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const createdSale = (await api.createSale({
        items: cart,
        customerId: selectedCustomer?.id,
        discountType,
        discountValue,
        applyTax,
        paymentMethod: payMethod,
        paymentSplit: payMethod === 'split' ? splitLegs.filter((l) => l.amount > 0) : undefined,
        amountTendered: tendered,
        note: saleNote,
        heldBillId: activeHeldId || undefined,
      })) as Sale;
      setTenderOpen(false);
      clearBill();
      await onRefresh();
      onSaleCompleted(createdSale);
      notify('ok', `Bill ${createdSale.billNo} completed!`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  }

  const nextBillPreview = `B-${1049 + workspace.sales.length}`;

  const cashTenderedNum = Number(tenderedInput) || 0;
  const changePreview = Math.max(0, cashTenderedNum - totals.grandTotal);
  const quickCashAmounts = useMemo(() => {
    const t = totals.grandTotal;
    const opts = new Set<number>([t]);
    const round100 = Math.ceil(t / 100) * 100;
    const round500 = Math.ceil(t / 500) * 500;
    const round1000 = Math.ceil(t / 1000) * 1000;
    const round5000 = Math.ceil(t / 5000) * 5000;
    [round100, round500, round1000, round5000].forEach((v) => {
      if (v > t) opts.add(v);
    });
    return Array.from(opts).slice(0, 4);
  }, [totals.grandTotal]);

  const paymentOptions: {
    id: PaymentMethod;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled: boolean;
  }[] = [
    { id: 'cash', label: 'Cash', icon: Banknote, enabled: workspace.settings.enabledPayments.cash },
    { id: 'card', label: 'Card', icon: CreditCard, enabled: workspace.settings.enabledPayments.card },
    { id: 'easypaisa', label: 'EasyPaisa', icon: Smartphone, enabled: workspace.settings.enabledPayments.easypaisa },
    { id: 'jazzcash', label: 'JazzCash', icon: Smartphone, enabled: workspace.settings.enabledPayments.jazzcash },
    { id: 'bank', label: 'Bank', icon: Building2, enabled: workspace.settings.enabledPayments.bank },
    { id: 'khata', label: 'Khata', icon: BookUser, enabled: workspace.settings.enabledPayments.khata },
    { id: 'split', label: 'Split', icon: Split, enabled: true },
  ];

  const renderCartBody = () => (
    <div className="flex flex-col h-full min-h-0 bg-white">
      {/* Bill Header */}
      <div className="px-4 py-3 border-b border-[#F6F0E7] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-[18px] font-bold text-[#162660] tabular-num whitespace-nowrap">
            Bill {nextBillPreview}
          </h2>
          <span className="h-6 px-2.5 rounded-full bg-[#F6F0E7] text-[#454F70] text-[12px] font-semibold inline-flex items-center">
            Draft
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleHoldBill}
            title="Hold current bill or view held bills"
            className="relative h-10 px-2.5 rounded-[10px] hover:bg-[#F8F2E9] text-[#454F70] text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PauseCircle className="w-4 h-4" />
            <span>Hold</span>
            {workspace.heldBills.length > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#162660] text-white text-[10px] font-bold flex items-center justify-center tabular-num">
                {workspace.heldBills.length}
              </span>
            )}
          </button>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearBill}
              title="Clear bill"
              aria-label="Clear bill"
              className="w-9 h-9 rounded-[10px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Selector Bar */}
      <div className="px-4 py-2.5 border-b border-[#F6F0E7] flex items-center justify-between gap-2 shrink-0 bg-[#F8F2E9]/50">
        <button
          type="button"
          onClick={() => setCustomerModalOpen(true)}
          className="flex-1 min-w-0 flex items-center gap-2.5 text-left py-1 rounded-[10px] hover:bg-[#F6F0E7] px-2 -mx-2 transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-[#EEF5FE] text-[#2E46A0] flex items-center justify-center text-[12px] font-bold shrink-0">
            {selectedCustomer ? getInitials(selectedCustomer.name) : <UserPlus className="w-4 h-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-[#162660] truncate">
              {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
            </p>
            <p className="text-[12px] text-[#5B6585] truncate tabular-num">
              {selectedCustomer
                ? `${selectedCustomer.phone} · Due ${formatMoney(selectedCustomer.balanceDue, cur)}`
                : 'Tap to attach customer or Khata'}
            </p>
          </div>
        </button>
        {selectedCustomer && (
          <button
            type="button"
            onClick={() => setSelectedCustomerId('')}
            className="text-[12px] font-semibold text-[#5B6585] hover:text-[#B42318] px-2 py-1"
          >
            Remove
          </button>
        )}
      </div>

      {/* Cart Line Items */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 divide-y divide-[#F6F0E7]">
        {cart.length === 0 ? (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-[#F6F0E7] text-[#5B6585] flex items-center justify-center mb-3">
              <ScanBarcode className="w-6 h-6" />
            </div>
            <p className="text-[15px] font-bold text-[#162660]">Ready for next customer</p>
            <p className="text-[13px] text-[#5B6585] mt-1 max-w-[240px]">
              Tap items from the catalog or scan a barcode to start building this bill.
            </p>
            {workspace.heldBills.length > 0 && (
              <button
                type="button"
                onClick={() => setHeldModalOpen(true)}
                className="mt-4 h-9 px-3.5 rounded-[10px] bg-[#EEF5FE] hover:bg-[#D0E6FD] text-[#2E46A0] text-[13px] font-semibold inline-flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                Recall {workspace.heldBills.length} Held {workspace.heldBills.length === 1 ? 'Bill' : 'Bills'}
              </button>
            )}
          </div>
        ) : (
          cart.map((item) => {
            const lineTotal = Math.max(0, Math.round(item.unitPrice * item.qty - item.discount));
            return (
              <div key={item.productId} className="py-3 flex items-start gap-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-bold text-[#162660] leading-snug">{item.name}</p>
                    <p className="text-[14px] font-bold text-[#162660] tabular-num shrink-0">
                      {formatMoney(lineTotal, cur)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#5B6585]">
                    <span className="tabular-num">{formatMoney(item.unitPrice, cur)} ea</span>
                    {item.variant && <span>· {item.variant}</span>}
                    {item.discount > 0 && (
                      <span className="text-[#14532D] font-semibold tabular-num">
                        -{formatMoney(item.discount, cur)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1 bg-[#F6F0E7] rounded-[10px] p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, -1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-8 h-8 rounded-[8px] bg-white hover:bg-[#ECE4D8] text-[#162660] flex items-center justify-center shadow-[0_1px_2px_rgba(22,30,60,0.06)]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-[14px] font-bold tabular-num text-[#162660]">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="w-8 h-8 rounded-[8px] bg-white hover:bg-[#ECE4D8] text-[#162660] flex items-center justify-center shadow-[0_1px_2px_rgba(22,30,60,0.06)]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingLine({ ...item })}
                        className="h-8 px-2.5 rounded-[8px] hover:bg-[#F8F2E9] text-[#2E46A0] text-[12px] font-semibold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="w-8 h-8 rounded-[8px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bill Totals & Charge Footer */}
      <div className="px-4 py-3.5 border-t border-[#E9E1D5] bg-[#F8F2E9]/70 space-y-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDiscountModalOpen(true)}
            className={`flex-1 h-9 px-3 rounded-[10px] border text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
              totals.discountAmount > 0
                ? 'bg-[#EEF5FE] border-[#B5D3F5] text-[#2E46A0]'
                : 'bg-white border-[#D9CFC0] text-[#454F70] hover:bg-[#F6F0E7]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>
              {totals.discountAmount > 0
                ? `Discount -${formatMoney(totals.discountAmount, cur)}`
                : 'Add Discount'}
            </span>
          </button>
          {workspace.settings.taxRate > 0 && (
            <button
              type="button"
              onClick={() => setApplyTax((v) => !v)}
              className={`h-9 px-3 rounded-[10px] border text-[13px] font-semibold transition-colors ${
                applyTax
                  ? 'bg-[#EEF5FE] border-[#B5D3F5] text-[#2E46A0]'
                  : 'bg-white border-[#D9CFC0] text-[#454F70]'
              }`}
            >
              Tax {workspace.settings.taxRate}%
            </button>
          )}
        </div>

        <div className="space-y-1 text-[13px] text-[#454F70]">
          <div className="flex justify-between">
            <span>Subtotal ({totals.itemCount} items)</span>
            <span className="font-semibold tabular-num">{formatMoney(totals.subtotal, cur)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-[#14532D]">
              <span>Bill Discount</span>
              <span className="font-semibold tabular-num">
                -{formatMoney(totals.discountAmount, cur)}
              </span>
            </div>
          )}
          {totals.taxAmount > 0 && (
            <div className="flex justify-between">
              <span>Tax ({workspace.settings.taxRate}%)</span>
              <span className="font-semibold tabular-num">{formatMoney(totals.taxAmount, cur)}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={openTenderModal}
          className="w-full h-[54px] rounded-[16px] bg-[#162660] hover:bg-[#111E50] disabled:bg-[#D9CFC0] disabled:text-[#5B6585] text-white text-[17px] font-bold flex items-center justify-between px-5 transition-colors shadow-[0_8px_20px_rgba(22,38,96,0.22)] disabled:shadow-none"
        >
          <span>Charge</span>
          <span className="tabular-num">{formatMoney(totals.grandTotal, cur)}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden w-full">
      {/* Left: Search, Categories & Product Grid */}
      <div className="flex-1 min-w-0 flex flex-col lg:h-full lg:overflow-hidden">
        {/* Counter Search Header */}
        <header className="px-3 sm:px-5 py-3 flex flex-wrap items-center gap-3 shrink-0">
          <div className="hidden xl:block w-[150px] shrink-0">
            <p className="text-[15px] font-bold text-[#162660] truncate">
              {workspace.settings.shopName}
            </p>
            <p className="text-[12px] text-[#5B6585] truncate">Counter 1 · {user.name.split(' ')[0]}</p>
          </div>

          <div className="flex-1 min-w-[220px] flex items-center gap-2 h-12 bg-white border border-[#D9CFC0] focus-within:border-[#162660] rounded-[14px] pl-3.5 pr-1.5 transition-colors">
            <Search className="w-5 h-5 text-[#5B6585] shrink-0" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Scan barcode, SKU, or search product..."
              className="flex-1 min-w-0 h-10 bg-transparent border-0 outline-none text-[15px]"
            />
            <kbd className="hidden sm:inline-flex items-center justify-center h-6 px-1.5 rounded-[6px] border border-[#D9CFC0] border-b-2 bg-[#F8F2E9] text-[12px] font-semibold text-[#454F70]">
              F2
            </kbd>
            <button
              type="button"
              onClick={() => {
                const inStock = workspace.products.find((p) => p.active && p.stockQty > 0);
                if (inStock) {
                  addProductToCart(inStock);
                  notify('ok', `Scanned ${inStock.sku} · ${inStock.name}`);
                }
              }}
              className="h-9 px-2.5 rounded-[10px] bg-[#E8F6EE] hover:bg-[#D5EFE0] text-[#14532D] text-[12px] font-bold inline-flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <ScanBarcode className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Scan</span>
            </button>
          </div>

          {workspace.heldBills.length > 0 && (
            <button
              type="button"
              onClick={() => setHeldModalOpen(true)}
              className="h-11 px-3 rounded-[12px] bg-white border border-[#D9CFC0] hover:bg-[#F8F2E9] text-[#162660] text-[13px] font-semibold inline-flex items-center gap-2 shrink-0"
            >
              <Clock className="w-4 h-4 text-[#2E46A0]" />
              <span className="tabular-num">Held ({workspace.heldBills.length})</span>
            </button>
          )}
        </header>

        {/* Category Strip */}
        <div className="px-3 sm:px-5 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-semibold shrink-0 transition-colors border ${
              selectedCategory === 'all'
                ? 'bg-[#162660] text-white border-[#162660]'
                : 'bg-white text-[#454F70] border-[#E9E1D5] hover:bg-[#F8F2E9]'
            }`}
          >
            All Items ({workspace.products.filter((p) => p.active).length})
          </button>
          {workspace.categories.map((cat) => {
            const count = workspace.products.filter((p) => p.active && p.categoryId === cat.id).length;
            const activeCat = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-9 px-3.5 rounded-full text-[13px] font-semibold shrink-0 transition-colors border inline-flex items-center gap-2 ${
                  activeCat
                    ? 'bg-[#162660] text-white border-[#162660]'
                    : 'bg-white text-[#454F70] border-[#E9E1D5] hover:bg-[#F8F2E9]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: activeCat ? '#D0E6FD' : cat.color }}
                />
                <span>{cat.name}</span>
                <span className={`text-[11px] tabular-num ${activeCat ? 'text-[#D0E6FD]' : 'text-[#5B6585]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 lg:overflow-y-auto px-3 sm:px-5 pb-28 lg:pb-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-10 text-center">
              <p className="text-[16px] font-bold text-[#162660]">No matching products</p>
              <p className="text-[14px] text-[#5B6585] mt-1">
                Try clearing your search or selecting another category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((prod) => {
                const inCart = cart.find((c) => c.productId === prod.id);
                const outOfStock = prod.stockQty <= 0;
                const lowStock = !outOfStock && prod.stockQty <= prod.minStock;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => addProductToCart(prod)}
                    className={`relative text-left bg-white border rounded-[18px] p-3.5 flex flex-col gap-2 transition-all ${
                      inCart
                        ? 'border-[#162660] ring-2 ring-[#D0E6FD]'
                        : 'border-[#E9E1D5] hover:border-[#B5D3F5] hover:shadow-[0_4px_14px_rgba(22,30,60,0.06)]'
                    } ${outOfStock ? 'opacity-55 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white font-bold text-[13px] shrink-0 shadow-inner"
                        style={{ background: prod.swatch }}
                      >
                        {prod.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-num ${
                          outOfStock
                            ? 'bg-[#FDF0EF] text-[#B42318]'
                            : lowStock
                              ? 'bg-[#FFF3C4] text-[#6B4E00]'
                              : 'bg-[#F6F0E7] text-[#454F70]'
                        }`}
                      >
                        {outOfStock ? 'Out' : `${prod.stockQty} left`}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[#162660] leading-snug line-clamp-2">
                        {prod.name}
                      </p>
                      <p className="text-[12px] text-[#5B6585] truncate mt-0.5">
                        {prod.sku} · {prod.variant}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#F6F0E7]">
                      <span className="text-[15px] font-bold text-[#162660] tabular-num">
                        {formatMoney(prod.salePrice, cur)}
                      </span>
                      {inCart && (
                        <span className="min-w-[24px] h-6 px-1.5 rounded-full bg-[#162660] text-white text-[12px] font-bold inline-flex items-center justify-center tabular-num">
                          {inCart.qty}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Right Bill Panel */}
      <aside className="hidden lg:flex lg:w-[375px] xl:w-[410px] shrink-0 border-l border-[#E9E1D5] h-full flex-col">
        {renderCartBody()}
      </aside>

      {/* Mobile / Tablet Sticky Bottom Bill Bar + Expandable Sheet */}
      <div className="lg:hidden fixed bottom-[66px] left-0 right-0 z-20">
        {mobileSheetOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#0F1B47]/45 flex flex-col justify-end"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobileSheetOpen(false);
            }}
          >
            <div className="bg-white rounded-t-[24px] h-[82vh] flex flex-col overflow-hidden shadow-[0_-18px_48px_rgba(12,20,50,0.3)]">
              <div className="px-4 py-2.5 border-b border-[#F6F0E7] flex items-center justify-between">
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#5B6585]">
                  Current Bill
                </span>
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  className="h-9 px-3 rounded-[10px] bg-[#F6F0E7] text-[#162660] text-[13px] font-semibold inline-flex items-center gap-1"
                >
                  <ChevronDown className="w-4 h-4" />
                  Hide
                </button>
              </div>
              <div className="flex-1 min-h-0">{renderCartBody()}</div>
            </div>
          </div>
        )}

        <div className="bg-white border-t border-[#E9E1D5] px-3 py-2.5 shadow-[0_-8px_24px_rgba(22,30,60,0.1)] flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="flex-1 min-w-0 flex items-center gap-2.5 text-left"
          >
            <span className="w-10 h-10 rounded-full bg-[#F6F0E7] text-[#162660] flex items-center justify-center shrink-0">
              <ChevronUp className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-[#162660] tabular-num truncate">
                {nextBillPreview} · {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
              </p>
              <p className="text-[12px] text-[#5B6585] truncate">
                {selectedCustomer ? selectedCustomer.name : 'Walk-in'} · Tap to edit bill
              </p>
            </div>
          </button>
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={openTenderModal}
            className="h-12 px-4 rounded-[14px] bg-[#162660] disabled:bg-[#D9CFC0] text-white text-[14px] font-bold shrink-0 tabular-num whitespace-nowrap"
          >
            Charge {formatMoney(totals.grandTotal, cur)}
          </button>
        </div>
      </div>

      {/* Discount Modal */}
      <Modal
        open={discountModalOpen}
        onClose={() => setDiscountModalOpen(false)}
        title="Bill Discount"
        subtitle="Apply a fixed amount or percentage discount to the current bill"
        maxWidth="max-w-sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setDiscountValue(0);
                setDiscountModalOpen(false);
              }}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => setDiscountModalOpen(false)}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Apply Discount
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-[12px] bg-[#ECE4D8]">
            {(['fixed', 'percent'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDiscountType(t)}
                className={`h-9 rounded-[9px] text-[13px] font-semibold ${
                  discountType === t ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]'
                }`}
              >
                {t === 'fixed' ? `Fixed (${cur})` : 'Percentage (%)'}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">
              Discount Value
            </label>
            <input
              type="number"
              min={0}
              max={discountType === 'percent' ? 100 : totals.subtotal}
              value={discountValue}
              onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value) || 0))}
              className="w-full h-12 px-3.5 rounded-[12px] border border-[#D9CFC0] text-[16px] font-bold tabular-num"
            />
          </div>
          {discountType === 'percent' && (
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDiscountValue(pct)}
                  className="h-9 rounded-[10px] border border-[#D9CFC0] bg-[#F8F2E9] hover:bg-[#EEF5FE] text-[13px] font-bold text-[#162660] tabular-num"
                >
                  {pct}%
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Line Modal */}
      <Modal
        open={Boolean(editingLine)}
        onClose={() => setEditingLine(null)}
        title={editingLine?.name || 'Edit Line'}
        subtitle="Adjust unit price or line-level discount"
        maxWidth="max-w-sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingLine(null)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!editingLine) return;
                setCart((prev) =>
                  prev.map((i) => (i.productId === editingLine.productId ? editingLine : i))
                );
                setEditingLine(null);
              }}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Save Line
            </button>
          </>
        }
      >
        {editingLine && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                Unit Price ({cur})
              </label>
              <input
                type="number"
                min={0}
                value={editingLine.unitPrice}
                onChange={(e) =>
                  setEditingLine({ ...editingLine, unitPrice: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[15px] font-bold tabular-num"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                Line Discount ({cur})
              </label>
              <input
                type="number"
                min={0}
                value={editingLine.discount}
                onChange={(e) =>
                  setEditingLine({ ...editingLine, discount: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[15px] font-bold tabular-num"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Customer Picker Modal */}
      <Modal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Attach Customer"
        subtitle="Link this bill to a customer profile or Khata account"
        maxWidth="max-w-md"
      >
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCustomerId('');
              setCustomerModalOpen(false);
            }}
            className={`w-full p-3 rounded-[14px] border text-left flex items-center justify-between ${
              !selectedCustomerId
                ? 'bg-[#EEF5FE] border-[#B5D3F5]'
                : 'bg-white border-[#E9E1D5] hover:bg-[#F8F2E9]'
            }`}
          >
            <div>
              <p className="text-[14px] font-bold text-[#162660]">Walk-in Customer</p>
              <p className="text-[12px] text-[#5B6585]">Standard counter checkout</p>
            </div>
            {!selectedCustomerId && <Check className="w-4 h-4 text-[#2E46A0]" />}
          </button>

          {workspace.customers.map((c) => {
            const picked = selectedCustomerId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCustomerId(c.id);
                  setCustomerModalOpen(false);
                }}
                className={`w-full p-3 rounded-[14px] border text-left flex items-center justify-between gap-3 ${
                  picked
                    ? 'bg-[#EEF5FE] border-[#B5D3F5]'
                    : 'bg-white border-[#E9E1D5] hover:bg-[#F8F2E9]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-[#162660] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                    {getInitials(c.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#162660] truncate">{c.name}</p>
                    <p className="text-[12px] text-[#5B6585] tabular-num">{c.phone}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] text-[#5B6585]">Khata Due</p>
                  <p className="text-[13px] font-bold text-[#162660] tabular-num">
                    {formatMoney(c.balanceDue, cur)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Held Bills Modal */}
      <Modal
        open={heldModalOpen}
        onClose={() => setHeldModalOpen(false)}
        title="Held Bills"
        subtitle="Resume parked bills back into the register"
        maxWidth="max-w-md"
      >
        {workspace.heldBills.length === 0 ? (
          <p className="text-[14px] text-[#5B6585] text-center py-6">No bills currently on hold.</p>
        ) : (
          <div className="space-y-2.5">
            {workspace.heldBills.map((h) => {
              const total = h.items.reduce((s, i) => s + i.unitPrice * i.qty - i.discount, 0);
              return (
                <div
                  key={h.id}
                  className="p-3.5 rounded-[14px] border border-[#E9E1D5] bg-[#F8F2E9]/50 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#162660] truncate">{h.label}</p>
                    <p className="text-[12px] text-[#5B6585] tabular-num">
                      {h.items.length} lines · {formatMoney(total, cur)} · {formatDateTime(h.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => recallHeldBill(h)}
                      className="h-9 px-3 rounded-[10px] bg-[#162660] text-white text-[13px] font-bold"
                    >
                      Recall
                    </button>
                    <button
                      type="button"
                      onClick={() => discardHeldBill(h.id)}
                      aria-label="Discard held bill"
                      className="w-9 h-9 rounded-[10px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Take Payment (Tender) Modal */}
      <Modal
        open={tenderOpen}
        onClose={() => !submitting && setTenderOpen(false)}
        title="Take Payment"
        subtitle={`${nextBillPreview} · ${totals.itemCount} items · ${selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}`}
        maxWidth="max-w-xl"
        footer={
          <>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setTenderOpen(false)}
              className="h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Back to Bill
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={completeCheckout}
              className="h-11 px-6 rounded-[12px] bg-[#162660] hover:bg-[#111E50] disabled:opacity-60 text-white text-[15px] font-bold tabular-num"
            >
              {submitting ? 'Completing...' : `Confirm ${formatMoney(totals.grandTotal, cur)}`}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Amount Due Hero Strip */}
          <div className="rounded-[16px] bg-[#162660] text-white p-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#BFD0EE]">
                Total Amount Due
              </p>
              <p className="text-[32px] font-bold tabular-num leading-tight mt-0.5">
                {formatMoney(totals.grandTotal, cur)}
              </p>
            </div>
            {payMethod === 'cash' && (
              <div className="text-right">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#BFD0EE]">
                  Change Due
                </p>
                <p className="text-[24px] font-bold text-[#7FD6A4] tabular-num leading-tight mt-0.5">
                  {formatMoney(changePreview, cur)}
                </p>
              </div>
            )}
          </div>

          {/* Payment Method Grid */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B6585] mb-2">
              Payment Method
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {paymentOptions
                .filter((o) => o.enabled)
                .map((opt) => {
                  const Icon = opt.icon;
                  const activeOpt = payMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPayMethod(opt.id)}
                      className={`h-12 px-3 rounded-[12px] border text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
                        activeOpt
                          ? 'bg-[#EEF5FE] border-[#162660] text-[#162660] ring-1 ring-[#162660]'
                          : 'bg-white border-[#D9CFC0] text-[#454F70] hover:bg-[#F8F2E9]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Cash Tender Controls */}
          {payMethod === 'cash' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">
                  Cash Received ({cur})
                </label>
                <input
                  type="number"
                  min={0}
                  value={tenderedInput}
                  onChange={(e) => setTenderedInput(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-[#D9CFC0] text-[18px] font-bold tabular-num"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickCashAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTenderedInput(String(amt))}
                    className="h-10 rounded-[10px] bg-[#F6F0E7] hover:bg-[#D0E6FD] text-[#162660] text-[13px] font-bold tabular-num transition-colors"
                  >
                    {formatMoney(amt, cur)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Khata Warning / Info */}
          {payMethod === 'khata' && (
            <div
              className={`p-3.5 rounded-[14px] border text-[13px] ${
                selectedCustomer
                  ? 'bg-[#EEF5FE] border-[#B5D3F5] text-[#24398A]'
                  : 'bg-[#FFF3C4] border-[#EBD892] text-[#6B4E00]'
              }`}
            >
              {selectedCustomer ? (
                <p>
                  Charging <strong className="tabular-num">{formatMoney(totals.grandTotal, cur)}</strong> to{' '}
                  <strong>{selectedCustomer.name}</strong>'s Khata ledger. New balance will be{' '}
                  <strong className="tabular-num">
                    {formatMoney(selectedCustomer.balanceDue + totals.grandTotal, cur)}
                  </strong>
                  .
                </p>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span>Please attach a customer before billing on Khata credit.</span>
                  <button
                    type="button"
                    onClick={() => setCustomerModalOpen(true)}
                    className="px-3 py-1.5 rounded-[8px] bg-[#162660] text-white font-bold shrink-0"
                  >
                    Pick Customer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Split Payment Builder */}
          {payMethod === 'split' && (
            <div className="space-y-2.5">
              {splitLegs.map((leg, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <select
                    value={leg.method}
                    onChange={(e) => {
                      const next = [...splitLegs];
                      next[idx] = {
                        ...leg,
                        method: e.target.value as Exclude<PaymentMethod, 'split'>,
                      };
                      setSplitLegs(next);
                    }}
                    className="col-span-5 h-11 px-3 rounded-[10px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="khata">Khata Credit</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    value={leg.amount}
                    onChange={(e) => {
                      const next = [...splitLegs];
                      next[idx] = { ...leg, amount: Math.max(0, Number(e.target.value) || 0) };
                      setSplitLegs(next);
                    }}
                    className="col-span-7 h-11 px-3 rounded-[10px] border border-[#D9CFC0] text-[15px] font-bold tabular-num"
                  />
                </div>
              ))}
              <p className="text-[12px] text-[#5B6585] tabular-num">
                Split Sum:{' '}
                <strong className="text-[#162660]">
                  {formatMoney(splitLegs.reduce((s, l) => s + l.amount, 0), cur)}
                </strong>{' '}
                / {formatMoney(totals.grandTotal, cur)}
              </p>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
              Optional Bill Note
            </label>
            <input
              type="text"
              value={saleNote}
              onChange={(e) => setSaleNote(e.target.value)}
              placeholder="e.g. Gift wrapped, reference #..."
              className="w-full h-11 px-3.5 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
