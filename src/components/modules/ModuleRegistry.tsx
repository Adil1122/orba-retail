'use client';

import type React from 'react';
import type { ModuleName } from '@/types/pos';
import AddStock from '@/components/inventory/AddStock';
import App from '@/components/dashboard/App';
import BillBook from '@/components/pos/BillBook';
import Cash from '@/components/business/Cash';
import CashierHome from '@/components/dashboard/CashierHome';
import Categories from '@/components/inventory/Categories';
import ChatBot from '@/components/integrations/ChatBot';
import Chats from '@/components/integrations/Chats';
import Complete from '@/components/pos/Complete';
import Couriers from '@/components/integrations/Couriers';
import CreateAccount from '@/features/auth/CreateAccount';
import CreateStyle from '@/components/inventory/CreateStyle';
import Customer from '@/components/pos/Customer';
import Discount from '@/components/pos/Discount';
import Expenses from '@/components/business/Expenses';
import HeldBills from '@/components/pos/HeldBills';
import Inventory from '@/components/inventory/Inventory';
import Item from '@/components/inventory/Item';
import ItemEditor from '@/components/inventory/ItemEditor';
import Khata from '@/components/business/Khata';
import LineEdit from '@/components/pos/LineEdit';
import Login from '@/features/auth/Login';
import Main from '@/components/dashboard/Main';
import Measured from '@/components/inventory/Measured';
import NewPO from '@/components/inventory/NewPO';
import OpenShift from '@/components/pos/OpenShift';
import Orders from '@/components/business/Orders';
import OwnerHome from '@/components/dashboard/OwnerHome';
import PhotoHandoff from '@/components/inventory/PhotoHandoff';
import Printer from '@/components/pos/Printer';
import Purchasing from '@/components/business/Purchasing';
import Quote from '@/components/pos/Quote';
import Receipt80 from '@/components/pos/Receipt80';
import Receive from '@/components/inventory/Receive';
import RegisterUrdu from '@/features/auth/RegisterUrdu';
import Reports from '@/components/business/Reports';
import Returns from '@/components/pos/Returns';
import SetData from '@/components/settings/SetData';
import SetFbr from '@/components/settings/SetFbr';
import SetPayments from '@/components/settings/SetPayments';
import SetPrinter from '@/components/settings/SetPrinter';
import SetReceipt from '@/components/settings/SetReceipt';
import SetSecurity from '@/components/settings/SetSecurity';
import SetShop from '@/components/settings/SetShop';
import SetTeam from '@/components/settings/SetTeam';
import SetWhatsApp from '@/components/settings/SetWhatsApp';
import Settings from '@/components/settings/Settings';
import Setup from '@/features/auth/Setup';
import Shift from '@/components/pos/Shift';
import ShoeExchange from '@/components/pos/ShoeExchange';
import SignIn from '@/features/auth/SignIn';
import Staff from '@/components/business/Staff';
import Stock from '@/components/inventory/Stock';
import StockCount from '@/components/inventory/StockCount';
import StockHome from '@/components/dashboard/StockHome';
import SyncCheck from '@/components/inventory/SyncCheck';
import Tender from '@/components/pos/Tender';

export const MODULE_REGISTRY: Record<ModuleName, React.ComponentType<any>> = {
  AddStock,
  App,
  BillBook,
  Cash,
  CashierHome,
  Categories,
  ChatBot,
  Chats,
  Complete,
  Couriers,
  CreateAccount,
  CreateStyle,
  Customer,
  Discount,
  Expenses,
  HeldBills,
  Inventory,
  Item,
  ItemEditor,
  Khata,
  LineEdit,
  Login,
  Main,
  Measured,
  NewPO,
  OpenShift,
  Orders,
  OwnerHome,
  PhotoHandoff,
  Printer,
  Purchasing,
  Quote,
  Receipt80,
  Receive,
  RegisterUrdu,
  Reports,
  Returns,
  SetData,
  SetFbr,
  SetPayments,
  SetPrinter,
  SetReceipt,
  SetSecurity,
  SetShop,
  SetTeam,
  SetWhatsApp,
  Settings,
  Setup,
  Shift,
  ShoeExchange,
  SignIn,
  Staff,
  Stock,
  StockCount,
  StockHome,
  SyncCheck,
  Tender,
};

export function getModuleComponent(name: ModuleName): React.ComponentType<any> {
  return MODULE_REGISTRY[name] || CreateAccount;
}
