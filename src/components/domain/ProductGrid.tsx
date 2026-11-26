'use client';

import React from 'react';
import type { ProductItem } from '@/types/pos';
import { ProductCard } from './ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

export interface ProductGridProps {
  products: ProductItem[];
  onSelect?: (product: ProductItem) => void;
  selectedId?: string;
}

export function ProductGrid({ products, onSelect, selectedId }: ProductGridProps) {
  if (!products.length) {
    return (
      <EmptyState
        icon="search"
        title="No matching items"
        description="Try another name, barcode, SKU, or category filter."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelect}
          selected={selectedId === product.id}
        />
      ))}
    </div>
  );
}
