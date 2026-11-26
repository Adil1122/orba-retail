'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';
import { LoadingState } from '@/components/ui/LoadingState';
import { MODULE_MAP } from '@/lib/routes';
import type { ModuleName } from '@/types/pos';

function ModulePageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawName = String(params?.name || 'CreateAccount');
  const moduleName: ModuleName = MODULE_MAP[rawName as ModuleName]
    ? (rawName as ModuleName)
    : 'CreateAccount';

  const extraProps: Record<string, any> = {};
  searchParams.forEach((val, key) => {
    if (val === 'true') extraProps[key] = true;
    else if (val === 'false') extraProps[key] = false;
    else extraProps[key] = val;
  });

  return <ResponsiveViewport moduleName={moduleName} moduleProps={extraProps} />;
}

export default function DynamicModulePage() {
  return (
    <Suspense fallback={<div className="p-6"><LoadingState rows={5} /></div>}>
      <ModulePageInner />
    </Suspense>
  );
}
