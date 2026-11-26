'use client';

import React from 'react';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';

export default function JoinStaffPage() {
  return (
    <ResponsiveViewport
      moduleName="CreateAccount"
      moduleProps={{ step: 'join', demo: 'empty' }}
      title="Join Shop as Staff · ZYRO Retail POS"
    />
  );
}
