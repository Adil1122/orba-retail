'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function SellRegisterPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'owner', page: 'sell', kit: 'shoes' }}
      title="Sell · ZYRO Retail POS"
    />
  );
}
