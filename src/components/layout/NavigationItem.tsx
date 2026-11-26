'use client';

import React from 'react';
import Link from 'next/link';
import { ZyroIcon } from '@/components/ui/Icons';

export interface NavigationItemProps {
  href: string;
  label: string;
  icon?: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export function NavigationItem({
  href,
  label,
  icon = 'home',
  active = false,
  badge,
  onClick,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={[
        'side flex items-center gap-3 px-3 h-11 rounded-[12px] text-[15px] font-semibold no-underline transition-colors',
        active
          ? 'bg-[#D0E6FD] text-[#162660]'
          : 'text-[#454F70] hover:bg-[#F6F0E7] hover:text-[#162660]',
      ].join(' ')}
    >
      <ZyroIcon name={icon} size={19} className="shrink-0" />
      <span className="truncate flex-1">{label}</span>
      {badge !== undefined && (
        <span className="num text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#EEF5FE] text-[#2E46A0]">
          {badge}
        </span>
      )}
    </Link>
  );
}
