'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bp bg-[#162660] text-white border border-transparent shadow-xs',
  secondary: 'bs bg-white text-[#162660] border border-[#D9CFC0]',
  accent: 'bg-[#D0E6FD] hover:bg-[#DCECFE] text-[#162660] border border-[#B5D3F5]',
  danger: 'bd bg-[#B42318] text-white border border-transparent',
  ghost: 'bt bg-transparent text-[#2E46A0] border border-transparent hover:bg-[#F8F2E9]',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-[13px] rounded-[10px] gap-1.5',
  md: 'h-11 px-4 text-[15px] rounded-[12px] gap-2',
  lg: 'h-13 px-5 text-[16px] rounded-[14px] gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-semibold whitespace-nowrap shrink-0 select-none',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent"
          style={{ animation: 'zspin 0.7s linear infinite' }}
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
