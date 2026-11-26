'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import type { NavGroup } from './Navigation';
import { Header } from './Header';
import { Drawer } from '@/components/ui/Drawer';

export interface AppShellProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  navGroups?: NavGroup[];
  children: React.ReactNode;
}

export function AppShell({ title, subtitle, actions, navGroups, children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-[#F1E4D1] text-[#162660] flex">
      <div className="hidden lg:block sticky top-0 h-dvh">
        <Sidebar groups={navGroups} />
      </div>

      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title="ZYRO Retail POS"
        subtitle="Navigation"
        side="left"
        width={280}
      >
        <div className="-m-4 h-full">
          <Sidebar
            groups={navGroups}
            onNavigate={() => setMobileNavOpen(false)}
            className="w-full border-0"
          />
        </div>
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col min-h-dvh">
        <Header
          title={title}
          subtitle={subtitle}
          actions={actions}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
