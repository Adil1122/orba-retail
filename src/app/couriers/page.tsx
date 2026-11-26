'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function CouriersPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'owner', page: 'couriers' }}
      title="Couriers & Shipments · ZYRO Retail POS"
    />
  );
}
