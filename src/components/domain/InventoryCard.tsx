'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, type BadgeTone } from '@/components/ui/Badge';

export interface InventoryCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeTone?: BadgeTone;
  onClick?: () => void;
}

export function InventoryCard({
  label,
  value,
  subtitle,
  badgeText,
  badgeTone = 'neutral',
  onClick,
}: InventoryCardProps) {
  return (
    <Card
      onClick={onClick}
      className={[
        'flex flex-col gap-1.5 transition-colors',
        onClick ? 'cursor-pointer tile' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-[#5B6585]">{label}</span>
        {badgeText && <Badge tone={badgeTone}>{badgeText}</Badge>}
      </div>
      <div className="num text-[26px] font-bold text-[#162660] leading-tight">{value}</div>
      {subtitle && <div className="text-[13px] text-[#454F70]">{subtitle}</div>}
    </Card>
  );
}
