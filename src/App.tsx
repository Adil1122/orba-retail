import React, { useCallback, useEffect, useState } from 'react';
import { api, getStoredToken, setStoredToken } from './lib/api.ts';
import type { NavSection, Sale, StaffUser, WorkspacePayload } from './types/pos.ts';
import { AuthView } from './components/AuthView.tsx';
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

export default function App() {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<StaffUser | null>(null);
  const [workspace, setWorkspace] = useState<WorkspacePayload | null>(null);
  const [active, setActive] = useState<NavSection>('dashboard');
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
      setActive(loggedInUser.role === 'cashier' ? 'pos' : 'dashboard');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to load workspace.');
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      // Ignore logout network error
    }
    setStoredToken(null);
    setUser(null);
    setWorkspace(null);
    setActive('dashboard');
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
    return <AuthView onSuccess={handleAuthSuccess} />;
  }

  const lowStockCount = workspace.products.filter((p) => p.active && p.stockQty <= p.minStock).length;

  return (
    <>
      <AppShell
        active={active}
        onNavigate={setActive}
        user={user}
        settings={workspace.settings}
        onLogout={handleLogout}
        lowStockCount={lowStockCount}
        heldBillsCount={workspace.heldBills.length}
      >
        {active === 'dashboard' && (
          <DashboardView
            workspace={workspace}
            onNavigate={setActive}
            onOpenReceipt={setReceiptSale}
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
          <StockView workspace={workspace} onRefresh={refreshWorkspace} notify={notify} />
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
