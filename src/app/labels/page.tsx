'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function LabelsPage() {
  return (
    <ResponsiveViewport
      moduleName="App"
      moduleProps={{ role: 'owner', page: 'labels', kit: 'shoes' }}
      title="Labels · ZYRO Retail POS"
    />
  );
}
