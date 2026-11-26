'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { NavigationItem } from './NavigationItem';

export interface NavGroup {
  label: string;
  items: Array<{ href: string; label: string; icon?: string; badge?: string | number }>;
}

export interface NavigationProps {
  groups: NavGroup[];
  onNavigate?: () => void;
}

export function Navigation({ groups, onNavigate }: NavigationProps) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#5B6585]">
            {group.label}
          </div>
          {group.items.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              active={pathname === item.href}
              onClick={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}
