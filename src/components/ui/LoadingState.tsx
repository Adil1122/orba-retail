'use client';

import React from 'react';

export interface LoadingStateProps {
  rows?: number;
  label?: string;
}

export function LoadingState({ rows = 4, label = 'Loading ZYRO Retail POS...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col gap-3 w-full" role="status" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skel h-12 rounded-[12px] w-full"
          style={{ width: i === rows - 1 ? '68%' : '100%' }}
        />
      ))}
    </div>
  );
}
