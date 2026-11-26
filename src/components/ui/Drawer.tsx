'use client';

import React, { useEffect } from 'react';
import { ZyroIcon } from './Icons';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  side?: 'left' | 'right';
  width?: number;
  children: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  side = 'right',
  width = 380,
  children,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#162660]/35"
      style={{ animation: 'zfade 0.14s ease-out' }}
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        className={[
          'fixed top-0 bottom-0 bg-white shadow-2xl flex flex-col max-w-[92vw]',
          side === 'right' ? 'right-0' : 'left-0',
        ].join(' ')}
        style={{ width, animation: 'zdrawer 0.18s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#162660] text-white px-4 py-3.5 flex items-center gap-3 shrink-0">
          <div className="min-w-0 flex-1">
            {title && <div className="text-[16px] font-bold truncate">{title}</div>}
            {subtitle && <div className="text-[12px] text-[#A9BCE0] truncate">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 inline-flex items-center justify-center text-white shrink-0"
          >
            <ZyroIcon name="x" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}
