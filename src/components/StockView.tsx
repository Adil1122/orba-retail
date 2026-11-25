import React, { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  Edit3,
  Trash2,
  SlidersHorizontal,
  ClipboardCheck,
  FolderKanban,
} from 'lucide-react';
import type { Category, Product, WorkspacePayload } from '../types/pos.ts';
import { api } from '../lib/api.ts';
import { formatDateTime, formatMoney, formatNumber } from '../lib/format.ts';
import { Modal } from './BrandMark.tsx';

const SWATCHES = ['#162660', '#2E46A0', '#4A78B8', '#7A5320', '#2F4A2E', '#4A3A5A', '#394154', '#B45348', '#B0895A'];

export function StockView({
  workspace,
  onRefresh,
  notify,
}: {
  workspace: WorkspacePayload;
  onRefresh: () => Promise<void>;
  notify: (type: 'ok' | 'err', msg: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const [tab, setTab] = useState<'products' | 'categories' | 'count' | 'history'>('products');
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [lowOnly, setLowOnly] = useState(false);

  // Product modal
  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pBarcode, setPBarcode] = useState('');
  const [pCat, setPCat] = useState('');
  const [pVariant, setPVariant] = useState('');
  const [pUnit, setPUnit] = useState('pcs');
  const [pCost, setPCost] = useState('');
  const [pSale, setPSale] = useState('');
  const [pStock, setPStock] = useState('');
  const [pMin, setPMin] = useState('5');
  const [pSwatch, setPSwatch] = useState('#162660');

  // Adjust modal
  const [adjustProd, setAdjustProd] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState('0');
  const [adjustReason, setAdjustReason] = useState('Restock delivery');

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [cName, setCName] = useState('');
  const [cColor, setCColor] = useState('#162660');
  const [cDesc, setCDesc] = useState('');

  // Stock count state
  const [countDraft, setCountDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const totalSkus = workspace.products.length;
    const totalUnits = workspace.products.reduce((s, p) => s + p.stockQty, 0);
    const costValue = workspace.products.reduce((s, p) => s + p.stockQty * p.costPrice, 0);
    const retailValue = workspace.products.reduce((s, p) => s + p.stockQty * p.salePrice, 0);
    const lowCount = workspace.products.filter((p) => p.stockQty <= p.minStock).length;
    return { totalSkus, totalUnits, costValue, retailValue, lowCount };
  }, [workspace.products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workspace.products.filter((p) => {
      if (catFilter !== 'all' && p.categoryId !== catFilter) return false;
      if (lowOnly && p.stockQty > p.minStock) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q)
      );
    });
  }, [workspace.products, query, catFilter, lowOnly]);

  function openAddProduct() {
    setEditingProd(null);
    setPName('');
    setPSku(`ZYR-${100 + workspace.products.length + 1}`);
    setPBarcode('');
    setPCat(workspace.categories[0]?.id || '');
    setPVariant('Standard');
    setPUnit('pcs');
    setPCost('');
    setPSale('');
    setPStock('10');
    setPMin('5');
    setPSwatch('#162660');
    setProdModalOpen(true);
  }

  function openEditProduct(p: Product) {
    setEditingProd(p);
    setPName(p.name);
    setPSku(p.sku);
    setPBarcode(p.barcode);
    setPCat(p.categoryId);
    setPVariant(p.variant);
    setPUnit(p.unit);
    setPCost(String(p.costPrice));
    setPSale(String(p.salePrice));
    setPStock(String(p.stockQty));
    setPMin(String(p.minStock));
    setPSwatch(p.swatch);
    setProdModalOpen(true);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: pName,
        sku: pSku,
        barcode: pBarcode,
        categoryId: pCat,
        variant: pVariant,
        unit: pUnit,
        costPrice: Number(pCost) || 0,
        salePrice: Number(pSale) || 0,
        stockQty: Number(pStock) || 0,
        minStock: Number(pMin) || 5,
        swatch: pSwatch,
      };
      if (editingProd) {
        await api.updateProduct(editingProd.id, payload);
        notify('ok', 'Product updated.');
      } else {
        await api.createProduct(payload);
        notify('ok', 'Product added to inventory.');
      }
      setProdModalOpen(false);
      await onRefresh();
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not save product.');
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(p: Product) {
    try {
      await api.deleteProduct(p.id);
      await onRefresh();
      notify('ok', `Removed ${p.name}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to remove product.');
    }
  }

  async function submitAdjustment(e: React.FormEvent) {
    e.preventDefault();
    if (!adjustProd) return;
    const delta = Number(adjustDelta);
    if (!delta) {
      notify('err', 'Enter a positive or negative quantity delta.');
      return;
    }
    setSaving(true);
    try {
      await api.adjustProductStock(adjustProd.id, delta, adjustReason);
      setAdjustProd(null);
      await onRefresh();
      notify('ok', `Stock adjusted for ${adjustProd.name}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Adjustment failed.');
    } finally {
      setSaving(false);
    }
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, { name: cName, color: cColor, description: cDesc });
        notify('ok', 'Category updated.');
      } else {
        await api.createCategory({ name: cName, color: cColor, description: cDesc });
        notify('ok', 'Category created.');
      }
      setCatModalOpen(false);
      await onRefresh();
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not save category.');
    } finally {
      setSaving(false);
    }
  }

  async function applyStockCount() {
    const counts = Object.entries(countDraft)
      .filter(([, val]) => val !== '' && Number.isFinite(Number(val)))
      .map(([productId, val]) => ({ productId, countedQty: Math.max(0, Number(val)) }));
    if (counts.length === 0) {
      notify('err', 'Enter physical counts for at least one product.');
      return;
    }
    setSaving(true);
    try {
      await api.submitStockCount(counts);
      setCountDraft({});
      await onRefresh();
      notify('ok', 'Stock count reconciled and inventory updated.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Stock count submission failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#5B6585]">
            {workspace.settings.branchName} · Inventory Management
          </p>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#162660] leading-tight">
            Stock & Products
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingCat(null);
              setCName('');
              setCColor('#162660');
              setCDesc('');
              setCatModalOpen(true);
            }}
            className="h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white hover:bg-[#F8F2E9] text-[#162660] text-[14px] font-semibold inline-flex items-center gap-2"
          >
            <FolderKanban className="w-4 h-4" />
            <span>New Category</span>
          </button>
          <button
            type="button"
            onClick={openAddProduct}
            className="h-11 px-4 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[14px] font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E9E1D5] rounded-[16px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Total SKUs</p>
          <p className="text-[22px] font-bold text-[#162660] tabular-num mt-1">
            {formatNumber(stats.totalSkus)}
          </p>
          <p className="text-[12px] text-[#5B6585] tabular-num">{formatNumber(stats.totalUnits)} units on hand</p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[16px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Stock Cost Value</p>
          <p className="text-[22px] font-bold text-[#162660] tabular-num mt-1">
            {formatMoney(stats.costValue, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">At purchase cost</p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[16px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Retail Valuation</p>
          <p className="text-[22px] font-bold text-[#14532D] tabular-num mt-1">
            {formatMoney(stats.retailValue, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">Expected sale value</p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[16px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Low / Out of Stock</p>
          <p className="text-[22px] font-bold text-[#6B4E00] tabular-num mt-1">{stats.lowCount}</p>
          <p className="text-[12px] text-[#5B6585]">Need restock attention</p>
        </div>
      </div>

      {/* Tab Track */}
      <div className="inline-flex gap-1 p-1 rounded-[12px] bg-[#ECE4D8] max-w-full overflow-x-auto">
        {[
          { id: 'products' as const, label: 'Products' },
          { id: 'categories' as const, label: `Categories (${workspace.categories.length})` },
          { id: 'count' as const, label: 'Stock Count' },
          { id: 'history' as const, label: 'Adjustments' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`h-9 px-4 rounded-[9px] text-[13px] font-semibold whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-white text-[#162660] shadow-[0_1px_2px_rgba(22,30,60,0.08)]'
                : 'text-[#454F70] hover:text-[#162660]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCTS */}
      {tab === 'products' && (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
          <div className="p-4 border-b border-[#F6F0E7] flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] h-11 flex items-center gap-2 px-3 rounded-[12px] border border-[#D9CFC0] bg-[#F8F2E9]/40">
              <Search className="w-4 h-4 text-[#5B6585]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, SKU, barcode, variant..."
                className="flex-1 bg-transparent border-0 outline-none text-[14px]"
              />
            </div>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
            >
              <option value="all">All Categories</option>
              {workspace.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setLowOnly((v) => !v)}
              className={`h-11 px-3.5 rounded-[12px] border text-[13px] font-semibold inline-flex items-center gap-1.5 ${
                lowOnly
                  ? 'bg-[#FFF3C4] border-[#EBD892] text-[#6B4E00]'
                  : 'bg-white border-[#D9CFC0] text-[#454F70]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Low Stock Only
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-[#F6F0E7] bg-[#F8F2E9]/70 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Cost</th>
                  <th className="py-3 px-3 text-right">Sale Price</th>
                  <th className="py-3 px-3 text-right">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
                {filteredProducts.map((p) => {
                  const cat = workspace.categories.find((c) => c.id === p.categoryId);
                  const isOut = p.stockQty <= 0;
                  const isLow = !isOut && p.stockQty <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-[#F8F2E9]/60">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-9 h-9 rounded-[10px] shrink-0 text-white text-[12px] font-bold flex items-center justify-center"
                            style={{ background: p.swatch }}
                          >
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-[#162660]">{p.name}</p>
                            <p className="text-[12px] text-[#5B6585] tabular-num">
                              {p.sku} · {p.variant}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#454F70]">{cat?.name || 'Uncategorized'}</td>
                      <td className="py-3 px-3 text-right text-[#5B6585] tabular-num">
                        {formatMoney(p.costPrice, cur)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#162660] tabular-num">
                        {formatMoney(p.salePrice, cur)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold tabular-num ${
                            isOut
                              ? 'bg-[#FDF0EF] text-[#B42318]'
                              : isLow
                                ? 'bg-[#FFF3C4] text-[#6B4E00]'
                                : 'bg-[#E8F6EE] text-[#14532D]'
                          }`}
                        >
                          {p.stockQty} {p.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustProd(p);
                              setAdjustDelta('5');
                              setAdjustReason('Restock delivery');
                            }}
                            title="Adjust stock"
                            className="h-8 px-2.5 rounded-[8px] bg-[#EEF5FE] hover:bg-[#D0E6FD] text-[#2E46A0] text-[12px] font-bold inline-flex items-center gap-1"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            Adjust
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditProduct(p)}
                            aria-label={`Edit ${p.name}`}
                            className="w-8 h-8 rounded-[8px] hover:bg-[#F6F0E7] text-[#454F70] flex items-center justify-center"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProduct(p)}
                            aria-label={`Delete ${p.name}`}
                            className="w-8 h-8 rounded-[8px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {tab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {workspace.categories.map((cat) => {
            const count = workspace.products.filter((p) => p.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-white border border-[#E9E1D5] rounded-[18px] p-4 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className="w-10 h-10 rounded-[12px] shrink-0 flex items-center justify-center text-white"
                    style={{ background: cat.color }}
                  >
                    <Package className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-bold text-[#162660] truncate">{cat.name}</h3>
                    <p className="text-[13px] text-[#5B6585] mt-0.5 line-clamp-2">
                      {cat.description || 'Retail category'}
                    </p>
                    <p className="text-[12px] font-semibold text-[#2E46A0] mt-2 tabular-num">
                      {count} {count === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCat(cat);
                      setCName(cat.name);
                      setCColor(cat.color);
                      setCDesc(cat.description || '');
                      setCatModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-[8px] hover:bg-[#F6F0E7] text-[#454F70] flex items-center justify-center"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await api.deleteCategory(cat.id);
                      await onRefresh();
                      notify('ok', 'Category deleted.');
                    }}
                    className="w-8 h-8 rounded-[8px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: PHYSICAL STOCK COUNT */}
      {tab === 'count' && (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F6F0E7] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-bold text-[#162660]">Physical Stock Count</h2>
              <p className="text-[13px] text-[#5B6585]">
                Enter counted shelf quantities to reconcile variances automatically
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={applyStockCount}
              className="h-10 px-4 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[13px] font-bold inline-flex items-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" />
              Apply Count Adjustments
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#F6F0E7] bg-[#F8F2E9]/70 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3 text-right">System Qty</th>
                  <th className="py-3 px-3 text-right">Counted Qty</th>
                  <th className="py-3 px-4 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
                {workspace.products.map((p) => {
                  const raw = countDraft[p.id] ?? '';
                  const hasVal = raw !== '' && Number.isFinite(Number(raw));
                  const variance = hasVal ? Math.round(Number(raw)) - p.stockQty : 0;
                  return (
                    <tr key={p.id}>
                      <td className="py-2.5 px-4">
                        <p className="font-semibold text-[#162660]">{p.name}</p>
                        <p className="text-[12px] text-[#5B6585]">{p.sku}</p>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold tabular-num">{p.stockQty}</td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          min={0}
                          placeholder={String(p.stockQty)}
                          value={raw}
                          onChange={(e) =>
                            setCountDraft((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          className="w-24 h-9 px-2.5 text-right rounded-[9px] border border-[#D9CFC0] font-bold tabular-num"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold tabular-num">
                        {!hasVal ? (
                          <span className="text-[#5B6585]">—</span>
                        ) : variance === 0 ? (
                          <span className="text-[#14532D]">0</span>
                        ) : (
                          <span className={variance > 0 ? 'text-[#2E46A0]' : 'text-[#B42318]'}>
                            {variance > 0 ? `+${variance}` : variance}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ADJUSTMENT HISTORY */}
      {tab === 'history' && (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#F6F0E7] bg-[#F8F2E9]/70 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3 text-right">Change</th>
                  <th className="py-3 px-3 text-right">New Qty</th>
                  <th className="py-3 px-3">Reason</th>
                  <th className="py-3 px-4">By / Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
                {workspace.stockAdjustments.map((adj) => (
                  <tr key={adj.id}>
                    <td className="py-3 px-4 font-semibold text-[#162660]">{adj.productName}</td>
                    <td className="py-3 px-3 text-right font-bold tabular-num">
                      <span className={adj.delta >= 0 ? 'text-[#14532D]' : 'text-[#B42318]'}>
                        {adj.delta >= 0 ? `+${adj.delta}` : adj.delta}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-num">{adj.newQty}</td>
                    <td className="py-3 px-3 text-[#454F70]">{adj.reason}</td>
                    <td className="py-3 px-4 text-[#5B6585] text-[13px]">
                      {adj.createdBy} · {formatDateTime(adj.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        open={prodModalOpen}
        onClose={() => setProdModalOpen(false)}
        title={editingProd ? 'Edit Product' : 'Add New Product'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={saveProduct} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Product Name</label>
            <input
              required
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              placeholder="e.g. Egyptian Cotton Kurta"
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">SKU</label>
              <input
                required
                value={pSku}
                onChange={(e) => setPSku(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px] uppercase"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Barcode</label>
              <input
                value={pBarcode}
                onChange={(e) => setPBarcode(e.target.value)}
                placeholder="Auto if empty"
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px] tabular-num"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Category</label>
              <select
                value={pCat}
                onChange={(e) => setPCat(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px]"
              >
                {workspace.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Variant / Size</label>
              <input
                value={pVariant}
                onChange={(e) => setPVariant(e.target.value)}
                placeholder="Navy · L"
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                Cost Price ({cur})
              </label>
              <input
                type="number"
                min={0}
                required
                value={pCost}
                onChange={(e) => setPCost(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px] font-bold tabular-num"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                Sale Price ({cur})
              </label>
              <input
                type="number"
                min={0}
                required
                value={pSale}
                onChange={(e) => setPSale(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px] font-bold tabular-num"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Stock Qty</label>
              <input
                type="number"
                min={0}
                required
                value={pStock}
                onChange={(e) => setPStock(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px] font-bold tabular-num"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Min Alert</label>
              <input
                type="number"
                min={0}
                value={pMin}
                onChange={(e) => setPMin(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px] tabular-num"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Unit</label>
              <input
                value={pUnit}
                onChange={(e) => setPUnit(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">Tile Swatch</label>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((sw) => (
                <button
                  key={sw}
                  type="button"
                  onClick={() => setPSwatch(sw)}
                  className={`w-8 h-8 rounded-[9px] ${pSwatch === sw ? 'ring-2 ring-offset-2 ring-[#162660]' : ''}`}
                  style={{ background: sw }}
                />
              ))}
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setProdModalOpen(false)}
              className="h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
            >
              {saving ? 'Saving...' : editingProd ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal
        open={Boolean(adjustProd)}
        onClose={() => setAdjustProd(null)}
        title={`Adjust Stock · ${adjustProd?.name || ''}`}
        subtitle={`Current quantity: ${adjustProd?.stockQty ?? 0} ${adjustProd?.unit || ''}`}
        maxWidth="max-w-sm"
      >
        <form onSubmit={submitAdjustment} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
              Quantity Change (+ to add, - to deduct)
            </label>
            <input
              type="number"
              required
              value={adjustDelta}
              onChange={(e) => setAdjustDelta(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[16px] font-bold tabular-num"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Reason</label>
            <input
              required
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="e.g. Damaged piece, New shipment"
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdjustProd(null)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Update Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title={editingCat ? 'Edit Category' : 'New Category'}
        maxWidth="max-w-sm"
      >
        <form onSubmit={saveCategory} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Category Name</label>
            <input
              required
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              placeholder="e.g. Winter Collection"
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Description</label>
            <input
              value={cDesc}
              onChange={(e) => setCDesc(e.target.value)}
              placeholder="Short summary"
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((sw) => (
                <button
                  key={sw}
                  type="button"
                  onClick={() => setCColor(sw)}
                  className={`w-8 h-8 rounded-[9px] ${cColor === sw ? 'ring-2 ring-offset-2 ring-[#162660]' : ''}`}
                  style={{ background: sw }}
                />
              ))}
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCatModalOpen(false)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
