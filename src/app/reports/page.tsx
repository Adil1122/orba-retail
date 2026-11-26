'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function ReportsPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'owner', page: 'reports' }}
      title="Reports · ZYRO Retail POS"
    />
  );
}
