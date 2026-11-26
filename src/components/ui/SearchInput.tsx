'use client';

import React from 'react';
import { ZyroIcon } from './Icons';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export function SearchInput({
  value,
  onClear,
  placeholder = 'Search...',
  className = '',
  ...rest
}: SearchInputProps) {
  const hasVal = typeof value === 'string' ? value.length > 0 : Boolean(value);
  return (
    <div
      className={[
        'field flex items-center gap-2 h-11 px-3.5 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ZyroIcon name="search" size={18} className="text-[#5B6585] shrink-0" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-[15px] text-[#162660] placeholder:text-[#5B6585]"
        {...rest}
      />
      {hasVal && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[#5B6585] hover:bg-[#F6F0E7] hover:text-[#162660]"
        >
          <ZyroIcon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
