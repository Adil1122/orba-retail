'use client';

import React, { useMemo } from 'react';
import type { ModuleName } from '@/types/pos';
import { usePosApp } from '@/context/PosAppContext';
import { MODULE_MAP } from '@/lib/routes';
import { getModuleComponent } from '@/components/modules/ModuleRegistry';
import { ModuleSwitcherDrawer } from './ModuleSwitcherDrawer';
import { Toast } from '@/components/ui/Toast';

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
  const { viewport, kit, lang, setKit, setLang, setDrawerOpen, toastMessage } = usePosApp();
  const meta = MODULE_MAP[moduleName];
  const Component = getModuleComponent(moduleName);

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
    };

    if (meta?.supportsKit && !moduleProps.kit) {
      merged.kit = kit;
    }
    if (meta?.supportsLang && !moduleProps.lang) {
      merged.lang = lang;
    }

    return merged;
  }, [viewport, meta, moduleProps, kit, lang, setKit, setLang]);

  const isStandaloneModal = meta?.kind === 'modal';

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
