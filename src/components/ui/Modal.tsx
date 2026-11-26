'use client';

import React, { useEffect } from 'react';
import { ZyroIcon } from './Icons';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxWidth?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  maxWidth = 520,
  children,
  footer,
}: ModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#162660]/40"
      style={{ animation: 'zfade 0.14s ease-out' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full rounded-[20px] bg-white border border-[#E9E1D5] shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden"
        style={{ maxWidth, animation: 'zsheet 0.18s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#F6F0E7]">
            <div className="min-w-0">
              {title && <h2 className="m-0 text-[18px] font-bold text-[#162660]">{title}</h2>}
              {subtitle && <p className="m-0 mt-0.5 text-[13px] text-[#5B6585]">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[#5B6585] hover:bg-[#F6F0E7] hover:text-[#162660] shrink-0"
            >
              <ZyroIcon name="x" size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-[#F6F0E7] bg-[#F8F2E9] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
