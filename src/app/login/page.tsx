'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';
import { LoadingState } from '@/components/ui/LoadingState';

function LoginPageInner() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const step = stepParam === 'forgot' || stepParam === 'reset' ? stepParam : 'signin';

  return (
    <ResponsiveViewport
      moduleName="CreateAccount"
      moduleProps={{ step, demo: 'empty' }}
      title="Sign in · ZYRO Retail POS"
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6"><LoadingState rows={4} /></div>}>
      <LoginPageInner />
    </Suspense>
  );
}
