export type UserRole = 'owner' | 'manager' | 'cashier' | 'stock';

export type PaymentMethod =
  | 'cash'
  | 'card'
  | 'jazzcash'
  | 'easypaisa'
  | 'bank'
  | 'khata'
  | 'split';

export type NavSection =
  | 'dashboard'
  | 'pos'
  | 'stock'
  | 'orders'
  | 'customers'
  | 'purchasing'
  | 'expenses'
  | 'cash'
  | 'reports'
  | 'settings';

export type ShopKind =
  | 'clothing'
  | 'shoes'
  | 'pharmacy'
  | 'grocery'
  | 'cosmetics'
  | 'jewellery'
  | 'electronics'
  | 'general';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pin?: string;
  phone?: string;
  branchName?: string;
  active: boolean;
  avatarBg: string;
  avatarFg: string;
  createdAt: string;
}

export interface BusinessSettings {
  id: string;
  shopName: string;
  branchName: string;
  shopType: ShopKind;
  city?: string;
  area?: string;
  branchCount?: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  taxInclusive: boolean;
  ntnNumber: string;
  fbrPosId: string;
  receiptHeader: string;
  receiptFooter: string;
  showSkuOnReceipt: boolean;
  showLogoOnReceipt?: boolean;
  enabledPayments: {
    cash: boolean;
    card: boolean;
    jazzcash: boolean;
    easypaisa: boolean;
    bank: boolean;
    khata: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  categoryId: string;
  variant: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stockQty: number;
  minStock: number;
  swatch: string;
  artKey?: string;
  active: boolean;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  variant: string;
  unitPrice: number;
  costPrice: number;
  qty: number;
  discount: number; // per-line fixed discount
}

export interface SaleItem {
  productId: string;
  name: string;
  sku: string;
  variant: string;
  unitPrice: number;
  costPrice: number;
  qty: number;
  returnedQty: number;
  discount: number;
  lineTotal: number;
}

export interface PaymentSplitEntry {
  method: Exclude<PaymentMethod, 'split'>;
  amount: number;
}

export interface Sale {
  id: string;
  billNo: string;
  customerId?: string;
  customerName: string;
  cashierId: string;
  cashierName: string;
  items: SaleItem[];
  subtotal: number;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentSplit?: PaymentSplitEntry[];
  amountTendered: number;
  changeDue: number;
  status: 'completed' | 'partial_return' | 'returned';
  note?: string;
  createdAt: string;
}

export interface ReturnRecord {
  id: string;
  returnNo: string;
  saleId: string;
  billNo: string;
  customerId?: string;
  customerName: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    qty: number;
    refundAmount: number;
  }[];
  totalRefund: number;
  refundMethod: 'cash' | 'bank' | 'khata_credit';
  reason: string;
  processedBy: string;
  createdAt: string;
}

export interface HeldBill {
  id: string;
  label: string;
  customerId?: string;
  customerName?: string;
  items: CartItem[];
  discountType: 'fixed' | 'percent';
  discountValue: number;
  note?: string;
  createdBy: string;
  createdAt: string;
}

export interface KhataEntry {
  id: string;
  customerId: string;
  type: 'charge' | 'payment' | 'refund';
  amount: number;
  method?: string;
  reference?: string;
  note?: string;
  createdBy: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit: number;
  balanceDue: number;
  totalSpent: number;
  visits: number;
  lastVisit?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  city: string;
  category: string;
  payableBalance: number;
  createdAt: string;
}

export interface PurchaseOrderItem {
  productId: string;
  name: string;
  sku: string;
  qty: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: 'ordered' | 'received' | 'cancelled';
  notes?: string;
  createdBy: string;
  createdAt: string;
  receivedAt?: string;
}

export interface Expense {
  id: string;
  title: string;
  category:
    | 'Rent'
    | 'Utilities'
    | 'Salaries'
    | 'Supplies'
    | 'Transport'
    | 'Maintenance'
    | 'Marketing'
    | 'Other';
  amount: number;
  paymentSource: 'Cash Drawer' | 'Bank Transfer' | 'JazzCash' | 'EasyPaisa';
  date: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface CashMovement {
  id: string;
  shiftId: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface CashShift {
  id: string;
  shiftNo: string;
  openedBy: string;
  openedAt: string;
  openingFloat: number;
  closedBy?: string;
  closedAt?: string;
  countedCash?: number;
  expectedCash?: number;
  variance?: number;
  notes?: string;
  status: 'open' | 'closed';
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  delta: number;
  previousQty: number;
  newQty: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface ApprovalItem {
  id: string;
  kind: 'discount' | 'refund' | 'stock_count' | 'po';
  title: string;
  detail: string;
  amount: number;
  requestedBy: string;
  status: 'pending' | 'approved' | 'dismissed';
  createdAt: string;
}

export interface WorkspacePayload {
  settings: BusinessSettings;
  staff: StaffUser[];
  categories: Category[];
  products: Product[];
  customers: Customer[];
  khataEntries: KhataEntry[];
  sales: Sale[];
  returns: ReturnRecord[];
  heldBills: HeldBill[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  expenses: Expense[];
  shifts: CashShift[];
  cashMovements: CashMovement[];
  stockAdjustments: StockAdjustment[];
  approvals?: ApprovalItem[];
}
