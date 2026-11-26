'use client';

import React, { useState } from 'react';
import { rs } from '@/lib/common';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export type PaymentMethodId = 'cash' | 'card' | 'jazzcash' | 'easypaisa' | 'raast' | 'khata';

export interface PaymentPanelProps {
  total: number;
  onComplete: (method: PaymentMethodId, tendered: number) => void;
  onCancel?: () => void;
}

const METHODS: Array<{ id: PaymentMethodId; label: string }> = [
  { id: 'cash', label: 'Cash' },
  { id: 'card', label: 'Card' },
  { id: 'jazzcash', label: 'JazzCash' },
  { id: 'easypaisa', label: 'EasyPaisa' },
  { id: 'raast', label: 'Raast QR' },
  { id: 'khata', label: 'Khata' },
];

export function PaymentPanel({ total, onComplete, onCancel }: PaymentPanelProps) {
  const [method, setMethod] = useState<PaymentMethodId>('cash');
  const [tendered, setTendered] = useState<number>(total);

  const change = Math.max(0, tendered - total);
  const quickNotes = [50000, 100000, 500000];

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-[#F6F0E7]">
        <span className="text-[14px] font-semibold text-[#5B6585]">Amount Due</span>
        <span className="num text-[26px] font-bold text-[#162660]">{rs(total)}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {METHODS.map((m) => {
          const active = method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setMethod(m.id);
                setTendered(total);
              }}
              className={[
                'h-11 px-3 rounded-[12px] border text-[14px] font-semibold transition-colors',
                active
                  ? 'bg-[#D0E6FD] border-[#162660] text-[#162660]'
                  : 'bg-white border-[#D9CFC0] text-[#454F70] hover:bg-[#F8F2E9]',
              ].join(' ')}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {method === 'cash' && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Button variant="secondary" size="sm" onClick={() => setTendered(total)}>
              Exact
            </Button>
            {quickNotes.map((amt) => (
              <Button key={amt} variant="secondary" size="sm" onClick={() => setTendered(amt)}>
                {rs(amt)}
              </Button>
            ))}
          </div>
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[12px] bg-[#F8F2E9] text-[14px]">
            <span className="text-[#454F70]">Change due</span>
            <span className="num font-bold text-[#14532D]">{rs(change)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Back
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={method === 'cash' && tendered < total}
          onClick={() => onComplete(method, tendered)}
        >
          Confirm {METHODS.find((m) => m.id === method)?.label} · {rs(total)}
        </Button>
      </div>
    </Card>
  );
}
