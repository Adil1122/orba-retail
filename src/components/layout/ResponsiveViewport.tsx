'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { ModuleName } from '@/types/pos';
import { usePosApp } from '@/context/PosAppContext';
import { MODULE_MAP } from '@/lib/routes';
import { getModuleComponent } from '@/components/modules/ModuleRegistry';
import { ModuleSwitcherDrawer } from './ModuleSwitcherDrawer';
import { Toast } from '@/components/ui/Toast';
import { LoadingState } from '@/components/ui/LoadingState';

const PUBLIC_AUTH_MODULES = new Set<ModuleName>([
  'CreateAccount',
  'SignIn',
  'Login',
  'Setup',
]);

const PUBLIC_PATHS = new Set<string>([
  '/',
  '/login',
  '/register',
  '/join',
  '/signin',
  '/staff-login',
  '/setup',
]);

export interface ResponsiveViewportProps {
  moduleName: ModuleName;
  moduleProps?: Record<string, any>;
  title?: string;
}

export function ResponsiveViewport({
  moduleName,
  moduleProps = {},
  title,
}: ResponsiveViewportProps) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const {
    viewport,
    kit,
    lang,
    setKit,
    setLang,
    setDrawerOpen,
    toastMessage,
    authUser,
    authLoading,
    refreshAuth,
    logout,
  } = usePosApp();
  const meta = MODULE_MAP[moduleName];
  const Component = getModuleComponent(moduleName);

  const isPublicRoute =
    PUBLIC_AUTH_MODULES.has(moduleName) || PUBLIC_PATHS.has(pathname);

  useEffect(() => {
    if (!isPublicRoute && !authLoading && !authUser) {
      router.replace('/login');
    }
  }, [isPublicRoute, authLoading, authUser, router]);

  const computedProps = useMemo(() => {
    const vw = viewport.width;
    const vh = viewport.height;
    const isPhone = vw < 760;
    const isDesk = vw >= 1100;
    const kind = meta?.kind || 'modal';

    const fitProps: Record<string, any> = { w: vw, h: vh };
    if (kind === 'shell') {
      fitProps.layout = isPhone ? 'phone' : isDesk ? 'desk' : 'tablet';
    } else if (kind === 'page') {
      fitProps.size = isPhone ? 'phone' : isDesk ? 'wide' : 'medium';
    } else if (kind === 'register') {
      fitProps.layout = isDesk
        ? vh < 790
          ? 'laptop'
          : 'desk'
        : vw > vh && vw >= 900
          ? 'tablet'
          : 'portrait';
    } else if (kind === 'twosize') {
      fitProps.size = vw < 960 ? 'phone' : 'wide';
    }

    const merged: Record<string, any> = {
      ...fitProps,
      ...moduleProps,
      w: vw,
      h: vh,
      onLangChange: setLang,
      onKitChange: setKit,
      authUser,
      onAuthSuccess: refreshAuth,
      onLogout: logout,
    };

    if (meta?.supportsKit && !moduleProps.kit) {
      merged.kit = kit;
    }
    if (meta?.supportsLang && !moduleProps.lang) {
      merged.lang = lang;
    }

    return merged;
  }, [viewport, meta, moduleProps, kit, lang, setKit, setLang, authUser, refreshAuth, logout]);

  const isStandaloneModal = meta?.kind === 'modal';

  if (!isPublicRoute && (authLoading || !authUser)) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#F1E4D1] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white border border-[#E9E1D5] p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#162660] mb-3">
            {authLoading ? 'Checking your session…' : 'Redirecting to sign in…'}
          </p>
          <LoadingState rows={3} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="zyro-viewport-host"
      data-nar={viewport.isNarrow ? '1' : undefined}
      data-mid={viewport.isMid ? '1' : undefined}
      data-cmp={viewport.isCompactHeight ? '1' : undefined}
      dir={computedProps.lang === 'ur' || moduleName === 'RegisterUrdu' ? 'rtl' : 'ltr'}
    >
      {isStandaloneModal ? (
        <div className="zyro-standalone-modal min-h-[100dvh] w-full max-w-full flex items-center justify-center p-3 sm:p-6 overflow-x-hidden">
          <div className="w-full max-w-full flex justify-center">
            <Component {...computedProps} />
          </div>
        </div>
      ) : (
        <Component {...computedProps} />
      )}

      {/* Slim, unobtrusive edge tab for switching screens, shop types & languages */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open ZYRO screen and module switcher"
        title="Screens & Modules (press `)"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 w-[18px] sm:w-[22px] hover:w-[28px] h-[64px] sm:h-[78px] rounded-l-[10px] bg-[#162660]/60 hover:bg-[#162660] text-white border-0 flex items-center justify-center p-0 transition-all shadow-md"
      >
        <span
          className="text-[10px] sm:text-[11px] font-bold tracking-[0.06em]"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Screens
        </span>
      </button>

      <ModuleSwitcherDrawer currentTitle={title || meta?.title} currentModule={moduleName} />
      <Toast open={Boolean(toastMessage)} message={toastMessage || ''} />
    </div>
  );
}
