'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  surface?: 'card' | 'raised' | 'neutral';
}

const PAD_MAP = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

const SURFACE_MAP = {
  card: 'bg-white border-[#E9E1D5]',
  raised: 'bg-[#F8F2E9] border-[#E9E1D5]',
  neutral: 'bg-[#F6F0E7] border-[#E9E1D5]',
};

export function Card({
  padding = 'md',
  surface = 'card',
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'rounded-[20px] border',
        SURFACE_MAP[surface],
        PAD_MAP[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
