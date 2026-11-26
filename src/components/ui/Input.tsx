'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefixNode?: React.ReactNode;
  suffixNode?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  prefixNode,
  suffixNode,
  id,
  className = '',
  ...rest
}: InputProps) {
  const inputId = id || React.useId();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[14px] font-semibold text-[#162660]">
          {label}
        </label>
      )}
      <div
        className={[
          'field flex items-center gap-2 h-12 px-3.5 rounded-[12px] border bg-white text-[#162660] transition-colors',
          error ? 'err border-[#B42318]' : 'border-[#8A8276]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {prefixNode && <span className="shrink-0 text-[#5B6585]">{prefixNode}</span>}
        <input
          id={inputId}
          className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-[15px] text-[#162660] placeholder:text-[#5B6585]"
          aria-invalid={Boolean(error) || undefined}
          {...rest}
        />
        {suffixNode && <span className="shrink-0 text-[#5B6585]">{suffixNode}</span>}
      </div>
      {error ? (
        <span className="text-[13px] font-medium text-[#B42318]">{error}</span>
      ) : hint ? (
        <span className="text-[13px] text-[#5B6585]">{hint}</span>
      ) : null}
    </div>
  );
}
