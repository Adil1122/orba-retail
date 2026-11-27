'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function InventoryPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'owner', page: 'stock', kit: 'shoes' }}
      title="Stock · ZYRO Retail POS"
    />
  );
}
