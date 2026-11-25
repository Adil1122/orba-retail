import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  Home,
  KeyRound,
  LogOut,
  Menu,
  MoreHorizontal,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Truck,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import type { BusinessSettings, NavSection, StaffUser } from '../types/pos.ts';
import { ZyroLogo } from './BrandMark.tsx';

interface NavItem {
  id: NavSection;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'primary' | 'backoffice' | 'bottom';
  badge?: number;
}

export function AppShell({
  active,
  onNavigate,
  user,
  settings,
  onLogout,
  onSwitchCounter,
  onSwitchBranch,
  lowStockCount,
  heldBillsCount,
  children,
}: {
  active: NavSection;
  onNavigate: (section: NavSection) => void;
  user: StaffUser;
  settings: BusinessSettings;
  onLogout: () => void;
  onSwitchCounter?: () => void;
  onSwitchBranch?: (branchName: string) => void;
  lowStockCount: number;
  heldBillsCount: number;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', shortLabel: 'Home', icon: Home, group: 'primary' },
    { id: 'pos', label: 'Sell', shortLabel: 'Sell', icon: ShoppingBag, group: 'primary', badge: heldBillsCount || undefined },
    { id: 'orders', label: 'Bill book', shortLabel: 'Bills', icon: BookOpen, group: 'primary' },
    { id: 'customers', label: 'Khata', shortLabel: 'Khata', icon: Users, group: 'primary' },
    { id: 'stock', label: 'Stock', shortLabel: 'Stock', icon: Package, group: 'primary', badge: lowStockCount || undefined },
    { id: 'purchasing', label: 'Suppliers', shortLabel: 'Suppliers', icon: Truck, group: 'backoffice' },
    { id: 'expenses', label: 'Expenses', shortLabel: 'Expenses', icon: Receipt, group: 'backoffice' },
    { id: 'cash', label: 'Cash', shortLabel: 'Cash', icon: Wallet, group: 'backoffice' },
    { id: 'reports', label: 'Reports', shortLabel: 'Reports', icon: BarChart3, group: 'backoffice' },
    { id: 'settings', label: 'Settings', shortLabel: 'Settings', icon: Settings, group: 'bottom' },
  ];

  const primaryItems = navItems.filter((i) => i.group === 'primary');
  const backOfficeItems = navItems.filter((i) => i.group === 'backoffice');
  const settingsItem = navItems.find((i) => i.id === 'settings')!;

  const mobileTabs: NavSection[] = ['dashboard', 'pos', 'orders', 'stock'];

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // On Sell/POS register, desktop uses the compact 84px icon rail (matching Main.jsx!)
  const useCompactRailOnDesktop = active === 'pos';

  const handleSelect = (id: NavSection) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#F1E4D1] text-[#162660] flex flex-col md:flex-row">
      {/* ==================== DESKTOP FULL SIDEBAR (236px WHITE, App.jsx) ==================== */}
      {!useCompactRailOnDesktop && (
        <aside className="hidden xl:flex flex-col w-[236px] shrink-0 bg-white border-r border-[#E9E1D5] sticky top-0 h-screen z-30">
          {/* Brand + Branch Dropdown */}
          <div className="px-4 pt-4 pb-3 border-b border-[#F6F0E7] relative">
            <div className="flex items-center gap-3">
              <ZyroLogo size={38} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-[#162660] leading-tight truncate">
                  {settings.shopName}
                </p>
                <button
                  type="button"
                  onClick={() => setBranchMenuOpen((o) => !o)}
                  className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-[#5B6585] hover:text-[#162660] max-w-full"
                >
                  <span className="truncate">{settings.branchName}</span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>

            {branchMenuOpen && (
              <div className="anim-zup absolute left-3 right-3 top-[68px] z-40 rounded-[14px] bg-white border border-[#E9E1D5] shadow-[0_12px_32px_rgba(12,20,50,0.16)] p-1.5">
                {['Main Branch', 'DHA Branch', 'Gulberg Counter 2'].map((br) => (
                  <button
                    key={br}
                    type="button"
                    onClick={() => {
                      setBranchMenuOpen(false);
                      onSwitchBranch?.(br);
                    }}
                    className={`w-full px-3 py-2 rounded-[10px] text-left text-[13px] font-semibold flex items-center gap-2 ${
                      settings.branchName === br
                        ? 'bg-[#EEF5FE] text-[#162660]'
                        : 'text-[#454F70] hover:bg-[#F6F0E7]'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{br}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary & Back Office Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
            <div className="space-y-1">
              {primaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full h-[46px] px-2.5 rounded-[12px] flex items-center gap-3 text-[15px] transition-colors ${
                      isActive
                        ? 'bg-[#EEF5FE] hover:bg-[#D0E6FD] text-[#162660] font-bold'
                        : 'text-[#454F70] hover:bg-[#F6F0E7] hover:text-[#162660] font-medium'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-[#162660] text-white' : 'bg-[#F6F0E7] text-[#454F70]'
                      }`}
                    >
                      <Icon className="w-[17px] h-[17px]" />
                    </span>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={`min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center tabular-num ${
                          item.id === 'stock'
                            ? 'bg-[#FDF0EF] text-[#B42318]'
                            : 'bg-[#162660] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="space-y-1">
              <p className="px-3 pb-1 text-[13px] font-medium text-[#5B6585]">Back office</p>
              {backOfficeItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full h-[44px] px-2.5 rounded-[12px] flex items-center gap-3 text-[15px] transition-colors ${
                      isActive
                        ? 'bg-[#EEF5FE] hover:bg-[#D0E6FD] text-[#162660] font-bold'
                        : 'text-[#454F70] hover:bg-[#F6F0E7] hover:text-[#162660] font-medium'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-[#162660] text-white' : 'bg-[#F6F0E7] text-[#454F70]'
                      }`}
                    >
                      <Icon className="w-[17px] h-[17px]" />
                    </span>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Bottom Settings + User Profile Popover */}
          <div className="px-3 pt-2 pb-3 border-t border-[#E9E1D5] space-y-2 relative">
            <button
              type="button"
              aria-current={active === 'settings' ? 'page' : undefined}
              onClick={() => handleSelect('settings')}
              className={`w-full h-[44px] px-2.5 rounded-[12px] flex items-center gap-3 text-[15px] transition-colors ${
                active === 'settings'
                  ? 'bg-[#EEF5FE] hover:bg-[#D0E6FD] text-[#162660] font-bold'
                  : 'text-[#454F70] hover:bg-[#F6F0E7] hover:text-[#162660] font-medium'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  active === 'settings' ? 'bg-[#162660] text-white' : 'bg-[#F6F0E7] text-[#454F70]'
                }`}
              >
                <Settings className="w-[17px] h-[17px]" />
              </span>
              <span className="flex-1 text-left truncate">{settingsItem.label}</span>
            </button>

            <div className="pt-2 border-t border-[#F6F0E7] flex items-center gap-2.5 px-1">
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                style={{ backgroundColor: user.avatarBg, color: user.avatarFg }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-[#162660] truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-[12px] text-[#5B6585] capitalize truncate">{user.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-label="Account actions"
                className="w-8 h-8 rounded-full hover:bg-[#F6F0E7] text-[#5B6585] hover:text-[#162660] flex items-center justify-center shrink-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {userMenuOpen && (
              <div className="anim-zup absolute left-3 right-3 bottom-[62px] z-40 rounded-[14px] bg-white border border-[#E9E1D5] shadow-[0_14px_36px_rgba(12,20,50,0.2)] p-1.5 space-y-1">
                {onSwitchCounter && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSwitchCounter();
                    }}
                    className="w-full px-3 py-2.5 rounded-[10px] text-left text-[13px] font-semibold text-[#162660] hover:bg-[#F6F0E7] flex items-center gap-2"
                  >
                    <KeyRound className="w-4 h-4 text-[#2E46A0]" />
                    Switch counter (PIN)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2.5 rounded-[10px] text-left text-[13px] font-semibold text-[#B42318] hover:bg-[#FDF0EF] flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ==================== COMPACT 84px ICON RAIL (Tablet md..xl OR Desktop on Sell/POS) ==================== */}
      <aside
        className={`hidden md:flex ${
          useCompactRailOnDesktop ? '' : 'xl:hidden'
        } flex-col items-center w-[84px] shrink-0 bg-white border-r border-[#E9E1D5] sticky top-0 h-screen py-3 gap-1 z-30`}
      >
        <button
          type="button"
          onClick={() => handleSelect('dashboard')}
          className="mb-2"
          title={settings.shopName}
        >
          <ZyroLogo size={44} />
        </button>

        <nav className="flex-1 w-full flex flex-col items-center gap-1 overflow-y-auto no-scrollbar px-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleSelect(item.id)}
                className={`relative w-[72px] min-h-[54px] py-1.5 rounded-[12px] flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? 'bg-[#EEF5FE] text-[#162660] font-bold'
                    : 'text-[#454F70] hover:bg-[#F6F0E7] hover:text-[#162660] font-medium'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] leading-none truncate max-w-[66px]">
                  {item.shortLabel}
                </span>
                {item.badge ? (
                  <span
                    className={`absolute top-1 right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center tabular-num ${
                      item.id === 'stock' ? 'bg-[#B42318] text-white' : 'bg-[#162660] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="pt-2 border-t border-[#F6F0E7] flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={onSwitchCounter || onLogout}
            title={`${user.name} · Switch counter / Sign out`}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold border border-[#E9E1D5]"
            style={{ backgroundColor: user.avatarBg, color: user.avatarFg }}
          >
            {initials}
          </button>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Sign out"
            title="Sign out"
            className="w-9 h-8 rounded-[10px] text-[#5B6585] hover:bg-[#FDF0EF] hover:text-[#B42318] flex items-center justify-center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ==================== MOBILE TOP BAR (< 768px) ==================== */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-[#E9E1D5] px-4 h-[60px] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <ZyroLogo size={34} />
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[#162660] truncate leading-tight">
              {settings.shopName}
            </p>
            <p className="text-[12px] text-[#5B6585] truncate">{settings.branchName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="w-10 h-10 rounded-[12px] bg-[#F6F0E7] text-[#162660] flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* ==================== MAIN CONTENT STAGE ==================== */}
      <main className="flex-1 min-w-0 flex flex-col pb-[76px] md:pb-0">
        {children}
      </main>

      {/* ==================== MOBILE BOTTOM 5-TAB BAR ==================== */}
      <nav
        aria-label="Primary mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#E9E1D5] px-1.5 h-[66px] grid grid-cols-5 items-center shadow-[0_-4px_16px_rgba(12,20,50,0.06)]"
      >
        {mobileTabs.map((tabId) => {
          const item = navItems.find((n) => n.id === tabId)!;
          const Icon = item.icon;
          const isActive = active === tabId;
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => handleSelect(tabId)}
              className={`relative h-12 rounded-[12px] flex flex-col items-center justify-center gap-0.5 ${
                isActive ? 'text-[#162660] font-bold bg-[#EEF5FE]' : 'text-[#5B6585] font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] leading-none">{item.shortLabel}</span>
              {item.badge ? (
                <span className="absolute top-1 right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#B42318] text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`h-12 rounded-[12px] flex flex-col items-center justify-center gap-0.5 ${
            !mobileTabs.includes(active)
              ? 'text-[#162660] font-bold bg-[#EEF5FE]'
              : 'text-[#5B6585] font-medium'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[11px] leading-none">More</span>
        </button>
      </nav>

      {/* ==================== MOBILE MORE DRAWER ==================== */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-[#0F1B47]/45 backdrop-blur-[2px] flex justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
        >
          <div className="anim-zdrawer w-[84%] max-w-[320px] h-full bg-white flex flex-col shadow-2xl">
            <div className="px-4 py-4 border-b border-[#E9E1D5] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                  style={{ backgroundColor: user.avatarBg, color: user.avatarFg }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-[#162660] truncate">{user.name}</p>
                  <p className="text-[12px] text-[#5B6585] capitalize">{user.role} · {settings.branchName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-[#F6F0E7] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`w-full h-12 px-3 rounded-[12px] flex items-center gap-3 text-[15px] ${
                      isActive
                        ? 'bg-[#EEF5FE] text-[#162660] font-bold'
                        : 'text-[#454F70] hover:bg-[#F6F0E7] font-medium'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-[#162660] text-white' : 'bg-[#F6F0E7] text-[#454F70]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-[#E9E1D5] space-y-2">
              {onSwitchCounter && (
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onSwitchCounter();
                  }}
                  className="zyro-bs w-full h-11 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[14px] font-semibold flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  Switch counter (PIN)
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onLogout();
                }}
                className="w-full h-11 rounded-[12px] bg-[#FDF0EF] text-[#B42318] text-[14px] font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
