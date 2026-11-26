export type UserRole = 'owner' | 'cashier' | 'inventory';

export type ShopKitId =
  | 'clothing'
  | 'shoes'
  | 'jewellery'
  | 'pharmacy'
  | 'grocery'
  | 'cosmetics'
  | 'mobile'
  | 'other';

export type AppLang = 'en' | 'roman' | 'ur';

export type LayoutMode = 'desk' | 'tablet' | 'phone';
export type ViewportSizeMode = 'wide' | 'medium' | 'phone';

export type ModuleName =
  // Application Shell & Dashboards
  | 'App'
  | 'OwnerHome'
  | 'CashierHome'
  | 'StockHome'
  | 'Main'
  // Authentication & Onboarding
  | 'CreateAccount'
  | 'Login'
  | 'Setup'
  | 'SignIn'
  | 'RegisterUrdu'
  // POS, Sales & Checkout
  | 'BillBook'
  | 'Complete'
  | 'Customer'
  | 'Discount'
  | 'HeldBills'
  | 'LineEdit'
  | 'OpenShift'
  | 'Printer'
  | 'Quote'
  | 'Receipt80'
  | 'Returns'
  | 'Shift'
  | 'ShoeExchange'
  | 'Tender'
  // Stock & Inventory
  | 'AddStock'
  | 'Categories'
  | 'CreateStyle'
  | 'Inventory'
  | 'Item'
  | 'ItemEditor'
  | 'Measured'
  | 'NewPO'
  | 'PhotoHandoff'
  | 'Receive'
  | 'Stock'
  | 'StockCount'
  | 'SyncCheck'
  // Business Management
  | 'Cash'
  | 'Expenses'
  | 'Khata'
  | 'Orders'
  | 'Purchasing'
  | 'Reports'
  | 'Staff'
  // Settings & Integrations
  | 'Settings'
  | 'SetShop'
  | 'SetTeam'
  | 'SetPayments'
  | 'SetPrinter'
  | 'SetReceipt'
  | 'SetFbr'
  | 'SetWhatsApp'
  | 'SetSecurity'
  | 'SetData'
  | 'Chats'
  | 'ChatBot'
  | 'Couriers';

export type ModuleCategory =
  | 'Application Shell & Dashboards'
  | 'Authentication & Onboarding'
  | 'POS, Sales & Checkout'
  | 'Stock & Inventory'
  | 'Business Management'
  | 'Settings & Integrations';

export interface ModuleMetadata {
  name: ModuleName;
  title: string;
  category: ModuleCategory;
  route: string;
  kind: 'shell' | 'register' | 'page' | 'twosize' | 'modal';
  supportsKit?: boolean;
  supportsLang?: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  urdu?: string;
  cat: string;
  price: number;
  cost?: number;
  art?: string;
  color?: string;
  sku?: string;
  barcode?: string;
  variants?: Array<{
    size?: string;
    color?: string;
    stock?: number;
    sku?: string;
  }>;
  stock?: number;
  measured?: boolean;
  unit?: string;
}

export interface CartLine {
  key: string;
  id: string;
  name: string;
  variant?: string;
  qty: number;
  price: number;
  disc?: number;
  note?: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  city?: string;
  creditLimit?: number;
  balance?: number;
  visits?: number;
}

export interface ViewportMetrics {
  width: number;
  height: number;
  layout: LayoutMode;
  size: ViewportSizeMode;
  isNarrow: boolean;
  isMid: boolean;
  isCompactHeight: boolean;
}
