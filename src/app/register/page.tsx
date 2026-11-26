'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function RegisterPage() {
  return (
    <ResponsiveViewport
      moduleName="CreateAccount"
      moduleProps={{ step: 'phone', demo: 'empty' }}
      title="Create Account · ZYRO Retail POS"
    />
  );
}
