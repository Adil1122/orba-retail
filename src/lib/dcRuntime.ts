'use client';

import type React from 'react';
import { openBoard } from './common';

const CAMEL_CACHE = new Map<string, string>();

function toCssProp(raw: string): string {
  const key = raw.trim();
  const cached = CAMEL_CACHE.get(key);
  if (cached) return cached;
  if (key.startsWith('--')) {
    CAMEL_CACHE.set(key, key);
    return key;
  }
  const normalized = key.startsWith('-webkit-')
    ? 'Webkit' + key.slice(8).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    : key.startsWith('-moz-')
      ? 'Moz' + key.slice(5).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
      : key.startsWith('-ms-')
        ? 'ms' + key.slice(4).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
        : key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  CAMEL_CACHE.set(key, normalized);
  return normalized;
}

/**
 * Converts a CSS declaration string into a React.CSSProperties object.
 * Handles URLs/data-URIs containing colons and custom CSS variables safely.
 */
export function dcStyle(css: string | undefined | null): React.CSSProperties | undefined {
  if (!css) return undefined;
  const out: Record<string, string> = {};
  let part = '';
  let depth = 0;
  let quote: string | null = null;

  const flush = (decl: string) => {
    const idx = decl.indexOf(':');
    if (idx <= 0) return;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop || !val) return;
    out[toCssProp(prop)] = val.replace(/\s*!important\s*$/i, '');
  };

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (quote) {
      part += ch;
      if (ch === quote && css[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      part += ch;
      continue;
    }
    if (ch === '(') {
      depth++;
      part += ch;
      continue;
    }
    if (ch === ')' && depth > 0) {
      depth--;
      part += ch;
      continue;
    }
    if (ch === ';' && depth === 0) {
      flush(part);
      part = '';
      continue;
    }
    part += ch;
  }
  if (part.trim()) flush(part);
  return out as React.CSSProperties;
}

export function dcStr(v: unknown): string {
  if (v === null || v === undefined || typeof v === 'function') return '';
  return String(v);
}

export function dcBool(v: unknown): boolean {
  return Boolean(v);
}

export function dcLinkClick(
  href: string | undefined,
  existingHandler?: ((e: React.MouseEvent<HTMLAnchorElement>) => void) | unknown
) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof existingHandler === 'function') {
      existingHandler(e);
    }
    if (e.defaultPrevented || !href) return;
    const m = href.match(/([A-Za-z0-9_-]+)\.dc\.html(\?[^#]*)?/);
    if (m) {
      e.preventDefault();
      openBoard(m[1] + (m[2] && m[2].length > 1 ? m[2] : ''));
    }
  };
}

const CLEAN_BOARD_HREF: Record<string, string> = {
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

export function dcHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const m = href.match(/([A-Za-z0-9_-]+)\.dc\.html(\?[^#]*)?/);
  if (m) {
    const board = m[1];
    const query = m[2] && m[2].length > 1 ? m[2] : '';
    if (!query && CLEAN_BOARD_HREF[board]) {
      return CLEAN_BOARD_HREF[board];
    }
    return `/screen/${board}${query}`;
  }
  return href;
}
