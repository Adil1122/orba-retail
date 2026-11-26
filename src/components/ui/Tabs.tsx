'use client';

import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeId, onChange, className = '' }: TabsProps) {
  return (
    <div
      role="tablist"
      className={[
        'inline-flex flex-wrap items-center gap-1 p-1 rounded-[14px] bg-[#ECE4D8]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={[
              'tab h-9 px-3.5 rounded-[10px] text-[14px] font-semibold inline-flex items-center gap-2 transition-all',
              active
                ? 'bg-white text-[#162660] shadow-xs'
                : 'bg-transparent text-[#454F70] hover:text-[#162660]',
            ].join(' ')}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={[
                  'num text-[12px] px-1.5 py-0.5 rounded-full',
                  active ? 'bg-[#D0E6FD] text-[#162660]' : 'bg-[#F6F0E7] text-[#5B6585]',
                ].join(' ')}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
