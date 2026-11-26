'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ResponsiveViewport } from '@/components/layout/ResponsiveViewport';
import { LoadingState } from '@/components/ui/LoadingState';
import { resolveBoard } from '@/lib/routes';

function BoardScreenInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const board = decodeURIComponent(String(params?.board || 'AccountWelcome'));
  const qs = searchParams.toString();
  const resolved = resolveBoard(qs ? `${board}?${qs}` : board);

  return (
    <ResponsiveViewport
      moduleName={resolved.moduleName}
      moduleProps={resolved.props}
      title={resolved.title}
    />
  );
}

export default function DynamicBoardScreenPage() {
  return (
    <Suspense fallback={<div className="p-6"><LoadingState rows={5} /></div>}>
      <BoardScreenInner />
    </Suspense>
  );
}
