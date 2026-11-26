'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { SearchInput } from '@/components/ui/SearchInput';
import { InventoryCard } from '@/components/domain/InventoryCard';
import { ProductSearch } from '@/components/domain/ProductSearch';
import { ProductGrid } from '@/components/domain/ProductGrid';
import { Cart } from '@/components/domain/Cart';
import { PaymentPanel } from '@/components/domain/PaymentPanel';
import { StockTable } from '@/components/domain/StockTable';
import { CustomerSelector } from '@/components/domain/CustomerSelector';
import { MODULE_LIST } from '@/lib/routes';
import { ITEMS, CUSTOMERS, rs } from '@/lib/common';
import { usePosApp } from '@/context/PosAppContext';
import type { ModuleCategory, ProductItem, CustomerRecord } from '@/types/pos';

const CATEGORIES: Array<'All' | ModuleCategory> = [
  'All',
  'Application Shell & Dashboards',
  'Authentication & Onboarding',
  'POS, Sales & Checkout',
  'Stock & Inventory',
  'Business Management',
  'Settings & Integrations',
];

export default function ModulesDirectoryPage() {
  const { cart, addToCart, updateCartQty, removeFromCart, clearCart, showToast } = usePosApp();
  const [activeTab, setActiveTab] = useState<'modules' | 'components'>('modules');
  const [category, setCategory] = useState<'All' | ModuleCategory>('All');
  const [search, setSearch] = useState('');
  const [prodQuery, setProdQuery] = useState('');
  const [prodCat, setProdCat] = useState('All');
  const [selectedCust, setSelectedCust] = useState<string | undefined>(undefined);
  const [showPay, setShowPay] = useState(false);

  const filteredModules = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MODULE_LIST.filter((m) => {
      if (category !== 'All' && m.category !== category) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
  }, [category, search]);

  const sampleProducts: ProductItem[] = useMemo(() => {
    const raw = Array.isArray(ITEMS) ? ITEMS : [];
    return raw.slice(0, 12).map((it: any) => ({
      id: String(it.id),
      name: String(it.name || 'Item'),
      cat: String(it.cat || 'General'),
      price: Number(it.price || 0),
      sku: it.sku ? String(it.sku) : String(it.id),
      stock: Array.isArray(it.variants)
        ? it.variants.reduce((s: number, v: any) => s + Number(v.stock || 0), 0)
        : Number(it.stock ?? 12),
    }));
  }, []);

  const productCategories = useMemo(
    () => ['All', ...Array.from(new Set(sampleProducts.map((p) => p.cat)))],
    [sampleProducts]
  );

  const visibleProducts = useMemo(() => {
    const q = prodQuery.trim().toLowerCase();
    return sampleProducts.filter((p) => {
      if (prodCat !== 'All' && p.cat !== prodCat) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
    });
  }, [sampleProducts, prodQuery, prodCat]);

  const sampleCustomers: CustomerRecord[] = useMemo(() => {
    const raw = Array.isArray(CUSTOMERS) ? CUSTOMERS : [];
    return raw.map((c: any) => ({
      id: String(c.id),
      name: String(c.name || 'Customer'),
      phone: String(c.phone || ''),
      city: c.city ? String(c.city) : undefined,
      balance: Number(c.balance || 0),
    }));
  }, []);

  const cartTotal = cart.reduce((sum, l) => sum + l.price * l.qty - (l.disc || 0), 0);

  return (
    <AppShell
      title="ZYRO Retail POS — Modules & Components"
      subtitle="All 57 React modules + reusable UI & POS domain library"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/owner" className="no-underline">
            <Button variant="secondary" size="sm">
              Owner App
            </Button>
          </Link>
          <Link href="/sell" className="no-underline">
            <Button variant="primary" size="sm">
              Open Register
            </Button>
          </Link>
        </div>
      }
    >
      <PageContainer>
        <PageHeader
          eyebrow="ZYRO Retail POS New · Frontend Architecture"
          title="57 Converted Modules & Reusable Component Library"
          description="Browse every screen converted from the design specification or test the reusable layout, UI, and POS domain components live."
          actions={
            <Tabs
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as 'modules' | 'components')}
              tabs={[
                { id: 'modules', label: 'All 57 Modules', count: MODULE_LIST.length },
                { id: 'components', label: 'Component Sandbox', count: 10 },
              ]}
            />
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <InventoryCard label="Converted Modules" value={MODULE_LIST.length} badgeText="100% React TSX" badgeTone="ok" />
          <InventoryCard label="UI Primitives" value={16} subtitle="Buttons, Inputs, Tables, Modals" />
          <InventoryCard label="Domain Components" value={10} subtitle="ProductGrid, Cart, PaymentPanel" />
          <InventoryCard label="Responsive Range" value="360–1920px" badgeText="Mobile → 1080p" badgeTone="accent" />
        </div>

        {activeTab === 'modules' ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="w-full md:max-w-sm">
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch('')}
                  placeholder="Search by module name or screen title..."
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const active = cat === category;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={[
                        'h-9 px-3 rounded-full text-[13px] font-semibold border transition-colors',
                        active
                          ? 'bg-[#162660] border-[#162660] text-white'
                          : 'bg-white border-[#D9CFC0] text-[#162660] hover:bg-[#F8F2E9]',
                      ].join(' ')}
                    >
                      {cat === 'All' ? 'All (57)' : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredModules.map((mod) => (
                <Card key={mod.name} className="flex flex-col justify-between gap-3 tile">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[16px] font-bold text-[#162660]">{mod.name}</span>
                      <Badge tone="info">{mod.kind}</Badge>
                    </div>
                    <div className="text-[14px] text-[#454F70]">{mod.title}</div>
                    <div className="text-[12px] text-[#5B6585]">{mod.category}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F6F0E7]">
                    <span className="mono text-[12px] text-[#2E46A0] truncate">{mod.route}</span>
                    <Link href={`/modules/${mod.name}`} className="no-underline shrink-0">
                      <Button variant="secondary" size="sm">
                        Open
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
            <div className="xl:col-span-2 flex flex-col gap-5">
              <Card className="flex flex-col gap-4">
                <h2 className="m-0 text-[18px] font-bold text-[#162660]">
                  ProductSearch &amp; ProductGrid
                </h2>
                <ProductSearch
                  query={prodQuery}
                  onQueryChange={setProdQuery}
                  categories={productCategories}
                  activeCategory={prodCat}
                  onCategoryChange={setProdCat}
                />
                <ProductGrid
                  products={visibleProducts}
                  onSelect={(p) => {
                    addToCart({ key: p.id, id: p.id, name: p.name, price: p.price });
                    showToast(`Added ${p.name} (${rs(p.price)})`);
                  }}
                />
              </Card>

              <div className="flex flex-col gap-2">
                <h2 className="m-0 text-[18px] font-bold text-[#162660]">StockTable</h2>
                <StockTable
                  items={visibleProducts}
                  onSelect={(p) => showToast(`Selected ${p.name} · SKU ${p.sku}`)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {showPay ? (
                <PaymentPanel
                  total={cartTotal}
                  onCancel={() => setShowPay(false)}
                  onComplete={(method) => {
                    showToast(`Payment recorded via ${method} (${rs(cartTotal)})`);
                    clearCart();
                    setShowPay(false);
                  }}
                />
              ) : (
                <Cart
                  lines={cart}
                  onQtyChange={updateCartQty}
                  onRemove={removeFromCart}
                  onClear={clearCart}
                  onCheckout={() => setShowPay(true)}
                />
              )}

              <div className="flex flex-col gap-2">
                <h2 className="m-0 text-[18px] font-bold text-[#162660]">CustomerSelector</h2>
                <CustomerSelector
                  customers={sampleCustomers}
                  selectedId={selectedCust}
                  onSelect={(c) => {
                    setSelectedCust(c.id);
                    showToast(`Selected customer: ${c.name}`);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
