'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  id: string;
  label: string;
  description?: string;
  danger?: boolean;
  onSelect: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          role="menu"
          className={[
            'absolute top-full mt-1.5 z-40 min-w-[200px] rounded-[14px] border border-[#E9E1D5] bg-white p-1.5 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          ].join(' ')}
          style={{ animation: 'zup 0.14s ease-out' }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className={[
                'w-full text-left px-3 py-2 rounded-[10px] flex flex-col gap-0.5 transition-colors',
                item.danger
                  ? 'text-[#B42318] hover:bg-[#FDF0EF]'
                  : 'text-[#162660] hover:bg-[#F8F2E9]',
              ].join(' ')}
            >
              <span className="text-[14px] font-semibold">{item.label}</span>
              {item.description && (
                <span className="text-[12px] text-[#5B6585]">{item.description}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
