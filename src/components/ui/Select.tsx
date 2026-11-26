'use client';

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export function Select({
  label,
  options,
  error,
  hint,
  id,
  className = '',
  ...rest
}: SelectProps) {
  const selectId = id || React.useId();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-[14px] font-semibold text-[#162660]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={[
          'field h-12 px-3.5 rounded-[12px] border bg-white text-[15px] text-[#162660] outline-none',
          error ? 'err border-[#B42318]' : 'border-[#8A8276]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-[13px] font-medium text-[#B42318]">{error}</span>
      ) : hint ? (
        <span className="text-[13px] text-[#5B6585]">{hint}</span>
      ) : null}
    </div>
  );
}
