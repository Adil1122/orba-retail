'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function PrintersPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'owner', page: 'printers', kit: 'shoes' }}
      title="Printers · ZYRO Retail POS"
    />
  );
}
