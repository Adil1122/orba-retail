'use client';

import React from 'react';

export type BadgeTone = 'ok' | 'warn' | 'err' | 'info' | 'neutral' | 'accent';

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const TONE_MAP: Record<BadgeTone, { bg: string; fg: string; dot: string }> = {
  ok: { bg: 'bg-[#E8F6EE]', fg: 'text-[#14532D]', dot: 'bg-[#2F9E63]' },
  warn: { bg: 'bg-[#FFF3C4]', fg: 'text-[#6B4E00]', dot: 'bg-[#C99A06]' },
  err: { bg: 'bg-[#FDF0EF]', fg: 'text-[#B42318]', dot: 'bg-[#E36B5D]' },
  info: { bg: 'bg-[#EAF2FD]', fg: 'text-[#24398A]', dot: 'bg-[#2E46A0]' },
  accent: { bg: 'bg-[#D0E6FD]', fg: 'text-[#162660]', dot: 'bg-[#162660]' },
  neutral: { bg: 'bg-[#F6F0E7]', fg: 'text-[#454F70]', dot: 'bg-[#5B6585]' },
};

export function Badge({ tone = 'neutral', dot = false, children, className = '' }: BadgeProps) {
  const t = TONE_MAP[tone];
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap',
        t.bg,
        t.fg,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && <span className={`w-2 h-2 rounded-full shrink-0 ${t.dot}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
