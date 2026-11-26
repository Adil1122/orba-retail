'use client';

import React from 'react';
import { ZyroIcon } from './Icons';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = 'box', title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[20px] border border-dashed border-[#C8BCAA] bg-[#F8F2E9] p-8 text-center flex flex-col items-center justify-center gap-2.5">
      <div className="w-12 h-12 rounded-full bg-white border border-[#E9E1D5] inline-flex items-center justify-center text-[#2E46A0]">
        <ZyroIcon name={icon} size={22} />
      </div>
      <h3 className="m-0 text-[17px] font-bold text-[#162660]">{title}</h3>
      {description && <p className="m-0 max-w-sm text-[14px] text-[#5B6585]">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
