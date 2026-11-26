'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePosApp } from '@/context/PosAppContext';
import { Drawer } from '@/components/ui/Drawer';
import { SearchInput } from '@/components/ui/SearchInput';
import { APP_LANGS, SHOP_KITS } from '@/lib/tokens';
import { MODULE_LIST, ROUTE_GROUPS } from '@/lib/routes';

export interface ModuleSwitcherDrawerProps {
  currentTitle?: string;
  currentModule?: string;
}

export function ModuleSwitcherDrawer({ currentTitle, currentModule }: ModuleSwitcherDrawerProps) {
  const { drawerOpen, setDrawerOpen, kit, setKit, lang, setLang, viewport, navigateBoard } = usePosApp();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'screens' | 'modules'>('screens');

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MODULE_LIST;
    return MODULE_LIST.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Drawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      title="ZYRO Retail POS"
      subtitle={`${currentTitle || currentModule || 'Workspace'} · ${viewport.width} × ${viewport.height}`}
      side="right"
      width={390}
    >
      <div className="flex flex-col gap-4">
        {/* Shop Kit selector */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B6585] mb-2">
            Shop Type (Kit)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SHOP_KITS.map((k) => {
              const active = kit === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setKit(k.id)}
                  className={[
                    'h-9 px-3 rounded-full text-[13px] font-semibold border transition-colors',
                    active
                      ? 'bg-[#162660] border-[#162660] text-white'
                      : 'bg-white border-[#D9CFC0] text-[#162660] hover:bg-[#F8F2E9]',
                  ].join(' ')}
                >
                  {k.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language selector */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B6585] mb-2">
            Language
          </div>
          <div className="flex flex-wrap gap-1.5">
            {APP_LANGS.map((l) => {
              const active = lang === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLang(l.id)}
                  className={[
                    'h-9 px-3.5 rounded-full text-[13px] font-semibold border transition-colors',
                    active
                      ? 'bg-[#162660] border-[#162660] text-white'
                      : 'bg-white border-[#D9CFC0] text-[#162660] hover:bg-[#F8F2E9]',
                  ].join(' ')}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode toggle: Workflows vs All 57 Modules */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-[12px] bg-[#ECE4D8]">
          <button
            type="button"
            onClick={() => setTab('screens')}
            className={[
              'h-9 rounded-[9px] text-[13px] font-semibold transition-all',
              tab === 'screens' ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]',
            ].join(' ')}
          >
            Role Flows
          </button>
          <button
            type="button"
            onClick={() => setTab('modules')}
            className={[
              'h-9 rounded-[9px] text-[13px] font-semibold transition-all',
              tab === 'modules' ? 'bg-white text-[#162660] shadow-xs' : 'text-[#454F70]',
            ].join(' ')}
          >
            All 57 Modules
          </button>
        </div>

        {tab === 'screens' ? (
          <div className="flex flex-col gap-4">
            {ROUTE_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B6585] mb-1.5">
                  {group.label}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((it) => (
                    <button
                      key={it.k}
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        navigateBoard(it.k);
                      }}
                      className="w-full text-left px-3 py-2 rounded-[10px] hover:bg-[#F8F2E9] flex items-center justify-between gap-2 text-[#162660]"
                    >
                      <span className="text-[14px] font-medium truncate">{it.t}</span>
                      <span className="text-[11px] text-[#5B6585] mono shrink-0">
                        {it.k.split('?')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Filter 57 modules..."
            />
            <div className="flex flex-col gap-0.5">
              {filteredModules.map((m) => (
                <Link
                  key={m.name}
                  href={`/modules/${m.name}`}
                  onClick={() => setDrawerOpen(false)}
                  className={[
                    'no-underline px-3 py-2 rounded-[10px] flex items-center justify-between gap-2 transition-colors',
                    currentModule === m.name
                      ? 'bg-[#D0E6FD] text-[#162660] font-semibold'
                      : 'text-[#162660] hover:bg-[#F8F2E9]',
                  ].join(' ')}
                >
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate">{m.name}</div>
                    <div className="text-[11px] text-[#5B6585] truncate">{m.category}</div>
                  </div>
                  <span className="text-[11px] mono text-[#2E46A0] shrink-0">{m.route}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-[#E9E1D5]">
          <Link
            href="/modules"
            onClick={() => setDrawerOpen(false)}
            className="block w-full text-center py-2.5 px-4 rounded-[12px] bg-[#EEF5FE] text-[#162660] border border-[#B5D3F5] font-semibold text-[14px] no-underline hover:bg-[#D0E6FD]"
          >
            Open Component &amp; 57-Module Directory
          </Link>
        </div>
      </div>
    </Drawer>
  );
}
