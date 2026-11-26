'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function PurchasingPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'owner', page: 'suppliers' }}
      title="Suppliers & Purchasing · ZYRO Retail POS"
    />
  );
}
