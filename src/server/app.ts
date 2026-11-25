import 'dotenv/config';
import crypto from 'crypto';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { zyroStore } from './store.ts';
import type {
  CartItem,
  CashMovement,
  CashShift,
  Category,
  Customer,
  Expense,
  HeldBill,
  PaymentMethod,
  PaymentSplitEntry,
  Product,
  PurchaseOrder,
  ReturnRecord,
  Sale,
  SaleItem,
  ShopKind,
  StaffUser,
  Supplier,
  UserRole,
} from '../types/pos.ts';

interface AuthRequest extends Request {
  user?: StaffUser;
}

const AVATAR_PALETTES: [string, string][] = [
  ['#EAF2FD', '#24398A'],
  ['#F1E4D1', '#7A5320'],
  ['#E5EDE3', '#2F4A2E'],
  ['#ECE6EF', '#4A3A5A'],
];

function genId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(4).toString('hex')}`;
}

function asNonEmptyString(val: unknown, maxLen = 180): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (!trimmed || trimmed.length > maxLen) return null;
  return trimmed;
}

function asFiniteNumber(val: unknown, min = 0, max = 1_000_000_000): number | null {
  const num = Number(val);
  if (!Number.isFinite(num) || num < min || num > max) return null;
  return num;
}

const ALLOWED_ROLES: UserRole[] = ['owner', 'manager', 'cashier', 'stock'];
const ALLOWED_PAYMENTS: PaymentMethod[] = [
  'cash',
  'card',
  'jazzcash',
  'easypaisa',
  'bank',
  'khata',
  'split',
];

async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
  const user = await zyroStore.verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
  req.user = user;
  next();
}

function requireRole(roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action.' });
    }
    next();
  };
}

function computeExpectedCashForShift(shift: CashShift): number {
  const ws = zyroStore.getWorkspace();
  const openedAtMs = new Date(shift.openedAt).getTime();
  const closedAtMs = shift.closedAt ? new Date(shift.closedAt).getTime() : Date.now();

  let cashSales = 0;
  for (const s of ws.sales) {
    const t = new Date(s.createdAt).getTime();
    if (t < openedAtMs || t > closedAtMs) continue;
    if (s.paymentMethod === 'cash') {
      cashSales += s.total;
    } else if (s.paymentMethod === 'split' && Array.isArray(s.paymentSplit)) {
      for (const p of s.paymentSplit) {
        if (p.method === 'cash') cashSales += p.amount;
      }
    }
  }

  let khataCashIn = 0;
  for (const k of ws.khataEntries) {
    const t = new Date(k.createdAt).getTime();
    if (t < openedAtMs || t > closedAtMs) continue;
    if (k.type === 'payment' && k.method?.toLowerCase() === 'cash') {
      khataCashIn += k.amount;
    }
  }

  let cashExpenses = 0;
  for (const e of ws.expenses) {
    const t = new Date(e.createdAt).getTime();
    if (t < openedAtMs || t > closedAtMs) continue;
    if (e.paymentSource === 'Cash Drawer') {
      cashExpenses += e.amount;
    }
  }

  let cashRefunds = 0;
  for (const r of ws.returns) {
    const t = new Date(r.createdAt).getTime();
    if (t < openedAtMs || t > closedAtMs) continue;
    if (r.refundMethod === 'cash') {
      cashRefunds += r.totalRefund;
    }
  }

  let netMovements = 0;
  for (const m of ws.cashMovements) {
    if (m.shiftId !== shift.id) continue;
    netMovements += m.type === 'cash_in' ? m.amount : -m.amount;
  }

  return Math.max(
    0,
    Math.round(shift.openingFloat + cashSales + khataCashIn - cashExpenses - cashRefunds + netMovements)
  );
}

export function createApiApp(): Express {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // ==================== HEALTH ====================
  app.get('/api/health', (_req: Request, res: Response) => {
    return res.json({ ok: true, supabaseConnected: zyroStore.isSupabaseConnected() });
  });

  // ==================== AUTH ROUTES ====================
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const identifier = asNonEmptyString(req.body?.identifier ?? req.body?.email, 160);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email or mobile number and password are required.' });
    }
    const result = await zyroStore.loginWithEmailPassword(identifier, password);
    if (!result) {
      return res.status(401).json({ error: 'Incorrect email/mobile number or password.' });
    }
    return res.json(result);
  });

  app.post('/api/auth/pin-login', async (req: Request, res: Response) => {
    const pin = typeof req.body?.pin === 'string' ? req.body.pin.trim() : '';
    const staffId = typeof req.body?.staffId === 'string' ? req.body.staffId.trim() : undefined;
    const branchName = typeof req.body?.branchName === 'string' ? req.body.branchName.trim() : undefined;
    if (!pin || pin.replace(/\D/g, '').length < 4) {
      return res.status(400).json({ error: 'Enter your 4-digit counter PIN.' });
    }
    const result = await zyroStore.loginWithPin(pin, staffId, branchName);
    if (!result) {
      return res.status(401).json({ error: 'That PIN did not match an active counter account.' });
    }
    return res.json(result);
  });

  app.post('/api/auth/check-phone', async (req: Request, res: Response) => {
    const phone = asNonEmptyString(req.body?.phone, 40);
    if (!phone) return res.status(400).json({ error: 'Mobile number is required.' });
    const status = await zyroStore.checkPhoneAvailability(phone);
    return res.json(status);
  });

  app.post('/api/auth/send-otp', (req: Request, res: Response) => {
    const target = asNonEmptyString(req.body?.target ?? req.body?.phone ?? req.body?.email, 160);
    const purpose =
      req.body?.purpose === 'reset' || req.body?.purpose === 'join' ? req.body.purpose : 'verify';
    if (!target) {
      return res.status(400).json({ error: 'Provide a valid mobile number or email address.' });
    }
    const issued = zyroStore.issueOtp(target, purpose);
    return res.json({ ok: true, target: issued.target, demoCode: issued.code });
  });

  app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
    const target = asNonEmptyString(req.body?.target ?? req.body?.phone ?? req.body?.email, 160);
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
    const purpose =
      req.body?.purpose === 'reset' || req.body?.purpose === 'join' ? req.body.purpose : 'verify';
    if (!target || !code) {
      return res.status(400).json({ error: 'Verification target and 6-digit code are required.' });
    }
    const valid = zyroStore.verifyOtp(target, code, purpose);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid or expired 6-digit code. Please check and try again.' });
    }
    return res.json({ ok: true });
  });

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    const name = asNonEmptyString(req.body?.name, 100);
    const email = asNonEmptyString(req.body?.email, 160);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const shopName = typeof req.body?.shopName === 'string' ? req.body.shopName.trim().slice(0, 120) : '';
    const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim().slice(0, 40) : '';
    const city = typeof req.body?.city === 'string' ? req.body.city.trim().slice(0, 80) : '';
    const area = typeof req.body?.area === 'string' ? req.body.area.trim().slice(0, 120) : '';
    const branchCount = typeof req.body?.branchCount === 'string' ? req.body.branchCount.trim().slice(0, 20) : '';
    const showLogoOnReceipt =
      typeof req.body?.showLogoOnReceipt === 'boolean' ? req.body.showLogoOnReceipt : undefined;
    const allowedKinds: ShopKind[] = [
      'clothing',
      'shoes',
      'pharmacy',
      'grocery',
      'cosmetics',
      'jewellery',
      'electronics',
      'general',
    ];
    const shopKind = allowedKinds.includes(req.body?.shopKind) ? (req.body.shopKind as ShopKind) : undefined;

    if (!name || !email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid full name and email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    const result = await zyroStore.registerUser({
      name,
      email,
      password,
      shopName,
      phone,
      city,
      area,
      branchCount,
      shopKind,
      showLogoOnReceipt,
    });
    if ('error' in result) {
      return res.status(409).json(result);
    }
    return res.status(201).json(result);
  });

  app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
    const identifier = asNonEmptyString(req.body?.identifier ?? req.body?.email, 160);
    if (!identifier) {
      return res.status(400).json({ error: 'Enter your mobile number or email address.' });
    }
    await zyroStore.ensureHydrated();
    const issued = zyroStore.issueOtp(identifier, 'reset');
    return res.json({
      ok: true,
      demoCode: issued.code,
      hint: 'Enter the 6-digit verification code to choose a new password.',
    });
  });

  app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
    const identifier = asNonEmptyString(req.body?.identifier, 160);
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
    if (!identifier || !code || newPassword.length < 6) {
      return res.status(400).json({ error: 'Provide account identifier, 6-digit code, and a 6+ character password.' });
    }
    const result = await zyroStore.resetPasswordWithCode(identifier, code, newPassword);
    if ('error' in result) {
      return res.status(400).json(result);
    }
    return res.json({ ok: true });
  });

  app.post('/api/auth/join-lookup', async (req: Request, res: Response) => {
    const phone = asNonEmptyString(req.body?.phone, 40);
    if (!phone) return res.status(400).json({ error: 'Enter the mobile number your owner invited.' });
    const info = await zyroStore.joinLookup(phone);
    return res.json(info);
  });

  app.post('/api/auth/join-complete', async (req: Request, res: Response) => {
    const phone = asNonEmptyString(req.body?.phone, 40);
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
    const pin = typeof req.body?.pin === 'string' ? req.body.pin.trim() : '';
    const name = typeof req.body?.name === 'string' ? req.body.name.trim().slice(0, 100) : undefined;
    if (!phone || !code || !pin) {
      return res.status(400).json({ error: 'Phone, 6-digit SMS code, and 4-digit PIN are required.' });
    }
    const result = await zyroStore.completeStaffJoin({ phone, code, pin, name });
    if ('error' in result) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  });

  app.get('/api/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
    return res.json({ user: req.user });
  });

  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    return res.json({ ok: true });
  });

  // ==================== WORKSPACE ====================
  app.get('/api/workspace', requireAuth, async (_req: AuthRequest, res: Response) => {
    await zyroStore.ensureHydrated();
    const ws = zyroStore.getWorkspace();
    const shiftsWithLiveExpected = ws.shifts.map((sh) =>
      sh.status === 'open' ? { ...sh, expectedCash: computeExpectedCashForShift(sh) } : sh
    );
    return res.json({ ...ws, shifts: shiftsWithLiveExpected });
  });

  app.post('/api/approvals/:id/resolve', requireAuth, requireRole(['owner', 'manager']), async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const item = (ws.approvals || []).find((a) => a.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Review item not found.' });
    item.status = req.body?.decision === 'dismissed' ? 'dismissed' : 'approved';
    await zyroStore.persist();
    return res.json(item);
  });

  // ==================== CATEGORIES ====================
  app.post('/api/categories', requireAuth, async (req: AuthRequest, res: Response) => {
    const name = asNonEmptyString(req.body?.name, 80);
    if (!name) return res.status(400).json({ error: 'Category name is required.' });
    const color =
      typeof req.body?.color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(req.body.color)
        ? req.body.color
        : '#162660';
    const description =
      typeof req.body?.description === 'string' ? req.body.description.trim().slice(0, 200) : '';
    const cat: Category = { id: genId('cat'), name, color, description };
    zyroStore.getWorkspace().categories.push(cat);
    await zyroStore.persist();
    return res.status(201).json(cat);
  });

  app.put('/api/categories/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const cat = ws.categories.find((c) => c.id === req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found.' });
    const name = asNonEmptyString(req.body?.name, 80);
    if (name) cat.name = name;
    if (typeof req.body?.color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(req.body.color)) {
      cat.color = req.body.color;
    }
    if (typeof req.body?.description === 'string') {
      cat.description = req.body.description.trim().slice(0, 200);
    }
    await zyroStore.persist();
    return res.json(cat);
  });

  app.delete('/api/categories/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const idx = ws.categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found.' });
    ws.categories.splice(idx, 1);
    await zyroStore.persist();
    return res.json({ ok: true });
  });

  app.get('/api/categories', requireAuth, (_req: AuthRequest, res: Response) => {
    return res.json(zyroStore.getWorkspace().categories);
  });

  // ==================== PRODUCTS ====================
  app.get('/api/products', requireAuth, (req: AuthRequest, res: Response) => {
    const q = typeof req.query?.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const prods = zyroStore.getWorkspace().products;
    if (!q) return res.json(prods);
    return res.json(
      prods.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.toLowerCase().includes(q)
      )
    );
  });

  app.get('/api/products/lookup', requireAuth, (req: AuthRequest, res: Response) => {
    const code = typeof req.query?.code === 'string' ? req.query.code.trim().toLowerCase() : '';
    if (!code) return res.status(400).json({ error: 'Provide a barcode or SKU to look up.' });
    const prod = zyroStore
      .getWorkspace()
      .products.find(
        (p) =>
          p.barcode.toLowerCase() === code ||
          p.sku.toLowerCase() === code ||
          p.id.toLowerCase() === code
      );
    return res.json({ product: prod || null });
  });

  app.post('/api/products', requireAuth, async (req: AuthRequest, res: Response) => {
    const name = asNonEmptyString(req.body?.name, 140);
    const sku = asNonEmptyString(req.body?.sku, 60);
    const salePrice = asFiniteNumber(req.body?.salePrice, 0);
    const costPrice = asFiniteNumber(req.body?.costPrice ?? 0, 0);
    const stockQty = asFiniteNumber(req.body?.stockQty ?? 0, 0, 1_000_000);
    const minStock = asFiniteNumber(req.body?.minStock ?? 5, 0, 100_000);

    if (!name || !sku || salePrice === null || costPrice === null || stockQty === null || minStock === null) {
      return res.status(400).json({ error: 'Valid name, SKU, prices, and stock quantities are required.' });
    }

    const ws = zyroStore.getWorkspace();
    const categoryId =
      typeof req.body?.categoryId === 'string' && ws.categories.some((c) => c.id === req.body.categoryId)
        ? req.body.categoryId
        : ws.categories[0]?.id || 'cat_general';

    const product: Product = {
      id: genId('prd'),
      name,
      sku: sku.toUpperCase(),
      barcode:
        typeof req.body?.barcode === 'string' && req.body.barcode.trim()
          ? req.body.barcode.trim().slice(0, 64)
          : `8964${Math.floor(1000000 + Math.random() * 8999999)}`,
      categoryId,
      variant: typeof req.body?.variant === 'string' ? req.body.variant.trim().slice(0, 80) : 'Standard',
      unit: typeof req.body?.unit === 'string' && req.body.unit.trim() ? req.body.unit.trim().slice(0, 20) : 'pcs',
      costPrice,
      salePrice,
      stockQty: Math.round(stockQty),
      minStock: Math.round(minStock),
      swatch:
        typeof req.body?.swatch === 'string' && /^#[0-9A-Fa-f]{6}$/.test(req.body.swatch)
          ? req.body.swatch
          : '#162660',
      active: req.body?.active !== false,
      updatedAt: new Date().toISOString(),
    };

    ws.products.unshift(product);
    await zyroStore.persist();
    return res.status(201).json(product);
  });

  app.put('/api/products/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const prod = ws.products.find((p) => p.id === req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found.' });

    const name = asNonEmptyString(req.body?.name, 140);
    if (name) prod.name = name;
    const sku = asNonEmptyString(req.body?.sku, 60);
    if (sku) prod.sku = sku.toUpperCase();
    if (typeof req.body?.barcode === 'string') prod.barcode = req.body.barcode.trim().slice(0, 64);
    if (typeof req.body?.categoryId === 'string') prod.categoryId = req.body.categoryId;
    if (typeof req.body?.variant === 'string') prod.variant = req.body.variant.trim().slice(0, 80);
    if (typeof req.body?.unit === 'string' && req.body.unit.trim()) prod.unit = req.body.unit.trim().slice(0, 20);
    const salePrice = asFiniteNumber(req.body?.salePrice, 0);
    if (salePrice !== null) prod.salePrice = salePrice;
    const costPrice = asFiniteNumber(req.body?.costPrice, 0);
    if (costPrice !== null) prod.costPrice = costPrice;
    const stockQty = asFiniteNumber(req.body?.stockQty, 0, 1_000_000);
    if (stockQty !== null) prod.stockQty = Math.round(stockQty);
    const minStock = asFiniteNumber(req.body?.minStock, 0, 100_000);
    if (minStock !== null) prod.minStock = Math.round(minStock);
    if (typeof req.body?.swatch === 'string' && /^#[0-9A-Fa-f]{6}$/.test(req.body.swatch)) {
      prod.swatch = req.body.swatch;
    }
    if (typeof req.body?.active === 'boolean') prod.active = req.body.active;
    prod.updatedAt = new Date().toISOString();

    await zyroStore.persist();
    return res.json(prod);
  });

  app.delete('/api/products/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const idx = ws.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found.' });
    ws.products.splice(idx, 1);
    await zyroStore.persist();
    return res.json({ ok: true });
  });

  app.post('/api/products/:id/adjust', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const prod = ws.products.find((p) => p.id === req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found.' });

    const delta = asFiniteNumber(req.body?.delta, -100_000, 100_000);
    if (delta === null || delta === 0) {
      return res.status(400).json({ error: 'Adjustment delta must be a non-zero number.' });
    }
    const reason = asNonEmptyString(req.body?.reason, 160) || 'Manual stock adjustment';
    const prev = prod.stockQty;
    const nextQty = Math.max(0, Math.round(prev + delta));
    prod.stockQty = nextQty;
    prod.updatedAt = new Date().toISOString();

    ws.stockAdjustments.unshift({
      id: genId('adj'),
      productId: prod.id,
      productName: prod.name,
      delta: nextQty - prev,
      previousQty: prev,
      newQty: nextQty,
      reason,
      createdBy: req.user!.name,
      createdAt: new Date().toISOString(),
    });
    await zyroStore.persist();
    return res.json(prod);
  });

  app.post('/api/stock-count', requireAuth, async (req: AuthRequest, res: Response) => {
    const counts = req.body?.counts;
    if (!Array.isArray(counts) || counts.length === 0) {
      return res.status(400).json({ error: 'Provide at least one stock count line.' });
    }
    const ws = zyroStore.getWorkspace();
    let updated = 0;
    for (const line of counts) {
      const prod = ws.products.find((p) => p.id === line?.productId);
      const counted = asFiniteNumber(line?.countedQty, 0, 1_000_000);
      if (!prod || counted === null) continue;
      const rounded = Math.round(counted);
      if (rounded !== prod.stockQty) {
        const prev = prod.stockQty;
        prod.stockQty = rounded;
        prod.updatedAt = new Date().toISOString();
        ws.stockAdjustments.unshift({
          id: genId('adj'),
          productId: prod.id,
          productName: prod.name,
          delta: rounded - prev,
          previousQty: prev,
          newQty: rounded,
          reason: 'Physical stock count reconciliation',
          createdBy: req.user!.name,
          createdAt: new Date().toISOString(),
        });
        updated++;
      }
    }
    await zyroStore.persist();
    return res.json({ ok: true, updated });
  });

  app.patch('/api/products/:id/price', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const prod = ws.products.find((p) => p.id === req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found.' });
    const salePrice = asFiniteNumber(req.body?.salePrice, 0);
    if (salePrice === null) return res.status(400).json({ error: 'Provide a valid sale price.' });
    prod.salePrice = Math.round(salePrice);
    const costPrice = asFiniteNumber(req.body?.costPrice, 0);
    if (costPrice !== null) prod.costPrice = Math.round(costPrice);
    prod.updatedAt = new Date().toISOString();
    await zyroStore.persist();
    return res.json(prod);
  });

  app.get('/api/stock/adjustments', requireAuth, (_req: AuthRequest, res: Response) => {
    return res.json(zyroStore.getWorkspace().stockAdjustments);
  });

  app.post('/api/stock/batch-receive', requireAuth, async (req: AuthRequest, res: Response) => {
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Scan or add at least one item before saving the batch.' });
    }
    const note = asNonEmptyString(req.body?.note, 160) || 'Barcode scan-in batch';
    const ws = zyroStore.getWorkspace();
    let updatedCount = 0;
    let totalUnits = 0;

    for (const line of items) {
      const prod = ws.products.find((p) => p.id === line?.productId);
      const qty = asFiniteNumber(line?.qty, 1, 100_000);
      if (!prod || qty === null) continue;
      const added = Math.round(qty);
      const prev = prod.stockQty;
      prod.stockQty = prev + added;
      prod.updatedAt = new Date().toISOString();
      ws.stockAdjustments.unshift({
        id: genId('adj'),
        productId: prod.id,
        productName: prod.name,
        delta: added,
        previousQty: prev,
        newQty: prod.stockQty,
        reason: note,
        createdBy: req.user!.name,
        createdAt: new Date().toISOString(),
      });
      updatedCount++;
      totalUnits += added;
    }

    if (updatedCount === 0) {
      return res.status(400).json({ error: 'No matching products were found in this batch.' });
    }

    await zyroStore.persist();
    return res.status(201).json({ ok: true, updatedCount, totalUnits });
  });

  // ==================== SALES & CHECKOUT ====================
  app.get('/api/sales', requireAuth, (_req: AuthRequest, res: Response) => {
    return res.json(zyroStore.getWorkspace().sales);
  });

  app.post('/api/sales', requireAuth, async (req: AuthRequest, res: Response) => {
    const rawItems = req.body?.items;
    const paymentMethod = req.body?.paymentMethod as PaymentMethod;
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ error: 'Cart cannot be empty.' });
    }
    if (!ALLOWED_PAYMENTS.includes(paymentMethod)) {
      return res.status(400).json({ error: 'Unsupported payment method.' });
    }

    const ws = zyroStore.getWorkspace();
    const saleItems: SaleItem[] = [];
    let subtotal = 0;

    for (const raw of rawItems as CartItem[]) {
      const qty = asFiniteNumber(raw.qty, 1, 10000);
      const unitPrice = asFiniteNumber(raw.unitPrice, 0);
      const lineDiscount = asFiniteNumber(raw.discount ?? 0, 0);
      if (qty === null || unitPrice === null || lineDiscount === null) {
        return res.status(400).json({ error: 'Invalid cart item quantity or price.' });
      }
      const prod = ws.products.find((p) => p.id === raw.productId);
      const lineTotal = Math.max(0, Math.round(unitPrice * qty - lineDiscount));
      subtotal += lineTotal;
      saleItems.push({
        productId: raw.productId,
        name: prod?.name || asNonEmptyString(raw.name, 140) || 'Item',
        sku: prod?.sku || String(raw.sku || 'MISC'),
        variant: prod?.variant || String(raw.variant || ''),
        unitPrice,
        costPrice: prod?.costPrice ?? Number(raw.costPrice || 0),
        qty: Math.round(qty),
        returnedQty: 0,
        discount: lineDiscount,
        lineTotal,
      });
    }

    const discountType = req.body?.discountType === 'percent' ? 'percent' : 'fixed';
    const discountValue = asFiniteNumber(req.body?.discountValue ?? 0, 0) ?? 0;
    const discountAmount =
      discountType === 'percent'
        ? Math.min(subtotal, Math.round((subtotal * Math.min(discountValue, 100)) / 100))
        : Math.min(subtotal, Math.round(discountValue));

    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const applyTax = Boolean(req.body?.applyTax);
    const taxRate = applyTax ? ws.settings.taxRate : 0;
    const taxAmount =
      taxRate > 0 && !ws.settings.taxInclusive
        ? Math.round((afterDiscount * taxRate) / 100)
        : 0;
    const total = afterDiscount + taxAmount;

    let customer: Customer | undefined;
    if (typeof req.body?.customerId === 'string' && req.body.customerId) {
      customer = ws.customers.find((c) => c.id === req.body.customerId);
    }

    let khataCharged = 0;
    let paymentSplit: PaymentSplitEntry[] | undefined;
    if (paymentMethod === 'khata') {
      if (!customer) {
        return res.status(400).json({ error: 'Please select a customer for Khata credit billing.' });
      }
      khataCharged = total;
    } else if (paymentMethod === 'split') {
      const splitRaw = req.body?.paymentSplit;
      if (!Array.isArray(splitRaw) || splitRaw.length === 0) {
        return res.status(400).json({ error: 'Split payment requires at least one payment leg.' });
      }
      paymentSplit = [];
      let splitSum = 0;
      for (const leg of splitRaw) {
        const amt = asFiniteNumber(leg?.amount, 0);
        if (amt === null || amt <= 0) continue;
        if (!ALLOWED_PAYMENTS.includes(leg.method) || leg.method === 'split') continue;
        paymentSplit.push({ method: leg.method, amount: Math.round(amt) });
        splitSum += Math.round(amt);
        if (leg.method === 'khata') khataCharged += Math.round(amt);
      }
      if (khataCharged > 0 && !customer) {
        return res.status(400).json({ error: 'Select a customer to put part of a split bill on Khata.' });
      }
      if (splitSum < total) {
        return res.status(400).json({ error: 'Split payment total must cover the full bill amount.' });
      }
    }

    const amountTendered =
      paymentMethod === 'khata'
        ? 0
        : Math.max(total, Math.round(asFiniteNumber(req.body?.amountTendered ?? total, 0) ?? total));
    const changeDue = paymentMethod === 'cash' ? Math.max(0, amountTendered - total) : 0;

    for (const item of saleItems) {
      const prod = ws.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQty = Math.max(0, prod.stockQty - item.qty);
        prod.updatedAt = new Date().toISOString();
      }
    }

    const billNum = 1049 + ws.sales.length;
    const billNo = `B-${billNum}`;
    const now = new Date().toISOString();

    const sale: Sale = {
      id: genId('sal'),
      billNo,
      customerId: customer?.id,
      customerName: customer ? customer.name : 'Walk-in Customer',
      cashierId: req.user!.id,
      cashierName: req.user!.name,
      items: saleItems,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxAmount,
      total,
      paymentMethod,
      paymentSplit,
      amountTendered,
      changeDue,
      status: 'completed',
      note: typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 200) : undefined,
      createdAt: now,
    };

    ws.sales.unshift(sale);

    if (customer) {
      customer.totalSpent += total;
      customer.visits += 1;
      customer.lastVisit = now;
      if (khataCharged > 0) {
        customer.balanceDue += khataCharged;
        ws.khataEntries.unshift({
          id: genId('kh'),
          customerId: customer.id,
          type: 'charge',
          amount: khataCharged,
          reference: billNo,
          note: `POS Bill ${billNo}`,
          createdBy: req.user!.name,
          createdAt: now,
        });
      }
    }

    if (typeof req.body?.heldBillId === 'string' && req.body.heldBillId) {
      ws.heldBills = ws.heldBills.filter((h) => h.id !== req.body.heldBillId);
    }

    await zyroStore.persist();
    return res.status(201).json(sale);
  });

  app.post('/api/sales/:id/return', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const sale = ws.sales.find((s) => s.id === req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale invoice not found.' });

    const returnLines = req.body?.items;
    if (!Array.isArray(returnLines) || returnLines.length === 0) {
      return res.status(400).json({ error: 'Select at least one item to return.' });
    }

    const refundMethod =
      req.body?.refundMethod === 'bank' || req.body?.refundMethod === 'khata_credit'
        ? req.body.refundMethod
        : 'cash';
    const reason = asNonEmptyString(req.body?.reason, 180) || 'Customer return';

    const processedItems: ReturnRecord['items'] = [];
    let totalRefund = 0;

    for (const line of returnLines) {
      const qty = asFiniteNumber(line?.qty, 1, 1000);
      if (qty === null) continue;
      const saleItem = sale.items.find((i) => i.productId === line.productId);
      if (!saleItem) continue;
      const maxReturnable = saleItem.qty - saleItem.returnedQty;
      if (maxReturnable <= 0) continue;
      const actualQty = Math.min(Math.round(qty), maxReturnable);
      const unitRefund = Math.round(saleItem.lineTotal / saleItem.qty);
      const refundAmount = unitRefund * actualQty;

      saleItem.returnedQty += actualQty;
      totalRefund += refundAmount;
      processedItems.push({
        productId: saleItem.productId,
        name: saleItem.name,
        sku: saleItem.sku,
        qty: actualQty,
        refundAmount,
      });

      const prod = ws.products.find((p) => p.id === saleItem.productId);
      if (prod) {
        prod.stockQty += actualQty;
        prod.updatedAt = new Date().toISOString();
      }
    }

    if (processedItems.length === 0) {
      return res.status(400).json({ error: 'No eligible items left to return on this bill.' });
    }

    const allReturned = sale.items.every((i) => i.returnedQty >= i.qty);
    sale.status = allReturned ? 'returned' : 'partial_return';

    const now = new Date().toISOString();
    const retRecord: ReturnRecord = {
      id: genId('ret'),
      returnNo: `R-${301 + ws.returns.length}`,
      saleId: sale.id,
      billNo: sale.billNo,
      customerId: sale.customerId,
      customerName: sale.customerName,
      items: processedItems,
      totalRefund,
      refundMethod,
      reason,
      processedBy: req.user!.name,
      createdAt: now,
    };
    ws.returns.unshift(retRecord);

    if (refundMethod === 'khata_credit' && sale.customerId) {
      const cust = ws.customers.find((c) => c.id === sale.customerId);
      if (cust) {
        cust.balanceDue = Math.max(0, cust.balanceDue - totalRefund);
        ws.khataEntries.unshift({
          id: genId('kh'),
          customerId: cust.id,
          type: 'refund',
          amount: totalRefund,
          reference: retRecord.returnNo,
          note: `Return credit for ${sale.billNo}`,
          createdBy: req.user!.name,
          createdAt: now,
        });
      }
    }

    await zyroStore.persist();
    return res.status(201).json(retRecord);
  });

  // ==================== HELD BILLS ====================
  app.post('/api/held-bills', requireAuth, async (req: AuthRequest, res: Response) => {
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cannot hold an empty bill.' });
    }
    const label = asNonEmptyString(req.body?.label, 100) || `Held Bill #${zyroStore.getWorkspace().heldBills.length + 1}`;
    const held: HeldBill = {
      id: genId('hld'),
      label,
      customerId: typeof req.body?.customerId === 'string' ? req.body.customerId : undefined,
      customerName: typeof req.body?.customerName === 'string' ? req.body.customerName : 'Walk-in Customer',
      items,
      discountType: req.body?.discountType === 'percent' ? 'percent' : 'fixed',
      discountValue: asFiniteNumber(req.body?.discountValue ?? 0, 0) ?? 0,
      note: typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 160) : undefined,
      createdBy: req.user!.name,
      createdAt: new Date().toISOString(),
    };
    zyroStore.getWorkspace().heldBills.unshift(held);
    await zyroStore.persist();
    return res.status(201).json(held);
  });

  app.delete('/api/held-bills/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    ws.heldBills = ws.heldBills.filter((h) => h.id !== req.params.id);
    await zyroStore.persist();
    return res.json({ ok: true });
  });

  // ==================== CUSTOMERS & KHATA ====================
  app.post('/api/customers', requireAuth, async (req: AuthRequest, res: Response) => {
    const name = asNonEmptyString(req.body?.name, 120);
    const phone = asNonEmptyString(req.body?.phone, 40);
    if (!name || !phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' });
    }
    const creditLimit = asFiniteNumber(req.body?.creditLimit ?? 50000, 0) ?? 50000;
    const customer: Customer = {
      id: genId('cus'),
      name,
      phone,
      email: typeof req.body?.email === 'string' ? req.body.email.trim().slice(0, 120) : '',
      address: typeof req.body?.address === 'string' ? req.body.address.trim().slice(0, 200) : '',
      creditLimit,
      balanceDue: 0,
      totalSpent: 0,
      visits: 0,
      createdAt: new Date().toISOString(),
    };
    zyroStore.getWorkspace().customers.unshift(customer);
    await zyroStore.persist();
    return res.status(201).json(customer);
  });

  app.put('/api/customers/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const cust = zyroStore.getWorkspace().customers.find((c) => c.id === req.params.id);
    if (!cust) return res.status(404).json({ error: 'Customer not found.' });
    const name = asNonEmptyString(req.body?.name, 120);
    if (name) cust.name = name;
    const phone = asNonEmptyString(req.body?.phone, 40);
    if (phone) cust.phone = phone;
    if (typeof req.body?.email === 'string') cust.email = req.body.email.trim().slice(0, 120);
    if (typeof req.body?.address === 'string') cust.address = req.body.address.trim().slice(0, 200);
    const creditLimit = asFiniteNumber(req.body?.creditLimit, 0);
    if (creditLimit !== null) cust.creditLimit = creditLimit;
    await zyroStore.persist();
    return res.json(cust);
  });

  app.delete('/api/customers/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const idx = ws.customers.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Customer not found.' });
    ws.customers.splice(idx, 1);
    await zyroStore.persist();
    return res.json({ ok: true });
  });

  app.post('/api/customers/:id/payment', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const cust = ws.customers.find((c) => c.id === req.params.id);
    if (!cust) return res.status(404).json({ error: 'Customer not found.' });
    const amount = asFiniteNumber(req.body?.amount, 1);
    if (amount === null) return res.status(400).json({ error: 'Payment amount must be greater than zero.' });
    const method = asNonEmptyString(req.body?.method, 40) || 'Cash';
    const note = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 160) : 'Khata payment received';

    const rounded = Math.round(amount);
    cust.balanceDue = Math.max(0, cust.balanceDue - rounded);
    const entry = {
      id: genId('kh'),
      customerId: cust.id,
      type: 'payment' as const,
      amount: rounded,
      method,
      note,
      createdBy: req.user!.name,
      createdAt: new Date().toISOString(),
    };
    ws.khataEntries.unshift(entry);
    await zyroStore.persist();
    return res.status(201).json({ customer: cust, entry });
  });

  // ==================== SUPPLIERS & PURCHASING ====================
  app.post('/api/suppliers', requireAuth, async (req: AuthRequest, res: Response) => {
    const name = asNonEmptyString(req.body?.name, 120);
    const phone = asNonEmptyString(req.body?.phone, 40);
    if (!name || !phone) return res.status(400).json({ error: 'Supplier name and phone are required.' });
    const supplier: Supplier = {
      id: genId('sup'),
      name,
      contactName: asNonEmptyString(req.body?.contactName, 100) || name,
      phone,
      city: asNonEmptyString(req.body?.city, 80) || 'Lahore',
      category: asNonEmptyString(req.body?.category, 80) || 'General Merchandise',
      payableBalance: asFiniteNumber(req.body?.payableBalance ?? 0, 0) ?? 0,
      createdAt: new Date().toISOString(),
    };
    zyroStore.getWorkspace().suppliers.unshift(supplier);
    await zyroStore.persist();
    return res.status(201).json(supplier);
  });

  app.delete('/api/suppliers/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    ws.suppliers = ws.suppliers.filter((s) => s.id !== req.params.id);
    await zyroStore.persist();
    return res.json({ ok: true });
  });

  app.post('/api/purchase-orders', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const supplier = ws.suppliers.find((s) => s.id === req.body?.supplierId);
    if (!supplier) return res.status(400).json({ error: 'Select a valid supplier.' });
    const rawItems = req.body?.items;
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ error: 'Add at least one product line to the purchase order.' });
    }

    const items: PurchaseOrder['items'] = [];
    let totalCost = 0;
    for (const line of rawItems) {
      const prod = ws.products.find((p) => p.id === line?.productId);
      const qty = asFiniteNumber(line?.qty, 1, 100000);
      const unitCost = asFiniteNumber(line?.unitCost, 0);
      if (!prod || qty === null || unitCost === null) continue;
      const lineTotal = Math.round(qty * unitCost);
      totalCost += lineTotal;
      items.push({
        productId: prod.id,
        name: prod.name,
        sku: prod.sku,
        qty: Math.round(qty),
        unitCost,
        lineTotal,
      });
    }
    if (items.length === 0) return res.status(400).json({ error: 'No valid products found in order.' });

    const po: PurchaseOrder = {
      id: genId('po'),
      poNumber: `PO-${2042 + ws.purchaseOrders.length}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      items,
      totalCost,
      status: 'ordered',
      notes: typeof req.body?.notes === 'string' ? req.body.notes.trim().slice(0, 200) : undefined,
      createdBy: req.user!.name,
      createdAt: new Date().toISOString(),
    };
    ws.purchaseOrders.unshift(po);
    await zyroStore.persist();
    return res.status(201).json(po);
  });

  app.post('/api/purchase-orders/:id/receive', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const po = ws.purchaseOrders.find((p) => p.id === req.params.id);
    if (!po) return res.status(404).json({ error: 'Purchase order not found.' });
    if (po.status !== 'ordered') {
      return res.status(400).json({ error: 'Only ordered POs can be received.' });
    }
    for (const line of po.items) {
      const prod = ws.products.find((p) => p.id === line.productId);
      if (prod) {
        prod.stockQty += line.qty;
        prod.costPrice = line.unitCost;
        prod.updatedAt = new Date().toISOString();
      }
    }
    po.status = 'received';
    po.receivedAt = new Date().toISOString();
    await zyroStore.persist();
    return res.json(po);
  });

  app.post('/api/purchase-orders/:id/cancel', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const po = ws.purchaseOrders.find((p) => p.id === req.params.id);
    if (!po) return res.status(404).json({ error: 'Purchase order not found.' });
    if (po.status !== 'ordered') return res.status(400).json({ error: 'Cannot cancel this order.' });
    po.status = 'cancelled';
    await zyroStore.persist();
    return res.json(po);
  });

  // ==================== EXPENSES ====================
  app.post('/api/expenses', requireAuth, async (req: AuthRequest, res: Response) => {
    const title = asNonEmptyString(req.body?.title, 140);
    const amount = asFiniteNumber(req.body?.amount, 1);
    if (!title || amount === null) {
      return res.status(400).json({ error: 'Expense title and valid positive amount are required.' });
    }
    const validCategories: Expense['category'][] = [
      'Rent',
      'Utilities',
      'Salaries',
      'Supplies',
      'Transport',
      'Maintenance',
      'Marketing',
      'Other',
    ];
    const validSources: Expense['paymentSource'][] = [
      'Cash Drawer',
      'Bank Transfer',
      'JazzCash',
      'EasyPaisa',
    ];
    const category = validCategories.includes(req.body?.category) ? req.body.category : 'Other';
    const paymentSource = validSources.includes(req.body?.paymentSource)
      ? req.body.paymentSource
      : 'Cash Drawer';
    const date =
      typeof req.body?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.body.date)
        ? req.body.date
        : new Date().toISOString().slice(0, 10);

    const exp: Expense = {
      id: genId('exp'),
      title,
      category,
      amount: Math.round(amount),
      paymentSource,
      date,
      notes: typeof req.body?.notes === 'string' ? req.body.notes.trim().slice(0, 200) : '',
      createdBy: req.user!.name,
      createdAt: new Date().toISOString(),
    };
    zyroStore.getWorkspace().expenses.unshift(exp);
    await zyroStore.persist();
    return res.status(201).json(exp);
  });

  app.delete('/api/expenses/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    ws.expenses = ws.expenses.filter((e) => e.id !== req.params.id);
    await zyroStore.persist();
    return res.json({ ok: true });
  });

  // ==================== CASH SHIFTS ====================
  app.post('/api/shifts/open', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    if (ws.shifts.some((s) => s.status === 'open')) {
      return res.status(400).json({ error: 'A cash shift is already open. Close it first.' });
    }
    const openingFloat = asFiniteNumber(req.body?.openingFloat ?? 0, 0);
    if (openingFloat === null) {
      return res.status(400).json({ error: 'Opening float must be a valid non-negative number.' });
    }
    const shift: CashShift = {
      id: genId('shf'),
      shiftNo: `SH-0${85 + ws.shifts.length}`,
      openedBy: req.user!.name,
      openedAt: new Date().toISOString(),
      openingFloat: Math.round(openingFloat),
      status: 'open',
    };
    ws.shifts.unshift(shift);
    await zyroStore.persist();
    return res.status(201).json({ ...shift, expectedCash: computeExpectedCashForShift(shift) });
  });

  app.post('/api/shifts/:id/movement', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const shift = ws.shifts.find((s) => s.id === req.params.id && s.status === 'open');
    if (!shift) return res.status(404).json({ error: 'Open shift not found.' });
    const type = req.body?.type === 'cash_in' ? 'cash_in' : 'cash_out';
    const amount = asFiniteNumber(req.body?.amount, 1);
    const reason = asNonEmptyString(req.body?.reason, 160);
    if (amount === null || !reason) {
      return res.status(400).json({ error: 'Positive amount and reason are required.' });
    }
    const mov: CashMovement = {
      id: genId('cm'),
      shiftId: shift.id,
      type,
      amount: Math.round(amount),
      reason,
      createdBy: req.user!.name,
      createdAt: new Date().toISOString(),
    };
    ws.cashMovements.unshift(mov);
    await zyroStore.persist();
    return res.status(201).json(mov);
  });

  app.post('/api/shifts/:id/close', requireAuth, async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const shift = ws.shifts.find((s) => s.id === req.params.id && s.status === 'open');
    if (!shift) return res.status(404).json({ error: 'Open shift not found.' });
    const countedCash = asFiniteNumber(req.body?.countedCash, 0);
    if (countedCash === null) {
      return res.status(400).json({ error: 'Counted cash amount is required.' });
    }
    const expectedCash = computeExpectedCashForShift(shift);
    shift.status = 'closed';
    shift.closedBy = req.user!.name;
    shift.closedAt = new Date().toISOString();
    shift.expectedCash = expectedCash;
    shift.countedCash = Math.round(countedCash);
    shift.variance = Math.round(countedCash) - expectedCash;
    shift.notes = typeof req.body?.notes === 'string' ? req.body.notes.trim().slice(0, 200) : '';
    await zyroStore.persist();
    return res.json(shift);
  });

  // ==================== SETTINGS & STAFF ====================
  app.put('/api/settings', requireAuth, requireRole(['owner', 'manager']), async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const s = ws.settings;
    const shopName = asNonEmptyString(req.body?.shopName, 120);
    if (shopName) s.shopName = shopName;
    const branchName = asNonEmptyString(req.body?.branchName, 80);
    if (branchName) s.branchName = branchName;
    if (typeof req.body?.phone === 'string') s.phone = req.body.phone.trim().slice(0, 40);
    if (typeof req.body?.address === 'string') s.address = req.body.address.trim().slice(0, 220);
    if (typeof req.body?.city === 'string') s.city = req.body.city.trim().slice(0, 80);
    if (typeof req.body?.area === 'string') s.area = req.body.area.trim().slice(0, 120);
    if (typeof req.body?.currency === 'string' && req.body.currency.trim()) {
      s.currency = req.body.currency.trim().slice(0, 8);
    }
    const taxRate = asFiniteNumber(req.body?.taxRate, 0, 50);
    if (taxRate !== null) s.taxRate = taxRate;
    if (typeof req.body?.taxInclusive === 'boolean') s.taxInclusive = req.body.taxInclusive;
    if (typeof req.body?.ntnNumber === 'string') s.ntnNumber = req.body.ntnNumber.trim().slice(0, 60);
    if (typeof req.body?.fbrPosId === 'string') s.fbrPosId = req.body.fbrPosId.trim().slice(0, 60);
    if (typeof req.body?.receiptHeader === 'string') s.receiptHeader = req.body.receiptHeader.trim().slice(0, 220);
    if (typeof req.body?.receiptFooter === 'string') s.receiptFooter = req.body.receiptFooter.trim().slice(0, 220);
    if (typeof req.body?.showSkuOnReceipt === 'boolean') s.showSkuOnReceipt = req.body.showSkuOnReceipt;
    if (typeof req.body?.showLogoOnReceipt === 'boolean') s.showLogoOnReceipt = req.body.showLogoOnReceipt;
    if (
      req.body?.shopType &&
      ['clothing', 'shoes', 'grocery', 'general', 'pharmacy', 'electronics', 'cosmetics', 'hardware'].includes(
        req.body.shopType
      )
    ) {
      s.shopType = req.body.shopType;
    }
    if (req.body?.enabledPayments && typeof req.body.enabledPayments === 'object') {
      const ep = req.body.enabledPayments;
      s.enabledPayments = {
        cash: Boolean(ep.cash),
        card: Boolean(ep.card),
        jazzcash: Boolean(ep.jazzcash),
        easypaisa: Boolean(ep.easypaisa),
        bank: Boolean(ep.bank),
        khata: Boolean(ep.khata),
      };
    }
    await zyroStore.persist();
    return res.json(s);
  });

  app.post('/api/staff', requireAuth, requireRole(['owner', 'manager']), async (req: AuthRequest, res: Response) => {
    const name = asNonEmptyString(req.body?.name, 100);
    const email = asNonEmptyString(req.body?.email, 160);
    const role = ALLOWED_ROLES.includes(req.body?.role) ? (req.body.role as UserRole) : 'cashier';
    const password = typeof req.body?.password === 'string' && req.body.password.length >= 6 ? req.body.password : 'zyro1234';
    if (!name || !email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid staff name and email are required.' });
    }
    const ws = zyroStore.getWorkspace();
    if (ws.staff.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: 'A staff member with this email already exists.' });
    }
    const rawPin = typeof req.body?.pin === 'string' ? req.body.pin.replace(/\D/g, '').slice(0, 4) : '';
    const palette = AVATAR_PALETTES[ws.staff.length % AVATAR_PALETTES.length];
    const staff: StaffUser = {
      id: genId('usr'),
      name,
      email: email.toLowerCase(),
      role,
      phone: typeof req.body?.phone === 'string' ? req.body.phone.trim().slice(0, 40) : '',
      pin: rawPin.length === 4 ? rawPin : undefined,
      branchName: ws.settings.branchName,
      active: true,
      avatarBg: palette[0],
      avatarFg: palette[1],
      createdAt: new Date().toISOString(),
    };
    ws.staff.push(staff);
    zyroStore.setStaffPassword(staff.id, staff.email, password);
    await zyroStore.persist();
    return res.status(201).json(staff);
  });

  app.put('/api/staff/:id', requireAuth, requireRole(['owner', 'manager']), async (req: AuthRequest, res: Response) => {
    const ws = zyroStore.getWorkspace();
    const staff = ws.staff.find((u) => u.id === req.params.id);
    if (!staff) return res.status(404).json({ error: 'Staff member not found.' });
    const name = asNonEmptyString(req.body?.name, 100);
    if (name) staff.name = name;
    if (ALLOWED_ROLES.includes(req.body?.role)) staff.role = req.body.role;
    if (typeof req.body?.phone === 'string') staff.phone = req.body.phone.trim().slice(0, 40);
    if (typeof req.body?.pin === 'string') {
      const digits = req.body.pin.replace(/\D/g, '').slice(0, 4);
      if (digits.length === 4) staff.pin = digits;
    }
    if (typeof req.body?.active === 'boolean') staff.active = req.body.active;
    await zyroStore.persist();
    return res.json(staff);
  });

  return app;
}
