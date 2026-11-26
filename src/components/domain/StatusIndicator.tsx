'use client';

import React from 'react';
import { Badge, type BadgeTone } from '@/components/ui/Badge';

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'open' | 'closed' | 'low' | 'out' | 'pending' | 'paid' | 'failed';
  label?: string;
}

const STATUS_CONFIG: Record<StatusIndicatorProps['status'], { tone: BadgeTone; text: string }> = {
  online: { tone: 'ok', text: 'Online' },
  offline: { tone: 'warn', text: 'Offline' },
  open: { tone: 'ok', text: 'Shift open' },
  closed: { tone: 'neutral', text: 'Closed' },
  low: { tone: 'warn', text: 'Low stock' },
  out: { tone: 'err', text: 'Out of stock' },
  pending: { tone: 'info', text: 'Pending' },
  paid: { tone: 'ok', text: 'Paid' },
  failed: { tone: 'err', text: 'Failed' },
};

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.online;
  return (
    <Badge tone={cfg.tone} dot>
      {label || cfg.text}
    </Badge>
  );
}
