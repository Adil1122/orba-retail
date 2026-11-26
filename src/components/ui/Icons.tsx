'use client';

import React from 'react';
import { ICONS } from '@/lib/common';

export interface ZyroIconProps extends React.SVGProps<SVGSVGElement> {
  name?: keyof typeof ICONS | string;
  path?: string;
  size?: number;
}

export function ZyroIcon({
  name,
  path,
  size = 20,
  strokeWidth = 1.75,
  className = '',
  ...rest
}: ZyroIconProps) {
  const d = path || (name && (ICONS as Record<string, string>)[name]) || '';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}

export function ZyroLogo({ size = 36, showLabel = true }: { size?: number; showLabel?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        role="img"
        aria-label="ZYRO Retail POS"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="shrink-0"
      >
        <rect width="64" height="64" rx="14" fill="#D0E6FD" />
        <path fill="#162660" d="M17 17h30v9L29 38h18v9H17v-9l18-12H17z" />
      </svg>
      {showLabel && (
        <span className="font-bold tracking-tight text-current" style={{ fontSize: Math.round(size * 0.5) }}>
          ZYRO Retail POS
        </span>
      )}
    </span>
  );
}
