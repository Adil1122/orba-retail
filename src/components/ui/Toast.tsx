'use client';

import React from 'react';
import { ZyroIcon } from './Icons';

export interface ToastProps {
  open: boolean;
  message: string;
  tone?: 'ok' | 'warn' | 'err' | 'info';
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const TONE_DOT = {
  ok: 'text-[#7FD6A4]',
  warn: 'text-[#F2D06B]',
  err: 'text-[#F7A59B]',
  info: 'text-[#A9C6FF]',
};

export function Toast({
  open,
  message,
  tone = 'ok',
  actionLabel,
  onAction,
  onDismiss,
}: ToastProps) {
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-md z-50 rounded-[14px] bg-[#162660] text-white px-4 py-3 shadow-xl flex items-center gap-3"
      style={{ animation: 'zup 0.16s ease-out' }}
    >
      <ZyroIcon name={tone === 'err' ? 'alert' : 'check'} size={18} className={TONE_DOT[tone]} />
      <span className="text-[14px] font-medium flex-1">{message}</span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-[13px] font-bold text-[#D0E6FD] hover:underline shrink-0"
        >
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-[#A9BCE0] hover:text-white shrink-0"
        >
          <ZyroIcon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
