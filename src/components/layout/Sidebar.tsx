'use client';

import React from 'react';
import Link from 'next/link';
import { ZyroLogo } from '@/components/ui/Icons';
import { Navigation, type NavGroup } from './Navigation';

export const DEFAULT_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Workspaces',
    items: [
      { href: '/owner', label: 'Owner Home', icon: 'home' },
      { href: '/cashier', label: 'Cashier Home', icon: 'bag' },
      { href: '/stock', label: 'Stockkeeper Home', icon: 'box' },
      { href: '/sell', label: 'POS Register', icon: 'grid' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/bills', label: 'Bill Book', icon: 'receipt' },
      { href: '/inventory', label: 'Inventory & Stock', icon: 'box' },
      { href: '/customers', label: 'Khata & Customers', icon: 'users' },
      { href: '/orders', label: 'Orders', icon: 'truck' },
      { href: '/purchasing', label: 'Suppliers & POs', icon: 'truck' },
      { href: '/cash', label: 'Cash & Bank', icon: 'cash' },
      { href: '/expenses', label: 'Expenses', icon: 'receipt' },
      { href: '/reports', label: 'Reports', icon: 'chart' },
      { href: '/staff', label: 'Staff & Pay', icon: 'users' },
    ],
  },
  {
    label: 'Integrations & System',
    items: [
      { href: '/chats', label: 'WhatsApp Chats', icon: 'chat' },
      { href: '/couriers', label: 'Couriers', icon: 'truck' },
      { href: '/settings', label: 'Settings', icon: 'gear' },
      { href: '/modules', label: 'All 57 Modules', icon: 'grid' },
    ],
  },
];

export interface SidebarProps {
  groups?: NavGroup[];
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ groups = DEFAULT_NAV_GROUPS, onNavigate, className = '' }: SidebarProps) {
  return (
    <aside
      className={[
        'w-[260px] shrink-0 bg-white border-r border-[#E9E1D5] flex flex-col h-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="h-16 px-4 border-b border-[#F6F0E7] flex items-center justify-between shrink-0">
        <Link href="/owner" className="no-underline text-[#162660]">
          <ZyroLogo size={32} />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <Navigation groups={groups} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}
