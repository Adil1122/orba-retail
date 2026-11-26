'use client';

import React, { useState, useMemo } from 'react';
import type { CustomerRecord } from '@/types/pos';
import { rs } from '@/lib/common';
import { SearchInput } from '@/components/ui/SearchInput';
import { Card } from '@/components/ui/Card';

export interface CustomerSelectorProps {
  customers: CustomerRecord[];
  selectedId?: string;
  onSelect: (customer: CustomerRecord) => void;
}

export function CustomerSelector({ customers, selectedId, onSelect }: CustomerSelectorProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <Card className="flex flex-col gap-3">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery('')}
        placeholder="Search customer by name or mobile number..."
      />
      <div className="flex flex-col divide-y divide-[#F6F0E7] max-h-[320px] overflow-y-auto">
        {filtered.map((cust) => {
          const active = cust.id === selectedId;
          return (
            <button
              key={cust.id}
              type="button"
              onClick={() => onSelect(cust)}
              className={[
                'text-left py-2.5 px-3 rounded-[10px] flex items-center justify-between gap-3 transition-colors',
                active ? 'bg-[#D0E6FD] text-[#162660]' : 'hover:bg-[#F8F2E9] text-[#162660]',
              ].join(' ')}
            >
              <div className="min-w-0">
                <div className="text-[14px] font-semibold truncate">{cust.name}</div>
                <div className="text-[12px] text-[#5B6585]">{cust.phone}</div>
              </div>
              {typeof cust.balance === 'number' && cust.balance > 0 && (
                <span className="num text-[13px] font-bold text-[#B42318] shrink-0">
                  Due {rs(cust.balance)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
