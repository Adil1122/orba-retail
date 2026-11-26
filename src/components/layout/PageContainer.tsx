'use client';

import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const MAX_W = {
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1440px]',
  full: 'max-w-none',
};

export function PageContainer({ children, maxWidth = '2xl', className = '' }: PageContainerProps) {
  return (
    <div
      className={[
        'w-full mx-auto px-4 sm:px-6 lg:px-7 py-5 sm:py-6 flex flex-col gap-5',
        MAX_W[maxWidth],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
