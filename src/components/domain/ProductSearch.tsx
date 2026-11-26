'use client';

import React from 'react';
import { SearchInput } from '@/components/ui/SearchInput';

export interface ProductSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
}

export function ProductSearch({
  query,
  onQueryChange,
  categories = [],
  activeCategory = 'All',
  onCategoryChange,
}: ProductSearchProps) {
  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onClear={() => onQueryChange('')}
        placeholder="Scan barcode or search products by name, SKU..."
      />
      {categories.length > 0 && onCategoryChange && (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => onCategoryChange(cat)}
                className={[
                  'h-9 px-3.5 rounded-full text-[13px] font-semibold border transition-colors',
                  active
                    ? 'bg-[#162660] border-[#162660] text-white'
                    : 'bg-white border-[#D9CFC0] text-[#162660] hover:bg-[#F8F2E9]',
                ].join(' ')}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
