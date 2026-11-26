import type { ModuleMetadata, ModuleName } from '@/types/pos';

export const MODULE_LIST: ModuleMetadata[] = [
  {
    "name": "AddStock",
    "title": "AddStock",
    "category": "Stock & Inventory",
    "route": "/inventory/add-stock",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "App",
    "title": "Owner home",
    "category": "Application Shell & Dashboards",
    "route": "/owner",
    "kind": "shell",
    "supportsKit": true,
    "supportsLang": true
  },
  {
    "name": "BillBook",
    "title": "BillBook",
    "category": "POS, Sales & Checkout",
    "route": "/bills",
    "kind": "page",
    "supportsKit": true,
    "supportsLang": false
  },
  {
    "name": "Cash",
    "title": "Cash",
    "category": "Business Management",
    "route": "/cash",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "CashierHome",
    "title": "CashierHome",
    "category": "Application Shell & Dashboards",
    "route": "/cashier",
    "kind": "page",
    "supportsKit": true,
    "supportsLang": false
  },
  {
    "name": "Categories",
    "title": "Categories",
    "category": "Stock & Inventory",
    "route": "/inventory/categories",
    "kind": "modal",
    "supportsKit": true,
    "supportsLang": false
  },
  {
    "name": "ChatBot",
    "title": "ChatBot",
    "category": "Settings & Integrations",
    "route": "/modules/ChatBot",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Chats",
    "title": "Chats",
    "category": "Settings & Integrations",
    "route": "/chats",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Complete",
    "title": "Complete",
    "category": "POS, Sales & Checkout",
    "route": "/modules/Complete",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Couriers",
    "title": "Couriers",
    "category": "Settings & Integrations",
    "route": "/couriers",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "CreateAccount",
    "title": "Welcome",
    "category": "Authentication & Onboarding",
    "route": "/",
    "kind": "twosize",
    "supportsKit": true,
    "supportsLang": true
  },
  {
    "name": "CreateStyle",
    "title": "Create style",
    "category": "Stock & Inventory",
    "route": "/modules/CreateStyle",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Customer",
    "title": "Customer",
    "category": "POS, Sales & Checkout",
    "route": "/modules/Customer",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Discount",
    "title": "Discount",
    "category": "POS, Sales & Checkout",
    "route": "/modules/Discount",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Expenses",
    "title": "Expenses",
    "category": "Business Management",
    "route": "/expenses",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "HeldBills",
    "title": "HeldBills",
    "category": "POS, Sales & Checkout",
    "route": "/modules/HeldBills",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Inventory",
    "title": "Inventory",
    "category": "Stock & Inventory",
    "route": "/inventory",
    "kind": "modal",
    "supportsKit": true,
    "supportsLang": false
  },
  {
    "name": "Item",
    "title": "Sizes and colours",
    "category": "Stock & Inventory",
    "route": "/modules/Item",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "ItemEditor",
    "title": "ItemEditor",
    "category": "Stock & Inventory",
    "route": "/inventory/add",
    "kind": "modal",
    "supportsKit": true,
    "supportsLang": false
  },
  {
    "name": "Khata",
    "title": "Khata",
    "category": "Business Management",
    "route": "/customers",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "LineEdit",
    "title": "LineEdit",
    "category": "POS, Sales & Checkout",
    "route": "/modules/LineEdit",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Login",
    "title": "Login",
    "category": "Authentication & Onboarding",
    "route": "/staff-login",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Main",
    "title": "Register",
    "category": "Application Shell & Dashboards",
    "route": "/sell",
    "kind": "register",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Measured",
    "title": "Measured item",
    "category": "Stock & Inventory",
    "route": "/modules/Measured",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "NewPO",
    "title": "New purchase order",
    "category": "Stock & Inventory",
    "route": "/modules/NewPO",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "OpenShift",
    "title": "Open shift",
    "category": "POS, Sales & Checkout",
    "route": "/modules/OpenShift",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Orders",
    "title": "Orders",
    "category": "Business Management",
    "route": "/orders",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "OwnerHome",
    "title": "OwnerHome",
    "category": "Application Shell & Dashboards",
    "route": "/owner",
    "kind": "page",
    "supportsKit": true,
    "supportsLang": false
  },
  {
    "name": "PhotoHandoff",
    "title": "Photos from your phone",
    "category": "Stock & Inventory",
    "route": "/modules/PhotoHandoff",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Printer",
    "title": "Printer",
    "category": "POS, Sales & Checkout",
    "route": "/printer",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Purchasing",
    "title": "Purchasing",
    "category": "Business Management",
    "route": "/purchasing",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Quote",
    "title": "Quote",
    "category": "POS, Sales & Checkout",
    "route": "/modules/Quote",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Receipt80",
    "title": "Receipt80",
    "category": "POS, Sales & Checkout",
    "route": "/modules/Receipt80",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Receive",
    "title": "Receive goods",
    "category": "Stock & Inventory",
    "route": "/modules/Receive",
    "kind": "twosize",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "RegisterUrdu",
    "title": "Register in Urdu",
    "category": "Authentication & Onboarding",
    "route": "/sell/urdu",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Reports",
    "title": "Reports",
    "category": "Business Management",
    "route": "/reports",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Returns",
    "title": "Return or exchange",
    "category": "POS, Sales & Checkout",
    "route": "/modules/Returns",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetData",
    "title": "SetData",
    "category": "Settings & Integrations",
    "route": "/modules/SetData",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetFbr",
    "title": "SetFbr",
    "category": "Settings & Integrations",
    "route": "/modules/SetFbr",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetPayments",
    "title": "SetPayments",
    "category": "Settings & Integrations",
    "route": "/modules/SetPayments",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetPrinter",
    "title": "SetPrinter",
    "category": "Settings & Integrations",
    "route": "/modules/SetPrinter",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetReceipt",
    "title": "SetReceipt",
    "category": "Settings & Integrations",
    "route": "/modules/SetReceipt",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetSecurity",
    "title": "SetSecurity",
    "category": "Settings & Integrations",
    "route": "/modules/SetSecurity",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetShop",
    "title": "SetShop",
    "category": "Settings & Integrations",
    "route": "/modules/SetShop",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetTeam",
    "title": "SetTeam",
    "category": "Settings & Integrations",
    "route": "/modules/SetTeam",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SetWhatsApp",
    "title": "SetWhatsApp",
    "category": "Settings & Integrations",
    "route": "/modules/SetWhatsApp",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Settings",
    "title": "Settings",
    "category": "Settings & Integrations",
    "route": "/settings",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": true
  },
  {
    "name": "Setup",
    "title": "Set up this device",
    "category": "Authentication & Onboarding",
    "route": "/setup",
    "kind": "twosize",
    "supportsKit": false,
    "supportsLang": true
  },
  {
    "name": "Shift",
    "title": "Close shift",
    "category": "POS, Sales & Checkout",
    "route": "/modules/Shift",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "ShoeExchange",
    "title": "Shoe exchange",
    "category": "POS, Sales & Checkout",
    "route": "/modules/ShoeExchange",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SignIn",
    "title": "Counter sign-in",
    "category": "Authentication & Onboarding",
    "route": "/signin",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Staff",
    "title": "Staff",
    "category": "Business Management",
    "route": "/staff",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Stock",
    "title": "Stock",
    "category": "Stock & Inventory",
    "route": "/modules/Stock",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "StockCount",
    "title": "Stock count",
    "category": "Stock & Inventory",
    "route": "/modules/StockCount",
    "kind": "twosize",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "StockHome",
    "title": "StockHome",
    "category": "Application Shell & Dashboards",
    "route": "/stock",
    "kind": "page",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "SyncCheck",
    "title": "Sync check",
    "category": "Stock & Inventory",
    "route": "/modules/SyncCheck",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  },
  {
    "name": "Tender",
    "title": "Tender",
    "category": "POS, Sales & Checkout",
    "route": "/modules/Tender",
    "kind": "modal",
    "supportsKit": false,
    "supportsLang": false
  }
];

export const MODULE_MAP: Record<ModuleName, ModuleMetadata> = MODULE_LIST.reduce(
  (acc, item) => {
    acc[item.name] = item;
    return acc;
  },
  {} as Record<ModuleName, ModuleMetadata>
);

export const BOARD_WRAPPERS: Record<string, [ModuleName, string]> = {
  "Day": [
    "Main",
    "start=\"login\""
  ],
  "VariantPicker": [
    "Main",
    "state=\"size\""
  ],
  "MeasuredBlocked": [
    "Main",
    "state=\"blocked\""
  ],
  "StateScan": [
    "Main",
    "state=\"scan\""
  ],
  "StateRepeat": [
    "Main",
    "state=\"repeat\""
  ],
  "StateUnknown": [
    "Main",
    "state=\"unknown\""
  ],
  "StateOutOfStock": [
    "Main",
    "state=\"oos\""
  ],
  "StateOffline": [
    "Main",
    "offline=\"{{yes}}\""
  ],
  "StateLoading": [
    "Main",
    "loading=\"{{yes}}\""
  ],
  "StateCharging": [
    "Tender",
    "demo=\"charging\""
  ],
  "StatePrinter": [
    "Complete",
    "demo=\"printerFail\""
  ],
  "StateClear": [
    "Main",
    "state=\"clear\""
  ],
  "StateUndo": [
    "Main",
    "state=\"undo\""
  ],
  "StateMenu": [
    "Main",
    "state=\"menu\""
  ],
  "StateDiscounted": [
    "Main",
    "state=\"discounted\""
  ],
  "PayNotes": [
    "Tender",
    "demo=\"notes\""
  ],
  "PayJazz": [
    "Tender",
    "demo=\"jazz\""
  ],
  "PayRaast": [
    "Tender",
    "demo=\"raast\""
  ],
  "PaySplit": [
    "Tender",
    "demo=\"split\""
  ],
  "SaleCustomer": [
    "Complete",
    "demo=\"customer\""
  ],
  "ShiftReport": [
    "Shift",
    "stage=\"report\""
  ],
  "SizeLaptop": [
    "Main",
    "layout=\"laptop\" keyboard=\"{{yes}}\""
  ],
  "SizeTablet": [
    "Main",
    "layout=\"tablet\""
  ],
  "SizePortrait": [
    "Main",
    "layout=\"portrait\" state=\"billSheet\""
  ],
  "ReceiptFBR": [
    "Receipt80",
    "fbr=\"connected\""
  ],
  "AppCashier": [
    "App",
    "role=\"cashier\""
  ],
  "AppStockkeeper": [
    "App",
    "role=\"inventory\" lang=\"roman\""
  ],
  "AppUrdu": [
    "App",
    "lang=\"ur\""
  ],
  "AppTablet": [
    "App",
    "layout=\"tablet\""
  ],
  "AppPhone": [
    "App",
    "layout=\"phone\""
  ],
  "AppPhoneMore": [
    "App",
    "layout=\"phone\" demo=\"more\""
  ],
  "OwnerReview": [
    "OwnerHome",
    "demo=\"review\""
  ],
  "AppBills": [
    "App",
    "role=\"cashier\" page=\"bills\""
  ],
  "AppPrinter": [
    "App",
    "role=\"cashier\" page=\"printer\""
  ],
  "AppCashierPhone": [
    "App",
    "role=\"cashier\" layout=\"phone\""
  ],
  "AppBillsPhone": [
    "App",
    "role=\"cashier\" layout=\"phone\" page=\"bills\""
  ],
  "QuotePreview": [
    "Quote",
    "demo=\"preview\""
  ],
  "BillRefund": [
    "BillBook",
    "demo=\"refund\""
  ],
  "BillReprint": [
    "BillBook",
    "role=\"owner\" demo=\"reprint\""
  ],
  "SignInError": [
    "SignIn",
    "demo=\"error\""
  ],
  "SignInExpired": [
    "SignIn",
    "demo=\"expired\""
  ],
  "SyncCheckOffline": [
    "SyncCheck",
    "demo=\"offline\""
  ],
  "AppKhata": [
    "App",
    "page=\"khata\""
  ],
  "AppKhataCashier": [
    "App",
    "role=\"cashier\" page=\"khata\""
  ],
  "AppKhataPhone": [
    "App",
    "layout=\"phone\" page=\"khata\""
  ],
  "KhataProfile": [
    "Khata",
    "demo=\"profile\""
  ],
  "KhataCollect": [
    "Khata",
    "demo=\"collect\""
  ],
  "KhataReminder": [
    "Khata",
    "demo=\"reminder\""
  ],
  "KhataConsent": [
    "Khata",
    "demo=\"consent\""
  ],
  "KhataRefund": [
    "Khata",
    "demo=\"refund\""
  ],
  "AppStockHome": [
    "App",
    "role=\"inventory\""
  ],
  "AppStockHomePhone": [
    "App",
    "role=\"inventory\" layout=\"phone\""
  ],
  "AppStock": [
    "App",
    "page=\"stock\""
  ],
  "AppStockCashier": [
    "App",
    "role=\"cashier\" page=\"stock\""
  ],
  "AppStockPhone": [
    "App",
    "role=\"inventory\" layout=\"phone\" page=\"stock\""
  ],
  "StockDrawer": [
    "Stock",
    "demo=\"drawer\""
  ],
  "StockAdjust": [
    "Stock",
    "demo=\"adjust\""
  ],
  "StockConflict": [
    "Stock",
    "demo=\"conflict\""
  ],
  "StockPrice": [
    "Stock",
    "role=\"owner\" demo=\"price\""
  ],
  "StockAdd": [
    "Stock",
    "demo=\"add\""
  ],
  "CreateStyleTooMany": [
    "CreateStyle",
    "demo=\"toomany\""
  ],
  "CreateStyleTaken": [
    "CreateStyle",
    "demo=\"taken\""
  ],
  "CreateStyleDone": [
    "CreateStyle",
    "demo=\"done\""
  ],
  "StockCountReview": [
    "StockCount",
    "demo=\"review\""
  ],
  "StockCountDone": [
    "StockCount",
    "demo=\"done\""
  ],
  "StockCountPhone": [
    "StockCount",
    "size=\"phone\""
  ],
  "MeasuredStockkeeper": [
    "Measured",
    "role=\"inventory\""
  ],
  "MeasuredApprove": [
    "Measured",
    "demo=\"approve\""
  ],
  "MeasuredCount": [
    "Measured",
    "demo=\"count\""
  ],
  "AppSuppliers": [
    "App",
    "page=\"suppliers\""
  ],
  "AppSuppliersStock": [
    "App",
    "role=\"inventory\" page=\"suppliers\""
  ],
  "AppSuppliersPhone": [
    "App",
    "layout=\"phone\" page=\"suppliers\""
  ],
  "PurchasingApprove": [
    "Purchasing",
    "demo=\"approve\""
  ],
  "PurchasingOrder": [
    "Purchasing",
    "demo=\"po\""
  ],
  "PurchasingBills": [
    "Purchasing",
    "tab=\"bills\""
  ],
  "PurchasingPost": [
    "Purchasing",
    "demo=\"post\""
  ],
  "PurchasingEnter": [
    "Purchasing",
    "demo=\"enter\""
  ],
  "PurchasingPay": [
    "Purchasing",
    "demo=\"pay\""
  ],
  "PurchasingCredit": [
    "Purchasing",
    "demo=\"credit\""
  ],
  "PurchasingSuppliers": [
    "Purchasing",
    "demo=\"supplier\""
  ],
  "PurchasingAddSupplier": [
    "Purchasing",
    "demo=\"addsup\""
  ],
  "PurchasingStock": [
    "Purchasing",
    "role=\"inventory\""
  ],
  "NewPOStock": [
    "NewPO",
    "role=\"inventory\" demo=\"empty\""
  ],
  "NewPODone": [
    "NewPO",
    "demo=\"done\""
  ],
  "ReceivePartial": [
    "Receive",
    "po=\"114\""
  ],
  "ReceiveCost": [
    "Receive",
    "po=\"116\" demo=\"cost\""
  ],
  "ReceiveOver": [
    "Receive",
    "po=\"114\" demo=\"over\""
  ],
  "ReceiveDone": [
    "Receive",
    "po=\"116\" demo=\"done\""
  ],
  "ReceivePhone": [
    "Receive",
    "po=\"116\" size=\"phone\""
  ],
  "ReceivePartialPhone": [
    "Receive",
    "po=\"114\" size=\"phone\""
  ],
  "AppCash": [
    "App",
    "page=\"cash\""
  ],
  "AppExpenses": [
    "App",
    "page=\"expenses\""
  ],
  "AppStaff": [
    "App",
    "page=\"staff\""
  ],
  "AppCashPhone": [
    "App",
    "layout=\"phone\" page=\"cash\""
  ],
  "CashClose": [
    "Cash",
    "demo=\"close\""
  ],
  "CashShort": [
    "Cash",
    "demo=\"short\""
  ],
  "CashOpen": [
    "Cash",
    "demo=\"open\""
  ],
  "CashBook": [
    "Cash",
    "tab=\"book\""
  ],
  "CashEntries": [
    "Cash",
    "tab=\"entries\""
  ],
  "CashEntry": [
    "Cash",
    "demo=\"entry\""
  ],
  "CashEntryNew": [
    "Cash",
    "demo=\"new\""
  ],
  "ExpensesBill": [
    "Expenses",
    "demo=\"bill\""
  ],
  "ExpensesPay": [
    "Expenses",
    "demo=\"pay\""
  ],
  "ExpensesNew": [
    "Expenses",
    "demo=\"new\""
  ],
  "ExpensesMonthly": [
    "Expenses",
    "tab=\"monthly\""
  ],
  "ExpensesMonthlyNew": [
    "Expenses",
    "demo=\"rec\""
  ],
  "StaffLine": [
    "Staff",
    "demo=\"line\""
  ],
  "StaffPosted": [
    "Staff",
    "demo=\"posted\""
  ],
  "StaffPay": [
    "Staff",
    "demo=\"pay\""
  ],
  "StaffList": [
    "Staff",
    "tab=\"staff\""
  ],
  "StaffPerson": [
    "Staff",
    "demo=\"person\""
  ],
  "StaffAdvance": [
    "Staff",
    "demo=\"advance\""
  ],
  "StaffPhone": [
    "Staff",
    "size=\"phone\" w=\"390\" h=\"844\""
  ],
  "AppReports": [
    "App",
    "page=\"reports\""
  ],
  "AppReportsPhone": [
    "App",
    "layout=\"phone\" page=\"reports\""
  ],
  "AppBranchSwitch": [
    "App",
    "demo=\"switch\""
  ],
  "SignInOwnerDHA": [
    "SignIn",
    "who=\"owner\" branch=\"dha\""
  ],
  "ReportsBalances": [
    "Reports",
    "tab=\"tb\""
  ],
  "ReportsJournals": [
    "Reports",
    "tab=\"journals\""
  ],
  "ReportsActivity": [
    "Reports",
    "tab=\"activity\""
  ],
  "ReportsChecks": [
    "Reports",
    "tab=\"checks\""
  ],
  "ReportsIssue": [
    "Reports",
    "demo=\"issue\""
  ],
  "ReportsPhone": [
    "Reports",
    "size=\"phone\" w=\"390\" h=\"844\""
  ],
  "AppOrders": [
    "App",
    "page=\"orders\""
  ],
  "AppOrdersCashier": [
    "App",
    "role=\"cashier\" page=\"orders\""
  ],
  "AppOrdersStock": [
    "App",
    "role=\"inventory\" page=\"orders\""
  ],
  "AppOrdersPhone": [
    "App",
    "layout=\"phone\" page=\"orders\""
  ],
  "OrdersDetail": [
    "Orders",
    "demo=\"order\""
  ],
  "OrdersNew": [
    "Orders",
    "demo=\"new\""
  ],
  "OrdersConfirm": [
    "Orders",
    "demo=\"confirm\""
  ],
  "OrdersPack": [
    "Orders",
    "demo=\"pack\""
  ],
  "OrdersDelivery": [
    "Orders",
    "demo=\"status\""
  ],
  "OrdersReturn": [
    "Orders",
    "demo=\"inspect\""
  ],
  "OrdersCod": [
    "Orders",
    "demo=\"cod\""
  ],
  "OrdersShipments": [
    "Orders",
    "tab=\"ships\""
  ],
  "OrdersMessages": [
    "Orders",
    "tab=\"msgs\""
  ],
  "OrdersPhone": [
    "Orders",
    "size=\"phone\" w=\"390\" h=\"844\""
  ],
  "AppSettings": [
    "App",
    "page=\"settings\""
  ],
  "SettingsStaff": [
    "App",
    "page=\"settings\" setsec=\"staff\""
  ],
  "SettingsDevice": [
    "App",
    "page=\"settings\" setsec=\"device\""
  ],
  "SettingsPrinter": [
    "App",
    "page=\"settings\" setsec=\"printer\""
  ],
  "SettingsReceipt": [
    "App",
    "page=\"settings\" setsec=\"receipt\""
  ],
  "SettingsFbr": [
    "App",
    "page=\"settings\" setsec=\"fbr\""
  ],
  "SettingsFbrConnect": [
    "App",
    "page=\"settings\" setsec=\"fbr\" setsub=\"steps\""
  ],
  "SettingsFbrPos": [
    "App",
    "page=\"settings\" setsec=\"fbr\" setsub=\"pos\""
  ],
  "SettingsFbrTest": [
    "App",
    "page=\"settings\" setsec=\"fbr\" setsub=\"test\""
  ],
  "SettingsFbrOn": [
    "App",
    "page=\"settings\" setsec=\"fbr\" setsub=\"on\""
  ],
  "SettingsLanguage": [
    "App",
    "page=\"settings\" setsec=\"lang\""
  ],
  "SettingsConnections": [
    "App",
    "page=\"settings\" setsec=\"conn\""
  ],
  "SettingsStaffManage": [
    "App",
    "page=\"settings\" setsec=\"staff\" setsub=\"manage\""
  ],
  "SettingsRoles": [
    "App",
    "page=\"settings\" setsec=\"staff\" setsub=\"roles\""
  ],
  "SettingsApprovals": [
    "App",
    "page=\"settings\" setsec=\"staff\" setsub=\"limits\""
  ],
  "SettingsPayments": [
    "App",
    "page=\"settings\" setsec=\"pay\""
  ],
  "SettingsPrinterAdd": [
    "App",
    "page=\"settings\" setsec=\"printer\" setsub=\"add\""
  ],
  "SettingsWhatsApp": [
    "App",
    "page=\"settings\" setsec=\"wa\""
  ],
  "SettingsWhatsAppLink": [
    "App",
    "page=\"settings\" setsec=\"wa\" setsub=\"qr\""
  ],
  "SettingsWhatsAppApi": [
    "App",
    "page=\"settings\" setsec=\"wa\" setsub=\"api\""
  ],
  "SettingsWhatsAppOn": [
    "App",
    "page=\"settings\" setsec=\"wa\" setsub=\"on\""
  ],
  "SettingsSecurity": [
    "App",
    "page=\"settings\" setsec=\"security\""
  ],
  "SettingsData": [
    "App",
    "page=\"settings\" setsec=\"data\""
  ],
  "SettingsPhone": [
    "Settings",
    "size=\"phone\" w=\"390\" h=\"844\""
  ],
  "SetupSignIn": [
    "Setup",
    "step=\"signin\""
  ],
  "SetupSignInError": [
    "Setup",
    "step=\"signin\" demo=\"error\""
  ],
  "SetupShop": [
    "Setup",
    "step=\"shop\""
  ],
  "SetupDevice": [
    "Setup",
    "step=\"device\""
  ],
  "SetupPrinter": [
    "Setup",
    "step=\"printer\""
  ],
  "SetupProducts": [
    "Setup",
    "step=\"products\" demo=\"downloading\""
  ],
  "SetupReady": [
    "Setup",
    "step=\"ready\""
  ],
  "SetupReadyCashier": [
    "Setup",
    "step=\"ready\" who=\"cashier\""
  ],
  "SetupUrdu": [
    "Setup",
    "lang=\"ur\" step=\"lang\""
  ],
  "SetupShopUrdu": [
    "Setup",
    "lang=\"ur\" step=\"shop\""
  ],
  "SetupReadyUrdu": [
    "Setup",
    "lang=\"ur\" step=\"ready\""
  ],
  "SetupRoman": [
    "Setup",
    "lang=\"roman\" step=\"device\""
  ],
  "SetupPhone": [
    "Setup",
    "size=\"phone\" w=\"390\" h=\"844\" step=\"device\""
  ],
  "SetupPhoneUrdu": [
    "Setup",
    "size=\"phone\" w=\"390\" h=\"844\" lang=\"ur\" step=\"printer\""
  ],
  "AppOrdersLaptop": [
    "App",
    "page=\"orders\" w=\"1366\" h=\"768\""
  ],
  "AppReportsLaptop": [
    "App",
    "page=\"reports\" w=\"1366\" h=\"768\""
  ],
  "AppSettingsTablet": [
    "App",
    "layout=\"tablet\" page=\"settings\""
  ],
  "AppCashTablet": [
    "App",
    "layout=\"tablet\" page=\"cash\""
  ],
  "AppStaffPortrait": [
    "App",
    "layout=\"tablet\" w=\"768\" h=\"1024\" page=\"staff\""
  ],
  "AppOrdersPortrait": [
    "App",
    "layout=\"tablet\" w=\"768\" h=\"1024\" page=\"orders\""
  ],
  "AppOrders360": [
    "App",
    "layout=\"phone\" w=\"360\" h=\"740\" page=\"orders\""
  ],
  "AppCash360": [
    "App",
    "layout=\"phone\" w=\"360\" h=\"740\" page=\"cash\""
  ],
  "AppStock360": [
    "App",
    "role=\"cashier\" layout=\"phone\" w=\"360\" h=\"740\" page=\"stock\""
  ],
  "SetupTablet": [
    "Setup",
    "w=\"1024\" h=\"600\" step=\"shop\""
  ],
  "Setup360": [
    "Setup",
    "size=\"phone\" w=\"360\" h=\"740\" lang=\"ur\" step=\"device\""
  ],
  "SignInPortrait": [
    "SignIn",
    "who=\"owner\" w=\"768\" h=\"1024\""
  ],
  "SignInPhone": [
    "SignIn",
    "w=\"390\" h=\"844\""
  ],
  "SignIn360": [
    "SignIn",
    "w=\"360\" h=\"740\""
  ],
  "PhotoHandoffReceived": [
    "PhotoHandoff",
    "demo=\"received\""
  ],
  "PhotoHandoffComputer": [
    "PhotoHandoff",
    "tab=\"pc\" demo=\"waiting\""
  ],
  "PhotoHandoffWebcam": [
    "PhotoHandoff",
    "tab=\"cam\" demo=\"waiting\""
  ],
  "AppAddItem": [
    "App",
    "role=\"owner\" page=\"additem\" idemo=\"empty\""
  ],
  "AppAddStock": [
    "App",
    "role=\"owner\" page=\"addstock\" asdemo=\"list\""
  ],
  "AppAddStockNew": [
    "App",
    "role=\"owner\" page=\"addstock\" asdemo=\"new\""
  ],
  "AppAddStockDone": [
    "App",
    "role=\"owner\" page=\"addstock\" asdemo=\"done\""
  ],
  "AppAddItemFilled": [
    "App",
    "role=\"owner\" page=\"additem\" idemo=\"filled\""
  ],
  "AppAddItemFull": [
    "App",
    "role=\"owner\" page=\"additem\" idemo=\"filled\" w=\"1280\" h=\"1560\""
  ],
  "AppAddItemCheck": [
    "App",
    "role=\"owner\" page=\"additem\" idemo=\"errors\""
  ],
  "AppAddItemSaved": [
    "App",
    "role=\"owner\" page=\"additem\" idemo=\"done\""
  ],
  "AppAddItemNewCat": [
    "App",
    "role=\"owner\" page=\"additem\" idemo=\"newcat\""
  ],
  "AppEditItem": [
    "App",
    "role=\"owner\" page=\"additem\" idemo=\"edit\""
  ],
  "AppAddItemStockkeeper": [
    "App",
    "role=\"inventory\" page=\"additem\" idemo=\"filled\""
  ],
  "AppAddItemShoes": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"shoes\" idemo=\"filled\""
  ],
  "AppAddItemJewellery": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"jewellery\" idemo=\"filled\""
  ],
  "AppAddItemPharmacy": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"pharmacy\" idemo=\"filled\""
  ],
  "AppAddItemPharmacyFull": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"pharmacy\" idemo=\"errors\" w=\"1280\" h=\"1400\""
  ],
  "AppAddItemGrocery": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"grocery\" idemo=\"filled\""
  ],
  "AppAddItemLoose": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"grocery\" idemo=\"loose\""
  ],
  "AppAddItemCosmetics": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"cosmetics\" idemo=\"filled\""
  ],
  "AppAddItemMobile": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"mobile\" idemo=\"filled\""
  ],
  "AppAddItemOther": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"other\" idemo=\"filled\""
  ],
  "AppCategories": [
    "App",
    "role=\"owner\" page=\"categories\""
  ],
  "AppCategoryNew": [
    "App",
    "role=\"owner\" page=\"categories\" cdemo=\"new\""
  ],
  "AppCategoryEdit": [
    "App",
    "role=\"owner\" page=\"categories\" cdemo=\"edit\""
  ],
  "AppCategoryDelete": [
    "App",
    "role=\"owner\" page=\"categories\" cdemo=\"delete\""
  ],
  "AppCategoryDeleteEmpty": [
    "App",
    "role=\"owner\" page=\"categories\" cdemo=\"deleteEmpty\""
  ],
  "AppStockShoes": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"shoes\""
  ],
  "AppStockShoesGaps": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"shoes\" sdemo=\"tab2\""
  ],
  "AppStockShoesArticle": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"shoes\" sdemo=\"item\""
  ],
  "AppStockShoesReceive": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"shoes\" sdemo=\"receive\""
  ],
  "AppStockShoesReorder": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"shoes\" sdemo=\"insight\""
  ],
  "AppStockShoesIdle": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"shoes\" sdemo=\"tab3\""
  ],
  "AppStockPharmacy": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"pharmacy\""
  ],
  "AppStockPharmacySoon": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"pharmacy\" sdemo=\"tab2\""
  ],
  "AppStockPharmacyExpired": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"pharmacy\" sdemo=\"tab3\""
  ],
  "AppStockPharmacyMedicine": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"pharmacy\" sdemo=\"item\""
  ],
  "AppStockPharmacyBatch": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"pharmacy\" sdemo=\"receive\""
  ],
  "AppStockPharmacyReturn": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"pharmacy\" sdemo=\"insight\""
  ],
  "AppAddItemShoesCarton": [
    "App",
    "role=\"owner\" page=\"additem\" kit=\"shoes\" idemo=\"filled\" w=\"1280\" h=\"1560\""
  ],
  "AppStockShoesEdit": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"shoes\" sdemo=\"editsc\""
  ],
  "AppStockShoesAdjust": [
    "App",
    "role=\"owner\" page=\"stock\" kit=\"shoes\" sdemo=\"adjust\""
  ],
  "ShoeExchangeFind": [
    "ShoeExchange",
    "demo=\"find\""
  ],
  "ShoeExchangeChoose": [
    "ShoeExchange",
    "demo=\"choose\""
  ],
  "ShoeExchangeSoldOut": [
    "ShoeExchange",
    "demo=\"sold\""
  ],
  "ShoeExchangeOther": [
    "ShoeExchange",
    "demo=\"other\""
  ],
  "ShoeExchangeFault": [
    "ShoeExchange",
    "demo=\"fault\""
  ],
  "ShoeExchangeDone": [
    "ShoeExchange",
    "demo=\"done\""
  ],
  "AppHomeShoes": [
    "App",
    "role=\"owner\" page=\"home\" kit=\"shoes\""
  ],
  "AppCashierShoes": [
    "App",
    "role=\"cashier\" page=\"home\" kit=\"shoes\""
  ],
  "AppBillsShoes": [
    "App",
    "role=\"cashier\" page=\"bills\" kit=\"shoes\""
  ],
  "AppStockShoesCashier": [
    "App",
    "role=\"cashier\" page=\"stock\" kit=\"shoes\""
  ],
  "AppStockPharmacyCashier": [
    "App",
    "role=\"cashier\" page=\"stock\" kit=\"pharmacy\""
  ],
  "AppNoAccess": [
    "App",
    "role=\"cashier\" page=\"categories\""
  ],
  "AccountWelcome": [
    "CreateAccount",
    "step=\"welcome\""
  ],
  "AccountWelcomeUrdu": [
    "CreateAccount",
    "step=\"welcome\" lang=\"ur\""
  ],
  "AccountWelcomePhone": [
    "CreateAccount",
    "step=\"welcome\" size=\"phone\""
  ],
  "AccountPhone": [
    "CreateAccount",
    "step=\"phone\""
  ],
  "AccountPhoneTaken": [
    "CreateAccount",
    "step=\"phone\" demo=\"taken\""
  ],
  "AccountCode": [
    "CreateAccount",
    "step=\"code\""
  ],
  "AccountCodeError": [
    "CreateAccount",
    "step=\"code\" demo=\"codeError\""
  ],
  "AccountYou": [
    "CreateAccount",
    "step=\"you\""
  ],
  "AccountYouWeak": [
    "CreateAccount",
    "step=\"you\" demo=\"weak\""
  ],
  "AccountShop": [
    "CreateAccount",
    "step=\"shop\""
  ],
  "AccountKind": [
    "CreateAccount",
    "step=\"kind\" kit=\"shoes\""
  ],
  "AccountKindPharmacy": [
    "CreateAccount",
    "step=\"kind\" kit=\"pharmacy\""
  ],
  "AccountBuilding": [
    "CreateAccount",
    "step=\"building\""
  ],
  "AccountReady": [
    "CreateAccount",
    "step=\"ready\""
  ],
  "AccountKindPhone": [
    "CreateAccount",
    "step=\"kind\" size=\"phone\""
  ],
  "AccountReadyPhone": [
    "CreateAccount",
    "step=\"ready\" size=\"phone\""
  ],
  "AccountSignIn": [
    "CreateAccount",
    "step=\"signin\" demo=\"empty\""
  ],
  "AccountSignInError": [
    "CreateAccount",
    "step=\"signin\" demo=\"wrongPassword\""
  ],
  "AccountForgot": [
    "CreateAccount",
    "step=\"forgot\""
  ],
  "AccountReset": [
    "CreateAccount",
    "step=\"reset\""
  ],
  "AccountJoin": [
    "CreateAccount",
    "step=\"join\""
  ],
  "AccountJoinNoInvite": [
    "CreateAccount",
    "step=\"join\" demo=\"noInvite\""
  ],
  "AccountJoinPin": [
    "CreateAccount",
    "step=\"joinPin\""
  ],
  "AccountJoinPinMismatch": [
    "CreateAccount",
    "step=\"joinPin\" demo=\"pinMismatch\""
  ],
  "AccountJoinDone": [
    "CreateAccount",
    "step=\"joinDone\""
  ],
  "AppChats": [
    "App",
    "page=\"chats\""
  ],
  "AppChatsOrder": [
    "App",
    "page=\"chats\" pdemo=\"order\""
  ],
  "AppChatsItem": [
    "App",
    "page=\"chats\" pdemo=\"items\""
  ],
  "AppChatsTemplate": [
    "App",
    "page=\"chats\" pdemo=\"template\""
  ],
  "AppChatsCashier": [
    "App",
    "role=\"cashier\" page=\"chats\""
  ],
  "AppChatbot": [
    "App",
    "page=\"chats\" subtab=\"bot\""
  ],
  "AppChatbotTest": [
    "App",
    "page=\"chats\" subtab=\"bot\" pdemo=\"botTest\""
  ],
  "AppChatsTablet": [
    "App",
    "layout=\"tablet\" page=\"chats\""
  ],
  "AppChatsPhone": [
    "App",
    "layout=\"phone\" page=\"chats\""
  ],
  "AppChatsPhoneOpen": [
    "App",
    "layout=\"phone\" page=\"chats\" pdemo=\"open\""
  ],
  "AppCouriers": [
    "App",
    "page=\"couriers\""
  ],
  "AppCouriersTrack": [
    "App",
    "page=\"couriers\" pdemo=\"track\""
  ],
  "AppCouriersBook": [
    "App",
    "page=\"couriers\" subtab=\"book\""
  ],
  "AppCouriersBooked": [
    "App",
    "page=\"couriers\" pdemo=\"booked\""
  ],
  "AppCouriersCod": [
    "App",
    "page=\"couriers\" subtab=\"cod\""
  ],
  "AppCouriersReturns": [
    "App",
    "page=\"couriers\" subtab=\"ret\""
  ],
  "AppCouriersAccounts": [
    "App",
    "page=\"couriers\" subtab=\"acc\""
  ],
  "AppCouriersConnect": [
    "App",
    "page=\"couriers\" pdemo=\"connect\""
  ],
  "AppCouriersTablet": [
    "App",
    "layout=\"tablet\" page=\"couriers\""
  ],
  "AppCouriersPhone": [
    "App",
    "layout=\"phone\" page=\"couriers\""
  ],
  "SettingsStaffAdd": [
    "App",
    "page=\"settings\" setsec=\"staff\" setdemo=\"add\""
  ]
};

export const BOARD_TITLES: Record<string, string> = {
  "Day": "Start of day",
  "VariantPicker": "Size and colour picker",
  "MeasuredBlocked": "Measured item locked",
  "StateScan": "Scan adds an item",
  "StateRepeat": "Same item scanned again",
  "StateUnknown": "Unknown barcode",
  "StateOutOfStock": "Item out of stock",
  "StateOffline": "Internet drops",
  "StateLoading": "Catalogue loading",
  "StateCharging": "Charging",
  "StatePrinter": "Printer fails",
  "StateClear": "Clear asks once",
  "StateUndo": "Undo for 5 seconds",
  "StateMenu": "Staff menu",
  "StateDiscounted": "Discount on the bill",
  "PayNotes": "Tap the notes",
  "PayJazz": "JazzCash",
  "PayRaast": "Raast QR",
  "PaySplit": "Split payment",
  "SaleCustomer": "Sale with a customer",
  "ShiftReport": "Shift report",
  "SizeLaptop": "Laptop 1366 by 768",
  "SizeTablet": "Tablet 1024 by 600",
  "SizePortrait": "Portrait tablet",
  "ReceiptFBR": "FBR receipt",
  "AppCashier": "Cashier shell",
  "AppStockkeeper": "Stockkeeper shell, Roman Urdu",
  "AppUrdu": "Urdu menus",
  "AppTablet": "Tablet shell",
  "AppPhone": "Phone shell",
  "AppPhoneMore": "Phone More sheet",
  "OwnerReview": "Owner review drawer",
  "AppBills": "Bill book in the shell",
  "AppPrinter": "Printer in the shell",
  "AppCashierPhone": "Cashier home on phone",
  "AppBillsPhone": "Bill book on phone",
  "QuotePreview": "Quote PDF preview",
  "BillRefund": "Pay a refund",
  "BillReprint": "Owner reprint",
  "SignInError": "Sign-in error",
  "SignInExpired": "Session expired",
  "SyncCheckOffline": "Unconfirmed sales while offline",
  "AppKhata": "Khata in the owner shell",
  "AppKhataCashier": "Khata for a cashier",
  "AppKhataPhone": "Khata on the owner phone",
  "KhataProfile": "Customer statement",
  "KhataCollect": "Collect a payment",
  "KhataReminder": "Payment reminder draft",
  "KhataConsent": "Record offers consent",
  "KhataRefund": "Pay a refund owed",
  "AppStockHome": "Stockkeeper home",
  "AppStockHomePhone": "Stockkeeper home on a phone",
  "AppStock": "Stock in the owner shell",
  "AppStockCashier": "Stock look-up for a cashier",
  "AppStockPhone": "Stock on the stockkeeper phone",
  "StockDrawer": "Product with size and colour grid",
  "StockAdjust": "Change stock with a reason",
  "StockConflict": "Stock changed while editing",
  "StockPrice": "Owner changes a price",
  "StockAdd": "Add a one-size product",
  "CreateStyleTooMany": "Style over 60 SKUs",
  "CreateStyleTaken": "Style code already used",
  "CreateStyleDone": "Style created",
  "StockCountReview": "Count review with a held-stock error",
  "StockCountDone": "Count saved",
  "StockCountPhone": "Count on a phone",
  "MeasuredStockkeeper": "Fabric pilot, stockkeeper view",
  "MeasuredApprove": "Approve a fabric delivery",
  "MeasuredCount": "Count fabric with evidence",
  "AppSuppliers": "Suppliers in the owner shell",
  "AppSuppliersStock": "Suppliers for the stockkeeper",
  "AppSuppliersPhone": "Suppliers on the owner phone",
  "PurchasingApprove": "Approve a draft order",
  "PurchasingOrder": "Order on the way",
  "PurchasingBills": "Bills and what you owe",
  "PurchasingPost": "Post a supplier bill",
  "PurchasingEnter": "Enter a supplier bill",
  "PurchasingPay": "Pay a supplier in cash",
  "PurchasingCredit": "Record a supplier credit",
  "PurchasingSuppliers": "Supplier directory",
  "PurchasingAddSupplier": "Add a supplier",
  "PurchasingStock": "Stockkeeper view of orders",
  "NewPOStock": "New order by the stockkeeper",
  "NewPODone": "Order approved",
  "ReceivePartial": "Receive the rest of an order",
  "ReceiveCost": "Receive with a cost change",
  "ReceiveOver": "More than ordered is blocked",
  "ReceiveDone": "Delivery received",
  "ReceivePhone": "Receive on a phone",
  "ReceivePartialPhone": "Receive the rest on a phone",
  "AppCash": "Cash in the owner shell",
  "AppExpenses": "Expenses in the owner shell",
  "AppStaff": "Staff and payroll in the owner shell",
  "AppCashPhone": "Cash on the owner phone",
  "CashClose": "Count and close a shift",
  "CashShort": "Drawer short at close",
  "CashOpen": "Open a shift with a float",
  "CashBook": "Cash book and books check",
  "CashEntries": "Cash entries for review",
  "CashEntry": "A cash entry to check",
  "CashEntryNew": "New cash entry",
  "ExpensesBill": "An expense bill",
  "ExpensesPay": "Pay an expense in cash",
  "ExpensesNew": "New expense bill",
  "ExpensesMonthly": "Monthly bills",
  "ExpensesMonthlyNew": "New monthly bill",
  "StaffLine": "Change one person’s pay",
  "StaffPosted": "Posted payroll to pay",
  "StaffPay": "Pay a salary in cash",
  "StaffList": "Staff and sign-in roles",
  "StaffPerson": "One person",
  "StaffAdvance": "Give a cash advance",
  "StaffPhone": "Payroll on a phone",
  "AppReports": "Reports in the owner shell",
  "AppReportsPhone": "Reports on the owner phone",
  "AppBranchSwitch": "Switch branch · sign in again",
  "SignInOwnerDHA": "Owner signs in to another branch",
  "ReportsBalances": "Trial balance",
  "ReportsJournals": "Journals",
  "ReportsActivity": "Activity",
  "ReportsChecks": "Books check",
  "ReportsIssue": "Books check found a problem",
  "ReportsPhone": "Reports on a phone",
  "AppOrders": "Orders board in the owner shell",
  "AppOrdersCashier": "Orders for a cashier",
  "AppOrdersStock": "Orders for the stockkeeper",
  "AppOrdersPhone": "Orders on the owner phone",
  "OrdersDetail": "Order detail",
  "OrdersNew": "New order from WhatsApp",
  "OrdersConfirm": "Confirm order · holds stock",
  "OrdersPack": "Pack for courier",
  "OrdersDelivery": "Update delivery",
  "OrdersReturn": "Check returned items",
  "OrdersCod": "Match courier payment",
  "OrdersShipments": "Shipments and COD",
  "OrdersMessages": "Message drafts · not sent",
  "OrdersPhone": "Orders on a phone",
  "AppSettings": "Settings in the owner shell",
  "SettingsStaff": "Settings · team: people, roles and branches",
  "SettingsDevice": "Settings · this device",
  "SettingsPrinter": "Settings · receipt and label printers",
  "SettingsReceipt": "Settings · receipt editor with preview",
  "SettingsFbr": "Settings · tax and FBR: who must connect",
  "SettingsFbrConnect": "Settings · FBR step 1: NTN and STRN",
  "SettingsFbrPos": "Settings · FBR step 2: POS IDs from IRIS",
  "SettingsFbrTest": "Settings · FBR step 3: test invoice",
  "SettingsFbrOn": "Settings · FBR live: bills, sales tax, waiting to send",
  "SettingsLanguage": "Settings · language",
  "SettingsConnections": "Settings · couriers and online store",
  "SettingsStaffManage": "Settings · team: change a person’s role, branches, PIN",
  "SettingsRoles": "Settings · team: roles and what each can do",
  "SettingsApprovals": "Settings · team: approvals and limits",
  "SettingsPayments": "Settings · payments, Khata limit, rounding",
  "SettingsPrinterAdd": "Settings · add a printer",
  "SettingsWhatsApp": "Settings · WhatsApp: pick how to connect",
  "SettingsWhatsAppLink": "Settings · WhatsApp: scan the code with the shop phone",
  "SettingsWhatsAppApi": "Settings · WhatsApp Business API steps",
  "SettingsWhatsAppOn": "Settings · WhatsApp connected: what ZYRO sends, wording",
  "SettingsSecurity": "Settings · security, PINs and signed-in devices",
  "SettingsData": "Settings · backup and export",
  "SettingsPhone": "Settings on a phone",
  "SetupSignIn": "Setup · sign in",
  "SetupSignInError": "Setup · wrong password",
  "SetupShop": "Setup · your shop",
  "SetupDevice": "Setup · this device",
  "SetupPrinter": "Setup · printer",
  "SetupProducts": "Setup · downloading items",
  "SetupReady": "Setup · ready",
  "SetupReadyCashier": "Setup · ready for a cashier",
  "SetupUrdu": "Setup in Urdu · language",
  "SetupShopUrdu": "Setup in Urdu · your shop",
  "SetupReadyUrdu": "Setup in Urdu · ready",
  "SetupRoman": "Setup in Roman Urdu",
  "SetupPhone": "Setup on a phone",
  "SetupPhoneUrdu": "Setup on a phone in Urdu",
  "AppOrdersLaptop": "Orders · laptop 1366 × 768",
  "AppReportsLaptop": "Reports · laptop 1366 × 768",
  "AppSettingsTablet": "Settings · tablet 1024 × 600",
  "AppCashTablet": "Cash · tablet 1024 × 600",
  "AppStaffPortrait": "Staff and pay · portrait 768 × 1024",
  "AppOrdersPortrait": "Orders · portrait 768 × 1024",
  "AppOrders360": "Orders · small phone 360",
  "AppCash360": "Cash · small phone 360",
  "AppStock360": "Stock for a cashier · small phone 360",
  "SetupTablet": "Setup · tablet 1024 × 600",
  "Setup360": "Setup in Urdu · small phone 360",
  "SignInPortrait": "Sign in · portrait 768 × 1024",
  "SignInPhone": "Sign in · phone 390",
  "SignIn360": "Sign in · small phone 360",
  "PhotoHandoffReceived": "Web · photos from the phone",
  "PhotoHandoffComputer": "Web · photos from this computer",
  "PhotoHandoffWebcam": "Web · photos from the webcam",
  "AppAddItem": "Web · add item, start",
  "AppAddStock": "Web · Add stock: scan in",
  "AppAddStockNew": "Web · Add stock: a new barcode",
  "AppAddStockDone": "Web · Add stock: added, print labels",
  "AppAddItemFilled": "Web · add item, clothing",
  "AppAddItemFull": "Web · add item, the whole form",
  "AppAddItemCheck": "Web · add item, what’s missing",
  "AppAddItemSaved": "Web · item saved, labels",
  "AppAddItemNewCat": "Web · new category while adding",
  "AppEditItem": "Web · edit an item",
  "AppAddItemStockkeeper": "Web · stock keeper adds an item, no cost",
  "AppAddItemShoes": "Web · add an article, footwear brand",
  "AppAddItemJewellery": "Web · add item, jeweller",
  "AppAddItemPharmacy": "Web · add item, pharmacy",
  "AppAddItemPharmacyFull": "Web · pharmacy, expired batch and used barcode",
  "AppAddItemGrocery": "Web · add item, grocery pack",
  "AppAddItemLoose": "Web · add item, sold loose by kg",
  "AppAddItemCosmetics": "Web · add item, shades",
  "AppAddItemMobile": "Web · add item, phones by IMEI",
  "AppAddItemOther": "Web · add item, just a quantity",
  "AppCategories": "Web · categories",
  "AppCategoryNew": "Web · new category",
  "AppCategoryEdit": "Web · edit a category with items",
  "AppCategoryDelete": "Web · delete a category, move its items",
  "AppCategoryDeleteEmpty": "Web · delete an empty category",
  "AppStockShoes": "Web · footwear stock · articles, size runs, missing sizes",
  "AppStockShoesGaps": "Web · footwear · articles missing core sizes",
  "AppStockShoesArticle": "Web · footwear · one article, each colour by size",
  "AppStockShoesReceive": "Web · footwear · add pairs by size or carton",
  "AppStockShoesReorder": "Web · footwear · reorder missing sizes",
  "AppStockShoesIdle": "Web · footwear · articles not selling",
  "AppStockPharmacy": "Web · pharmacy stock · batches, expiry, racks",
  "AppStockPharmacySoon": "Web · pharmacy · expiring in 60 days",
  "AppStockPharmacyExpired": "Web · pharmacy · expired, blocked at the counter",
  "AppStockPharmacyMedicine": "Web · pharmacy · one medicine, its batches",
  "AppStockPharmacyBatch": "Web · pharmacy · add a batch",
  "AppStockPharmacyReturn": "Web · pharmacy · return list for the supplier",
  "AppAddItemShoesCarton": "Web · add an article, the whole form",
  "AppStockShoesEdit": "Web · footwear · edit an article’s sizes and colours",
  "AppStockShoesAdjust": "Web · footwear · change stock: mismatched pair",
  "ShoeExchangeFind": "Counter · footwear exchange, find the bill",
  "ShoeExchangeChoose": "Counter · exchange for a bigger size",
  "ShoeExchangeSoldOut": "Counter · size sold out, ask another branch",
  "ShoeExchangeOther": "Counter · exchange for a different article",
  "ShoeExchangeFault": "Counter · faulty or worn pair, owner’s PIN",
  "ShoeExchangeDone": "Counter · exchange recorded",
  "AppHomeShoes": "Web · footwear · owner Home with shoe stock",
  "AppCashierShoes": "Web · footwear · cashier Home with Exchange a size",
  "AppBillsShoes": "Web · footwear · bill page starts a size exchange",
  "AppStockShoesCashier": "Web · footwear · cashier looks up pairs, view only",
  "AppStockPharmacyCashier": "Web · pharmacy · cashier looks up batches, view only",
  "AppNoAccess": "Web · a page the role can’t open says who can",
  "AccountWelcome": "First visit · welcome: create, sign in or join",
  "AccountWelcomeUrdu": "First visit · welcome in Urdu, right to left",
  "AccountWelcomePhone": "First visit · welcome on a phone browser",
  "AccountPhone": "Create account · 1 mobile number and terms",
  "AccountPhoneTaken": "Create account · number already has an account",
  "AccountCode": "Create account · 2 SMS code",
  "AccountCodeError": "Create account · wrong SMS code",
  "AccountYou": "Create account · 3 your name and password",
  "AccountYouWeak": "Create account · password too weak",
  "AccountShop": "Create account · 4 shop name, city, branches, logo",
  "AccountKind": "Create account · 5 what you sell: footwear",
  "AccountKindPharmacy": "Create account · 5 what you sell: pharmacy",
  "AccountBuilding": "Create account · setting up the shop",
  "AccountReady": "Create account · 6 ready, what to do next",
  "AccountKindPhone": "Create account · what you sell, on a phone",
  "AccountReadyPhone": "Create account · ready, on a phone",
  "AccountSignIn": "Returning owner · sign in",
  "AccountSignInError": "Returning owner · number or password didn’t match",
  "AccountForgot": "Forgot password · get a code",
  "AccountReset": "Forgot password · code and new password",
  "AccountJoin": "Staff joins · number the owner added",
  "AccountJoinNoInvite": "Staff joins · number not on a staff list",
  "AccountJoinPin": "Staff joins · set a 4-digit PIN",
  "AccountJoinPinMismatch": "Staff joins · PINs don’t match",
  "AccountJoinDone": "Staff joins · done, go to the counter",
  "AppChats": "WhatsApp · business chats: list, chat, customer",
  "AppChatsOrder": "WhatsApp · make an order from the chat",
  "AppChatsItem": "WhatsApp · send an item from Stock",
  "AppChatsTemplate": "WhatsApp · after 24 hours, send an approved template",
  "AppChatsCashier": "WhatsApp · cashier answers chats",
  "AppChatbot": "WhatsApp · chatbot: menu, answers, orders, hours",
  "AppChatbotTest": "WhatsApp · chatbot test chat hands over to a person",
  "AppChatsTablet": "WhatsApp · counter tablet 1024 × 600",
  "AppChatsPhone": "WhatsApp · chats on a phone",
  "AppChatsPhoneOpen": "WhatsApp · one chat on a phone",
  "AppCouriers": "Couriers · shipments and their status",
  "AppCouriersTrack": "Couriers · tracking: delivery failed, what to do",
  "AppCouriersBook": "Couriers · book parcels, compare couriers",
  "AppCouriersBooked": "Couriers · parcels booked, print labels",
  "AppCouriersCod": "Couriers · COD payments matched to parcels",
  "AppCouriersReturns": "Couriers · parcels coming back",
  "AppCouriersAccounts": "Couriers · accounts and city rules",
  "AppCouriersConnect": "Couriers · connect a courier account",
  "AppCouriersTablet": "Couriers · counter tablet 1024 × 600",
  "AppCouriersPhone": "Couriers · on a phone",
  "SettingsStaffAdd": "Settings · team: add a person by mobile number",
  "App": "Owner home",
  "Main": "Register",
  "SignIn": "Counter sign-in",
  "Setup": "Set up this device",
  "CreateAccount": "Welcome",
  "Quote": "Quote",
  "Returns": "Return or exchange",
  "OpenShift": "Open shift",
  "Shift": "Close shift",
  "CreateStyle": "Create style",
  "Item": "Sizes and colours",
  "Measured": "Measured item",
  "StockCount": "Stock count",
  "Receive": "Receive goods",
  "NewPO": "New purchase order",
  "SyncCheck": "Sync check",
  "PhotoHandoff": "Photos from your phone",
  "RegisterUrdu": "Register in Urdu",
  "ShoeExchange": "Shoe exchange"
};

export const ROUTE_GROUPS: Array<{ label: string; items: Array<{ k: string; t: string }> }> = [
  {
    "label": "Start",
    "items": [
      {
        "k": "AccountWelcome",
        "t": "Welcome · first visit"
      },
      {
        "k": "AccountPhone",
        "t": "Create an account"
      },
      {
        "k": "AccountSignIn",
        "t": "Owner signs in"
      },
      {
        "k": "AccountJoin",
        "t": "Staff member joins"
      },
      {
        "k": "SetupSignIn",
        "t": "Set up this device"
      },
      {
        "k": "SignIn",
        "t": "Counter sign-in"
      }
    ]
  },
  {
    "label": "Owner",
    "items": [
      {
        "k": "App",
        "t": "Home"
      },
      {
        "k": "App?page=bills",
        "t": "Bill book"
      },
      {
        "k": "App?page=khata",
        "t": "Khata"
      },
      {
        "k": "App?page=stock",
        "t": "Stock"
      },
      {
        "k": "App?page=addstock",
        "t": "Add stock"
      },
      {
        "k": "App?page=orders",
        "t": "Orders"
      },
      {
        "k": "App?page=cash",
        "t": "Cash"
      },
      {
        "k": "App?page=suppliers",
        "t": "Suppliers"
      },
      {
        "k": "App?page=expenses",
        "t": "Expenses"
      },
      {
        "k": "App?page=staff",
        "t": "Staff and pay"
      },
      {
        "k": "App?page=reports",
        "t": "Reports"
      },
      {
        "k": "App?page=settings",
        "t": "Settings"
      }
    ]
  },
  {
    "label": "Cashier",
    "items": [
      {
        "k": "AppCashier",
        "t": "Home"
      },
      {
        "k": "Main",
        "t": "Register · sell"
      },
      {
        "k": "AppBills",
        "t": "Bill book"
      },
      {
        "k": "OpenShift",
        "t": "Open shift"
      },
      {
        "k": "Shift",
        "t": "Close shift"
      },
      {
        "k": "Returns",
        "t": "Return or exchange"
      },
      {
        "k": "Quote",
        "t": "Quote"
      },
      {
        "k": "ShoeExchangeFind",
        "t": "Shoe exchange"
      }
    ]
  },
  {
    "label": "Stockkeeper",
    "items": [
      {
        "k": "AppStockkeeper",
        "t": "Home"
      },
      {
        "k": "App?role=inventory&page=stock",
        "t": "Stock"
      },
      {
        "k": "AppAddItem",
        "t": "Add an item"
      },
      {
        "k": "CreateStyle",
        "t": "Create style"
      },
      {
        "k": "Item",
        "t": "Sizes and colours"
      },
      {
        "k": "StockCount",
        "t": "Stock count"
      },
      {
        "k": "Measured",
        "t": "Measured item"
      },
      {
        "k": "Receive",
        "t": "Receive goods"
      },
      {
        "k": "NewPO",
        "t": "New purchase order"
      },
      {
        "k": "PhotoHandoff",
        "t": "Photos from your phone"
      }
    ]
  },
  {
    "label": "More",
    "items": [
      {
        "k": "Day",
        "t": "Start of day"
      },
      {
        "k": "SyncCheck",
        "t": "Sync check"
      },
      {
        "k": "RegisterUrdu",
        "t": "Register in Urdu"
      },
      {
        "k": "AppUrdu",
        "t": "Owner app in Urdu"
      }
    ]
  }
];

export function parseAttrString(attrStr: string): Record<string, any> {
  const out: Record<string, any> = {};
  if (!attrStr) return out;
  const re = /([a-zA-Z0-9_-]+)=("([^"]*)"|'([^']*)')/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrStr)) !== null) {
    const key = m[1].replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    const raw = m[3] !== undefined ? m[3] : m[4];
    if (raw === '{{yes}}' || raw === 'true') out[key] = true;
    else if (raw === '{{no}}' || raw === 'false') out[key] = false;
    else if (/^-?\d+$/.test(raw)) out[key] = Number(raw);
    else out[key] = raw;
  }
  return out;
}

export function resolveBoard(boardKey: string): {
  moduleName: ModuleName;
  props: Record<string, any>;
  title: string;
  board: string;
} {
  const [boardPart, queryPart] = (boardKey || 'AccountWelcome').split('?');
  const extra: Record<string, any> = {};
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    params.forEach((v, k) => {
      if (v === 'true') extra[k] = true;
      else if (v === 'false') extra[k] = false;
      else extra[k] = v;
    });
  }

  let moduleName: ModuleName = 'CreateAccount';
  let baseProps: Record<string, any> = {};

  if (BOARD_WRAPPERS[boardPart]) {
    const [target, attrStr] = BOARD_WRAPPERS[boardPart];
    moduleName = target;
    baseProps = parseAttrString(attrStr);
  } else if (MODULE_MAP[boardPart as ModuleName]) {
    moduleName = boardPart as ModuleName;
  }

  return {
    moduleName,
    props: { ...baseProps, ...extra },
    title: BOARD_TITLES[boardPart] || MODULE_MAP[moduleName]?.title || moduleName,
    board: boardPart,
  };
}
