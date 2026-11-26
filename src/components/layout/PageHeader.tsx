'use client';

import React from 'react';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[13px] font-semibold text-[#5B6585] mb-1">{eyebrow}</div>
        )}
        <h1 className="m-0 text-[22px] sm:text-[26px] font-bold text-[#162660] leading-tight">
          {title}
        </h1>
        {description && (
          <p className="m-0 mt-1 text-[14px] text-[#454F70]">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
