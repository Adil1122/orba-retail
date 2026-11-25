import React, { useCallback, useEffect, useState } from 'react';
import { api, getStoredToken, setStoredToken } from './lib/api.ts';
import type { NavSection, Sale, StaffUser, WorkspacePayload } from './types/pos.ts';
import { AuthView, type AuthScreenMode } from './components/AuthView.tsx';
import { AppShell } from './components/AppShell.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { PosRegisterView } from './components/PosRegisterView.tsx';
import { StockView } from './components/StockView.tsx';
import { OrdersView } from './components/OrdersView.tsx';
import { CustomersView } from './components/CustomersView.tsx';
import { PurchasingView } from './components/PurchasingView.tsx';
import { ExpensesView } from './components/ExpensesView.tsx';
import { CashView } from './components/CashView.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { Receipt80Modal, ToastBanner, ZyroLogo } from './components/BrandMark.tsx';

type ParsedRoute =
  | { kind: 'auth'; mode: AuthScreenMode }
  | {
      kind: 'section';
      section: NavSection;
      roleHint?: 'owner' | 'cashier' | 'stock';
      stockSubMode?: 'addstock';
    };

const SECTION_TO_PATH: Record<NavSection, string> = {
  dashboard: '/owner',
  pos: '/cashier',
  stock: '/stock',
  orders: '/orders',
  customers: '/customers',
  purchasing: '/purchasing',
  expenses: '/expenses',
  cash: '/cash',
  reports: '/reports',
  settings: '/settings',
};

const AUTH_MODE_TO_PATH: Record<AuthScreenMode, string> = {
  welcome: '/',
  login: '/login',
  register: '/register',
  join: '/join',
  signin: '/signin',
};

function parsePathname(rawPath: string): ParsedRoute {
  const clean = rawPath.replace(/\/+$/, '').toLowerCase() || '/';
  switch (clean) {
    case '/':
    case '/welcome':
      return { kind: 'auth', mode: 'welcome' };
    case '/login':
      return { kind: 'auth', mode: 'login' };
    case '/register':
    case '/signup':
      return { kind: 'auth', mode: 'register' };
    case '/join':
      return { kind: 'auth', mode: 'join' };
    case '/signin':
    case '/counter':
      return { kind: 'auth', mode: 'signin' };
    case '/owner':
    case '/dashboard':
      return { kind: 'section', section: 'dashboard', roleHint: 'owner' };
    case '/cashier':
    case '/pos':
    case '/sell':
      return { kind: 'section', section: 'pos', roleHint: 'cashier' };
    case '/stock':
    case '/inventory':
    case '/products':
      return { kind: 'section', section: 'stock', roleHint: 'stock' };
    case '/addstock':
      return { kind: 'section', section: 'stock', roleHint: 'stock', stockSubMode: 'addstock' };
    case '/orders':
    case '/bills':
    case '/returns':
      return { kind: 'section', section: 'orders' };
    case '/customers':
    case '/khata':
      return { kind: 'section', section: 'customers' };
    case '/purchasing':
    case '/suppliers':
      return { kind: 'section', section: 'purchasing' };
    case '/expenses':
      return { kind: 'section', section: 'expenses' };
    case '/cash':
    case '/shifts':
      return { kind: 'section', section: 'cash' };
    case '/reports':
      return { kind: 'section', section: 'reports' };
    case '/settings':
      return { kind: 'section', section: 'settings' };
    default:
      return { kind: 'section', section: 'dashboard' };
  }
}

function defaultSectionForRole(role: StaffUser['role']): NavSection {
  if (role === 'cashier') return 'pos';
  if (role === 'stock') return 'stock';
  return 'dashboard';
}

export default function App() {
  const initialRoute = parsePathname(window.location.pathname);

  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<StaffUser | null>(null);
  const [workspace, setWorkspace] = useState<WorkspacePayload | null>(null);
  const [active, setActive] = useState<NavSection>(
    initialRoute.kind === 'section' ? initialRoute.section : 'dashboard'
  );
  const [stockInitialAddMode, setStockInitialAddMode] = useState<boolean>(
    initialRoute.kind === 'section' && initialRoute.stockSubMode === 'addstock'
  );
  const [pendingSection, setPendingSection] = useState<NavSection | null>(
    initialRoute.kind === 'section' ? initialRoute.section : null
  );
  const [authMode, setAuthMode] = useState<AuthScreenMode>(
    initialRoute.kind === 'auth' ? initialRoute.mode : 'login'
  );
  const [authEmailHint, setAuthEmailHint] = useState<string>(() => {
    if (initialRoute.kind === 'section' && initialRoute.roleHint === 'cashier') {
      return 'cashier@zyropos.app';
    }
    if (initialRoute.kind === 'section' && initialRoute.roleHint === 'stock') {
      return 'stock@zyropos.app';
    }
    return 'owner@zyropos.app';
  });
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; message: string } | null>(null);

  const notify = useCallback((type: 'ok' | 'err', message: string) => {
    setToast({ type, message });
    window.setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3600);
  }, []);

  const refreshWorkspace = useCallback(async () => {
    const ws = await api.getWorkspace();
    setWorkspace(ws);
  }, []);

  const navigateToSection = useCallback((section: NavSection, replace = false) => {
    setActive(section);
    if (section !== 'stock') setStockInitialAddMode(false);
    const targetPath = SECTION_TO_PATH[section];
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({}, '', targetPath);
      } else {
        window.history.pushState({}, '', targetPath);
      }
    }
  }, []);

  const openAddStock = useCallback(() => {
    setStockInitialAddMode(true);
    setActive('stock');
    window.history.pushState({}, '', '/addstock');
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const parsed = parsePathname(window.location.pathname);
      if (parsed.kind === 'auth') {
        setAuthMode(parsed.mode);
      } else {
        setActive(parsed.section);
        setStockInitialAddMode(parsed.stockSubMode === 'addstock');
        setPendingSection(parsed.section);
        if (parsed.roleHint === 'cashier') setAuthEmailHint('cashier@zyropos.app');
        else if (parsed.roleHint === 'stock') setAuthEmailHint('stock@zyropos.app');
        else if (parsed.roleHint === 'owner') setAuthEmailHint('owner@zyropos.app');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function restoreSession() {
      const token = getStoredToken();
      if (!token) {
        if (mounted) setBooting(false);
        return;
      }
      try {
        const [{ user: me }, ws] = await Promise.all([api.me(), api.getWorkspace()]);
        if (mounted) {
          setUser(me);
          setWorkspace(ws);
          const parsed = parsePathname(window.location.pathname);
          if (parsed.kind === 'auth') {
            const target = defaultSectionForRole(me.role);
            setActive(target);
            window.history.replaceState({}, '', SECTION_TO_PATH[target]);
          } else {
            setActive(parsed.section);
            setStockInitialAddMode(parsed.stockSubMode === 'addstock');
          }
        }
      } catch {
        setStoredToken(null);
      } finally {
        if (mounted) setBooting(false);
      }
    }
    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleAuthSuccess(loggedInUser: StaffUser) {
    setUser(loggedInUser);
    try {
      const ws = await api.getWorkspace();
      setWorkspace(ws);
      const target = pendingSection ?? defaultSectionForRole(loggedInUser.role);
      setPendingSection(null);
      navigateToSection(target, true);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to load workspace.');
    }
  }

  async function handleLogout(nextAuthMode: AuthScreenMode = 'welcome') {
    try {
      await api.logout();
    } catch {
      // Ignore logout network error
    }
    setStoredToken(null);
    setUser(null);
    setWorkspace(null);
    setPendingSection(null);
    setAuthMode(nextAuthMode);
    window.history.pushState({}, '', AUTH_MODE_TO_PATH[nextAuthMode]);
  }

  async function handleSwitchBranch(branchName: string) {
    try {
      await api.updateSettings({ branchName });
      await refreshWorkspace();
      notify('ok', `Switched active branch to ${branchName}`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not switch branch.');
    }
  }

  if (booting) {
    return (
      <div className="min-h-screen w-full bg-[#F1E4D1] flex flex-col items-center justify-center gap-3">
        <ZyroLogo size={54} />
        <p className="text-[16px] font-bold text-[#162660]">Loading ZYRO Retail POS...</p>
      </div>
    );
  }

  if (!user || !workspace) {
    return (
      <AuthView
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
        initialEmail={authEmailHint}
        onModeChange={(nextMode) => {
          setAuthMode(nextMode);
          window.history.replaceState({}, '', AUTH_MODE_TO_PATH[nextMode]);
        }}
      />
    );
  }

  const lowStockCount = workspace.products.filter((p) => p.active && p.stockQty <= p.minStock).length;

  return (
    <>
      <AppShell
        active={active}
        onNavigate={navigateToSection}
        user={user}
        settings={workspace.settings}
        onLogout={() => handleLogout('welcome')}
        onSwitchCounter={() => handleLogout('signin')}
        onSwitchBranch={handleSwitchBranch}
        lowStockCount={lowStockCount}
        heldBillsCount={workspace.heldBills.length}
      >
        {active === 'dashboard' && (
          <DashboardView
            workspace={workspace}
            user={user}
            onNavigate={navigateToSection}
            onOpenAddStock={openAddStock}
            onOpenReceipt={setReceiptSale}
            onRefresh={refreshWorkspace}
            notify={notify}
          />
        )}
        {active === 'pos' && (
          <PosRegisterView
            workspace={workspace}
            user={user}
            onRefresh={refreshWorkspace}
            onSaleCompleted={setReceiptSale}
            notify={notify}
          />
        )}
        {active === 'stock' && (
          <StockView
            workspace={workspace}
            initialAddStockMode={stockInitialAddMode}
            onExitAddStock={() => {
              setStockInitialAddMode(false);
              window.history.replaceState({}, '', '/stock');
            }}
            onRefresh={refreshWorkspace}
            notify={notify}
          />
        )}
        {active === 'orders' && (
          <OrdersView
            workspace={workspace}
            onRefresh={refreshWorkspace}
            onOpenReceipt={setReceiptSale}
            notify={notify}
          />
        )}
        {active === 'customers' && (
          <CustomersView workspace={workspace} onRefresh={refreshWorkspace} notify={notify} />
        )}
        {active === 'purchasing' && (
          <PurchasingView workspace={workspace} onRefresh={refreshWorkspace} notify={notify} />
        )}
        {active === 'expenses' && (
          <ExpensesView workspace={workspace} onRefresh={refreshWorkspace} notify={notify} />
        )}
        {active === 'cash' && (
          <CashView workspace={workspace} onRefresh={refreshWorkspace} notify={notify} />
        )}
        {active === 'reports' && <ReportsView workspace={workspace} />}
        {active === 'settings' && (
          <SettingsView
            workspace={workspace}
            user={user}
            onRefresh={refreshWorkspace}
            notify={notify}
          />
        )}
      </AppShell>

      <Receipt80Modal
        sale={receiptSale}
        settings={workspace.settings}
        onClose={() => setReceiptSale(null)}
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
