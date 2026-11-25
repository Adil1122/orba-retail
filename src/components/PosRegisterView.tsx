import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Banknote,
  Barcode,
  Building2,
  Check,
  CreditCard,
  Minus,
  PauseCircle,
  Percent,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Smartphone,
  Split,
  Tag,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { api } from '../lib/api.ts';
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
import { formatDateTime, formatMoney, paymentMethodLabel } from '../lib/format.ts';
import {
  computeOfferLineDiscount,
  formatOfferBadge,
  getEffectiveUnitPrice,
  isOfferActive,
} from '../lib/offers.ts';
import { Modal } from './BrandMark.tsx';
import { ProductArtSvg, ProductArtThumb, getCategoryTint } from './ProductArt.tsx';

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
  notify: (type: 'ok' | 'err', message: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const searchRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [applyTax, setApplyTax] = useState<boolean>(workspace.settings.taxRate > 0);
  const [activeHeldId, setActiveHeldId] = useState<string | undefined>(undefined);
  const [lastFlashedId, setLastFlashedId] = useState<string | null>(null);

  // Mobile bill sheet toggle
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Modals
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [heldModalOpen, setHeldModalOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  // Checkout / Tender state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountTendered, setAmountTendered] = useState<string>('');
  const [splitCash, setSplitCash] = useState<string>('');
  const [splitSecondMethod, setSplitSecondMethod] = useState<Exclude<PaymentMethod, 'split' | 'cash'>>('card');
  const [splitSecondAmt, setSplitSecondAmt] = useState<string>('');
  const [saleNote, setSaleNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Inline Return modal state
  const [returnSearch, setReturnSearch] = useState('');
  const [returnSale, setReturnSale] = useState<Sale | null>(null);
  const [returnQtys, setReturnQtys] = useState<Record<string, number>>({});
  const [refundMethod, setRefundMethod] = useState<'cash' | 'bank' | 'khata_credit'>('cash');
  const [returnReason, setReturnReason] = useState('Customer size exchange / return');
  const [processingReturn, setProcessingReturn] = useState(false);

  const catMap = useMemo(
    () => new Map(workspace.categories.map((c) => [c.id, c])),
    [workspace.categories]
  );

  const catNameMap = useMemo(
    () => new Map(workspace.categories.map((c) => [c.id, c.name])),
    [workspace.categories]
  );

  const activeCategoryObj = useMemo(
    () => (selectedCat !== 'all' && selectedCat !== 'offers' ? catMap.get(selectedCat) || null : null),
    [catMap, selectedCat]
  );

  const offerProductCount = useMemo(
    () => workspace.products.filter((p) => p.active && isOfferActive(p.offer)).length,
    [workspace.products]
  );

  const activeShift = useMemo(
    () => workspace.shifts.find((s) => s.status === 'open'),
    [workspace.shifts]
  );

  const nextBillNo = `B-${1049 + workspace.sales.length}`;

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workspace.products.filter((p) => {
      if (!p.active) return false;
      if (selectedCat === 'offers') {
        if (!isOfferActive(p.offer)) return false;
      } else if (selectedCat !== 'all' && p.categoryId !== selectedCat) {
        return false;
      }
      if (
        selectedSubcat !== 'all' &&
        (p.subcategory || '').toLowerCase() !== selectedSubcat.toLowerCase()
      ) {
        return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q)
      );
    });
  }, [workspace.products, selectedCat, selectedSubcat, search]);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + Math.max(0, item.unitPrice * item.qty - item.discount), 0),
    [cart]
  );

  const cartOfferSavings = useMemo(
    () => cart.reduce((acc, item) => acc + (item.discount || 0), 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (discountValue <= 0) return 0;
    if (discountType === 'percent') {
      return Math.min(subtotal, Math.round((subtotal * Math.min(discountValue, 100)) / 100));
    }
    return Math.min(subtotal, Math.round(discountValue));
  }, [subtotal, discountType, discountValue]);

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount =
    applyTax && workspace.settings.taxRate > 0 && !workspace.settings.taxInclusive
      ? Math.round((afterDiscount * workspace.settings.taxRate) / 100)
      : 0;
  const total = afterDiscount + taxAmount;

  function addToCart(product: Product) {
    if (product.stockQty <= 0) {
      notify('err', `${product.name} is sold out.`);
      return;
    }
    setLastFlashedId(product.id);
    window.setTimeout(() => setLastFlashedId((curId) => (curId === product.id ? null : curId)), 550);

    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.qty >= product.stockQty) {
          notify('err', `Only ${product.stockQty} units of ${product.name} in stock.`);
          return prev;
        }
        const nextQty = existing.qty + 1;
        const discount = computeOfferLineDiscount(product.salePrice, nextQty, product.offer);
        const offerLabel = discount > 0 ? formatOfferBadge(product.offer, cur) || undefined : undefined;
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: nextQty, discount, offerLabel } : i
        );
      }
      const discount = computeOfferLineDiscount(product.salePrice, 1, product.offer);
      const offerLabel = discount > 0 ? formatOfferBadge(product.offer, cur) || undefined : undefined;
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          variant: product.subcategory ? `${product.subcategory} · ${product.variant}` : product.variant,
          unitPrice: product.salePrice,
          costPrice: product.costPrice,
          qty: 1,
          discount,
          ...(offerLabel ? { offerLabel } : {}),
        },
      ];
    });
  }

  async function handleBarcodeOrSearchEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    const q = search.trim();
    if (!q) return;
    e.preventDefault();
    const localExact = workspace.products.find(
      (p) => p.barcode.toLowerCase() === q.toLowerCase() || p.sku.toLowerCase() === q.toLowerCase()
    );
    if (localExact) {
      addToCart(localExact);
      setSearch('');
      return;
    }
    try {
      const res = await api.lookupProduct(q);
      if (res.product) {
        addToCart(res.product);
        setSearch('');
        return;
      }
    } catch {
      // ignore and fall back to filtered list
    }
    if (filteredProducts.length === 1) {
      addToCart(filteredProducts[0]);
      setSearch('');
    }
  }

  function updateQty(productId: string, delta: number) {
    const prod = workspace.products.find((p) => p.id === productId);
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const nextQty = item.qty + delta;
          if (nextQty <= 0) return null;
          if (prod && nextQty > prod.stockQty) {
            notify('err', `Max ${prod.stockQty} available in stock.`);
            return item;
          }
          const discount = prod
            ? computeOfferLineDiscount(item.unitPrice, nextQty, prod.offer)
            : item.discount;
          const offerLabel =
            prod && discount > 0 ? formatOfferBadge(prod.offer, cur) || undefined : undefined;
          return { ...item, qty: nextQty, discount, offerLabel };
        })
        .filter(Boolean) as CartItem[]
    );
  }

  function clearCart() {
    setCart([]);
    setCustomer(null);
    setDiscountValue(0);
    setActiveHeldId(undefined);
    setSaleNote('');
  }

  async function handleHoldBill() {
    if (cart.length === 0) {
      setHeldModalOpen(true);
      return;
    }
    try {
      await api.holdBill({
        label: customer ? `${customer.name} · ${cart.length} items` : `${cart[0].name} + ${cart.length - 1} more`,
        customerId: customer?.id,
        customerName: customer?.name || 'Walk-in Customer',
        items: cart,
        discountType,
        discountValue,
      });
      await onRefresh();
      clearCart();
      notify('ok', 'Bill parked in Held Bills.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to hold bill.');
    }
  }

  function resumeHeldBill(held: HeldBill) {
    setCart(held.items);
    setDiscountType(held.discountType);
    setDiscountValue(held.discountValue);
    setActiveHeldId(held.id);
    if (held.customerId) {
      const found = workspace.customers.find((c) => c.id === held.customerId) || null;
      setCustomer(found);
    } else {
      setCustomer(null);
    }
    setHeldModalOpen(false);
    notify('ok', `Resumed ${held.label}`);
  }

  async function deleteHeld(id: string) {
    try {
      await api.deleteHeldBill(id);
      await onRefresh();
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not delete held bill.');
    }
  }

  function openCheckout() {
    if (cart.length === 0) {
      notify('err', 'Add at least one item before charging.');
      return;
    }
    setPaymentMethod('cash');
    setAmountTendered(String(total));
    setSplitCash(String(Math.floor(total / 2)));
    setSplitSecondAmt(String(total - Math.floor(total / 2)));
    setCheckoutOpen(true);
  }

  // Keyboard shortcuts matching Main.jsx bottom bar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        void handleHoldBill();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (cart.length > 0) setDiscountModalOpen(true);
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0 && !checkoutOpen) openCheckout();
      } else if (e.key === 'Escape' && !checkoutOpen && !discountModalOpen && !customerModalOpen && !heldModalOpen && !returnModalOpen) {
        if (search) setSearch('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  async function completeSale() {
    if (cart.length === 0) return;
    if (paymentMethod === 'khata' && !customer) {
      notify('err', 'Attach a customer to bill on Khata credit.');
      return;
    }

    let paymentSplit: PaymentSplitEntry[] | undefined;
    if (paymentMethod === 'split') {
      const cAmt = Math.max(0, Number(splitCash) || 0);
      const sAmt = Math.max(0, Number(splitSecondAmt) || 0);
      if (cAmt + sAmt < total) {
        notify('err', 'Split amounts must cover the full total.');
        return;
      }
      if (splitSecondMethod === 'khata' && !customer) {
        notify('err', 'Attach a customer for the Khata part of split payment.');
        return;
      }
      paymentSplit = [
        ...(cAmt > 0 ? [{ method: 'cash' as const, amount: cAmt }] : []),
        ...(sAmt > 0 ? [{ method: splitSecondMethod, amount: sAmt }] : []),
      ];
    }

    setSubmitting(true);
    try {
      const sale = await api.createSale({
        items: cart,
        customerId: customer?.id,
        discountType,
        discountValue,
        applyTax,
        paymentMethod,
        paymentSplit,
        amountTendered: paymentMethod === 'cash' ? Math.max(total, Number(amountTendered) || total) : total,
        heldBillId: activeHeldId,
        note: saleNote.trim() || undefined,
      });
      await onRefresh();
      clearCart();
      setCheckoutOpen(false);
      setMobileCartOpen(false);
      onSaleCompleted(sale);
      notify('ok', `Sale ${sale.billNo} completed (${formatMoney(sale.total, cur)})`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitInlineReturn() {
    if (!returnSale) return;
    const lines = Object.entries(returnQtys)
      .filter(([, q]) => q > 0)
      .map(([productId, qty]) => ({ productId, qty }));
    if (lines.length === 0) {
      notify('err', 'Select at least one item quantity to return.');
      return;
    }
    setProcessingReturn(true);
    try {
      await api.createReturn(returnSale.id, {
        items: lines,
        refundMethod,
        reason: returnReason.trim() || 'Counter return',
      });
      await onRefresh();
      notify('ok', `Return processed for ${returnSale.billNo} and stock restored.`);
      setReturnSale(null);
      setReturnQtys({});
      setReturnModalOpen(false);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not process return.');
    } finally {
      setProcessingReturn(false);
    }
  }

  const tenderNum = Number(amountTendered) || 0;
  const changeDue = paymentMethod === 'cash' ? Math.max(0, tenderNum - total) : 0;

  const pkrQuickAmounts = useMemo(() => {
    const rounded500 = Math.ceil(total / 500) * 500;
    const rounded1000 = Math.ceil(total / 1000) * 1000;
    const rounded5000 = Math.ceil(total / 5000) * 5000;
    const set = new Set<number>([total, rounded500, rounded1000, rounded5000, total + 500, total + 1000]);
    return Array.from(set)
      .filter((v) => v >= total && v > 0)
      .sort((a, b) => a - b)
      .slice(0, 4);
  }, [total]);

  const billPanelContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Bill Header matching Main.jsx (Bill B-xxxx + Draft pill + Hold / Return / Clear circular icon actions) */}
      <div className="px-4 py-3.5 border-b border-[#E9E1D5] flex items-center justify-between gap-2 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold text-[#162660] tabular-num">{nextBillNo}</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#EEF5FE] text-[#24398A] text-[11px] font-bold">
              {cart.length > 0 ? `${cart.reduce((a, i) => a + i.qty, 0)} items` : 'Draft'}
            </span>
          </div>
          <p className="text-[12px] text-[#5B6585] truncate">{user.name} · Counter 1</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleHoldBill}
            title="Hold bill or open held bills (F4)"
            className="relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-[10px] hover:bg-[#F6F0E7] text-[#162660]"
          >
            <span className="w-8 h-8 rounded-full bg-[#F6F0E7] flex items-center justify-center">
              <PauseCircle className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold text-[#454F70]">Hold</span>
            {workspace.heldBills.length > 0 && (
              <span className="absolute -top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#162660] text-white text-[10px] font-bold flex items-center justify-center">
                {workspace.heldBills.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setReturnSale(null);
              setReturnQtys({});
              setReturnSearch('');
              setReturnModalOpen(true);
            }}
            title="Process return or exchange"
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-[10px] hover:bg-[#F6F0E7] text-[#162660]"
          >
            <span className="w-8 h-8 rounded-full bg-[#F6F0E7] flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold text-[#454F70]">Return</span>
          </button>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={clearCart}
            title="Clear current bill"
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-[10px] hover:bg-[#FDF0EF] text-[#B42318] disabled:opacity-40"
          >
            <span className="w-8 h-8 rounded-full bg-[#F6F0E7] flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold">Clear</span>
          </button>
        </div>
      </div>

      {/* Dashed Customer Attach Bar (54px matching Main.jsx) */}
      <div className="px-4 py-3 border-b border-[#F6F0E7] shrink-0">
        {customer ? (
          <div className="h-[54px] px-3.5 rounded-[14px] bg-[#EEF5FE] border border-[#B5D3F5] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-full bg-[#162660] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                {customer.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[#162660] truncate">{customer.name}</p>
                <p className="text-[11px] text-[#24398A] truncate">
                  Khata due: {formatMoney(customer.balanceDue, cur)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCustomer(null)}
              className="w-7 h-7 rounded-full bg-white text-[#454F70] hover:text-[#B42318] flex items-center justify-center"
              aria-label="Remove customer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCustomerModalOpen(true)}
            className="w-full h-[54px] px-4 rounded-[14px] border border-dashed border-[#C8BCAA] hover:border-[#162660] hover:bg-[#F8F2E9] text-[#454F70] flex items-center justify-between gap-2 transition-colors"
          >
            <span className="flex items-center gap-2.5 text-[14px] font-semibold">
              <UserPlus className="w-4 h-4 text-[#2E46A0]" />
              Add customer (optional / Khata)
            </span>
            <span className="text-[12px] font-bold text-[#2E46A0]">Attach</span>
          </button>
        )}
      </div>

      {/* Cart Lines */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#F6F0E7] px-4">
        {cart.length === 0 ? (
          <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center py-10 px-4">
            <span className="w-14 h-14 rounded-full bg-[#F8F2E9] text-[#5B6585] flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6" />
            </span>
            <p className="text-[16px] font-bold text-[#162660]">Tap an item or scan a barcode</p>
            <p className="text-[13px] text-[#5B6585] mt-1 max-w-[240px]">
              Items you add appear here. Press <strong className="font-mono">F9</strong> any time to take payment.
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const prod = workspace.products.find((p) => p.id === item.productId);
            const lineTotal = Math.max(0, item.unitPrice * item.qty - item.discount);
            return (
              <div
                key={item.productId}
                className={`py-3 flex items-center gap-3 ${
                  lastFlashedId === item.productId ? 'anim-zflash rounded-[10px]' : ''
                }`}
              >
                {prod && (
                  <ProductArtThumb
                    product={prod}
                    categoryName={catNameMap.get(prod.categoryId)}
                    boxClass="w-10 h-10 rounded-[10px]"
                    svgSize={28}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#162660] truncate">{item.name}</p>
                  <p className="text-[12px] text-[#5B6585] tabular-num truncate">
                    {formatMoney(item.unitPrice, cur)} · {item.variant || item.sku}
                  </p>
                  {item.discount > 0 && (
                    <p className="text-[11px] font-bold text-[#14532D] mt-0.5 tabular-num">
                      {item.offerLabel || 'Offer'} · -{formatMoney(item.discount, cur)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-[#F6F0E7] rounded-[10px] p-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, -1)}
                    aria-label="Decrease quantity"
                    className="w-7 h-7 rounded-[8px] bg-white text-[#162660] hover:bg-[#EEF5FE] flex items-center justify-center shadow-2xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-[13px] font-bold tabular-num">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, 1)}
                    aria-label="Increase quantity"
                    className="w-7 h-7 rounded-[8px] bg-white text-[#162660] hover:bg-[#EEF5FE] flex items-center justify-center shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="w-[74px] text-right text-[14px] font-bold tabular-num text-[#162660] shrink-0">
                  {formatMoney(lineTotal, cur)}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Totals + Primary Charge Button (60px rounded-16 matching Main.jsx) */}
      <div className="p-4 border-t border-[#E9E1D5] bg-[#F8F2E9]/70 space-y-3 shrink-0">
        <div className="space-y-1.5 text-[14px]">
          <div className="flex items-center justify-between text-[#454F70]">
            <span>Subtotal</span>
            <span className="num font-semibold">{formatMoney(subtotal, cur)}</span>
          </div>

          {cartOfferSavings > 0 && (
            <div className="flex items-center justify-between text-[12px] text-[#14532D] font-semibold">
              <span className="inline-flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Product offers applied
              </span>
              <span className="num">-{formatMoney(cartOfferSavings, cur)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setDiscountModalOpen(true)}
              className="text-[13px] font-bold text-[#2E46A0] hover:underline inline-flex items-center gap-1 disabled:opacity-40"
            >
              <Percent className="w-3.5 h-3.5" />
              {discountAmount > 0 ? 'Edit discount (F8)' : 'Add discount (F8)'}
            </button>
            <span className="num font-semibold text-[#14532D]">
              {discountAmount > 0 ? `-${formatMoney(discountAmount, cur)}` : formatMoney(0, cur)}
            </span>
          </div>

          {workspace.settings.taxRate > 0 && (
            <div className="flex items-center justify-between text-[13px] text-[#454F70]">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyTax}
                  onChange={(e) => setApplyTax(e.target.checked)}
                  className="accent-[#162660]"
                />
                <span>GST ({workspace.settings.taxRate}%)</span>
              </label>
              <span className="num font-semibold">{formatMoney(taxAmount, cur)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-[#E9E1D5] flex items-baseline justify-between">
            <span className="text-[16px] font-bold text-[#162660]">Total</span>
            <span className="num text-[24px] font-bold text-[#162660]">
              {formatMoney(total, cur)}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={openCheckout}
          className="zyro-bp w-full h-[58px] rounded-[16px] bg-[#162660] text-white text-[17px] font-bold flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(22,38,96,0.22)]"
        >
          <span>Charge {formatMoney(total, cur)}</span>
          <span className="hidden sm:inline px-2 py-0.5 rounded-[6px] bg-white/15 text-[11px] font-mono">
            F9
          </span>
        </button>
      </div>
    </div>
  );

  const matchingReturnSales = useMemo(() => {
    const q = returnSearch.trim().toLowerCase();
    return workspace.sales
      .filter((s) => s.status !== 'returned')
      .filter(
        (s) =>
          !q ||
          s.billNo.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [workspace.sales, returnSearch]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-60px)] md:min-h-screen lg:h-screen overflow-hidden">
      {/* ==================== LEFT / CENTER CATALOG STAGE (#F1E4D1) ==================== */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Search & Category Controls */}
        <div className="px-4 sm:px-5 pt-4 pb-3 space-y-3 shrink-0">
          <div className="zyro-field h-[52px] rounded-[14px] bg-white border border-[#D9CFC0] px-3.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(12,20,50,0.04)]">
            <Search className="w-5 h-5 text-[#5B6585] shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleBarcodeOrSearchEnter}
              placeholder="Scan barcode or search item name, SKU..."
              className="flex-1 h-full bg-transparent text-[15px] font-medium focus:outline-none"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="w-7 h-7 rounded-full bg-[#F6F0E7] text-[#454F70] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-[#F6F0E7] text-[#5B6585] font-mono text-[12px] font-semibold">
                <Barcode className="w-3.5 h-3.5" /> F2
              </span>
            )}
          </div>

          {/* 44px Rounded-Full Category Pills + Offers + Sub-category Row */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedCat('all');
                  setSelectedSubcat('all');
                }}
                className={`h-[42px] px-4 rounded-full text-[14px] font-bold whitespace-nowrap transition-colors shrink-0 ${
                  selectedCat === 'all'
                    ? 'bg-[#162660] text-white'
                    : 'bg-white border border-[#E9E1D5] text-[#454F70] hover:bg-[#F8F2E9]'
                }`}
              >
                All items ({workspace.products.filter((p) => p.active).length})
              </button>
              {offerProductCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCat('offers');
                    setSelectedSubcat('all');
                  }}
                  className={`h-[42px] px-4 rounded-full text-[14px] font-bold whitespace-nowrap transition-colors shrink-0 inline-flex items-center gap-1.5 ${
                    selectedCat === 'offers'
                      ? 'bg-[#162660] text-[#D0E6FD]'
                      : 'bg-[#EEF5FE] border border-[#B5D3F5] text-[#162660] hover:bg-[#D0E6FD]'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Offers ({offerProductCount})
                </button>
              )}
              {workspace.categories.map((cat) => {
                const active = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCat(cat.id);
                      setSelectedSubcat('all');
                    }}
                    className={`h-[42px] px-4 rounded-full text-[14px] font-bold whitespace-nowrap transition-colors shrink-0 ${
                      active
                        ? 'bg-[#162660] text-white'
                        : 'bg-white border border-[#E9E1D5] text-[#454F70] hover:bg-[#F8F2E9]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {activeCategoryObj?.subcategories && activeCategoryObj.subcategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedSubcat('all')}
                  className={`h-[32px] px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 ${
                    selectedSubcat === 'all'
                      ? 'bg-[#D0E6FD] text-[#162660]'
                      : 'bg-white border border-[#E9E1D5] text-[#454F70] hover:bg-[#F8F2E9]'
                  }`}
                >
                  All {activeCategoryObj.name}
                </button>
                {activeCategoryObj.subcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubcat(sub)}
                    className={`h-[32px] px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 ${
                      selectedSubcat === sub
                        ? 'bg-[#D0E6FD] text-[#162660]'
                        : 'bg-white border border-[#E9E1D5] text-[#454F70] hover:bg-[#F8F2E9]'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Tile Grid (ProductArtSvg + color dot + offer badge + price + stock dot) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-24 lg:pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filteredProducts.map((product) => {
              const tint = getCategoryTint(catNameMap.get(product.categoryId) || product.categoryId);
              const out = product.stockQty <= 0;
              const low = !out && product.stockQty <= product.minStock;
              const inCart = cart.find((c) => c.productId === product.id);
              const hasOffer = isOfferActive(product.offer);
              const offerBadge = hasOffer ? formatOfferBadge(product.offer, cur) : '';
              const effectivePrice = hasOffer
                ? getEffectiveUnitPrice(product)
                : product.salePrice;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={out}
                  className={`zyro-tile relative bg-white border rounded-[16px] overflow-hidden text-left flex flex-col shadow-[0_2px_6px_rgba(12,20,50,0.04)] ${
                    inCart ? 'border-[#162660] ring-1 ring-[#162660]' : 'border-[#E9E1D5]'
                  } ${out ? 'opacity-55 cursor-not-allowed' : ''}`}
                >
                  {/* Top Tinted Product Art Stage */}
                  <div
                    className="zyro-ph relative h-[96px] sm:h-[108px] w-full flex items-center justify-center p-2"
                    style={{ backgroundColor: tint.bg }}
                  >
                    <ProductArtSvg
                      product={product}
                      categoryName={catNameMap.get(product.categoryId)}
                      size={74}
                    />
                    {/* Swatch Dot */}
                    <span
                      className="absolute bottom-2 left-2.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: product.swatch || '#162660' }}
                    />
                    {inCart && (
                      <span className="absolute top-2 right-2 min-w-[24px] h-6 px-1.5 rounded-full bg-[#162660] text-white text-[12px] font-bold flex items-center justify-center tabular-num shadow-sm">
                        {inCart.qty}
                      </span>
                    )}
                    {out ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FDF0EF] text-[#B42318] text-[10px] font-bold">
                        Sold out
                      </span>
                    ) : (
                      offerBadge && (
                        <span className="absolute top-2 left-2 max-w-[78%] truncate px-2 py-0.5 rounded-full bg-[#162660] text-[#D0E6FD] text-[10px] font-bold shadow-xs">
                          {offerBadge}
                        </span>
                      )
                    )}
                  </div>

                  {/* Bottom Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <p className="text-[14px] font-bold text-[#162660] leading-snug line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-[12px] text-[#5B6585] truncate mt-0.5">
                        {product.subcategory
                          ? `${product.subcategory} · ${product.variant || product.sku}`
                          : product.variant || product.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-1">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="num text-[15px] font-bold text-[#162660]">
                          {formatMoney(effectivePrice, cur)}
                        </span>
                        {effectivePrice < product.salePrice && (
                          <span className="num text-[11px] text-[#5B6585] line-through truncate">
                            {formatMoney(product.salePrice, cur)}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5B6585] tabular-num shrink-0">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            out ? 'bg-[#E36B5D]' : low ? 'bg-[#C99A06]' : 'bg-[#2F9E63]'
                          }`}
                        />
                        {product.stockQty}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {filteredProducts.length === 0 && (
            <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-10 text-center mt-4">
              <p className="text-[16px] font-bold text-[#162660]">No matching products found</p>
              <p className="text-[13px] text-[#5B6585] mt-1">
                Try clearing the search bar or switching category.
              </p>
            </div>
          )}
        </div>

        {/* Bottom 44px Keyboard Shortcut Strip (Main.jsx) */}
        <div className="hidden lg:flex h-[44px] bg-white border-t border-[#E9E1D5] px-5 items-center justify-between gap-4 text-[12px] text-[#5B6585] shrink-0">
          <div className="flex items-center gap-4">
            {[
              { k: 'F2', l: 'Search' },
              { k: 'F4', l: 'Hold' },
              { k: 'F8', l: 'Discount' },
              { k: 'F9', l: 'Charge' },
              { k: 'Esc', l: 'Clear search' },
            ].map((sc) => (
              <span key={sc.k} className="inline-flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-[5px] bg-[#F6F0E7] border border-[#E9E1D5] font-mono text-[11px] font-bold text-[#162660]">
                  {sc.k}
                </kbd>
                <span>{sc.l}</span>
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#14532D]">
            <span
              className={`w-2 h-2 rounded-full ${
                activeShift ? 'bg-[#2F9E63]' : 'bg-[#C99A06]'
              }`}
            />
            {activeShift ? `Shift ${activeShift.shiftNo} open` : 'Shift closed'}
          </span>
        </div>
      </div>

      {/* ==================== RIGHT 396px WHITE BILL PANEL (Desktop) ==================== */}
      <aside className="hidden lg:flex w-[370px] xl:w-[396px] shrink-0 border-l border-[#E9E1D5] h-full flex-col overflow-hidden">
        {billPanelContent}
      </aside>

      {/* ==================== MOBILE STICKY BILL BAR (< lg) ==================== */}
      <div className="lg:hidden fixed bottom-[66px] md:bottom-0 inset-x-0 md:left-[84px] z-20 bg-white border-t border-[#E9E1D5] px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-6px_20px_rgba(12,20,50,0.1)]">
        <button
          type="button"
          onClick={() => setMobileCartOpen(true)}
          className="flex-1 text-left"
        >
          <p className="text-[12px] font-semibold text-[#5B6585]">
            {cart.reduce((a, i) => a + i.qty, 0)} item(s) · {nextBillNo}
          </p>
          <p className="num text-[18px] font-bold text-[#162660]">{formatMoney(total, cur)}</p>
        </button>
        <button
          type="button"
          onClick={() => setMobileCartOpen(true)}
          className="zyro-bp h-12 px-5 rounded-[14px] bg-[#162660] text-white text-[15px] font-bold"
        >
          View Bill
        </button>
      </div>

      {/* Mobile Full Bill Sheet */}
      {mobileCartOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-[#0F1B47]/45 flex flex-col justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileCartOpen(false);
          }}
        >
          <div className="anim-zsheet h-[88vh] rounded-t-[22px] overflow-hidden bg-white flex flex-col">
            <div className="px-4 py-2 bg-[#F8F2E9] border-b border-[#E9E1D5] flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#162660]">Current Counter Bill</span>
              <button
                type="button"
                onClick={() => setMobileCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">{billPanelContent}</div>
          </div>
        </div>
      )}

      {/* ==================== TAKE PAYMENT / TENDER MODAL (Tender.jsx) ==================== */}
      <Modal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={`Take Payment · ${nextBillNo}`}
        subtitle={`Amount due: ${formatMoney(total, cur)}`}
        maxWidth="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="zyro-bs h-12 px-5 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[15px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={completeSale}
              className="zyro-bp h-12 px-6 rounded-[12px] bg-[#162660] text-white text-[15px] font-bold inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Completing...' : `Confirm ${formatMoney(total, cur)}`}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Total Summary Banner */}
          <div className="rounded-[16px] bg-[#162660] text-white px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#BFD0EE] font-semibold">Total to collect</p>
              <p className="num text-[32px] font-bold leading-tight">{formatMoney(total, cur)}</p>
            </div>
            {paymentMethod === 'cash' && changeDue > 0 && (
              <div className="text-right">
                <p className="text-[12px] text-[#7FD6A4] font-semibold">Change due</p>
                <p className="num text-[22px] font-bold text-[#7FD6A4]">
                  {formatMoney(changeDue, cur)}
                </p>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'jazzcash', label: 'JazzCash', icon: Smartphone },
                { id: 'easypaisa', label: 'EasyPaisa', icon: Smartphone },
                { id: 'bank', label: 'Bank / Raast', icon: Building2 },
                { id: 'khata', label: 'Khata', icon: Users },
                { id: 'split', label: 'Split', icon: Split },
              ] as { id: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }> }[]
            ).map((pm) => {
              const Icon = pm.icon;
              const active = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`zyro-opt h-14 px-2.5 rounded-[12px] border flex flex-col items-center justify-center gap-1 text-[13px] font-bold ${
                    active
                      ? 'bg-[#EEF5FE] border-[#162660] text-[#162660]'
                      : 'bg-white border-[#E9E1D5] text-[#454F70]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{pm.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cash Note Quick Buttons */}
          {paymentMethod === 'cash' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#162660] mb-1.5">
                  Cash received ({cur})
                </label>
                <input
                  type="number"
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                  className="zyro-field w-full h-12 rounded-[12px] border px-3.5 text-[18px] font-bold tabular-num focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {pkrQuickAmounts.map((amt, i) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountTendered(String(amt))}
                    className={`h-11 rounded-[10px] border text-[13px] font-bold tabular-num transition-colors ${
                      Number(amountTendered) === amt
                        ? 'bg-[#162660] text-white border-[#162660]'
                        : 'bg-[#F8F2E9] text-[#162660] border-[#D9CFC0] hover:bg-[#ECE4D8]'
                    }`}
                  >
                    {i === 0 ? `Exact (${amt.toLocaleString()})` : `${cur} ${amt.toLocaleString()}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Split Payment Inputs */}
          {paymentMethod === 'split' && (
            <div className="rounded-[14px] bg-[#F8F2E9] p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">
                    Cash amount
                  </label>
                  <input
                    type="number"
                    value={splitCash}
                    onChange={(e) => {
                      const v = Math.max(0, Number(e.target.value) || 0);
                      setSplitCash(e.target.value);
                      setSplitSecondAmt(String(Math.max(0, total - v)));
                    }}
                    className="zyro-field w-full h-11 rounded-[10px] border bg-white px-3 font-bold tabular-num focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">
                    Second method
                  </label>
                  <select
                    value={splitSecondMethod}
                    onChange={(e) =>
                      setSplitSecondMethod(e.target.value as Exclude<PaymentMethod, 'split' | 'cash'>)
                    }
                    className="zyro-field w-full h-11 rounded-[10px] border bg-white px-2.5 text-[14px] font-semibold focus:outline-none"
                  >
                    <option value="card">Card</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="bank">Bank / Raast</option>
                    <option value="khata">Khata Credit</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">
                  {paymentMethodLabel(splitSecondMethod)} amount
                </label>
                <input
                  type="number"
                  value={splitSecondAmt}
                  onChange={(e) => setSplitSecondAmt(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[10px] border bg-white px-3 font-bold tabular-num focus:outline-none"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'khata' && !customer && (
            <div className="rounded-[12px] bg-[#FFF3C4] border border-[#EBD892] px-4 py-3 text-[13px] font-semibold text-[#6B4E00] flex items-center justify-between gap-2">
              <span>Attach a customer account before billing to Khata.</span>
              <button
                type="button"
                onClick={() => {
                  setCheckoutOpen(false);
                  setCustomerModalOpen(true);
                }}
                className="underline font-bold text-[#162660]"
              >
                Pick customer
              </button>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-[#162660] mb-1">
              Bill note (optional)
            </label>
            <input
              type="text"
              value={saleNote}
              onChange={(e) => setSaleNote(e.target.value)}
              placeholder="e.g. Gift wrap, courier reference..."
              className="zyro-field w-full h-11 rounded-[12px] border px-3.5 text-[14px] focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* ==================== ATTACH CUSTOMER MODAL ==================== */}
      <Modal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Attach Customer"
        subtitle="Link this bill to a Khata or repeat customer"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Search by customer name or phone..."
            className="zyro-field w-full h-11 rounded-[12px] border px-3.5 text-[14px] focus:outline-none"
          />
          <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px] overflow-hidden">
            {workspace.customers
              .filter(
                (c) =>
                  !customerSearch.trim() ||
                  c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                  c.phone.includes(customerSearch)
              )
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCustomer(c);
                    setCustomerModalOpen(false);
                  }}
                  className="w-full px-4 py-3 hover:bg-[#F8F2E9] flex items-center justify-between gap-2 text-left"
                >
                  <div>
                    <p className="text-[14px] font-bold text-[#162660]">{c.name}</p>
                    <p className="text-[12px] text-[#5B6585]">{c.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="num text-[13px] font-bold text-[#7A5320]">
                      Due: {formatMoney(c.balanceDue, cur)}
                    </p>
                    <p className="text-[11px] text-[#5B6585]">
                      Limit: {formatMoney(c.creditLimit, cur)}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </Modal>

      {/* ==================== HELD BILLS MODAL ==================== */}
      <Modal
        open={heldModalOpen}
        onClose={() => setHeldModalOpen(false)}
        title="Held Bills"
        subtitle="Resume a parked customer bill"
      >
        <div className="space-y-2.5">
          {workspace.heldBills.length === 0 ? (
            <p className="text-[14px] text-[#5B6585] text-center py-6">No held bills right now.</p>
          ) : (
            workspace.heldBills.map((h) => (
              <div
                key={h.id}
                className="p-3.5 rounded-[14px] border border-[#E9E1D5] bg-[#F8F2E9]/60 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[#162660] truncate">{h.label}</p>
                  <p className="text-[12px] text-[#5B6585]">
                    {h.items.reduce((a, i) => a + i.qty, 0)} items · {formatDateTime(h.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => resumeHeldBill(h)}
                    className="zyro-bp h-9 px-3.5 rounded-[10px] bg-[#162660] text-white text-[13px] font-bold"
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteHeld(h.id)}
                    className="w-9 h-9 rounded-[10px] bg-white border border-[#E9E1D5] text-[#B42318] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* ==================== DISCOUNT MODAL ==================== */}
      <Modal
        open={discountModalOpen}
        onClose={() => setDiscountModalOpen(false)}
        title="Bill Discount"
        subtitle="Apply a flat amount or percentage off the bill"
        maxWidth="max-w-sm"
        footer={
          <button
            type="button"
            onClick={() => setDiscountModalOpen(false)}
            className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
          >
            Done
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 p-1 rounded-[10px] bg-[#ECE4D8] gap-1">
            {(['fixed', 'percent'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDiscountType(t)}
                className={`h-9 rounded-[8px] text-[13px] font-bold ${
                  discountType === t ? 'bg-white text-[#162660] shadow-xs' : 'text-[#5B6585]'
                }`}
              >
                {t === 'fixed' ? `Flat (${cur})` : 'Percentage (%)'}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={0}
            value={discountValue || ''}
            onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value) || 0))}
            placeholder={discountType === 'fixed' ? '500' : '10'}
            className="zyro-field w-full h-12 rounded-[12px] border px-3.5 text-[18px] font-bold tabular-num focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {(discountType === 'percent' ? [5, 10, 15, 20] : [100, 250, 500, 1000]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDiscountValue(preset)}
                className="px-3 py-1.5 rounded-[10px] bg-[#F8F2E9] hover:bg-[#EEF5FE] text-[#162660] text-[13px] font-bold"
              >
                {discountType === 'percent' ? `${preset}%` : `${cur} ${preset}`}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* ==================== INLINE COUNTER RETURN MODAL ==================== */}
      <Modal
        open={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title="Counter Return & Refund"
        subtitle="Find a recent bill, choose returned items and restock automatically"
        maxWidth="max-w-lg"
        footer={
          returnSale ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setReturnSale(null);
                  setReturnQtys({});
                }}
                className="zyro-bs h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
              >
                Pick another bill
              </button>
              <button
                type="button"
                disabled={processingReturn}
                onClick={submitInlineReturn}
                className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
              >
                {processingReturn ? 'Processing...' : 'Confirm Return & Restock'}
              </button>
            </>
          ) : undefined
        }
      >
        {!returnSale ? (
          <div className="space-y-3">
            <input
              type="text"
              value={returnSearch}
              onChange={(e) => setReturnSearch(e.target.value)}
              placeholder="Search Bill # (e.g. B-1048) or customer name..."
              className="zyro-field w-full h-11 rounded-[12px] border px-3.5 text-[14px] focus:outline-none"
            />
            <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px] overflow-hidden">
              {matchingReturnSales.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setReturnSale(s);
                    const init: Record<string, number> = {};
                    s.items.forEach((it) => {
                      const avail = it.qty - it.returnedQty;
                      if (avail > 0) init[it.productId] = avail;
                    });
                    setReturnQtys(init);
                  }}
                  className="w-full px-4 py-3 hover:bg-[#F8F2E9] flex items-center justify-between gap-2 text-left"
                >
                  <div>
                    <p className="text-[14px] font-bold text-[#162660]">
                      {s.billNo} · {s.customerName}
                    </p>
                    <p className="text-[12px] text-[#5B6585]">
                      {formatDateTime(s.createdAt)} · {s.items.length} line(s)
                    </p>
                  </div>
                  <span className="num text-[14px] font-bold text-[#162660]">
                    {formatMoney(s.total, cur)}
                  </span>
                </button>
              ))}
              {matchingReturnSales.length === 0 && (
                <p className="p-6 text-center text-[13px] text-[#5B6585]">No eligible bills found.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[12px] bg-[#F8F2E9] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-[#162660]">
                  {returnSale.billNo} · {returnSale.customerName}
                </p>
                <p className="text-[12px] text-[#5B6585]">{formatDateTime(returnSale.createdAt)}</p>
              </div>
              <span className="num text-[14px] font-bold">{formatMoney(returnSale.total, cur)}</span>
            </div>

            <div className="space-y-2">
              {returnSale.items.map((it) => {
                const max = it.qty - it.returnedQty;
                const val = returnQtys[it.productId] || 0;
                return (
                  <div
                    key={it.productId}
                    className="p-3 rounded-[12px] border border-[#E9E1D5] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[#162660] truncate">{it.name}</p>
                      <p className="text-[12px] text-[#5B6585]">
                        Returnable: {max} · {formatMoney(it.unitPrice, cur)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setReturnQtys((prev) => ({
                            ...prev,
                            [it.productId]: Math.max(0, (prev[it.productId] || 0) - 1),
                          }))
                        }
                        className="w-8 h-8 rounded-[8px] bg-[#F6F0E7] flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold tabular-num">{val}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setReturnQtys((prev) => ({
                            ...prev,
                            [it.productId]: Math.min(max, (prev[it.productId] || 0) + 1),
                          }))
                        }
                        className="w-8 h-8 rounded-[8px] bg-[#F6F0E7] flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#162660] mb-1">
                  Refund method
                </label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value as 'cash' | 'bank' | 'khata_credit')}
                  className="zyro-field w-full h-11 rounded-[12px] border bg-white px-3 text-[14px] focus:outline-none"
                >
                  <option value="cash">Cash from drawer</option>
                  <option value="bank">Bank / Wallet transfer</option>
                  {returnSale.customerId && <option value="khata_credit">Credit to Khata</option>}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#162660] mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border px-3 text-[14px] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
