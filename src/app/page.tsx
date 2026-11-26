'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function HomePage() {
  return (
    <ResponsiveViewport
      moduleName="CreateAccount"
      moduleProps={{ step: 'welcome' }}
      title="Welcome · ZYRO Retail POS"
    />
  );
}
