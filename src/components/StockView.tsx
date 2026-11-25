import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Barcode,
  Check,
  ChevronRight,
  ClipboardCheck,
  Edit3,
  Layers,
  Minus,
  PackagePlus,
  Plus,
  ScanLine,
  Search,
  Tag,
  Trash2,
} from 'lucide-react';
import { api } from '../lib/api.ts';
import type { OfferType, Product, ProductOffer, WorkspacePayload } from '../types/pos.ts';
import { formatDateTime, formatMoney } from '../lib/format.ts';
import { formatOfferBadge, getEffectiveUnitPrice, isOfferActive } from '../lib/offers.ts';
import { Modal, SlideDrawer } from './BrandMark.tsx';
import { ProductArtThumb } from './ProductArt.tsx';

type StockFilter = 'all' | 'offer' | 'out' | 'low' | 'in';

interface BatchLine {
  product: Product;
  qty: number;
}

export function StockView({
  workspace,
  initialAddStockMode = false,
  onExitAddStock,
  onRefresh,
  notify,
}: {
  workspace: WorkspacePayload;
  initialAddStockMode?: boolean;
  onExitAddStock?: () => void;
  onRefresh: () => Promise<void>;
  notify: (type: 'ok' | 'err', message: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Sub-view mode: main stock list OR dedicated Add Stock barcode scan-in screen (AddStock.jsx)
  const [addStockMode, setAddStockMode] = useState(initialAddStockMode);
  const [scanCode, setScanCode] = useState('');
  const [batchLines, setBatchLines] = useState<BatchLine[]>([]);
  const [batchNote, setBatchNote] = useState('Barcode scan-in delivery');
  const [savingBatch, setSavingBatch] = useState(false);

  // Stock List Filters
  const [statusTab, setStatusTab] = useState<StockFilter>('all');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [subcatFilter, setSubcatFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Slide-over Stock Detail Drawer (Stock.jsx)
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null);
  const [quickDelta, setQuickDelta] = useState('1');
  const [quickReason, setQuickReason] = useState('Shelf restock');
  const [quickSalePrice, setQuickSalePrice] = useState('');
  const [quickCostPrice, setQuickCostPrice] = useState('');
  const [drawerOfferActive, setDrawerOfferActive] = useState(false);
  const [drawerOfferType, setDrawerOfferType] = useState<OfferType>('percent');
  const [drawerOfferValue, setDrawerOfferValue] = useState('10');
  const [drawerOfferLabel, setDrawerOfferLabel] = useState('');
  const [drawerOfferEndsAt, setDrawerOfferEndsAt] = useState('');
  const [busyDrawer, setBusyDrawer] = useState(false);

  // Product Editor Modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCatId, setFormCatId] = useState(workspace.categories[0]?.id || '');
  const [formSubcat, setFormSubcat] = useState('');
  const [formVariant, setFormVariant] = useState('');
  const [formUnit, setFormUnit] = useState('pcs');
  const [formCost, setFormCost] = useState('');
  const [formSale, setFormSale] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formMin, setFormMin] = useState('5');
  const [formSwatch, setFormSwatch] = useState('#162660');
  const [formOfferActive, setFormOfferActive] = useState(false);
  const [formOfferType, setFormOfferType] = useState<OfferType>('percent');
  const [formOfferValue, setFormOfferValue] = useState('10');
  const [formOfferLabel, setFormOfferLabel] = useState('');
  const [formOfferEndsAt, setFormOfferEndsAt] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  // Stock Count Modal
  const [countOpen, setCountOpen] = useState(false);
  const [countMap, setCountMap] = useState<Record<string, string>>({});
  const [savingCount, setSavingCount] = useState(false);

  // Categories Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatSubcats, setNewCatSubcats] = useState('');
  const [newCatColor, setNewCatColor] = useState('#162660');

  useEffect(() => {
    setAddStockMode(initialAddStockMode);
  }, [initialAddStockMode]);

  useEffect(() => {
    if (addStockMode) {
      window.setTimeout(() => scanInputRef.current?.focus(), 80);
    }
  }, [addStockMode]);

  const catMap = useMemo(
    () => new Map(workspace.categories.map((c) => [c.id, c])),
    [workspace.categories]
  );

  const catNameMap = useMemo(
    () => new Map(workspace.categories.map((c) => [c.id, c.name])),
    [workspace.categories]
  );

  const activeFilterCategory = useMemo(
    () => (catFilter !== 'all' ? catMap.get(catFilter) || null : null),
    [catMap, catFilter]
  );

  const selectedFormCategory = useMemo(
    () => catMap.get(formCatId) || null,
    [catMap, formCatId]
  );

  const drawerProduct = useMemo(
    () => workspace.products.find((p) => p.id === drawerProductId) || null,
    [workspace.products, drawerProductId]
  );

  useEffect(() => {
    if (drawerProduct) {
      setQuickSalePrice(String(drawerProduct.salePrice));
      setQuickCostPrice(String(drawerProduct.costPrice));
      setQuickDelta('5');
      setQuickReason('Shelf restock');
      setDrawerOfferActive(Boolean(drawerProduct.offer?.active));
      setDrawerOfferType(drawerProduct.offer?.type || 'percent');
      setDrawerOfferValue(String(drawerProduct.offer?.value ?? 10));
      setDrawerOfferLabel(drawerProduct.offer?.label || '');
      setDrawerOfferEndsAt(drawerProduct.offer?.endsAt ? drawerProduct.offer.endsAt.slice(0, 10) : '');
    }
  }, [drawerProduct]);

  const counts = useMemo(() => {
    const out = workspace.products.filter((p) => p.stockQty === 0).length;
    const low = workspace.products.filter((p) => p.stockQty > 0 && p.stockQty <= p.minStock).length;
    const healthy = workspace.products.filter((p) => p.stockQty > p.minStock).length;
    const offers = workspace.products.filter((p) => isOfferActive(p.offer)).length;
    const totalUnits = workspace.products.reduce((a, p) => a + p.stockQty, 0);
    return { all: workspace.products.length, offer: offers, out, low, in: healthy, totalUnits };
  }, [workspace.products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workspace.products.filter((p) => {
      if (statusTab === 'offer' && !isOfferActive(p.offer)) return false;
      if (statusTab === 'out' && p.stockQty !== 0) return false;
      if (statusTab === 'low' && !(p.stockQty > 0 && p.stockQty <= p.minStock)) return false;
      if (statusTab === 'in' && p.stockQty <= p.minStock) return false;
      if (catFilter !== 'all' && p.categoryId !== catFilter) return false;
      if (subcatFilter !== 'all' && (p.subcategory || '').toLowerCase() !== subcatFilter.toLowerCase()) {
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
  }, [workspace.products, statusTab, catFilter, subcatFilter, search]);

  function handleFormCategoryChange(nextCatId: string) {
    setFormCatId(nextCatId);
    const nextCat = catMap.get(nextCatId);
    if (nextCat?.subcategories && nextCat.subcategories.length > 0) {
      if (!nextCat.subcategories.includes(formSubcat)) {
        setFormSubcat(nextCat.subcategories[0]);
      }
    } else {
      setFormSubcat('');
    }
  }

  function openNewItemModal(prefillBarcode = '') {
    const defaultCat =
      (catFilter !== 'all' ? catMap.get(catFilter) : null) || workspace.categories[0] || null;
    setEditingId(null);
    setFormName('');
    setFormSku(`ZYR-${100 + workspace.products.length + 1}`);
    setFormBarcode(prefillBarcode || `8964${Math.floor(1000000 + Math.random() * 8999999)}`);
    setFormCatId(defaultCat?.id || '');
    setFormSubcat(defaultCat?.subcategories?.[0] || '');
    setFormVariant('Standard');
    setFormUnit('pcs');
    setFormCost('1500');
    setFormSale('2500');
    setFormQty('10');
    setFormMin('5');
    setFormSwatch('#162660');
    setFormOfferActive(false);
    setFormOfferType('percent');
    setFormOfferValue('10');
    setFormOfferLabel('');
    setFormOfferEndsAt('');
    setEditorOpen(true);
  }

  function openEditItemModal(p: Product) {
    const cat = catMap.get(p.categoryId);
    setEditingId(p.id);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormBarcode(p.barcode);
    setFormCatId(p.categoryId);
    setFormSubcat(p.subcategory || (cat?.subcategories?.[0] ?? ''));
    setFormVariant(p.variant);
    setFormUnit(p.unit);
    setFormCost(String(p.costPrice));
    setFormSale(String(p.salePrice));
    setFormQty(String(p.stockQty));
    setFormMin(String(p.minStock));
    setFormSwatch(p.swatch);
    setFormOfferActive(Boolean(p.offer?.active));
    setFormOfferType(p.offer?.type || 'percent');
    setFormOfferValue(String(p.offer?.value ?? 10));
    setFormOfferLabel(p.offer?.label || '');
    setFormOfferEndsAt(p.offer?.endsAt ? p.offer.endsAt.slice(0, 10) : '');
    setEditorOpen(true);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const offerPayload: ProductOffer | null = formOfferActive
        ? {
            active: true,
            type: formOfferType,
            value:
              formOfferType === 'bogo'
                ? Math.max(10, Math.min(100, Number(formOfferValue) || 100))
                : Math.max(0, Number(formOfferValue) || 0),
            ...(formOfferLabel.trim() ? { label: formOfferLabel.trim() } : {}),
            ...(formOfferEndsAt.trim() ? { endsAt: formOfferEndsAt.trim() } : {}),
          }
        : null;
      const payload = {
        name: formName.trim(),
        sku: formSku.trim(),
        barcode: formBarcode.trim(),
        categoryId: formCatId,
        subcategory: formSubcat.trim() || null,
        variant: formVariant.trim(),
        unit: formUnit.trim() || 'pcs',
        costPrice: Number(formCost) || 0,
        salePrice: Number(formSale) || 0,
        stockQty: Number(formQty) || 0,
        minStock: Number(formMin) || 5,
        swatch: formSwatch,
        offer: offerPayload,
      };
      if (editingId) {
        await api.updateProduct(editingId, payload);
        notify('ok', `Updated ${payload.name}`);
      } else {
        const created = await api.createProduct(payload);
        notify('ok', `Added ${created.name} to stock.`);
      }
      await onRefresh();
      setEditorOpen(false);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleDrawerAdjust(deltaOverride?: number) {
    if (!drawerProduct) return;
    const delta = deltaOverride ?? Number(quickDelta);
    if (!delta || !Number.isFinite(delta)) {
      notify('err', 'Enter a non-zero quantity change.');
      return;
    }
    setBusyDrawer(true);
    try {
      await api.adjustProductStock(drawerProduct.id, delta, quickReason.trim() || 'Manual adjustment');
      await onRefresh();
      notify('ok', `${delta > 0 ? '+' : ''}${delta} units applied to ${drawerProduct.name}`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Adjustment failed.');
    } finally {
      setBusyDrawer(false);
    }
  }

  async function handleDrawerPriceUpdate() {
    if (!drawerProduct) return;
    setBusyDrawer(true);
    try {
      await api.updateProductPrice(
        drawerProduct.id,
        Number(quickSalePrice) || drawerProduct.salePrice,
        Number(quickCostPrice) || drawerProduct.costPrice
      );
      await onRefresh();
      notify('ok', `Updated pricing for ${drawerProduct.name}`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Price update failed.');
    } finally {
      setBusyDrawer(false);
    }
  }

  async function handleDrawerOfferSave(clear = false) {
    if (!drawerProduct) return;
    setBusyDrawer(true);
    try {
      const payload: ProductOffer | null =
        clear || !drawerOfferActive
          ? null
          : {
              active: true,
              type: drawerOfferType,
              value:
                drawerOfferType === 'bogo'
                  ? Math.max(10, Math.min(100, Number(drawerOfferValue) || 100))
                  : Math.max(0, Number(drawerOfferValue) || 0),
              ...(drawerOfferLabel.trim() ? { label: drawerOfferLabel.trim() } : {}),
              ...(drawerOfferEndsAt.trim() ? { endsAt: drawerOfferEndsAt.trim() } : {}),
            };
      await api.updateProductOffer(drawerProduct.id, payload);
      await onRefresh();
      notify('ok', payload ? `Saved offer on ${drawerProduct.name}` : `Removed offer from ${drawerProduct.name}`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Offer update failed.');
    } finally {
      setBusyDrawer(false);
    }
  }

  async function handleDeleteProduct(p: Product) {
    setBusyDrawer(true);
    try {
      await api.deleteProduct(p.id);
      await onRefresh();
      setDrawerProductId(null);
      notify('ok', `Removed ${p.name} from catalog.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setBusyDrawer(false);
    }
  }

  // ==================== ADD STOCK (BARCODE SCAN-IN) HANDLERS ====================
  function addProductToBatch(prod: Product) {
    setBatchLines((prev) => {
      const ex = prev.find((l) => l.product.id === prod.id);
      if (ex) {
        return prev.map((l) => (l.product.id === prod.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [{ product: prod, qty: 1 }, ...prev];
    });
  }

  async function handleScanSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = scanCode.trim();
    if (!code) return;
    try {
      const res = await api.lookupProduct(code);
      if (res.product) {
        addProductToBatch(res.product);
        setScanCode('');
        notify('ok', `Scanned +1 ${res.product.name}`);
      } else {
        setScanCode('');
        notify('ok', `Unknown barcode ${code} — create new item`);
        openNewItemModal(code);
      }
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Lookup failed.');
    }
  }

  async function commitScanBatch() {
    if (batchLines.length === 0) return;
    setSavingBatch(true);
    try {
      const res = await api.batchReceiveStock(
        batchLines.map((l) => ({ productId: l.product.id, qty: l.qty })),
        batchNote.trim() || 'Barcode scan-in batch'
      );
      await onRefresh();
      setBatchLines([]);
      notify('ok', `Added ${res.totalUnits} unit(s) across ${res.updatedCount} item(s) to stock.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not save batch.');
    } finally {
      setSavingBatch(false);
    }
  }

  // ==================== STOCK COUNT & CATEGORIES ====================
  function openStockCountModal() {
    const init: Record<string, string> = {};
    workspace.products.forEach((p) => {
      init[p.id] = String(p.stockQty);
    });
    setCountMap(init);
    setCountOpen(true);
  }

  async function submitStockCount() {
    setSavingCount(true);
    try {
      const payload = workspace.products.map((p) => ({
        productId: p.id,
        countedQty: Math.max(0, Number(countMap[p.id] ?? p.stockQty) || 0),
      }));
      const res = await api.submitStockCount(payload);
      await onRefresh();
      setCountOpen(false);
      notify('ok', `Stock count reconciled (${res.updated} item(s) adjusted).`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Stock count failed.');
    } finally {
      setSavingCount(false);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const subcategories = newCatSubcats
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await api.createCategory({
        name: newCatName.trim(),
        color: newCatColor,
        description: newCatDesc.trim(),
        ...(subcategories.length > 0 ? { subcategories } : {}),
      });
      await onRefresh();
      setNewCatName('');
      setNewCatDesc('');
      setNewCatSubcats('');
      notify('ok', 'Category added.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to create category.');
    }
  }

  const formOfferPreview = useMemo(() => {
    if (!formOfferActive) return null;
    const saleNum = Number(formSale) || 0;
    const draft: ProductOffer = {
      active: true,
      type: formOfferType,
      value: formOfferType === 'bogo' ? Number(formOfferValue) || 100 : Number(formOfferValue) || 0,
      label: formOfferLabel.trim() || undefined,
      endsAt: formOfferEndsAt.trim() || undefined,
    };
    return {
      badge: formatOfferBadge(draft, cur),
      effectivePrice: getEffectiveUnitPrice({ salePrice: saleNum, offer: draft }),
    };
  }, [formOfferActive, formOfferType, formOfferValue, formOfferLabel, formOfferEndsAt, formSale, cur]);

  const subcategoryAndOfferFields = (
    <>
      {selectedFormCategory?.subcategories && selectedFormCategory.subcategories.length > 0 && (
        <div className="rounded-[14px] bg-[#F8F2E9] border border-[#E9E1D5] p-3">
          <label className="block text-[12px] font-bold uppercase tracking-wider text-[#5B6585] mb-2">
            {selectedFormCategory.name} sub-category
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedFormCategory.subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setFormSubcat(sub)}
                className={`h-9 px-4 rounded-full text-[13px] font-bold transition-colors ${
                  formSubcat === sub
                    ? 'bg-[#162660] text-white'
                    : 'bg-white border border-[#D9CFC0] text-[#454F70] hover:bg-[#EEF5FE]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-[14px] bg-[#F8F2E9] border border-[#E9E1D5] p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formOfferActive}
              onChange={(e) => setFormOfferActive(e.target.checked)}
              className="w-4 h-4 accent-[#162660] rounded"
            />
            <span className="text-[13px] font-bold text-[#162660] inline-flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#2E46A0]" />
              Product Offer / Promotion
            </span>
          </label>
          {formOfferPreview?.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#162660] text-[#D0E6FD] text-[11px] font-bold">
              {formOfferPreview.badge}
            </span>
          )}
        </div>

        {formOfferActive && (
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'percent', label: '% Off' },
                  { id: 'fixed', label: `Flat ${cur} Off` },
                  { id: 'bogo', label: 'Buy 1 Get 2nd' },
                ] as { id: OfferType; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setFormOfferType(opt.id);
                    if (opt.id === 'bogo') setFormOfferValue('50');
                    else if (opt.id === 'percent') setFormOfferValue('15');
                    else setFormOfferValue('500');
                  }}
                  className={`h-9 rounded-[10px] text-[12px] font-bold border transition-colors ${
                    formOfferType === opt.id
                      ? 'bg-[#162660] text-white border-[#162660]'
                      : 'bg-white text-[#454F70] border-[#D9CFC0]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#5B6585] mb-1">
                  {formOfferType === 'percent'
                    ? 'Discount (%)'
                    : formOfferType === 'fixed'
                      ? `Discount (${cur})`
                      : '2nd Item Off (%)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={formOfferType === 'fixed' ? 1000000 : 100}
                  value={formOfferValue}
                  onChange={(e) => setFormOfferValue(e.target.value)}
                  className="zyro-field w-full h-10 rounded-[10px] border bg-white px-3 font-bold tabular-num focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5B6585] mb-1">
                  Offer badge label
                </label>
                <input
                  type="text"
                  value={formOfferLabel}
                  onChange={(e) => setFormOfferLabel(e.target.value)}
                  placeholder="e.g. Eid Sale 15% OFF"
                  className="zyro-field w-full h-10 rounded-[10px] border bg-white px-3 text-[13px] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5B6585] mb-1">
                  Valid until (optional)
                </label>
                <input
                  type="date"
                  value={formOfferEndsAt}
                  onChange={(e) => setFormOfferEndsAt(e.target.value)}
                  className="zyro-field w-full h-10 rounded-[10px] border bg-white px-2.5 text-[12px] focus:outline-none"
                />
              </div>
            </div>
            {formOfferPreview && Number(formSale) > 0 && formOfferType !== 'bogo' && (
              <p className="text-[12px] text-[#14532D] font-semibold">
                POS price preview:{' '}
                <span className="line-through text-[#5B6585] mr-1.5">
                  {formatMoney(Number(formSale), cur)}
                </span>
                <span className="font-bold">{formatMoney(formOfferPreview.effectivePrice, cur)}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );

  // =========================================================================
  // SUB-VIEW: ADD STOCK (BARCODE SCAN-IN BATCH — AddStock.jsx)
  // =========================================================================
  if (addStockMode) {
    const totalBatchUnits = batchLines.reduce((a, l) => a + l.qty, 0);
    return (
      <div className="p-4 sm:p-6 lg:px-8 lg:py-6 max-w-[1360px] w-full mx-auto space-y-5 anim-zup">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#5B6585]">
              Stock · {workspace.settings.branchName}
            </p>
            <h1 className="text-[28px] font-bold text-[#162660] tracking-[-0.02em] leading-tight mt-0.5">
              Add stock
            </h1>
            <p className="text-[14px] text-[#454F70] mt-1">
              Scan each piece with your barcode scanner. Each scan adds 1. A code ZYRO doesn&apos;t know opens a new item.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setAddStockMode(false);
                onExitAddStock?.();
              }}
              className="zyro-bs h-12 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[15px] font-semibold inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to stock
            </button>
            <button
              type="button"
              onClick={() => openNewItemModal()}
              className="zyro-bs h-12 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[15px] font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New item
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left: 60px Navy-bordered Scanner Input + Quick Test Barcodes */}
          <section className="lg:col-span-7 bg-white border border-[#E9E1D5] rounded-[20px] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-[18px] font-bold text-[#162660]">Barcode scanner</h2>
              <span className="h-7 px-3 rounded-full bg-[#E8F6EE] text-[#14532D] text-[12px] font-bold inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2F9E63]" />
                Scanner ready
              </span>
            </div>

            <form onSubmit={handleScanSubmit} className="flex gap-2.5">
              <div className="flex-1 h-[60px] rounded-[14px] border-2 border-[#162660] bg-white px-4 flex items-center gap-3 focus-within:ring-4 focus-within:ring-[#D0E6FD]">
                <ScanLine className="w-5 h-5 text-[#162660] shrink-0" />
                <input
                  ref={scanInputRef}
                  type="text"
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  placeholder="Scan barcode or type SKU (e.g. 89640010101) + Enter"
                  className="flex-1 h-full bg-transparent text-[16px] font-mono font-semibold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="zyro-bp h-[60px] px-5 rounded-[14px] bg-[#162660] text-white text-[15px] font-bold shrink-0"
              >
                Scan
              </button>
            </form>

            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B6585] mb-2">
                Quick-add existing items to this batch
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {workspace.products.slice(0, 8).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addProductToBatch(p)}
                    className="zyro-opt p-2.5 rounded-[12px] border border-[#E9E1D5] bg-[#F8F2E9]/50 hover:bg-[#EEF5FE] flex items-center gap-2.5 text-left"
                  >
                    <ProductArtThumb
                      product={p}
                      categoryName={catNameMap.get(p.categoryId)}
                      boxClass="w-10 h-10 rounded-[10px]"
                      svgSize={28}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-[#162660] truncate">{p.name}</p>
                      <p className="text-[11px] font-mono text-[#5B6585] truncate">
                        {p.barcode} · {p.stockQty} in stock
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-[#2E46A0] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right: This Batch Summary */}
          <section className="lg:col-span-5 bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#F6F0E7] flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[#162660]">This batch</h2>
                <p className="text-[12px] text-[#5B6585]">
                  {batchLines.length} item(s) · {totalBatchUnits} unit(s) ready to add
                </p>
              </div>
              {batchLines.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBatchLines([])}
                  className="text-[12px] font-bold text-[#B42318] hover:underline"
                >
                  Clear batch
                </button>
              )}
            </div>

            <div className="divide-y divide-[#F6F0E7] max-h-[380px] overflow-y-auto">
              {batchLines.length === 0 ? (
                <div className="p-8 text-center">
                  <Barcode className="w-8 h-8 text-[#5B6585] mx-auto mb-2" />
                  <p className="text-[14px] font-bold text-[#162660]">No items scanned yet</p>
                  <p className="text-[13px] text-[#5B6585] mt-1">
                    Scan a barcode or tap an item on the left to build your delivery batch.
                  </p>
                </div>
              ) : (
                batchLines.map((line) => (
                  <div key={line.product.id} className="px-4 py-3 flex items-center gap-3">
                    <ProductArtThumb
                      product={line.product}
                      categoryName={catNameMap.get(line.product.categoryId)}
                      boxClass="w-10 h-10 rounded-[10px]"
                      svgSize={28}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[#162660] truncate">
                        {line.product.name}
                      </p>
                      <p className="text-[12px] text-[#5B6585]">
                        Current: {line.product.stockQty} → New: {line.product.stockQty + line.qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#F6F0E7] rounded-[10px] p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setBatchLines((prev) =>
                            prev
                              .map((l) =>
                                l.product.id === line.product.id ? { ...l, qty: l.qty - 1 } : l
                              )
                              .filter((l) => l.qty > 0)
                          )
                        }
                        className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-[13px] font-bold tabular-num">
                        +{line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setBatchLines((prev) =>
                            prev.map((l) =>
                              l.product.id === line.product.id ? { ...l, qty: l.qty + 1 } : l
                            )
                          )
                        }
                        className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[#E9E1D5] bg-[#F8F2E9]/70 space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">
                  Batch note / supplier reference
                </label>
                <input
                  type="text"
                  value={batchNote}
                  onChange={(e) => setBatchNote(e.target.value)}
                  className="zyro-field w-full h-10 rounded-[10px] border bg-white px-3 text-[13px] focus:outline-none"
                />
              </div>
              <button
                type="button"
                disabled={batchLines.length === 0 || savingBatch}
                onClick={commitScanBatch}
                className="zyro-bp w-full h-12 rounded-[14px] bg-[#162660] text-white text-[15px] font-bold"
              >
                {savingBatch
                  ? 'Saving batch...'
                  : `Save batch to stock (+${totalBatchUnits} units)`}
              </button>
            </div>
          </section>
        </div>

        {/* Reuse Product Editor Modal when an unknown barcode is scanned */}
        <Modal
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          title="Add New Item"
          subtitle="Scanned barcode pre-filled below"
          maxWidth="max-w-lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="zyro-bs h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="stock-product-form"
                disabled={savingProduct}
                className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
              >
                {savingProduct ? 'Saving...' : 'Save Item'}
              </button>
            </>
          }
        >
          <form id="stock-product-form" onSubmit={saveProduct} className="space-y-3.5">
            <div>
              <label className="block text-[13px] font-semibold text-[#162660] mb-1">Item name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Cotton Kurta Navy"
                className="zyro-field w-full h-11 rounded-[12px] border px-3 text-[14px] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#162660] mb-1">SKU</label>
                <input
                  type="text"
                  required
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border px-3 font-mono text-[14px] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#162660] mb-1">Barcode</label>
                <input
                  type="text"
                  value={formBarcode}
                  onChange={(e) => setFormBarcode(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border px-3 font-mono text-[14px] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#162660] mb-1">Category</label>
                <select
                  value={formCatId}
                  onChange={(e) => handleFormCategoryChange(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border bg-white px-3 text-[14px] focus:outline-none"
                >
                  {workspace.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#162660] mb-1">Variant / Size</label>
                <input
                  type="text"
                  value={formVariant}
                  onChange={(e) => setFormVariant(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border px-3 text-[14px] focus:outline-none"
                />
              </div>
            </div>
            {subcategoryAndOfferFields}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">Cost ({cur})</label>
                <input
                  type="number"
                  required
                  value={formCost}
                  onChange={(e) => setFormCost(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border px-3 tabular-num focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">Sale ({cur})</label>
                <input
                  type="number"
                  required
                  value={formSale}
                  onChange={(e) => setFormSale(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border px-3 tabular-num focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">Opening Qty</label>
                <input
                  type="number"
                  required
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border px-3 tabular-num focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">Low alert</label>
                <input
                  type="number"
                  required
                  value={formMin}
                  onChange={(e) => setFormMin(e.target.value)}
                  className="zyro-field w-full h-11 rounded-[12px] border px-3 tabular-num focus:outline-none"
                />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // =========================================================================
  // MAIN STOCK VIEW (Stock.jsx 100% Parity)
  // =========================================================================
  return (
    <div className="p-4 sm:p-6 lg:px-8 lg:py-6 max-w-[1360px] w-full mx-auto space-y-4 anim-zup">
      {/* Header matching Stock.jsx */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="num text-[13px] font-semibold text-[#5B6585]">
            {workspace.settings.branchName} · {counts.all} items · {counts.totalUnits.toLocaleString()} units
          </p>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#162660] tracking-[-0.02em] leading-tight mt-0.5">
            Stock
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openStockCountModal}
            className="zyro-bs h-12 px-3.5 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[14px] font-semibold inline-flex items-center gap-2"
          >
            <ClipboardCheck className="w-4 h-4" />
            Count
          </button>
          <button
            type="button"
            onClick={() => setCatModalOpen(true)}
            className="zyro-bs h-12 px-3.5 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[14px] font-semibold inline-flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            Categories
          </button>
          <button
            type="button"
            onClick={() => setAddStockMode(true)}
            className="zyro-bs h-12 px-3.5 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[14px] font-semibold inline-flex items-center gap-2"
          >
            <PackagePlus className="w-4 h-4" />
            Add stock
          </button>
          <button
            type="button"
            onClick={() => openNewItemModal()}
            className="zyro-bp h-12 px-4 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add item
          </button>
        </div>
      </header>

      {/* Segmented Status Tabs (#ECE4D8) + Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-[12px] bg-[#ECE4D8] gap-1 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'All', count: counts.all },
              { id: 'offer', label: 'On offer', count: counts.offer },
              { id: 'out', label: 'Sold out', count: counts.out },
              { id: 'low', label: 'Running low', count: counts.low },
              { id: 'in', label: 'In stock', count: counts.in },
            ] as { id: StockFilter; label: string; count: number }[]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setStatusTab(t.id)}
              className={`h-9 px-3.5 rounded-[10px] text-[13px] font-bold whitespace-nowrap transition-all inline-flex items-center gap-1.5 ${
                statusTab === t.id
                  ? 'bg-white text-[#162660] shadow-xs'
                  : 'text-[#5B6585] hover:text-[#162660]'
              }`}
            >
              <span>{t.label}</span>
              <span className="num text-[12px] opacity-75">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="zyro-field h-[44px] w-full md:w-[320px] rounded-[12px] bg-white border border-[#D9CFC0] px-3.5 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-[#5B6585] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, SKU, barcode, Men/Women/Kids..."
            className="flex-1 h-full bg-transparent text-[14px] focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => {
              setCatFilter('all');
              setSubcatFilter('all');
            }}
            className={`h-[38px] px-4 rounded-full text-[13px] font-bold whitespace-nowrap shrink-0 ${
              catFilter === 'all'
                ? 'bg-[#162660] text-white'
                : 'bg-white border border-[#E9E1D5] text-[#454F70] hover:bg-[#F8F2E9]'
            }`}
          >
            All categories
          </button>
          {workspace.categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCatFilter(cat.id);
                setSubcatFilter('all');
              }}
              className={`h-[38px] px-4 rounded-full text-[13px] font-bold whitespace-nowrap shrink-0 ${
                catFilter === cat.id
                  ? 'bg-[#162660] text-white'
                  : 'bg-white border border-[#E9E1D5] text-[#454F70] hover:bg-[#F8F2E9]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sub-category Pills (e.g. Men / Women / Kids for Footwear & Bags) */}
        {activeFilterCategory?.subcategories && activeFilterCategory.subcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[12px] font-bold text-[#5B6585] shrink-0">
              {activeFilterCategory.name}:
            </span>
            <button
              type="button"
              onClick={() => setSubcatFilter('all')}
              className={`h-[32px] px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 ${
                subcatFilter === 'all'
                  ? 'bg-[#D0E6FD] text-[#162660]'
                  : 'bg-white border border-[#E9E1D5] text-[#454F70] hover:bg-[#F8F2E9]'
              }`}
            >
              All
            </button>
            {activeFilterCategory.subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSubcatFilter(sub)}
                className={`h-[32px] px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 ${
                  subcatFilter === sub
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

      {/* Main White Table (rounded-[18px], #F8F2E9 42px header, horizontal stock health bar) */}
      <div className="bg-white border border-[#E9E1D5] rounded-[18px] overflow-hidden shadow-[0_2px_10px_rgba(12,20,50,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="h-[42px] bg-[#F8F2E9] border-b border-[#E9E1D5] text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                <th className="px-4">Item</th>
                <th className="px-4">Category</th>
                <th className="px-4 text-right">Price</th>
                <th className="px-4 w-[200px]">Stock health</th>
                <th className="px-4 text-right">Available</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0E7]">
              {filteredProducts.map((p) => {
                const out = p.stockQty === 0;
                const low = !out && p.stockQty <= p.minStock;
                const targetMax = Math.max(p.minStock * 4, 20);
                const pct = Math.min(100, Math.round((p.stockQty / targetMax) * 100));
                const barColor = out ? '#E36B5D' : low ? '#C99A06' : '#162660';

                return (
                  <tr
                    key={p.id}
                    onClick={() => setDrawerProductId(p.id)}
                    className="hover:bg-[#F8F2E9] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductArtThumb
                          product={p}
                          categoryName={catNameMap.get(p.categoryId)}
                          boxClass="w-11 h-11 rounded-[12px]"
                          svgSize={32}
                        />
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-[#162660] truncate">{p.name}</p>
                          <p className="text-[12px] text-[#5B6585] font-mono truncate">
                            {p.sku} · {p.variant}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-[#454F70]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span>{catNameMap.get(p.categoryId) || 'General'}</span>
                        {p.subcategory && (
                          <span className="px-2 py-0.5 rounded-full bg-[#EEF5FE] text-[#24398A] text-[11px] font-bold">
                            {p.subcategory}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isOfferActive(p.offer) ? (
                        <div>
                          <div className="inline-flex items-center gap-1 justify-end">
                            <span className="px-1.5 py-0.5 rounded bg-[#162660] text-[#D0E6FD] text-[10px] font-bold">
                              {formatOfferBadge(p.offer, cur)}
                            </span>
                            <span className="num text-[14px] font-bold text-[#162660]">
                              {formatMoney(getEffectiveUnitPrice(p), cur)}
                            </span>
                          </div>
                          <p className="num text-[11px] text-[#5B6585]">
                            {getEffectiveUnitPrice(p) < p.salePrice && (
                              <span className="line-through mr-1.5">{formatMoney(p.salePrice, cur)}</span>
                            )}
                            Cost {formatMoney(p.costPrice, cur)}
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="num text-[14px] font-bold text-[#162660]">
                            {formatMoney(p.salePrice, cur)}
                          </p>
                          <p className="num text-[11px] text-[#5B6585]">
                            Cost {formatMoney(p.costPrice, cur)}
                          </p>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2.5 w-full rounded-full bg-[#ECE4D8] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${out ? 6 : Math.max(pct, 10)}%`, backgroundColor: barColor }}
                        />
                      </div>
                      <p className="text-[11px] text-[#5B6585] mt-1">
                        Min level: {p.minStock} {p.unit}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold tabular-num ${
                          out
                            ? 'bg-[#FDF0EF] text-[#B42318]'
                            : low
                              ? 'bg-[#FFF3C4] text-[#6B4E00]'
                              : 'bg-[#E8F6EE] text-[#14532D]'
                        }`}
                      >
                        {out ? 'Sold out' : `${p.stockQty} ${p.unit}`}
                      </span>
                    </td>
                    <td className="pr-3 text-[#5B6585]">
                      <ChevronRight className="w-4 h-4" />
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[14px] text-[#5B6585]">
                    No items match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== SLIDE-OVER STOCK DETAIL DRAWER (Stock.jsx) ==================== */}
      <SlideDrawer
        open={Boolean(drawerProduct)}
        onClose={() => setDrawerProductId(null)}
        eyebrow={drawerProduct ? `${drawerProduct.sku} · Barcode ${drawerProduct.barcode}` : ''}
        title={drawerProduct?.name || ''}
        footer={
          drawerProduct ? (
            <div className="w-full flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={busyDrawer}
                onClick={() => handleDeleteProduct(drawerProduct)}
                className="h-10 px-3.5 rounded-[10px] bg-[#FDF0EF] text-[#B42318] text-[13px] font-bold inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                type="button"
                onClick={() => openEditItemModal(drawerProduct)}
                className="zyro-bs h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#162660] text-[13px] font-bold inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                Edit full item
              </button>
            </div>
          ) : undefined
        }
      >
        {drawerProduct && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-[16px] bg-[#F8F2E9]">
              <ProductArtThumb
                product={drawerProduct}
                categoryName={catNameMap.get(drawerProduct.categoryId)}
                boxClass="w-16 h-16 rounded-[14px]"
                svgSize={48}
              />
              <div>
                <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#5B6585]">
                  <span>{catNameMap.get(drawerProduct.categoryId)}</span>
                  {drawerProduct.subcategory && (
                    <span className="px-2 py-0.5 rounded-full bg-[#D0E6FD] text-[#162660] text-[11px] font-bold">
                      {drawerProduct.subcategory}
                    </span>
                  )}
                  <span>· {drawerProduct.variant}</span>
                </div>
                <p className="num text-[26px] font-bold text-[#162660] leading-tight">
                  {drawerProduct.stockQty} {drawerProduct.unit}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <p className="text-[12px] text-[#5B6585]">
                    Reorder alert at {drawerProduct.minStock} {drawerProduct.unit}
                  </p>
                  {isOfferActive(drawerProduct.offer) && (
                    <span className="px-2 py-0.5 rounded-full bg-[#162660] text-[#D0E6FD] text-[11px] font-bold">
                      {formatOfferBadge(drawerProduct.offer, cur)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stock Adjustment */}
            <div className="rounded-[16px] border border-[#E9E1D5] p-4 space-y-3">
              <h3 className="text-[15px] font-bold text-[#162660]">Change stock</h3>
              <div className="grid grid-cols-4 gap-2">
                {[-1, 1, 5, 10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    disabled={busyDrawer}
                    onClick={() => handleDrawerAdjust(d)}
                    className={`h-10 rounded-[10px] font-bold text-[14px] tabular-num ${
                      d < 0
                        ? 'bg-[#FDF0EF] text-[#B42318] hover:bg-[#F2C4BE]'
                        : 'bg-[#EEF5FE] text-[#162660] hover:bg-[#D0E6FD]'
                    }`}
                  >
                    {d > 0 ? `+${d}` : d}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={quickDelta}
                  onChange={(e) => setQuickDelta(e.target.value)}
                  placeholder="+/- qty"
                  className="zyro-field w-24 h-10 rounded-[10px] border px-3 font-bold tabular-num focus:outline-none"
                />
                <input
                  type="text"
                  value={quickReason}
                  onChange={(e) => setQuickReason(e.target.value)}
                  placeholder="Reason"
                  className="zyro-field flex-1 h-10 rounded-[10px] border px-3 text-[13px] focus:outline-none"
                />
                <button
                  type="button"
                  disabled={busyDrawer}
                  onClick={() => handleDrawerAdjust()}
                  className="zyro-bp h-10 px-3.5 rounded-[10px] bg-[#162660] text-white text-[13px] font-bold"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Quick Price Update (PATCH /api/products/:id/price) */}
            <div className="rounded-[16px] border border-[#E9E1D5] p-4 space-y-3">
              <h3 className="text-[15px] font-bold text-[#162660]">Update pricing</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">
                    Sale price ({cur})
                  </label>
                  <input
                    type="number"
                    value={quickSalePrice}
                    onChange={(e) => setQuickSalePrice(e.target.value)}
                    className="zyro-field w-full h-10 rounded-[10px] border px-3 font-bold tabular-num focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">
                    Cost price ({cur})
                  </label>
                  <input
                    type="number"
                    value={quickCostPrice}
                    onChange={(e) => setQuickCostPrice(e.target.value)}
                    className="zyro-field w-full h-10 rounded-[10px] border px-3 font-bold tabular-num focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={busyDrawer}
                onClick={handleDrawerPriceUpdate}
                className="zyro-bp w-full h-10 rounded-[10px] bg-[#162660] text-white text-[13px] font-bold inline-flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Save new price
              </button>
            </div>

            {/* Quick Product Offer Update (PATCH /api/products/:id/offer) */}
            <div className="rounded-[16px] border border-[#E9E1D5] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[#162660] inline-flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#2E46A0]" />
                  Product offer
                </h3>
                <label className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#162660] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={drawerOfferActive}
                    onChange={(e) => setDrawerOfferActive(e.target.checked)}
                    className="w-4 h-4 accent-[#162660]"
                  />
                  Active
                </label>
              </div>

              {drawerOfferActive && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'percent', label: '% Off' },
                        { id: 'fixed', label: `${cur} Off` },
                        { id: 'bogo', label: 'BOGO' },
                      ] as { id: OfferType; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDrawerOfferType(opt.id)}
                        className={`h-8 rounded-[8px] text-[12px] font-bold border ${
                          drawerOfferType === opt.id
                            ? 'bg-[#162660] text-white border-[#162660]'
                            : 'bg-[#F8F2E9] text-[#454F70] border-[#D9CFC0]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={1}
                      value={drawerOfferValue}
                      onChange={(e) => setDrawerOfferValue(e.target.value)}
                      placeholder="Value"
                      className="zyro-field h-9 rounded-[10px] border px-3 font-bold tabular-num focus:outline-none"
                    />
                    <input
                      type="text"
                      value={drawerOfferLabel}
                      onChange={(e) => setDrawerOfferLabel(e.target.value)}
                      placeholder="Badge (optional)"
                      className="zyro-field h-9 rounded-[10px] border px-3 text-[13px] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busyDrawer}
                  onClick={() => handleDrawerOfferSave(false)}
                  className="zyro-bp flex-1 h-9 rounded-[10px] bg-[#162660] text-white text-[13px] font-bold"
                >
                  Save offer
                </button>
                {isOfferActive(drawerProduct.offer) && (
                  <button
                    type="button"
                    disabled={busyDrawer}
                    onClick={() => handleDrawerOfferSave(true)}
                    className="h-9 px-3 rounded-[10px] bg-[#FDF0EF] text-[#B42318] text-[12px] font-bold"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Recent Stock Adjustments for this Product */}
            <div>
              <h3 className="text-[14px] font-bold text-[#162660] mb-2">Recent stock history</h3>
              <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px] overflow-hidden">
                {workspace.stockAdjustments
                  .filter((a) => a.productId === drawerProduct.id)
                  .slice(0, 5)
                  .map((a) => (
                    <div key={a.id} className="px-3.5 py-2.5 flex items-center justify-between gap-2 text-[13px]">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#162660] truncate">{a.reason}</p>
                        <p className="text-[11px] text-[#5B6585]">
                          {a.createdBy} · {formatDateTime(a.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`num font-bold shrink-0 ${
                          a.delta >= 0 ? 'text-[#14532D]' : 'text-[#B42318]'
                        }`}
                      >
                        {a.delta >= 0 ? `+${a.delta}` : a.delta} ({a.newQty})
                      </span>
                    </div>
                  ))}
                {workspace.stockAdjustments.filter((a) => a.productId === drawerProduct.id).length === 0 && (
                  <p className="p-4 text-[13px] text-[#5B6585] text-center">No adjustments logged yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </SlideDrawer>

      {/* ==================== ADD / EDIT PRODUCT MODAL ==================== */}
      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editingId ? 'Edit Item' : 'Add New Item'}
        subtitle="Saved directly to your live inventory catalog"
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditorOpen(false)}
              className="zyro-bs h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="main-product-form"
              disabled={savingProduct}
              className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
            >
              {savingProduct ? 'Saving...' : editingId ? 'Save Changes' : 'Add Item'}
            </button>
          </>
        }
      >
        <form id="main-product-form" onSubmit={saveProduct} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#162660] mb-1">Product name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Egyptian Cotton Kurta"
              className="zyro-field w-full h-11 rounded-[12px] border px-3 text-[14px] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#162660] mb-1">SKU</label>
              <input
                type="text"
                required
                value={formSku}
                onChange={(e) => setFormSku(e.target.value)}
                className="zyro-field w-full h-11 rounded-[12px] border px-3 font-mono text-[14px] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#162660] mb-1">Barcode</label>
              <input
                type="text"
                value={formBarcode}
                onChange={(e) => setFormBarcode(e.target.value)}
                className="zyro-field w-full h-11 rounded-[12px] border px-3 font-mono text-[14px] focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#162660] mb-1">Category</label>
              <select
                value={formCatId}
                onChange={(e) => handleFormCategoryChange(e.target.value)}
                className="zyro-field w-full h-11 rounded-[12px] border bg-white px-3 text-[14px] focus:outline-none"
              >
                {workspace.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#162660] mb-1">Variant / Size</label>
              <input
                type="text"
                value={formVariant}
                onChange={(e) => setFormVariant(e.target.value)}
                className="zyro-field w-full h-11 rounded-[12px] border px-3 text-[14px] focus:outline-none"
              />
            </div>
          </div>
          {subcategoryAndOfferFields}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">Cost ({cur})</label>
              <input
                type="number"
                required
                value={formCost}
                onChange={(e) => setFormCost(e.target.value)}
                className="zyro-field w-full h-11 rounded-[12px] border px-3 tabular-num focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">Sale ({cur})</label>
              <input
                type="number"
                required
                value={formSale}
                onChange={(e) => setFormSale(e.target.value)}
                className="zyro-field w-full h-11 rounded-[12px] border px-3 tabular-num focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">Stock Qty</label>
              <input
                type="number"
                required
                value={formQty}
                onChange={(e) => setFormQty(e.target.value)}
                className="zyro-field w-full h-11 rounded-[12px] border px-3 tabular-num focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#5B6585] mb-1">Min alert</label>
              <input
                type="number"
                required
                value={formMin}
                onChange={(e) => setFormMin(e.target.value)}
                className="zyro-field w-full h-11 rounded-[12px] border px-3 tabular-num focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#5B6585] mb-1.5">Product swatch</label>
            <div className="flex flex-wrap gap-2">
              {['#162660', '#2E46A0', '#7A5320', '#2F4A2E', '#4A3A5A', '#394154', '#B45348', '#1E2433'].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setFormSwatch(hex)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formSwatch === hex ? 'border-[#162660] scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* ==================== STOCK COUNT MODAL ==================== */}
      <Modal
        open={countOpen}
        onClose={() => setCountOpen(false)}
        title="Physical Stock Count"
        subtitle="Enter counted shelf quantities to reconcile inventory"
        maxWidth="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCountOpen(false)}
              className="zyro-bs h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={savingCount}
              onClick={submitStockCount}
              className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
            >
              {savingCount ? 'Reconciling...' : 'Post Stock Count'}
            </button>
          </>
        }
      >
        <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px] overflow-hidden">
          {workspace.products.map((p) => {
            const counted = Number(countMap[p.id] ?? p.stockQty);
            const diff = counted - p.stockQty;
            return (
              <div key={p.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[#162660] truncate">{p.name}</p>
                  <p className="text-[12px] text-[#5B6585]">
                    System: {p.stockQty} ·{' '}
                    <span className={diff === 0 ? '' : diff > 0 ? 'text-[#14532D] font-bold' : 'text-[#B42318] font-bold'}>
                      Diff {diff >= 0 ? `+${diff}` : diff}
                    </span>
                  </p>
                </div>
                <input
                  type="number"
                  min={0}
                  value={countMap[p.id] ?? String(p.stockQty)}
                  onChange={(e) => setCountMap((m) => ({ ...m, [p.id]: e.target.value }))}
                  className="zyro-field w-24 h-10 rounded-[10px] border px-3 text-right font-bold tabular-num focus:outline-none"
                />
              </div>
            );
          })}
        </div>
      </Modal>

      {/* ==================== CATEGORIES MODAL ==================== */}
      <Modal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title="Categories"
        subtitle="Organize your POS register pills and stock reports"
      >
        <div className="space-y-4">
          <form onSubmit={handleAddCategory} className="rounded-[14px] bg-[#F8F2E9] p-3.5 space-y-2.5">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New category name"
                className="zyro-field flex-1 h-10 rounded-[10px] border bg-white px-3 text-[14px] focus:outline-none"
              />
              <button
                type="submit"
                className="zyro-bp h-10 px-4 rounded-[10px] bg-[#162660] text-white text-[13px] font-bold"
              >
                Add
              </button>
            </div>
            <input
              type="text"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Short description (optional)"
              className="zyro-field w-full h-9 rounded-[10px] border bg-white px-3 text-[13px] focus:outline-none"
            />
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={newCatSubcats}
                onChange={(e) => setNewCatSubcats(e.target.value)}
                placeholder="Sub-categories (e.g. Men, Women, Kids)"
                className="zyro-field flex-1 min-w-[180px] h-9 rounded-[10px] border bg-white px-3 text-[13px] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setNewCatSubcats('Men, Women, Kids')}
                className="h-9 px-3 rounded-[10px] bg-[#EEF5FE] hover:bg-[#D0E6FD] text-[#162660] text-[12px] font-bold shrink-0"
              >
                + Men / Women / Kids
              </button>
            </div>
          </form>

          <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px] overflow-hidden">
            {workspace.categories.map((c) => (
              <div key={c.id} className="px-4 py-3 flex items-center justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="w-3.5 h-3.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: c.color }} />
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#162660] truncate">{c.name}</p>
                    {c.description && <p className="text-[12px] text-[#5B6585] truncate">{c.description}</p>}
                    {c.subcategories && c.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {c.subcategories.map((sub) => (
                          <span
                            key={sub}
                            className="px-2 py-0.5 rounded-full bg-[#EEF5FE] text-[#24398A] text-[11px] font-bold"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {(!c.subcategories || c.subcategories.length === 0) && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await api.updateCategory(c.id, { subcategories: ['Men', 'Women', 'Kids'] });
                          await onRefresh();
                          notify('ok', `Added Men / Women / Kids to ${c.name}`);
                        } catch (err) {
                          notify('err', err instanceof Error ? err.message : 'Update failed.');
                        }
                      }}
                      className="h-8 px-2.5 rounded-[8px] bg-[#F8F2E9] hover:bg-[#EEF5FE] text-[#2E46A0] text-[11px] font-bold"
                    >
                      + M/W/K
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await api.deleteCategory(c.id);
                        await onRefresh();
                        notify('ok', `Deleted ${c.name}`);
                      } catch (err) {
                        notify('err', err instanceof Error ? err.message : 'Delete failed.');
                      }
                    }}
                    className="w-8 h-8 rounded-[8px] hover:bg-[#FDF0EF] text-[#B42318] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
