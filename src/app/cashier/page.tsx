'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function CashierDashboardPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'cashier', page: 'home' }}
      title="Cashier Home · ZYRO Retail POS"
    />
  );
}
