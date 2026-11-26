'use client';

import React from 'react';
import type { ProductItem } from '@/types/pos';
import { rs } from '@/lib/common';
import { StatusIndicator } from './StatusIndicator';

export interface ProductCardProps {
  product: ProductItem;
  onSelect?: (product: ProductItem) => void;
  selected?: boolean;
}

export function ProductCard({ product, onSelect, selected = false }: ProductCardProps) {
  const stockCount =
    product.stock ??
    (product.variants ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : 0);
  const stockStatus = stockCount <= 0 ? 'out' : stockCount <= 5 ? 'low' : 'online';

  return (
    <button
      type="button"
      onClick={onSelect ? () => onSelect(product) : undefined}
      className={[
        'tile text-left rounded-[16px] border p-3.5 bg-white flex flex-col gap-2.5 transition-all w-full',
        selected ? 'border-[#162660] ring-2 ring-[#D0E6FD]' : 'border-[#E9E1D5]',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-[#162660] truncate">{product.name}</div>
          <div className="text-[12px] text-[#5B6585] truncate">{product.cat}</div>
        </div>
        <StatusIndicator
          status={stockStatus}
          label={stockCount <= 0 ? 'Out' : `${stockCount} left`}
        />
      </div>
      <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-[#F6F0E7]">
        <span className="num text-[17px] font-bold text-[#162660]">{rs(product.price)}</span>
        {product.sku && <span className="mono text-[11px] text-[#5B6585]">{product.sku}</span>}
      </div>
    </button>
  );
}
