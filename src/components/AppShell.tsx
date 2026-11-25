import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ReceiptText,
  BookUser,
  Truck,
  Wallet,
  Banknote,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import type { BusinessSettings, NavSection, StaffUser } from '../types/pos.ts';
import { getInitials } from '../lib/format.ts';
import { ZyroLogo } from './BrandMark.tsx';

interface NavItemDef {
  id: NavSection;
  label: string;
  shortLabel: string;
  group: 'operations' | 'records' | 'manage';
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', group: 'operations', icon: LayoutDashboard },
  { id: 'pos', label: 'Sell Register', shortLabel: 'Sell', group: 'operations', icon: ShoppingBag },
  { id: 'stock', label: 'Stock & Products', shortLabel: 'Stock', group: 'operations', icon: Package },
  { id: 'orders', label: 'Orders & Returns', shortLabel: 'Orders', group: 'records', icon: ReceiptText },
  { id: 'customers', label: 'Customers & Khata', shortLabel: 'Khata', group: 'records', icon: BookUser },
  { id: 'purchasing', label: 'Purchasing', shortLabel: 'Purchase', group: 'records', icon: Truck },
  { id: 'expenses', label: 'Expenses', shortLabel: 'Expenses', group: 'manage', icon: Wallet },
  { id: 'cash', label: 'Cash & Shifts', shortLabel: 'Cash', group: 'manage', icon: Banknote },
  { id: 'reports', label: 'Reports', shortLabel: 'Reports', group: 'manage', icon: BarChart3 },
  { id: 'settings', label: 'Settings', shortLabel: 'Settings', group: 'manage', icon: Settings },
];

export function AppShell({
  active,
  onNavigate,
  user,
  settings,
  onLogout,
  lowStockCount,
  heldBillsCount,
  children,
}: {
  active: NavSection;
  onNavigate: (section: NavSection) => void;
  user: StaffUser;
  settings: BusinessSettings;
  onLogout: () => void;
  lowStockCount: number;
  heldBillsCount: number;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isCompactRail = active === 'pos';
  const activeItem = NAV_ITEMS.find((n) => n.id === active) || NAV_ITEMS[0];

  function handleNav(id: NavSection) {
    onNavigate(id);
    setDrawerOpen(false);
  }

  const renderNavButton = (item: NavItemDef, compact = false) => {
    const Icon = item.icon;
    const isActive = active === item.id;
    const badge =
      item.id === 'stock' && lowStockCount > 0
        ? lowStockCount
        : item.id === 'pos' && heldBillsCount > 0
          ? heldBillsCount
          : null;

    if (compact) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => handleNav(item.id)}
          aria-current={isActive ? 'page' : undefined}
          title={item.label}
          className={`relative w-[66px] py-2 rounded-[12px] flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive ? 'text-[#162660] font-bold' : 'text-[#454F70] hover:bg-[#F8F2E9] font-medium'
          }`}
        >
          <span
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isActive ? 'bg-[#162660] text-white' : 'bg-[#F6F0E7] text-[#454F70]'
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
          </span>
          <span className="text-[11px] leading-tight truncate max-w-[62px]">{item.shortLabel}</span>
          {badge !== null && (
            <span className="absolute top-1 right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B42318] text-white text-[10px] font-bold flex items-center justify-center tabular-num">
              {badge}
            </span>
          )}
        </button>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNav(item.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`w-full h-11 rounded-[12px] flex items-center gap-3 px-2.5 text-left transition-colors ${
          isActive
            ? 'bg-[#EEF5FE] text-[#162660] font-bold'
            : 'text-[#454F70] hover:bg-[#F8F2E9] font-medium'
        }`}
      >
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isActive ? 'bg-[#162660] text-white' : 'bg-[#F6F0E7] text-[#454F70]'
          }`}
        >
          <Icon className="w-[17px] h-[17px]" />
        </span>
        <span className="flex-1 min-w-0 text-[14px] truncate">{item.label}</span>
        {badge !== null && (
          <span
            className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center tabular-num ${
              item.id === 'stock'
                ? 'bg-[#FFF3C4] text-[#6B4E00]'
                : 'bg-[#D0E6FD] text-[#162660]'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F1E4D1] text-[#162660] flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar / Compact POS Rail */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#E9E1D5] h-screen sticky top-0 transition-all duration-200 ${
          isCompactRail ? 'w-[84px] items-center py-3 px-2' : 'w-[252px] py-4 px-3.5'
        }`}
      >
        {isCompactRail ? (
          <>
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              title="ZYRO Retail POS — Dashboard"
              className="mb-3"
            >
              <ZyroLogo size={44} />
            </button>
            <nav aria-label="Main navigation" className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center gap-1 w-full">
              {NAV_ITEMS.map((item) => renderNavButton(item, true))}
            </nav>
            <div className="pt-2 border-t border-[#F6F0E7] w-full flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={onLogout}
                title={`Sign out (${user.name})`}
                className="w-[66px] py-2 rounded-[12px] hover:bg-[#FDF0EF] text-[#454F70] hover:text-[#B42318] flex flex-col items-center gap-1 transition-colors"
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold"
                  style={{ background: user.avatarBg, color: user.avatarFg }}
                >
                  {getInitials(user.name)}
                </span>
                <span className="text-[11px] font-semibold">Sign out</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Brand + Shop Selector Header */}
            <div className="flex items-center gap-2.5 px-1.5 pb-4 mb-2 border-b border-[#F6F0E7]">
              <ZyroLogo size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-[#162660] truncate leading-tight">
                  {settings.shopName}
                </p>
                <p className="text-[12px] text-[#5B6585] truncate">
                  {settings.branchName} · ZYRO POS
                </p>
              </div>
            </div>

            <nav aria-label="Main navigation" className="flex-1 overflow-y-auto space-y-4 pr-0.5">
              <div>
                <p className="px-2.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5B6585]">
                  Counter & Stock
                </p>
                <div className="space-y-1">
                  {NAV_ITEMS.filter((i) => i.group === 'operations').map((item) => renderNavButton(item))}
                </div>
              </div>
              <div>
                <p className="px-2.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5B6585]">
                  Sales & Ledger
                </p>
                <div className="space-y-1">
                  {NAV_ITEMS.filter((i) => i.group === 'records').map((item) => renderNavButton(item))}
                </div>
              </div>
              <div>
                <p className="px-2.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5B6585]">
                  Finance & Shop
                </p>
                <div className="space-y-1">
                  {NAV_ITEMS.filter((i) => i.group === 'manage').map((item) => renderNavButton(item))}
                </div>
              </div>
            </nav>

            {/* User Profile & Sign Out */}
            <div className="pt-3 mt-2 border-t border-[#F6F0E7] flex items-center gap-2.5 px-1.5">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                style={{ background: user.avatarBg, color: user.avatarFg }}
              >
                {getInitials(user.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-[#162660] truncate">{user.name}</p>
                <p className="text-[12px] text-[#5B6585] capitalize">{user.role}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Sign out"
                aria-label="Sign out"
                className="w-9 h-9 rounded-[10px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Mobile & Tablet Top Bar */}
      <header className="lg:hidden sticky top-0 z-30 h-14 bg-white border-b border-[#E9E1D5] px-3 sm:px-5 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="w-10 h-10 rounded-[12px] bg-[#F6F0E7] hover:bg-[#ECE4D8] text-[#162660] flex items-center justify-center shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <ZyroLogo size={30} />
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[#162660] truncate leading-tight">
              {activeItem.label}
            </p>
            <p className="text-[11px] text-[#5B6585] truncate">{settings.shopName}</p>
          </div>
        </div>
        {active !== 'pos' && (
          <button
            type="button"
            onClick={() => handleNav('pos')}
            className="h-9 px-3 rounded-[10px] bg-[#162660] text-white text-[13px] font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sell</span>
          </button>
        )}
      </header>

      {/* Mobile / Tablet Slide-Over Drawer */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-[#0F1B47]/45 backdrop-blur-[2px] flex"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
        >
          <div className="w-[290px] max-w-[85vw] h-full bg-white shadow-[0_24px_64px_rgba(12,20,50,0.3)] flex flex-col p-4">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#F6F0E7]">
              <div className="flex items-center gap-2.5 min-w-0">
                <ZyroLogo size={38} />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-[#162660] truncate">{settings.shopName}</p>
                  <p className="text-[12px] text-[#5B6585] truncate">ZYRO Retail POS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="w-10 h-10 rounded-full bg-[#F6F0E7] text-[#454F70] flex items-center justify-center shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {NAV_ITEMS.map((item) => renderNavButton(item))}
            </nav>
            <div className="pt-3 border-t border-[#F6F0E7] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={{ background: user.avatarBg, color: user.avatarFg }}
                >
                  {getInitials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[#162660] truncate">{user.name}</p>
                  <p className="text-[12px] text-[#5B6585] capitalize">{user.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="h-9 px-3 rounded-[10px] bg-[#FDF0EF] text-[#B42318] text-[13px] font-semibold flex items-center gap-1.5 shrink-0"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col pb-[72px] lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar (5 quick touch targets >= 44px) */}
      <nav
        aria-label="Mobile quick navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-[66px] bg-white border-t border-[#E9E1D5] grid grid-cols-5 px-1 shadow-[0_-4px_16px_rgba(22,30,60,0.06)]"
      >
        {[
          { id: 'dashboard' as NavSection, label: 'Home', icon: LayoutDashboard },
          { id: 'pos' as NavSection, label: 'Sell', icon: ShoppingBag },
          { id: 'stock' as NavSection, label: 'Stock', icon: Package },
          { id: 'orders' as NavSection, label: 'Orders', icon: ReceiptText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleNav(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 ${
                isAct ? 'text-[#162660] font-bold' : 'text-[#5B6585] font-medium'
              }`}
            >
              <span
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isAct ? 'bg-[#D0E6FD] text-[#162660]' : ''
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 text-[#5B6585] font-medium"
        >
          <span className="w-10 h-7 rounded-full flex items-center justify-center">
            <ChevronRight className="w-[18px] h-[18px]" />
          </span>
          <span className="text-[11px]">More</span>
        </button>
      </nav>
    </div>
  );
}
