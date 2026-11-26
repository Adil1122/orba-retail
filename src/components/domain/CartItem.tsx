'use client';

import React from 'react';
import type { CartLine } from '@/types/pos';
import { rs } from '@/lib/common';
import { ZyroIcon } from '@/components/ui/Icons';

export interface CartItemProps {
  line: CartLine;
  onQtyChange: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
}

export function CartItem({ line, onQtyChange, onRemove }: CartItemProps) {
  const lineTotal = line.price * line.qty - (line.disc || 0);
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[#F6F0E7] last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-[#162660] truncate">{line.name}</div>
        <div className="text-[12px] text-[#5B6585] flex items-center gap-2">
          {line.variant && <span>{line.variant}</span>}
          <span className="num">{rs(line.price)} each</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onQtyChange(line.key, line.qty - 1)}
          className="w-8 h-8 rounded-[9px] border border-[#D9CFC0] bg-white hover:bg-[#F8F2E9] inline-flex items-center justify-center font-bold text-[#162660]"
        >
          −
        </button>
        <span className="num w-7 text-center text-[14px] font-bold text-[#162660]">{line.qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onQtyChange(line.key, line.qty + 1)}
          className="w-8 h-8 rounded-[9px] border border-[#D9CFC0] bg-white hover:bg-[#F8F2E9] inline-flex items-center justify-center font-bold text-[#162660]"
        >
          +
        </button>
      </div>

      <div className="text-right shrink-0 min-w-[76px]">
        <div className="num text-[14px] font-bold text-[#162660]">{rs(lineTotal)}</div>
      </div>

      <button
        type="button"
        aria-label="Remove item"
        onClick={() => onRemove(line.key)}
        className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[#5B6585] hover:bg-[#FDF0EF] hover:text-[#B42318] shrink-0"
      >
        <ZyroIcon name="x" size={15} />
      </button>
    </div>
  );
}
