'use client';

import React, { useEffect } from 'react';
import { navigateSection } from '@/lib/common';

interface FavoriteItem {
  key: string;
  name: string;
  sku: string;
}

declare global {
  interface Window {
    orbaEditFavorites?: (
      items: FavoriteItem[],
      existing: string[],
      onSave: (next: string[]) => void
    ) => void;
  }
}

interface SectionHelpersProps {
  activePage?: string;
}

/**
 * Interactive helpers for the 5 updated sections (Sell, Bill Book, Stock, Labels, Printers):
 * - Density switcher (cards / compact) on Sell catalogue
 * - Favorites manager dialog (window.orbaEditFavorites)
 * - Keyboard shortcuts dialog (#orba-shortcuts) and F2 / F4 / F6 / F8 / F9 shortcuts
 * - Bill Book listbox keyboard navigation (ArrowUp / ArrowDown / Home / End)
 * - Modal focus trap and cash input auto-focus
 */
export default function SectionHelpers({ activePage }: SectionHelpersProps) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const root = document.documentElement;
    let density = root.dataset.orbaDensity || 'cards';
    root.dataset.orbaDensity = density;

    const syncDensityButtons = () => {
      document.querySelectorAll<HTMLButtonElement>('button[data-orba-density]').forEach((b) => {
        const pressed = String(b.dataset.orbaDensity === density);
        if (b.getAttribute('aria-pressed') !== pressed) {
          b.setAttribute('aria-pressed', pressed);
        }
      });
    };
    syncDensityButtons();

    // Shortcuts help dialog
    let helpDlg = document.getElementById('orba-help-dialog') as HTMLDialogElement | null;
    if (!helpDlg) {
      helpDlg = document.createElement('dialog');
      helpDlg.id = 'orba-help-dialog';
      helpDlg.setAttribute('aria-labelledby', 'orba-help-title');
      helpDlg.innerHTML =
        '<h2 id="orba-help-title">Register shortcuts</h2>' +
        '<p>Use these shortcuts when no dialog is open. They never complete a sale.</p>' +
        '<dl>' +
        '<dt>F2</dt><dd>Focus search in the current workspace</dd>' +
        '<dt>F4</dt><dd>Customer</dd>' +
        '<dt>F6</dt><dd>Discount</dd>' +
        '<dt>F8</dt><dd>Hold or recall</dd>' +
        '<dt>F9</dt><dd>Open checkout (does not confirm payment)</dd>' +
        '<dt>Alt + 1</dt><dd>Sell</dd>' +
        '<dt>Alt + 2</dt><dd>Stock</dd>' +
        '<dt>Alt + 3</dt><dd>Bill Book</dd>' +
        '<dt>Alt + 4</dt><dd>Labels</dd>' +
        '<dt>Alt + 5</dt><dd>Printers</dd>' +
        '</dl>' +
        '<button type="button">Close</button>';
      document.body.appendChild(helpDlg);
      const closeBtn = helpDlg.querySelector('button');
      if (closeBtn) closeBtn.onclick = () => helpDlg?.close();
    }

    // Favorites manager dialog
    let favDlg = document.getElementById('orba-fav-dialog') as HTMLDialogElement | null;
    if (!favDlg) {
      favDlg = document.createElement('dialog');
      favDlg.id = 'orba-fav-dialog';
      favDlg.setAttribute('aria-labelledby', 'orba-fav-title');
      favDlg.innerHTML =
        '<header><h2 id="orba-fav-title">Manage favorites</h2>' +
        '<p>Pin frequently sold articles. This does not change stock or prices.</p>' +
        '<input type="search" aria-label="Search favorites catalogue" placeholder="Search article or code"></header>' +
        '<div id="orba-fav-list"></div>' +
        '<footer><span role="status" id="orba-fav-count"></span>' +
        '<button type="button" id="orba-fav-cancel">Cancel</button>' +
        '<button type="button" id="orba-fav-save">Save</button></footer>';
      document.body.appendChild(favDlg);
    }

    const favInput = favDlg.querySelector('input') as HTMLInputElement;
    const favList = favDlg.querySelector('#orba-fav-list') as HTMLDivElement;
    const favCount = favDlg.querySelector('#orba-fav-count') as HTMLSpanElement;
    const favCancel = favDlg.querySelector('#orba-fav-cancel') as HTMLButtonElement;
    const favSave = favDlg.querySelector('#orba-fav-save') as HTMLButtonElement;

    let catalog: FavoriteItem[] = [];
    let draft = new Set<string>();
    let saveFn: ((next: string[]) => void) | null = null;

    const updateFavCount = () => {
      if (favCount) favCount.textContent = `${draft.size} selected`;
    };

    const renderFavs = () => {
      if (!favList || !favInput) return;
      favList.replaceChildren();
      const q = favInput.value.toLowerCase().trim();
      const matches = catalog.filter((i) => `${i.name} ${i.sku}`.toLowerCase().includes(q));
      for (const item of matches) {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        const text = document.createElement('span');
        const code = document.createElement('small');
        checkbox.type = 'checkbox';
        checkbox.checked = draft.has(item.key);
        checkbox.setAttribute('aria-label', `${item.name} · ${item.sku}`);
        checkbox.onchange = () => {
          if (checkbox.checked) draft.add(item.key);
          else draft.delete(item.key);
          updateFavCount();
        };
        text.textContent = item.name;
        code.textContent = item.sku;
        text.append(code);
        label.append(checkbox, text);
        favList.append(label);
      }
      if (!favList.children.length) {
        const p = document.createElement('p');
        p.style.padding = '18px 0';
        p.textContent = 'No matching articles.';
        favList.append(p);
      }
      updateFavCount();
    };

    if (favInput) favInput.oninput = renderFavs;
    if (favCancel) favCancel.onclick = () => favDlg?.close();
    if (favSave) {
      favSave.onclick = () => {
        const fn = saveFn;
        const next = [...draft];
        favDlg?.close();
        fn?.(next);
      };
    }

    window.orbaEditFavorites = (items, existing, fn) => {
      catalog = items || [];
      draft = new Set((existing || []).filter((k) => catalog.some((i) => i.key === k)));
      saveFn = fn;
      if (favInput) favInput.value = '';
      renderFavs();
      try {
        favDlg?.showModal();
      } catch {
        favDlg?.setAttribute('open', '');
      }
      favInput?.focus();
    };

    // Click handler for density buttons and shortcuts help button
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const dBtn = target?.closest?.('button[data-orba-density]') as HTMLButtonElement | null;
      if (dBtn && dBtn.dataset.orbaDensity) {
        density = dBtn.dataset.orbaDensity;
        root.dataset.orbaDensity = density;
        syncDensityButtons();
      }
      if (target?.closest?.('#orba-shortcuts')) {
        try {
          helpDlg?.showModal();
        } catch {
          helpDlg?.setAttribute('open', '');
        }
      }
    };

    // Modal focus trap & #master-cash-amount auto-focus
    let activeModal: HTMLElement | null = null;
    let originEl: Element | null = null;
    let cashEl: HTMLElement | null = null;

    const getTopModal = (): HTMLElement | null => {
      const list = [...document.querySelectorAll<HTMLElement>('.zyro-sec-scope [aria-modal="true"]')].filter(
        (el) => el.getClientRects().length > 0
      );
      return list.length ? list[list.length - 1] : null;
    };

    const getFocusables = (container: HTMLElement): HTMLElement[] =>
      [
        ...container.querySelectorAll<HTMLElement>(
          'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]'
        ),
      ].filter(
        (el) =>
          el.tabIndex >= 0 &&
          el.getClientRects().length > 0 &&
          getComputedStyle(el).visibility === 'visible' &&
          !el.closest('[inert]')
      );

    const observer = new MutationObserver(() => {
      syncDensityButtons();
      const modal = getTopModal();
      if (modal !== activeModal) {
        if (modal) {
          if (!activeModal) originEl = document.activeElement;
          activeModal = modal;
          if (!modal.contains(document.activeElement)) {
            const list = getFocusables(modal);
            const preferred =
              list.find((el) => /close|cancel|back/i.test(el.getAttribute('aria-label') || el.innerText)) ||
              list[0];
            preferred?.focus({ preventScroll: true });
          }
        } else {
          activeModal = null;
          if (originEl && originEl.isConnected && originEl !== document.body) {
            (originEl as HTMLElement).focus?.({ preventScroll: true });
          }
          originEl = null;
        }
      }
      const cashInput = document.getElementById('master-cash-amount');
      if (
        cashInput &&
        !cashEl &&
        !modal &&
        !document.querySelector('dialog[open]') &&
        document.activeElement === document.body
      ) {
        cashInput.focus({ preventScroll: true });
        if (window.innerWidth <= 820) {
          cashInput.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      }
      cashEl = cashInput;
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Keyboard shortcuts + Bill Book listbox navigation
    const onKeyDown = (e: KeyboardEvent) => {
      // Tab focus trap inside active modal
      if (e.key === 'Tab' && !document.querySelector('dialog[open]')) {
        const modal = getTopModal();
        if (modal) {
          const list = getFocusables(modal);
          if (list.length) {
            const idx = list.indexOf(document.activeElement as HTMLElement);
            if (e.shiftKey && idx <= 0) {
              e.preventDefault();
              list[list.length - 1].focus();
              return;
            }
            if (!e.shiftKey && (idx < 0 || idx === list.length - 1)) {
              e.preventDefault();
              list[0].focus();
              return;
            }
          }
        }
      }

      if (e.defaultPrevented || document.querySelector('dialog[open],[aria-modal="true"]')) return;

      // Bill Book listbox keyboard navigation
      const target = e.target as HTMLElement | null;
      const optItem = target?.closest?.('[role="option"]') as HTMLElement | null;
      const billList = optItem?.closest('[role="listbox"][aria-label="Bills"]') as HTMLElement | null;
      if (billList && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) && !e.altKey && !e.ctrlKey && !e.metaKey) {
        const rows = [...billList.querySelectorAll<HTMLElement>('[role="option"]')].filter(
          (x) => !(x as HTMLButtonElement).disabled && x.getClientRects().length > 0
        );
        const i = rows.indexOf(optItem!);
        const nextIdx =
          e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? rows.length - 1
              : Math.max(0, Math.min(rows.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)));
        if (rows[nextIdx]) {
          e.preventDefault();
          rows[nextIdx].focus();
          rows[nextIdx].scrollIntoView({ block: 'nearest' });
        }
        return;
      }

      // F2: Focus search in Sell / Stock / Bill Book
      if (e.key === 'F2' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        const input = [...document.querySelectorAll<HTMLInputElement>('#pos-search,#v26-stock-search,#bb-q')].find(
          (x) => x.getClientRects().length > 0
        );
        if (input) {
          e.preventDefault();
          input.focus();
          input.select();
        }
        return;
      }

      // F4 / F6 / F8 / F9 shortcuts inside Sell
      if (
        !e.repeat &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        ['F4', 'F6', 'F8', 'F9'].includes(e.key) &&
        (!activePage || activePage === 'sell')
      ) {
        const btn = [...document.querySelectorAll<HTMLButtonElement>(`[data-orba-key="${e.key}"]`)].find(
          (x) => x.getClientRects().length > 0 && !x.disabled
        );
        if (btn) {
          e.preventDefault();
          btn.click();
        }
        return;
      }

      // Alt + 1..5 section switching (Sell, Stock, Bill Book, Labels, Printers)
      if (
        e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        /^[1-5]$/.test(e.key) &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName || '')
      ) {
        e.preventDefault();
        const pages = ['sell', 'stock', 'bills', 'labels', 'printers'];
        navigateSection(pages[Number(e.key) - 1]);
      }
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown, true);
      observer.disconnect();
    };
  }, [activePage]);

  return null;
}
