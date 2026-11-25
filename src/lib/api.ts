import type { Product, Sale, StaffUser, WorkspacePayload } from '../types/pos.ts';

const TOKEN_KEY = 'zyro_pos_session_token';

export function getStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(TOKEN_KEY) || window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null, persistLong = true): void {
  try {
    if (!token) {
      window.sessionStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
    } else {
      window.sessionStorage.setItem(TOKEN_KEY, token);
      if (persistLong) {
        window.localStorage.setItem(TOKEN_KEY, token);
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    }
  } catch {
    // Ignore storage quota restrictions
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });
  const text = await res.text();
  let json: unknown = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { error: text || 'Unexpected server response' };
  }

  if (!res.ok) {
    const errObj = json as { error?: string };
    throw new Error(errObj?.error || `Request failed (${res.status})`);
  }
  return json as T;
}

export const api = {
  health: () => request<{ ok: boolean; supabaseConnected: boolean }>('/api/health'),

  login: (identifier: string, password: string) =>
    request<{ user: StaffUser; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: identifier, identifier, password }),
    }),

  pinLogin: (pin: string, staffId?: string, branchName?: string) =>
    request<{ user: StaffUser; token: string }>('/api/auth/pin-login', {
      method: 'POST',
      body: JSON.stringify({ pin, staffId, branchName }),
    }),

  checkPhone: (phone: string) =>
    request<{ exists: boolean; normalized: string }>('/api/auth/check-phone', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  sendOtp: (target: string, purpose: 'verify' | 'reset' | 'join' = 'verify') =>
    request<{ ok: boolean; target: string; demoCode: string }>('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ target, purpose }),
    }),

  verifyOtp: (target: string, code: string, purpose: 'verify' | 'reset' | 'join' = 'verify') =>
    request<{ ok: boolean }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ target, code, purpose }),
    }),

  register: (payload: {
    name: string;
    email: string;
    password: string;
    shopName?: string;
    phone?: string;
    city?: string;
    area?: string;
    branchCount?: string;
    shopKind?: string;
    showLogoOnReceipt?: boolean;
  }) =>
    request<{ user: StaffUser; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (identifier: string) =>
    request<{ ok: boolean; demoCode: string; hint: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),

  resetPassword: (identifier: string, code: string, newPassword: string) =>
    request<{ ok: boolean }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ identifier, code, newPassword }),
    }),

  joinLookup: (phone: string) =>
    request<{
      found: boolean;
      shopName: string;
      branchName: string;
      staffName: string;
      role: StaffUser['role'];
    }>('/api/auth/join-lookup', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  joinComplete: (payload: { phone: string; code: string; pin: string; name?: string }) =>
    request<{ user: StaffUser; token: string }>('/api/auth/join-complete', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () => request<{ user: StaffUser }>('/api/auth/me'),

  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),

  getWorkspace: () => request<WorkspacePayload>('/api/workspace'),

  getProducts: (q?: string) =>
    request<Product[]>(`/api/products${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  lookupProduct: (code: string) =>
    request<{ product: Product | null }>(`/api/products/lookup?code=${encodeURIComponent(code)}`),

  createCategory: (body: { name: string; color: string; description?: string }) =>
    request('/api/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: string, body: { name?: string; color?: string; description?: string }) =>
    request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id: string) => request(`/api/categories/${id}`, { method: 'DELETE' }),

  createProduct: (body: Record<string, unknown>) =>
    request<Product>('/api/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: Record<string, unknown>) =>
    request<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateProductPrice: (id: string, salePrice: number, costPrice?: number) =>
    request<Product>(`/api/products/${id}/price`, {
      method: 'PATCH',
      body: JSON.stringify({ salePrice, costPrice }),
    }),
  deleteProduct: (id: string) => request(`/api/products/${id}`, { method: 'DELETE' }),
  adjustProductStock: (id: string, delta: number, reason: string) =>
    request<Product>(`/api/products/${id}/adjust`, {
      method: 'POST',
      body: JSON.stringify({ delta, reason }),
    }),
  batchReceiveStock: (items: { productId: string; qty: number }[], note?: string) =>
    request<{ ok: boolean; updatedCount: number; totalUnits: number }>('/api/stock/batch-receive', {
      method: 'POST',
      body: JSON.stringify({ items, note }),
    }),
  submitStockCount: (counts: { productId: string; countedQty: number }[]) =>
    request<{ ok: boolean; updated: number }>('/api/stock-count', {
      method: 'POST',
      body: JSON.stringify({ counts }),
    }),

  getSales: () => request<Sale[]>('/api/sales'),
  createSale: (body: Record<string, unknown>) =>
    request<Sale>('/api/sales', { method: 'POST', body: JSON.stringify(body) }),
  createReturn: (saleId: string, body: Record<string, unknown>) =>
    request(`/api/sales/${saleId}/return`, { method: 'POST', body: JSON.stringify(body) }),

  holdBill: (body: Record<string, unknown>) =>
    request('/api/held-bills', { method: 'POST', body: JSON.stringify(body) }),
  deleteHeldBill: (id: string) => request(`/api/held-bills/${id}`, { method: 'DELETE' }),

  createCustomer: (body: Record<string, unknown>) =>
    request('/api/customers', { method: 'POST', body: JSON.stringify(body) }),
  updateCustomer: (id: string, body: Record<string, unknown>) =>
    request(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCustomer: (id: string) => request(`/api/customers/${id}`, { method: 'DELETE' }),
  recordKhataPayment: (id: string, amount: number, method: string, note: string) =>
    request(`/api/customers/${id}/payment`, {
      method: 'POST',
      body: JSON.stringify({ amount, method, note }),
    }),

  createSupplier: (body: Record<string, unknown>) =>
    request('/api/suppliers', { method: 'POST', body: JSON.stringify(body) }),
  deleteSupplier: (id: string) => request(`/api/suppliers/${id}`, { method: 'DELETE' }),
  createPurchaseOrder: (body: Record<string, unknown>) =>
    request('/api/purchase-orders', { method: 'POST', body: JSON.stringify(body) }),
  receivePurchaseOrder: (id: string) =>
    request(`/api/purchase-orders/${id}/receive`, { method: 'POST' }),
  cancelPurchaseOrder: (id: string) =>
    request(`/api/purchase-orders/${id}/cancel`, { method: 'POST' }),

  createExpense: (body: Record<string, unknown>) =>
    request('/api/expenses', { method: 'POST', body: JSON.stringify(body) }),
  deleteExpense: (id: string) => request(`/api/expenses/${id}`, { method: 'DELETE' }),

  openShift: (openingFloat: number) =>
    request('/api/shifts/open', { method: 'POST', body: JSON.stringify({ openingFloat }) }),
  recordCashMovement: (shiftId: string, type: 'cash_in' | 'cash_out', amount: number, reason: string) =>
    request(`/api/shifts/${shiftId}/movement`, {
      method: 'POST',
      body: JSON.stringify({ type, amount, reason }),
    }),
  closeShift: (shiftId: string, countedCash: number, notes: string) =>
    request(`/api/shifts/${shiftId}/close`, {
      method: 'POST',
      body: JSON.stringify({ countedCash, notes }),
    }),

  resolveApproval: (id: string, decision: 'approved' | 'dismissed') =>
    request(`/api/approvals/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    }),

  updateSettings: (body: Record<string, unknown>) =>
    request('/api/settings', { method: 'PUT', body: JSON.stringify(body) }),
  createStaff: (body: Record<string, unknown>) =>
    request('/api/staff', { method: 'POST', body: JSON.stringify(body) }),
  updateStaff: (id: string, body: Record<string, unknown>) =>
    request(`/api/staff/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};
