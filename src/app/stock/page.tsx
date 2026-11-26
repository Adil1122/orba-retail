'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function StockDashboardPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'inventory', page: 'home' }}
      title="Stockkeeper Home · ZYRO Retail POS"
    />
  );
}
