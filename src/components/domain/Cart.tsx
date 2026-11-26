'use client';

import React from 'react';
import type { CartLine } from '@/types/pos';
import { rs } from '@/lib/common';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CartItem } from './CartItem';

export interface CartProps {
  lines: CartLine[];
  discount?: number;
  onQtyChange: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
  onClear?: () => void;
  onCheckout?: () => void;
}

export function Cart({
  lines,
  discount = 0,
  onQtyChange,
  onRemove,
  onClear,
  onCheckout,
}: CartProps) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty - (l.disc || 0), 0);
  const total = Math.max(0, subtotal - discount);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-[17px] font-bold text-[#162660]">Current Bill</h3>
          <span className="num text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#D0E6FD] text-[#162660]">
            {count}
          </span>
        </div>
        {lines.length > 0 && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>

      {lines.length === 0 ? (
        <EmptyState
          icon="bag"
          title="Bill is empty"
          description="Tap a product or scan a barcode to start a sale."
        />
      ) : (
        <>
          <div className="flex flex-col">
            {lines.map((line) => (
              <CartItem
                key={line.key}
                line={line}
                onQtyChange={onQtyChange}
                onRemove={onRemove}
              />
            ))}
          </div>

          <div className="pt-3 border-t border-[#E9E1D5] flex flex-col gap-1.5 text-[14px]">
            <div className="flex justify-between text-[#454F70]">
              <span>Subtotal</span>
              <span className="num font-semibold">{rs(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#14532D]">
                <span>Discount</span>
                <span className="num font-semibold">−{rs(discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-1 text-[#162660]">
              <span className="text-[16px] font-bold">Total</span>
              <span className="num text-[22px] font-bold">{rs(total)}</span>
            </div>
          </div>

          {onCheckout && (
            <Button variant="primary" size="lg" fullWidth onClick={onCheckout}>
              Take Payment · {rs(total)}
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
