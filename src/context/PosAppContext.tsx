'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AppLang, CartLine, ShopKitId, UserRole, ViewportMetrics } from '@/types/pos';
import { setBoardNavigator } from '@/lib/common';

interface PosContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  kit: ShopKitId;
  setKit: (kit: ShopKitId) => void;
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  viewport: ViewportMetrics;
  cart: CartLine[];
  addToCart: (line: Omit<CartLine, 'qty'>, qty?: number) => void;
  updateCartQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  navigateBoard: (boardKey: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PosContext = createContext<PosContextValue | null>(null);

function computeViewport(w: number, h: number): ViewportMetrics {
  const width = Math.max(320, Math.round(w));
  const height = Math.max(540, Math.round(h));
  const isNarrow = width < 760;
  const isMid = width >= 760 && width < 1100;
  const isCompactHeight = height < 660;
  const layout = isNarrow ? 'phone' : isMid ? 'tablet' : 'desk';
  const size = isNarrow ? 'phone' : isMid ? 'medium' : 'wide';
  return { width, height, layout, size, isNarrow, isMid, isCompactHeight };
}

const BOARD_TO_CLEAN_PATH: Record<string, string> = {
  AccountWelcome: '/',
  AccountPhone: '/register',
  AccountSignIn: '/login',
  AccountForgot: '/login?step=forgot',
  AccountJoin: '/join',
  SignIn: '/signin',
  Login: '/staff-login',
  Setup: '/setup',
  SetupSignIn: '/setup',
  SetupDevice: '/setup',
  App: '/owner',
  AppHomeShoes: '/owner',
  OwnerHome: '/owner',
  AppCashier: '/cashier',
  AppCashierShoes: '/cashier',
  CashierHome: '/cashier',
  AppStockkeeper: '/stock',
  StockHome: '/stock',
  Main: '/sell',
  Day: '/sell',
  RegisterUrdu: '/sell/urdu',
  AppBills: '/bills',
  AppBillsShoes: '/bills',
  AppStock: '/inventory',
  AppStockShoes: '/inventory',
  AppAddItem: '/inventory/add',
  AppAddItemShoesCarton: '/inventory/add',
  AppAddItemFilled: '/inventory/add',
  AppAddStock: '/inventory/add-stock',
  AppCategories: '/inventory/categories',
  AppKhata: '/customers',
  AppOrders: '/orders',
  AppSuppliers: '/purchasing',
  AppCash: '/cash',
  AppExpenses: '/expenses',
  AppReports: '/reports',
  AppStaff: '/staff',
  AppSettings: '/settings',
  SettingsStaffAdd: '/settings',
  AppChats: '/chats',
  AppCouriers: '/couriers',
  AppPrinter: '/printer',
  OrbaLabels: '/labels',
  SettingsPrinter: '/printers',
  MOnboard: '/owner',
};

export function PosProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('owner');
  const [kit, setKit] = useState<ShopKitId>('clothing');
  const [lang, setLang] = useState<AppLang>('en');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [viewport, setViewport] = useState<ViewportMetrics>(() => computeViewport(1280, 800));

  useEffect(() => {
    const sync = () => {
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;
      setViewport(computeViewport(vw, vh));
    };
    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);
    window.visualViewport?.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
      window.visualViewport?.removeEventListener('resize', sync);
    };
  }, []);

  const navigateBoard = useCallback(
    (boardKey: string) => {
      if (!boardKey) return;
      if (boardKey.startsWith('/')) {
        router.push(boardKey);
        return;
      }
      const [boardName, query] = boardKey.split('?');
      if (!query && BOARD_TO_CLEAN_PATH[boardName]) {
        router.push(BOARD_TO_CLEAN_PATH[boardName]);
        return;
      }
      if (boardName === 'App' && query) {
        const params = new URLSearchParams(query);
        const p = params.get('page');
        const r = params.get('role');
        if (!r && p) {
          const pageRoute: Record<string, string> = {
            home: '/owner',
            bills: '/bills',
            khata: '/customers',
            stock: '/inventory',
            additem: '/inventory/add',
            addstock: '/inventory/add-stock',
            categories: '/inventory/categories',
            orders: '/orders',
            cash: '/cash',
            suppliers: '/purchasing',
            expenses: '/expenses',
            staff: '/staff',
            reports: '/reports',
            settings: '/settings',
            chats: '/chats',
            couriers: '/couriers',
            printer: '/printer',
          };
          if (pageRoute[p] && [...params.keys()].length === 1) {
            router.push(pageRoute[p]);
            return;
          }
        }
      }
      router.push(`/screen/${encodeURIComponent(boardName)}${query ? `?${query}` : ''}`);
    },
    [router]
  );

  useEffect(() => {
    setBoardNavigator(navigateBoard);
    return () => setBoardNavigator(null);
  }, [navigateBoard]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      if (e.key === '`' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        setDrawerOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  }, []);

  const addToCart = useCallback((line: Omit<CartLine, 'qty'>, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.key === line.key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...line, qty }];
    });
  }, []);

  const updateCartQty = useCallback((key: string, qty: number) => {
    setCart((prev) => (qty <= 0 ? prev.filter((x) => x.key !== key) : prev.map((x) => (x.key === key ? { ...x, qty } : x))));
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((x) => x.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo<PosContextValue>(
    () => ({
      role,
      setRole,
      kit,
      setKit,
      lang,
      setLang,
      viewport,
      cart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      navigateBoard,
      drawerOpen,
      setDrawerOpen,
      toastMessage,
      showToast,
    }),
    [role, kit, lang, viewport, cart, addToCart, updateCartQty, removeFromCart, clearCart, navigateBoard, drawerOpen, toastMessage, showToast]
  );

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export function usePosApp(): PosContextValue {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error('usePosApp must be used within PosProvider');
  return ctx;
}
