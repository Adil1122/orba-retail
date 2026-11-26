'use client';

import React from 'react';
import { ZyroIcon, ZyroLogo } from '@/components/ui/Icons';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, onMenuClick, actions }: HeaderProps) {
  return (
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-[#E9E1D5] flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="lg:hidden w-10 h-10 rounded-[12px] border border-[#D9CFC0] bg-white inline-flex items-center justify-center text-[#162660] hover:bg-[#F8F2E9] shrink-0"
          >
            <ZyroIcon name="menu" size={20} />
          </button>
        )}
        <div className="lg:hidden shrink-0">
          <ZyroLogo size={28} showLabel={false} />
        </div>
        <div className="min-w-0">
          {title && <div className="text-[17px] font-bold text-[#162660] truncate">{title}</div>}
          {subtitle && <div className="text-[12px] text-[#5B6585] truncate">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
