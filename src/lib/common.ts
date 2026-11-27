// @ts-nocheck
'use client';

/* ============================================================
 * ZYRO Retail POS — Shared Design Tokens, Icons, Sample Data &
 * Operational Engine (Sell, Bill Book, Stock, Labels, Printers)
 * ============================================================ */
/* ============================================================
   DESIGN TOKENS · Copper Teal (design system 03) · gate D1
   The one source for colour, type, radius, elevation and motion.
   Every screen's UI colours, radii and type sizes come from here;
   preview/tokens_audit.py checks it. Product swatches and drawn
   illustrations are content, not tokens (listed in the audit).
   ============================================================ */
var TOKENS = {
  brand: { teal: '#162660', tealHover: '#111E50', tealText: '#2E46A0', copper: '#D0E6FD', copperHover: '#DCECFE', copperDeep: '#2E46A0', copperTint: '#EEF5FE', copperTintHover: '#D0E6FD', copperLine: '#B5D3F5', copperInk: '#7A5320', copperOnDark: '#D0E6FD', dangerHover: '#9A1E14' },
  ink: { strong: '#162660', body: '#454F70', muted: '#5B6585', dim: '#5B6585', onDark: '#FFFFFF', mutedOnDark: '#BFD0EE', dimOnDark: '#A9BCE0' },
  surface: { page: '#F1E4D1', card: '#FFFFFF', raised: '#F8F2E9', neutral: '#F6F0E7', track: '#ECE4D8', hover: '#F8F2E9' },
  line: { divider: '#F6F0E7', card: '#E9E1D5', control: '#D9CFC0', field: '#8A8276', dashed: '#C8BCAA' },
  status: {
    ok: { bg: '#E8F6EE', fg: '#14532D', accent: '#2F9E63', onDark: '#7FD6A4' },
    warn: { bg: '#FFF3C4', fg: '#6B4E00', accent: '#C99A06', line: '#EBD892', onDark: '#F2D06B' },
    err: { bg: '#FDF0EF', fg: '#B42318', accent: '#E36B5D', line: '#F2C4BE', onDark: '#F7A59B' },
    info: { bg: '#EAF2FD', fg: '#24398A', onDark: '#A9C6FF' },
    neutral: { bg: '#F6F0E7', fg: '#454F70' }
  },
  avatar: [['#EAF2FD', '#24398A'], ['#F1E4D1', '#7A5320'], ['#F1E6D6', '#6B4A1E'], ['#E5EDE3', '#2F4A2E'], ['#ECE6EF', '#4A3A5A']],
  print: { ink: '#111111', mid: '#555555', light: '#9A9A9A' },
  type: { family: "Outfit, 'Segoe UI', Roboto, system-ui, sans-serif", display: "Outfit, sans-serif", mono: "'JetBrains Mono', monospace", urdu: "'Noto Naskh Arabic', serif", sizes: [12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30, 34, 44, 52, 64], weights: [400, 500, 600, 700], urduBody: 18, urduLineHeight: 1.85 },
  radius: [3, 4, 6, 9, 10, 12, 14, 16, 18, 20, 22, 999],
  space: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48],
  elevation: { raised: '0 1px 2px rgba(22,30,60,.08)', toast: '0 12px 28px rgba(12,20,50,.28)', sheet: '0 18px 48px rgba(12,20,50,.3)', drawer: '-18px 0 48px rgba(12,20,50,.22)', dialog: '0 24px 64px rgba(12,20,50,.3)' },
  motion: { press: '100ms ease-out', fade: '150ms ease-out', sheet: '200ms ease-out', drawer: '250ms ease-out' },
  target: { min: 44, counter: 56 }
};
/* Content colours: product swatches, product art and drawn illustrations (device, cash notes). Not UI tokens. */
/* ===== Orba Retail · shared library (injected into every artboard by build.py) ===== */
var ICONS = {
  search: 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M20 20l-3.5-3.5',
  scan: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M8 8v8M12 8v8M16 8v8',
  home: 'M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5M10 21v-6h4v6',
  sell: 'M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4',
  orders: 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  stock: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  khata: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20M9 7h7M9 11h5',
  cash: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0M6 12h.01M18 12h.01',
  more: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  hold: 'M21 12A9 9 0 1 0 12 21M12 7v5l3 1.5M16.5 16v5M20.5 16v5',
  ret: 'M18 10V2H6v20l3-2 3 2M9 7h6M9 11h4M17 14l-3 3 3 3M14 17h4.5a2.5 2.5 0 0 0 0-5H17',
  clear: 'M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6',
  userPlus: 'M5 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6',
  user: 'M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M4 21a8 8 0 0 1 16 0',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  right: 'M9 18l6-6-6-6',
  left: 'M15 18l-6-6 6-6',
  down: 'M6 9l6 6 6-6',
  back: 'M19 12H5M12 19l-7-7 7-7',
  x: 'M18 6L6 18M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  percent: 'M19 5L5 19M4.5 6.5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M15.5 17.5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
  note: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  check: 'M20 6L9 17l-5-5',
  checkCircle: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M8 12.5l2.8 2.8L16 9.5',
  warn: 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
  err: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M12 8v4.5M12 16h.01',
  info: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M12 16v-4.5M12 8h.01',
  wifiOff: 'M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 4.2-2.6M10.7 5.1A15 15 0 0 1 22 8.8M5 12.9a10 10 0 0 1 5.2-2.7M19 12.9a10 10 0 0 0-2.1-1.6M12 20h.01',
  cloud: 'M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9zM9.5 14l2 2 3.5-3.5',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  printer: 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z',
  chat: 'M7.9 20A9 9 0 1 0 4 16.1L2 22zM8.5 11h.01M12 11h.01M15.5 11h.01',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  wallet: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  qr: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2M15 19h2M19 19h2v2h-2M6 6h.01M18 6h.01M6 18h.01',
  card: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20M6 15h4',
  bank: 'M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l9 5H3z',
  split: 'M16 3h5v5M8 3H3v5M12 22v-8.3a4 4 0 0 0-1.2-2.8L3 3M15 9l6-6',
  clock: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M12 7v5l3 2',
  lock: 'M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V7a4 4 0 0 1 8 0v4',
  key: 'M2.6 18.4L2 22h4v-2h2v-2h2l1.4-1.4a6.5 6.5 0 1 0-4-4zM16.5 7.5h.01',
  backspace: 'M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 9l-6 6M12 9l6 6',
  sound: 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  mute: 'M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6',
  globe: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  torch: 'M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12zM6 6h12M12 12v2',
  tag: 'M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4zM7.5 7.5h.01',
  ruler: 'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0zM14.5 12.5l2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2',
  bag: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15h6',
  keyboard: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10',
  refresh: 'M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M3 21v-5h5',
  receipt: 'M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  settings: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  dots: 'M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
  sortDown: 'M12 5v14M19 12l-7 7-7-7',
  sortUp: 'M12 19V5M5 12l7-7 7 7',
  help: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
  truck: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  external: 'M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  bills: 'M8 2h12v20l-3-2-3 2-3-2-3 2zM11 7h6M11 11h6M11 15h4M4 6v14',
  printer2: 'M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z',
  quote: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  store: 'M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6',
  coins: 'M2 8a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M18.1 10.4A6 6 0 1 1 10.3 18M7 6h1v4M16.7 13.9l.7.7-2.8 2.8',
  pause: 'M8 5v14M16 5v14',
  camera: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
  barcode: 'M3 5v14M6.5 5v14M9 5v14M13 5v14M15.5 5v14M18.5 5v14M21 5v14',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M9.9 4.2A9.6 9.6 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.3M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M14.1 14.1a3 3 0 1 1-4.2-4.2M2 2l20 20',
  shirt: 'M20.4 6.6 16 3a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.3 1.2l1.6 3.3a1 1 0 0 0 1.3.5L8 10.8V20a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-9.2l1.8.8a1 1 0 0 0 1.3-.5l1.6-3.3a1 1 0 0 0-.3-1.2z',
  shoe: 'M2 17v-4l3-1 2-5h3l1 3c2 1 5 1 8 2a3 3 0 0 1 3 3v2H2zM2 20h20',
  gem: 'M6 3h12l4 6-10 12L2 9zM2 9h20M12 21 8 9l4-6 4 6-4 12',
  pill: 'M10.5 20.5a5 5 0 0 1-7-7l10-10a5 5 0 0 1 7 7zM8.5 8.5l7 7',
  basket: 'M5 11l2-6M19 11l-2-6M2 11h20l-2 9H4zM9 15v2M12 15v2M15 15v2',
  drop: 'M12 2.7c-3 4-6 7.4-6 11.3a6 6 0 0 0 12 0c0-3.9-3-7.3-6-11.3z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 3v4M21 5h-4',
  layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  fingerprint: 'M12 11v3a8 8 0 0 1-1.5 4.7M8 7.5A5 5 0 0 1 17 11v1M5 10a7 7 0 0 1 1-3.5M7 14a5 5 0 0 0 .5-3M17 15.5a14 14 0 0 1-1 4M3 14.5c.5-1.4.8-2.8.8-4.2A8.2 8.2 0 0 1 16 4',
  up: 'M6 15l6-6 6 6',
  grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3'
};

/* Drawn product stand-ins (120 × 120): b = silhouette, s = shading, l = detail lines.
   They stand in until real 1:1 product photos arrive. */
var ART = { bag:{b:'M27 44 Q20 44 19 54 L14 100 Q14 109 24 110 L96 110 Q106 109 106 100 L101 54 Q100 44 93 44 Z M43 44 L43 31 Q43 15 60 15 Q77 15 77 31 L77 44 L70 44 L70 31 Q70 22 60 22 Q50 22 50 31 L50 44 Z',s:'M20 83 Q62 101 101 83 L104 101 Q104 107 96 108 L24 108 Q17 107 17 100 Z',l:'M23 55 L97 55 M48 62 L72 62 M60 55 L60 72'},
  tee: {
    b: 'M44 20L52 17C55 23 65 23 68 17L76 20L98 33L90 50L80 45V100C66 103 54 103 40 100V45L30 50L22 33Z',
    s: 'M40 92C54 95 66 95 80 92V100C66 103 54 103 40 100ZM90 50L80 45V40L93 44Z',
    l: 'M52 17C55 25 65 25 68 17M40 45V36M80 45V36'
  },
  kurta: {
    b: 'M46 12L54 10C56 15 64 15 66 10L74 12L94 27L88 45L80 41L82 109C68 111 52 111 38 109L40 41L32 45L26 27Z',
    s: 'M38 101C52 103 68 103 82 101V109C68 111 52 111 38 109Z',
    l: 'M54 10C56 16 64 16 66 10M60 14V42M60 21v.01M60 28v.01M60 35v.01M39.5 92v12M80.5 92v12'
  },
  suit: {
    b: 'M47 10L55 8H65L73 10L92 24L86 42L79 38L80 90C68 92 52 92 40 90L41 38L34 42L28 24ZM44 90H76L78 112H64L60 98L56 112H42Z',
    s: 'M44 90H76L76.6 96H43.4ZM40 84C52 86 68 86 80 84V90C68 92 52 92 40 90Z',
    l: 'M55 8V13C58 15 62 15 65 13V8M60 14V34M40.5 76v12M79.5 76v12'
  },
  jeans: {
    b: 'M38 12H82L86 108H66L60 50L54 108H34Z',
    s: 'M38 12H82L82.5 21H37.5Z',
    l: 'M38 21H82M60 21V44M44 22c0 7 5 10 10 10M76 22c0 7-5 10-10 10M64 30v.01M40 100h12M68 100h12'
  },
  lawn: {
    b: 'M24 42H96Q100 42 100 46V60Q100 64 96 64H24Q20 64 20 60V46Q20 42 24 42ZM18 66H102V80Q102 84 98 84H22Q18 84 18 80ZM16 86H104V100Q104 104 100 104H20Q16 104 16 100Z',
    s: 'M18 66H102V70H18ZM16 86H104V90H16Z',
    l: 'M34 50a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M52 54a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M70 50a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M86 55a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M26 76H94M24 96H96'
  },
  shawl: {
    b: 'M24 26H96Q100 26 100 30V72L60 92L20 72V30Q20 26 24 26Z',
    s: 'M20 64L60 84L100 64V72L60 92L20 72Z',
    l: 'M28 76v10M36 80v10M44 84v10M52 88v10M68 88v10M76 84v10M84 80v10M92 76v10M46 48c4-9 18-9 18 2c0 7-8 10-12 6M30 34H90'
  },
  chappal: {
    b: 'M60 12C76 12 82 28 80 48C78 64 82 78 80 92C78 105 70 110 60 110C50 110 42 105 40 92C38 78 42 64 40 48C38 28 44 12 60 12Z',
    s: 'M39 38C50 33 70 33 81 38L82 51C70 46 50 46 38 51ZM41 58C52 54 68 54 79 58L80 69C68 65 52 65 40 69Z',
    l: 'M47 41v4M53 40v5M60 39.5v5M67 40v5M73 41v4M60 76V102'
  },
  sneaker: {
    b: 'M12 84C12 72 18 66 28 64L46 58C52 56 56 58 58 62C64 70 74 72 86 74C100 76 108 80 108 88V92H12Z',
    s: 'M12 88H108V94C108 97 106 98 103 98H16C13 98 12 96 12 94Z',
    l: 'M50 62L56 70M58 60L64 68M66 64L70 71M30 80H76M96 80v.01'
  },
  khussa: {
    b: 'M14 86C14 76 22 70 34 70C50 70 62 72 78 70C92 68 100 60 104 52C108 60 106 74 98 82C90 90 74 94 56 94H22C17 94 14 91 14 86Z',
    s: 'M14 89C30 93 60 93 98 84V86C88 93 72 97 56 97H22C17 97 14 94 14 89Z',
    l: 'M40 79v.01M48 78.5v.01M56 78v.01M64 77.5v.01M72 76.5v.01M30 74C44 82 70 80 90 70'
  },
  belt: {
    b: 'M10 52H96Q104 52 104 60Q104 68 96 68H10Z',
    s: 'M10 64H100Q104 64 103 66Q101 68 96 68H10Z',
    l: 'M14 46H36V74H14ZM25 60H52M70 60v.01M78 60v.01M86 60v.01'
  },
  socks: {
    b: 'M30 14H48V62C48 70 52 74 60 78C68 82 70 94 60 98C52 102 42 96 34 90C28 84 30 74 30 68ZM58 22H76V66C76 74 80 78 88 82C96 86 98 98 88 102C80 106 70 100 62 94C56 88 58 78 58 72Z',
    s: 'M30 14H48V24H30ZM58 22H76V32H58Z',
    l: 'M34 16v6M39 16v6M44 16v6M62 24v6M67 24v6M72 24v6'
  },
  fabric: {
    b: 'M28 34H90A10 22 0 0 1 90 78H28A10 22 0 0 1 28 34ZM34 78L26 106H76L70 78Z',
    s: 'M90 34A10 22 0 0 1 90 78A10 22 0 0 1 90 34Z',
    l: 'M38 46H82M38 56H82M38 66H82M90 50A4 7 0 0 1 90 62'
  }
};

var SW = { Black: '#24282A', White: '#F8F2E9', Navy: '#26375E', Sky: '#93B9DC', Olive: '#6E7442', Grey: '#8C918E', Beige: '#D9C8A7', Indigo: '#33437A', Rose: '#E2A2B3', Mint: '#A9D9C2', Charcoal: '#3B3E3D', Rust: '#7A5320', Cream: '#EFE6D2', Brown: '#6E4626', Gold: '#C9A24A', Maroon: '#6E2230', Tan: '#8A5A33', Slate: '#5E6B73', Coffee: '#4B3221', Mustard: '#C9962E', Silver: '#B9BDC0', Red: '#B3312F', Camel: '#B88A5A' };

/* Warm category tints (all pass 6.4:1 with their ink). */
var TINT = { bags:{bg:'#F1E4D1',fg:'#7A5320'}, kids:{bg:'#EAF2FD',fg:'#24398A'}, general:{bg:'#E5EDE3',fg:'#2F4A2E'},
  men: { bg: '#EAF2FD', fg: '#24398A' },
  women: { bg: '#F1E4D1', fg: '#7A5320' },
  foot: { bg: '#F1E6D6', fg: '#6B4A1E' },
  acc: { bg: '#E5EDE3', fg: '#2F4A2E' },
  fabric: { bg: '#ECE6EF', fg: '#4A3A5A' }
};

var CATS = [
  { id: 'all', label: 'All items' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'foot', label: 'Footwear' },
  { id: 'acc', label: 'Accessories' },
  { id: 'fabric', label: 'Fabric' }, {id:'bags',label:'Bags'}, {id:'kids',label:'Kids'}, {id:'general',label:'General products'}
];

var __G: any = typeof window !== 'undefined' ? window : globalThis;
var STOCK_ADJ = __G.__orbaAdj || (__G.__orbaAdj = {});
/* ===== One shop in one window (23 Nov 2026) =====
   Settings, bills, Khata, the drawer, shifts and stock live here once, so every screen reads and writes the same shop.
   A page reload starts the demo day again. */
var SET = __G.__orbaSet || (__G.__orbaSet = {
  shop: { name: 'Hamza Fashion', phone: '0321 4567890', addr: 'Shop 14, Liberty Market, Gulberg III', city: 'Lahore', ntn: '4182031-6', strn: '3277876543210' },
  pay: { cash: true, khata: true, jazz: true, easy: true, raast: true, card: true, bank: true }, payV: null, khataLimit: 50000, round: 1,
  ap: { disc: 10, refund: 2000, cashout: 5000, price: true, void: true, how: 'both' },
  rc: { logo: true, addr: true, ntn: true, cust: true, powered: true, top: '', foot: 'Shukriya! Please visit again.', days: 7, lang: 'en' },
  pr: { auto: true, copies: false, drawer: true, gift: false, paper: 80, label: true, labelSize: '38' },
  fbr: { on: true, incl: true, rates: { Clothing: 18, Footwear: 18, Accessories: 18, 'Unstitched fabric': 18 }, buyer: true, wa: false },
  wa: { on: true, bill: true, khata: true, order: true, thanks: false, owner: true },
  sec: { pin: 4, lock: '5', two: true, sw: true, wrong: true },
  cn: { zs: true, tcs: true, leo: true, mp: false, px: true, trax: false, ig: true, fb: false },
  shift: { c1: 'open', float: 10000, by: 'Ali' }, min: 744
});
var LEDGER = __G.__orbaLedger || (__G.__orbaLedger = []);
var KEEP = __G.__orbaKeep || (__G.__orbaKeep = {});
/* a page keeps its work: restore these fields when it opens again, save them on every change */
function keepSync(self, key, fields) {
  var k = KEEP[key];
  if (!self._kept) { self._kept = true; if (k) { var st = Object.assign({}, self.state); fields.forEach(function (f) { if (k[f] !== undefined) st[f] = k[f]; }); self.state = st; } }
  var o = KEEP[key] || (KEEP[key] = {}); fields.forEach(function (f) { o[f] = self.state[f]; });
}
/* settings pages write to SET only after the owner changes something, so demo boards never overwrite the shop */
function trackDirty(self) { if (self._td) return; self._td = 1; var ss = self.setState; self.setState = function () { self._dirty = true; return ss.apply(self, arguments); }; }
function demoTime() { SET.min = (SET.min || 744) + 2; var h = Math.floor(SET.min / 60), m = SET.min % 60; return ((h + 11) % 12 + 1) + ':' + (m < 10 ? '0' : '') + m + (h >= 12 ? ' pm' : ' am'); }
/* money that moved: kind in|out, src khata|exp|sup|sal|adv|refund|return, way cash|jazz|easy|bank|home */
function ledgerAdd(e) { var x = Object.assign({ time: demoTime(), way: 'cash' }, e); LEDGER.push(x); return x; }
function ledgerSum(kind, srcs, cashOnly) { return LEDGER.reduce(function (a, x) { return a + (x.kind === kind && (!srcs || srcs.indexOf(x.src) >= 0) && (!cashOnly || x.way === 'cash') ? x.amt : 0); }, 0); }
function adjAdd(it, ci, si, d) { if (!it) return; var k = it.id + '|' + (it.colours ? (ci || 0) : '') + '|' + (it.sizes ? (si || 0) : ''); STOCK_ADJ[k] = (STOCK_ADJ[k] || 0) + d; }
function roundBill(x) { var r = +SET.round || 1; return r > 1 ? Math.round(x / r) * r : x; }
var TAX_GROUP = { men: 'Clothing', women: 'Clothing', kids: 'Clothing', foot: 'Footwear', acc: 'Accessories', fabric: 'Unstitched fabric' };
function rateOf(it) { var g = TAX_GROUP[(it && it.cat) || 'men'] || 'Clothing', r = SET.fbr.rates[g]; return r == null ? 18 : r; }
/* tax on a bill: per line at its category's rate, inside the price or added on top */
function taxFor(lines, goods) {
  var sub = lines.reduce(function (a, l) { return a + lineTotal(l); }, 0) || 1, k = goods / sub;
  return lines.reduce(function (a, l) { var r = rateOf(findItem(l.id)), v = lineTotal(l) * k; return a + (SET.fbr.incl ? v * r / (100 + r) : v * r / 100); }, 0);
}
function pinOf(id) { return +SET.sec.pin === 6 ? { ali: '111111', sana: '222222', imran: '123456' }[id] : PINS[id]; }

var ITEMS = __G.__orbaItems || (__G.__orbaItems = [
  { id: 'tee', art: 'tee', name: 'Everyday Tee', cat: 'men', price: 1350, sku: 'TEE', colours: ['Black', 'White', 'Navy'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], sizeLabel: 'Size', chart: true },
  { id: 'kurta', art: 'kurta', name: 'Cotton Kurta', cat: 'men', price: 3490, sku: 'KUR', colours: ['White', 'Sky', 'Olive'], sizes: ['S', 'M', 'L', 'XL'], sizeLabel: 'Size', chart: true },
  { id: 'suit', art: 'suit', name: 'Wash & Wear Shalwar Suit', cat: 'men', price: 5990, sku: 'WWS', colours: ['Grey', 'Beige'], sizes: ['38', '40', '42', '44'], sizeLabel: 'Chest · inches', chart: true },
  { id: 'jeans', art: 'jeans', name: 'Slim Denim Jeans', cat: 'men', price: 3990, sku: 'JNS', colours: ['Indigo', 'Black'], sizes: ['30', '32', '34', '36'], sizeLabel: 'Waist · inches', chart: true },
  { id: 'lawn', art: 'lawn', name: 'Lawn 3-Pc Unstitched', cat: 'women', price: 4950, sku: 'LWN', colours: ['Rose', 'Mint', 'Indigo'], sizes: null },
  { id: 'shawl', art: 'shawl', name: 'Pashmina-blend Shawl', cat: 'women', price: 3200, sku: 'SHW', colours: ['Charcoal', 'Rust', 'Cream'], sizes: null },
  { id: 'chappal', art: 'chappal', name: 'Peshawari Chappal', cat: 'foot', price: 4500, sku: 'PSH', colours: ['Brown', 'Black'], sizes: ['40', '41', '42', '43', '44', '45'], sizeLabel: 'Size · EU', chart: true },
  { id: 'sneaker', art: 'sneaker', name: 'Runner Sneaker', cat: 'foot', price: 6990, sku: 'RUN', colours: ['White', 'Slate'], sizes: ['39', '40', '41', '42', '43', '44'], sizeLabel: 'Size · EU', chart: true },
  { id: 'khussa', art: 'khussa', name: 'Khussa — Women', cat: 'foot', price: 2800, sku: 'KHS', colours: ['Gold', 'Maroon'], sizes: ['36', '37', '38', '39', '40'], sizeLabel: 'Size · EU', chart: true },
  { id: 'belt', art: 'belt', name: 'Leather Belt', cat: 'acc', price: 1200, sku: 'BLT-BRN', stock: 9, col: 'Tan' },
  { id: 'socks', art: 'socks', name: 'Cotton Socks 3-pack', cat: 'acc', price: 650, sku: 'SCK-3PK', stock: 24, col: 'Slate' },
  { id: 'fabric', art: 'fabric', name: 'Cotton Fabric by metre', cat: 'fabric', price: 1250, unit: '/ m', sku: 'FAB-COT', measured: true, col: 'Cream' }
]);

var CUSTOMERS = __G.__orbaCust || (__G.__orbaCust = [
  { id: 'c1', name: 'Bilal Ahmed', phone: '03217654321', khata: 2400, last: '2 Nov' },
  { id: 'c2', name: 'Ayesha Khan', phone: '03001234567', khata: 0, last: '11 Nov' },
  { id: 'c3', name: 'Usman Ali', phone: '03459988776', khata: 850, last: '9 Nov' },
  { id: 'c4', name: 'Sana Tariq', phone: '03334455667', khata: 0, last: '28 Oct' },
  { id: 'c5', name: 'Hina Raza', phone: '03111222333', khata: 0, last: '1 Nov' },
  { id: 'c6', name: 'Kamran Butt', phone: '03004455667', khata: 4640, last: '5 Nov' },
  { id: 'c7', name: 'Nadia Shah', phone: '03339876543', khata: 6300, last: '8 Nov' },
  { id: 'c8', name: 'Farhan Malik', phone: '03451122334', khata: 2990, last: '11 Nov' }
]);

/* Khata: credit invoices made in Orba (statement scope: invoice-linked credit sales only).
   d = yyyymmdd. lines = [itemId, colour, size, qty]. col = collections, ret = returns that reduce what is owed. */
var ITEMS_RAW_PRICE = {'tee': 1350, 'kurta': 3490, 'suit': 5990, 'jeans': 3990, 'lawn': 4950, 'shawl': 3200, 'chappal': 4500, 'sneaker': 6990, 'khussa': 2800, 'belt': 1200, 'socks': 650, 'fabric': 1250};
var KH_INV = __G.__orbaKh || (__G.__orbaKh = [
  { no: '0952', cust: 'c6', d: 20261012, by: 'Hamza', lines: [['suit', 1, 2, 1], ['socks', null, null, 1]], col: [{ d: 20261105, amt: 2000, by: 'Owner' }], ret: [] },
  { no: '0971', cust: 'c8', d: 20261020, by: 'Hamza', lines: [['jeans', 1, 3, 1]], col: [{ d: 20261111, amt: 1000, by: 'Owner' }], ret: [] },
  { no: '0988', cust: 'c1', d: 20261028, by: 'Hamza', lines: [['kurta', 0, 2, 1], ['tee', 1, 2, 1]], col: [{ d: 20261102, amt: 3000, by: 'Owner' }, { d: 20261109, amt: 1840, by: 'Owner' }], ret: [] },
  { no: '0990', cust: 'c7', d: 20261029, by: 'Hamza', lines: [['lawn', 1, 0, 1], ['socks', null, null, 1]], col: [], ret: [{ d: 20261102, amt: 650, item: 'Cotton Socks 3-pack' }] },
  { no: '1012', cust: 'c7', d: 20261108, by: 'Hamza', lines: [['tee', 0, 0, 1]], col: [], ret: [] },
  { no: '1035', cust: 'c1', d: 20261114, by: 'Hamza', lines: [['shawl', 0, 0, 1]], col: [{ d: 20261114, amt: 800, by: 'Owner' }], ret: [] },
  { no: '1038', cust: 'c3', d: 20261114, by: 'Hamza', lines: [['tee', 2, 3, 1]], col: [{ d: 20261114, amt: 500, by: 'Owner' }], ret: [] }
]);
// what each customer owes comes from their Khata bills, fee included
// a bill paid in full before stays paid: its last payment covered the Re 1 fee too
if (!KH_INV._fixed) KH_INV._fixed = 1, KH_INV.forEach(function (i) { var g = 0; i.lines.forEach(function (l) { var it = ITEMS_RAW_PRICE[l[0]]; g += (it || 0) * l[3]; }); var paid = i.col.reduce(function (a, x) { return a + x.amt; }, 0) + i.ret.reduce(function (a, x) { return a + x.amt; }, 0); if (g && paid >= g && i.col.length) i.col[i.col.length - 1].amt += 1; /* the Re 1 FBR fee; FBR_FEE is set further down */ });
// worked out when read, so it always matches the Khata page
CUSTOMERS.forEach(function (c) { Object.defineProperty(c, 'khata', { configurable: true, enumerable: true, get: function () { return KH_INV.filter(function (i) { return i.cust === c.id; }).reduce(function (a, i) { return a + Math.max(0, invOwed(i)); }, 0); }, set: function () {} }); });
var CONSENT = {
  c1: { yes: true, ev: 'Said yes at the counter', d: 20261102 },
  c4: { yes: true, ev: 'Signed the shop register', d: 20261020 },
  c7: { yes: true, ev: 'Replied “Yes” on WhatsApp', d: 20261101 }
};
/* Responsive helper: gives a screen W, H and the narrow (phone) / mid (small tablet) flags its
   template uses with the rz-* classes in helmet.html. Call rz(Component, designW, designH) once. */
function rz(C, dw, dh) {
  var rv = C.prototype.renderVals;
  C.prototype.renderVals = function () {
    var v = rv.call(this), p = this.props || {};
    var W = +p.w || v.W || dw, H = +p.h || v.H || dh;
    v.W = W; v.H = H; v.nar = W < 760 ? '1' : '0'; v.mid = W >= 760 && W < 1100 ? '1' : '0'; v.cmp = W < 1000 ? '1' : '0';
    return v;
  };
  return C;
}
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function dShort(d) { return (d % 100) + ' ' + MONTHS[Math.floor(d / 100) % 100 - 1]; }
function daysAgo(d) { var t = Date.UTC(2026, 10, 14), x = Date.UTC(Math.floor(d / 10000), Math.floor(d / 100) % 100 - 1, d % 100); return Math.round((t - x) / 86400000); }
function invTotal(inv) { if (inv.total != null) return inv.total; return inv.lines.reduce(function (a, l) { return a + findItem(l[0]).price * l[3]; }, 0) + FBR_FEE; }
function invCollected(inv) { return inv.col.reduce(function (a, c) { return a + c.amt; }, 0); }
function invReturned(inv) { return inv.ret.reduce(function (a, c) { return a + c.amt; }, 0); }
function invOwed(inv) { return invTotal(inv) - invCollected(inv) - invReturned(inv); }
function khOwed() { return KH_INV.reduce(function (a, i) { return a + invOwed(i); }, 0); }

/* Purchasing (UI-M5). Lines: [item id, colour index, size index, qty ordered, PO unit cost, qty received, actual unit cost]. */
var SUPPLIERS = [
  { id: 's1', name: 'Noor Textiles', city: 'Faisalabad', phone: '03007654321', makes: 'Kurtas, shalwar suits' },
  { id: 's2', name: 'Karim Fabrics', city: 'Lahore', phone: '03214455889', makes: 'Lawn, cotton fabric' },
  { id: 's3', name: 'Lahore Shoe Mart', city: 'Lahore', phone: '03451239876', makes: 'Chappals, sneakers' },
  { id: 's4', name: 'Shaheen Footwear', city: 'Multan', phone: '03336677881', makes: 'Khussa' },
  { id: 's5', name: 'Royal Leather', city: 'Sialkot', phone: '03019988776', makes: 'Belts' }
];
var POS = __G.__orbaPos || (__G.__orbaPos = [
  { no: '118', sup: 's4', status: 'draft', by: 'Faraz', d: 20261114, lines: [['khussa', 0, 0, 4, 1450, 0], ['khussa', 0, 1, 6, 1450, 0], ['khussa', 0, 2, 6, 1450, 0], ['khussa', 1, 1, 4, 1450, 0], ['khussa', 1, 2, 4, 1450, 0]] },
  { no: '117', sup: 's1', status: 'received', by: 'Faraz', d: 20261108, lines: [['kurta', 0, 1, 10, 2000, 10, 2000], ['kurta', 1, 1, 10, 2000, 10, 2000], ['suit', 0, 1, 4, 3000, 4, 3000], ['suit', 1, 2, 4, 3000, 4, 3000]] },
  { no: '116', sup: 's2', status: 'ordered', by: 'Faraz', d: 20261110, lines: [['lawn', 0, null, 20, 2600, 0], ['lawn', 1, null, 20, 2600, 0], ['lawn', 2, null, 20, 2600, 0]] },
  { no: '115', sup: 's5', status: 'approved', by: 'Hamza', d: 20261112, lines: [['belt', null, null, 20, 650, 0]] },
  { no: '114', sup: 's3', status: 'partial', by: 'Faraz', d: 20261105, lines: [['chappal', 0, 1, 5, 2300, 5, 2300], ['chappal', 0, 2, 5, 2300, 5, 2300], ['chappal', 0, 3, 5, 2300, 5, 2300], ['chappal', 0, 4, 5, 2300, 5, 2300], ['sneaker', 0, 1, 5, 3900, 2, 4050], ['sneaker', 0, 2, 5, 3900, 2, 4050], ['sneaker', 0, 3, 5, 3900, 2, 4050], ['sneaker', 0, 4, 5, 3900, 2, 4050]] },
  { no: '112', sup: 's3', status: 'received', by: 'Faraz', d: 20261020, billed: true, lines: [['chappal', 1, 1, 10, 2300, 10, 2300], ['sneaker', 1, 2, 10, 4100, 10, 4100]] },
  { no: '110', sup: 's1', status: 'received', by: 'Faraz', d: 20261012, billed: true, lines: [['kurta', 2, 2, 15, 1900, 15, 1900], ['suit', 0, 2, 6, 4000, 6, 4000]] }
]);
var VBILLS = [
  { ref: 'INV-2231', sup: 's1', po: '117', status: 'draft', by: 'Faraz', inv: 20261114, due: 20261214, total: 64000, pays: [], credits: [] },
  { ref: 'LSM-882', sup: 's3', po: '112', status: 'posted', by: 'Faraz', inv: 20261029, due: 20261128, total: 64000, pays: [], credits: [] },
  { ref: 'INV-2190', sup: 's1', po: '110', status: 'posted', by: 'Faraz', inv: 20261020, due: 20261109, total: 52500, pays: [{ amt: 30000, ref: 'NOOR-0301', d: 20261025, by: 'Hamza' }], credits: [] }
];
function supById(id) { return SUPPLIERS.filter(function (x) { return x.id === id; })[0]; }
function poById(no) { return POS.filter(function (x) { return x.no === no; })[0]; }
function poLineName(ln) { var it = ITEMS.filter(function (x) { return x.id === ln[0]; })[0]; return { it: it, name: it.name, variant: it.colours ? variantText(it, ln[1], ln[2]) : 'One size', sku: it.colours ? skuOf(it, ln[1], ln[2] == null ? 0 : ln[2]) : it.sku }; }
function poQty(po) { return po.lines.reduce(function (a, l) { return a + l[3]; }, 0); }
function poRecv(po) { return po.lines.reduce(function (a, l) { return a + (l[5] || 0); }, 0); }
function poValue(po) { return po.lines.reduce(function (a, l) { return a + l[3] * l[4]; }, 0); }
function drawerCash() { if(fwMode())return fwDrawerMinor()/100; var cash = 0, coll = 0; BILLS.forEach(function (b) { cash += billCash(b); coll += b.collected; }); return SET.shift.float + cash + coll + ledgerSum('in', null, true) - ledgerSum('out', null, true); }

/* Cash, expenses and staff (UI-M6). Money in rupees. */
/* How money moves (22 Nov): every payment in or out can be cash, JazzCash, Easypaisa or bank. Only cash touches the drawer. */
var WAY_NAME = { cash: 'cash', jazz: 'JazzCash', easy: 'Easypaisa', bank: 'bank transfer' };
var WAY_BY = { cash: 'in cash', jazz: 'by JazzCash', easy: 'by Easypaisa', bank: 'by bank transfer' };
var WAY_OUT = { cash: 'From the Counter 1 drawer', jazz: 'Shop wallet 0300 1112223', easy: 'Shop wallet 0300 1112223', bank: 'Meezan Bank · …4567' };
var WAY_IN = { cash: 'Into the Counter 1 drawer', jazz: 'To shop wallet 0300 1112223', easy: 'To shop wallet 0300 1112223', bank: 'To Meezan Bank · …4567' };
function wayList(cur, pick, subs) { return [['cash', 'Cash'], ['jazz', 'JazzCash'], ['easy', 'Easypaisa'], ['bank', 'Bank transfer']].map(function (w) { var on = (cur || 'cash') === w[0]; return { label: w[1], sub: subs[w[0]], on: on ? 'true' : 'false', border: on ? '2px solid #2E46A0' : '1px solid #D9CFC0', bg: on ? '#EEF5FE' : '#ffffff', pick: function () { pick(w[0]); } }; }); }
var SHIFTS = [
  { id: 'SH-1114-1', reg: 'Counter 1', d: 20261114, opened: '10:02 am', by: 'Hamza', cashier: 'Ali', float: 10000, status: 'open' },
  { id: 'SH-1113-1', reg: 'Counter 1', d: 20261113, opened: '10:05 am', closed: '9:12 pm', by: 'Hamza', cashier: 'Ali', float: 10000, expected: 58240, counted: 57940, status: 'closed' },
  { id: 'SH-1112-1', reg: 'Counter 1', d: 20261112, opened: '10:00 am', closed: '9:20 pm', by: 'Hamza', cashier: 'Sana', float: 10000, expected: 61180, counted: 61180, status: 'closed' },
  { id: 'SH-1111-1', reg: 'Counter 1', d: 20261111, opened: '10:10 am', closed: '9:05 pm', by: 'Hamza', cashier: 'Ali', float: 10000, expected: 49650, counted: 49750, status: 'closed' },
  { id: 'SH-1110-2', reg: 'Counter 2', d: 20261110, opened: '4:00 pm', closed: '9:30 pm', by: 'Hamza', cashier: 'Sana', float: 5000, expected: 12300, counted: 12300, status: 'closed' }
];
var CASH_CATS = {
  owner_cash_in: { dir: 'in', label: 'Owner put cash in', doc: false }, customer_collection: { dir: 'in', label: 'Customer payment', doc: true }, misc_receipt_review: { dir: 'in', label: 'Other cash in', doc: false },
  owner_cash_out: { dir: 'out', label: 'Owner took cash out', doc: false }, shop_expense: { dir: 'out', label: 'Shop expense', doc: true }, supplier_payment: { dir: 'out', label: 'Supplier payment', doc: true }, customer_refund: { dir: 'out', label: 'Customer refund', doc: true }, misc_payout_review: { dir: 'out', label: 'Other cash out', doc: false }
};
var CASH_DRAFTS = [
  { id: 'CD-3', cat: 'owner_cash_out', amt: 20000, ref: 'OWN-1114-01', src: '', reason: 'Took cash home to deposit at the bank tomorrow', by: 'Hamza', when: 'Today 1:15 pm', status: 'draft', v: 0 },
  { id: 'CD-2', cat: 'customer_collection', amt: 2500, ref: 'COLL-1113-02', src: 'Bill 0952', reason: 'Kamran paid part of his Khata at the shop door', by: 'Hamza', when: '13 Nov 6:40 pm', status: 'reviewed', v: 1, evidence: 'Receipt book page 41', note: 'Matches the receipt book entry' },
  { id: 'CD-1', cat: 'shop_expense', amt: 650, ref: 'EXP-1112-01', src: 'Tea stall slip 88', reason: 'Tea and snacks for staff on the sale day', by: 'Hamza', when: '12 Nov 5:10 pm', status: 'cancelled', v: 1, cancel: 'Entered twice by mistake' }
];
var EXP_CATS = { rent: 'Rent', electricity: 'Electricity', gas: 'Gas', water: 'Water', internet: 'Internet', supplies: 'Supplies', marketing: 'Marketing', repairs: 'Repairs', transport: 'Transport', other: 'Other' };
var EXP_BILLS = [
  { id: 'EX1', title: 'Electricity · November', payee: 'LESCO', cat: 'electricity', amt: 18400, svc: 20261101, due: 20261120, ref: '0412-NOV', status: 'draft', pays: [] },
  { id: 'EX2', title: 'Shop rent · November', payee: 'Malik Properties', cat: 'rent', amt: 45000, svc: 20261101, due: 20261105, ref: null, rec: 'r1', period: '2026-11', status: 'posted', pays: [] },
  { id: 'EX3', title: 'Shopping bags', payee: 'Al-Noor Packaging', cat: 'supplies', amt: 6200, svc: 20261103, due: 20261103, ref: 'ANP-771', status: 'posted', pays: [{ amt: 6200, ref: 'BAG-1103', d: 20261103 }] },
  { id: 'EX4', title: 'AC service', payee: 'Cool Tech', cat: 'repairs', amt: 4500, svc: 20261107, due: 20261107, ref: 'CT-2210', status: 'posted', pays: [{ amt: 4500, ref: 'ACS-1107', d: 20261107 }] },
  { id: 'EX5', title: 'Shop rent · October', payee: 'Malik Properties', cat: 'rent', amt: 45000, svc: 20261001, due: 20261005, ref: null, rec: 'r1', period: '2026-10', status: 'posted', pays: [{ amt: 45000, ref: 'RENT-1005', d: 20261005 }] },
  { id: 'EX6', title: 'Internet · October', payee: 'Nayatel', cat: 'internet', amt: 3500, svc: 20261001, due: 20261010, ref: null, rec: 'r2', period: '2026-10', status: 'posted', pays: [{ amt: 3500, ref: 'NET-1010', d: 20261010 }] }
];
var EXP_REC = [
  { id: 'r1', title: 'Shop rent', payee: 'Malik Properties', cat: 'rent', amt: 45000, day: 5, start: '2026-01', active: true, made: ['2026-10', '2026-11'] },
  { id: 'r2', title: 'Internet', payee: 'Nayatel', cat: 'internet', amt: 3500, day: 10, start: '2026-03', active: true, made: ['2026-10'] },
  { id: 'r3', title: 'Night guard', payee: 'Watch Services', cat: 'other', amt: 8000, day: 1, start: '2026-06', active: false, made: ['2026-08'] }
];
var EMPLOYEES = [
  { id: 'e1', code: 'ALI-01', name: 'Ali Hassan', job: 'Cashier', login: 'Cashier login', salary: 32000, rev: 2, active: true },
  { id: 'e2', code: 'SAN-02', name: 'Sana Malik', job: 'Cashier', login: 'Cashier login', salary: 30000, rev: 1, active: true },
  { id: 'e3', code: 'FAR-03', name: 'Faraz Ahmed', job: 'Stockkeeper', login: 'Stockkeeper login', salary: 34000, rev: 1, active: true },
  { id: 'e4', code: 'IMR-04', name: 'Imran Qureshi', job: 'Manager', login: 'Manager login', salary: 40000, rev: 3, active: true }
];
var ADVANCES = [
  { id: 'ADV-1103', emp: 'e3', amt: 5000, rec: 0, d: 20261103 },
  { id: 'ADV-1002', emp: 'e4', amt: 2000, rec: 2000, d: 20261002 }
];
/* Payroll lines: [employee id, paid days, allowance, bonus, overtime, reduction, advance recovery, paid in cash] */
var PAYRUNS = [
  { period: '2026-11', days: 30, status: 'draft', lines: [['e1', 30, 0, 0, 1500, 0, 0, 0], ['e2', 28, 0, 0, 0, 0, 0, 0], ['e3', 30, 0, 0, 0, 0, 0, 0], ['e4', 30, 2000, 0, 0, 0, 0, 0]] },
  { period: '2026-10', days: 31, status: 'posted', lines: [['e1', 31, 0, 0, 1000, 0, 0, 33000], ['e2', 31, 0, 0, 0, 0, 0, 30000], ['e3', 31, 0, 1000, 0, 0, 0, 35000], ['e4', 31, 2000, 0, 0, 0, 2000, 40000]] }
];
function empById(id) { return EMPLOYEES.filter(function (e) { return e.id === id; })[0]; }
function payLine(run, l, salary) { var base = Math.round(salary * l[1] / run.days), gross = base + l[2] + l[3] + l[4], earned = gross - l[5], net = earned - l[6]; return { base: base, gross: gross, earned: earned, net: net }; }
function monthName(p) { var m = parseInt(p.slice(5, 7), 10); return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1] + ' ' + p.slice(0, 4); }

/* Orders and shipments (UI-M8). Lines: [item id, colour index, size index, qty, shipped]. */
var ORDER_SRC = { manual_whatsapp: 'WhatsApp', manual_instagram: 'Instagram', manual_facebook: 'Facebook', website_manual: 'Website', counter_manual: 'Counter' };
var SORDERS = [
  { id: '2048', src: 'manual_whatsapp', ref: 'WA-1115-03', cust: 'c2', status: 'draft', by: 'Ali', when: 'Today 1:40 pm', lines: [['lawn', 0, null, 1, 0], ['shawl', 0, null, 1, 0]] },
  { id: '2047', src: 'manual_whatsapp', ref: 'WA-1115-01', cust: 'c7', status: 'confirmed', by: 'Ali', when: 'Today 10:15 am', confirm: 'WhatsApp · Nadia confirmed size and address', lines: [['suit', 0, 2, 1, 0]] },
  { id: '2046', src: 'manual_instagram', ref: 'IG-mehwish.style', cust: null, name: '@mehwish.style', status: 'confirmed', by: 'Ali', when: 'Today 11:50 am', confirm: 'Instagram DM · buyer chose size L', lines: [['kurta', 1, 2, 1, 0]] },
  { id: '2045', src: 'manual_facebook', ref: 'FB-8812', cust: 'c1', status: 'partially_fulfilled', by: 'Sana', when: '12 Nov', confirm: 'Phone call · Bilal said yes', lines: [['jeans', 0, 1, 1, 1], ['belt', null, null, 1, 0]] },
  { id: '2044', src: 'manual_whatsapp', ref: 'WA-1109-02', cust: 'c3', status: 'fulfilled', by: 'Ali', when: '9 Nov', confirm: 'WhatsApp · Usman confirmed address', lines: [['sneaker', 0, 3, 1, 1]] },
  { id: '2043', src: 'website_manual', ref: 'WEB-311', cust: 'c5', status: 'fulfilled', by: 'Sana', when: '6 Nov', confirm: 'Website form · called to confirm', lines: [['khussa', 0, 2, 1, 1]] },
  { id: '2042', src: 'manual_whatsapp', ref: 'WA-1104-01', cust: 'c6', status: 'cancelled', by: 'Ali', when: '4 Nov', confirm: 'WhatsApp · confirmed', lines: [['suit', 1, 1, 1, 0]] }
];
var SHIPMENTS = [
  { id: 'SHP-882', order: '2047', courier: 'TCS', city: 'Islamabad', status: 'prepared', cod: 5990, lines: [[0, 1]] },
  { id: 'SHP-881', order: '2045', courier: 'Leopards', city: 'Lahore', status: 'handed_over', cod: 3990, lines: [[0, 1]] },
  { id: 'SHP-879', order: '2044', courier: 'TCS', city: 'Karachi', status: 'delivered_manual', cod: 6990, lines: [[0, 1]], match: { ref: 'TCS-3311', got: 6840, fees: 150, status: 'manual_matched' } },
  { id: 'SHP-877', order: '2043', courier: 'M&P', city: 'Faisalabad', status: 'rto_manual', cod: 2800, lines: [[0, 1]], review: true, note: 'Customer refused at the door' }
];

var STAFF = [
  { id: 'ali', name: 'Ali Hassan', short: 'Ali', role: 'Cashier', ini: 'AH', bg: '#EAF2FD', fg: '#24398A' },
  { id: 'sana', name: 'Sana Malik', short: 'Sana', role: 'Cashier', ini: 'SM', bg: '#F1E4D1', fg: '#7A5320' },
  { id: 'imran', name: 'Imran Qureshi', short: 'Imran', role: 'Manager', ini: 'IQ', bg: '#F1E6D6', fg: '#6B4A1E' }
];

/* Status colours: success, warning (ochre), error, info, neutral. */
var STATUS = {
  ok: { bg: '#E8F6EE', fg: '#14532D', icon: 'checkCircle' },
  warn: { bg: '#FFF3C4', fg: '#6B4E00', icon: 'warn' },
  err: { bg: '#FDF0EF', fg: '#B42318', icon: 'err' },
  info: { bg: '#EAF2FD', fg: '#24398A', icon: 'info' },
  neutral: { bg: '#F6F0E7', fg: '#454F70', icon: 'info' }
};
function swv(on, fn, off) { return { on: on ? 'true' : 'false', trk: off ? '#E9E1D5' : (on ? '#162660' : '#8A8276'), knob: on ? 23 : 3, toggle: off ? function () {} : fn, dis: !!off }; }
function selv(on) { return { on: on ? 'true' : 'false', bd: on ? '2px solid #2E46A0' : '1px solid #D9CFC0', bg: on ? '#EEF5FE' : '#ffffff', fw: on ? 700 : 600 }; }
function chip(kind, text) { var s = STATUS[kind] || STATUS.neutral; return { bg: s.bg, fg: s.fg, d: ICONS[s.icon], text: text, kind: kind }; }

function n(x) { if(Number.isFinite(x)&&Math.abs(x)%1!==0)return Math.abs(x).toLocaleString('en-PK',{minimumFractionDigits:2,maximumFractionDigits:2});var t = String(Math.round(Math.abs(x))), last = t.slice(-3), rest = t.slice(0, -3); if (rest) last = ',' + last; return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last; }
var TAXR = 18, FBR_FEE = 1, POS_ID = '418203';
function taxIn(amt) { return Math.round((+amt || 0) * TAXR / (100 + TAXR)); }
function fbrNo(billNo, hm) { return POS_ID + '141126' + (hm || '1224') + ('0' + (+billNo % 60)).slice(-2); }
function rs(x) { return (x < 0 ? '−' : '') + 'Rs ' + n(x); }
function phoneFmt(p) { var d = String(p || '').replace(/\D/g, ''); if (d.indexOf('92') === 0) d = '0' + d.slice(2); if (d.length === 11) return d.slice(0, 4) + ' ' + d.slice(4); return d; }
function phoneIntl(p) { var d = String(p || '').replace(/\D/g, ''); if (d.indexOf('0') === 0) d = d.slice(1); if (d.indexOf('92') === 0) d = d.slice(2); return '+92 ' + d.slice(0, 3) + ' ' + d.slice(3); }
function phoneOk(p) { var d = String(p || '').replace(/\D/g, ''); if (d.indexOf('92') === 0) d = '0' + d.slice(2); return /^03\d{9}$/.test(d); }
function lum(hex) { var h = hex.replace('#', ''); var r = parseInt(h.substr(0, 2), 16) / 255, g = parseInt(h.substr(2, 2), 16) / 255, b = parseInt(h.substr(4, 2), 16) / 255; return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function findItem(id) { for (var i = 0; i < ITEMS.length; i++) { if (ITEMS[i].id === id) return ITEMS[i]; } return null; }
function adjOf(it, ci, si) { return STOCK_ADJ[it.id + '|' + (it.colours ? (ci || 0) : '') + '|' + (it.sizes ? (si || 0) : '')] || 0; }
function avail(it, ci, si) { if (it.measured) return 0; if (!it.colours) return (it.stock || 0) + adjOf(it, ci, si); return (it.isNew ? 0 : (ci * 5 + (si || 0) * 3 + Math.floor(it.price / 50)) % 7) + adjOf(it, ci, si); }
function reserved(it, ci, si) { if (!it.colours) return 0; return ((ci + (si || 0)) % 3 === 0) ? 1 : 0; }
function totalStock(it) {
  if (it.measured) return 0;
  if (!it.colours) return avail(it,0,0);
  var t = 0;
  it.colours.forEach(function (c, ci) { (it.sizes || [null]).forEach(function (s, si) { t += avail(it, ci, si); }); });
  return t;
}
function skuOf(it, ci, si) {
  if(fwMode()&&it.oi5Foot)return it.oi5Code;
  if(fwMode()&&it.fwProduct&&it.colours)return it.sku+'-V-'+orbaStableCode(JSON.stringify(['generic',it.id,String(it.colours[ci??0]??''),String(it.sizes?.[si??0]??'')]));
  if (!it.colours) return it.sku;
  var c = it.colours[ci].slice(0, 3).toUpperCase();
  return it.sizes ? it.sku + '-' + c + '-' + it.sizes[si] : it.sku + '-' + c;
}
function variantText(it, ci, si) {
  if (!it.colours) return 'One size';
  var c = it.colours[ci];
  if (!it.sizes) return c;
  var isEU = (it.sizeLabel || '').indexOf('EU') >= 0;
  return c + ' · ' + (isEU ? 'EU ' : '') + it.sizes[si];
}
function firstInStock(it) {
  for (var k = 0; k < (it.colours || [0]).length; k++) {
    var has = (it.sizes || [null]).some(function (x, si) { return avail(it, k, si) > 0; });
    if (has) return k;
  }
  return 0;
}
function artFor(it, ci) {
  var a = /shoe brush/i.test(it.name||'')?{b:'M19 42 Q19 35 27 35 L93 35 Q101 35 101 42 L101 62 Q101 69 93 69 L27 69 Q19 69 19 62 Z',s:'M24 70 L96 70 L92 95 L28 95 Z',l:'M30 72 L30 94 M39 72 L39 94 M48 72 L48 94 M57 72 L57 94 M66 72 L66 94 M75 72 L75 94 M84 72 L84 94 M93 72 L93 94 M29 45 L91 45'}:ART[it.art] || ART.tee;
  var name = it.colours ? it.colours[ci || 0] : (it.col || 'Grey');
  var col = SW[name] || '#8C918E';
  var dark = lum(col) < 0.4;
  return { body: a.b, shade: a.s || 'M0 0', line: a.l || 'M0 0', fill: col, lineCol: dark ? 'rgba(255,255,255,.55)' : 'rgba(22,38,96,.45)', shadeCol: dark ? 'rgba(0,0,0,.25)' : 'rgba(22,38,96,.11)' };
}
function dotsFor(it) {
  if (!it.colours) return [];
  return it.colours.map(function (c) { return { c: SW[c] || '#8C918E', name: c }; });
}
function stockInfo(it) {
  if (it.measured) return { text: 'Locked', dot: '#C99A06', fg: '#6B4E00' };
  var st = totalStock(it);
  if (st === 0) return { text: 'Out of stock', dot: '#B42318', fg: '#B42318' };
  if (st <= 5) return { text: st + ' left', dot: '#C99A06', fg: '#6B4E00' };
  return { text: st + ' in stock', dot: '#2F9E63', fg: '#5B6585' };
}
function beep(kind) {
  try {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    window.__zyroAC = window.__zyroAC || new AC();
    var ac = window.__zyroAC, o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = kind === 'err' ? 'square' : 'sine';
    o.frequency.value = kind === 'err' ? 196 : 1568;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(kind === 'err' ? 0.05 : 0.07, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'err' ? 0.28 : 0.09));
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.32);
  } catch (e) {}
}
/* A deterministic sample QR pattern (21 × 21). Not a real code. */
function qrPath(seed, size) {
  var N = 21, c = size / N, d = '', s = seed || 7;
  function finder(x, y) { return 'M' + (x * c) + ' ' + (y * c) + 'h' + (7 * c) + 'v' + (7 * c) + 'h' + (-7 * c) + 'zM' + ((x + 1) * c) + ' ' + ((y + 1) * c) + 'v' + (5 * c) + 'h' + (5 * c) + 'v' + (-5 * c) + 'zM' + ((x + 2) * c) + ' ' + ((y + 2) * c) + 'h' + (3 * c) + 'v' + (3 * c) + 'h' + (-3 * c) + 'z'; }
  d += finder(0, 0) + finder(14, 0) + finder(0, 14);
  for (var y = 0; y < N; y++) {
    for (var x = 0; x < N; x++) {
      var inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (inF) continue;
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      if ((s >> 8) % 100 < 46) d += 'M' + (x * c) + ' ' + (y * c) + 'h' + c + 'v' + c + 'h' + (-c) + 'z';
    }
  }
  return d;
}
/* PKR notes, largest first. tone = the note's main colour, for the small swatch only. */
var NOTES = [
  { v: 5000, label: '5,000', tone: '#B9873A' },
  { v: 1000, label: '1,000', tone: '#3E6A9E' },
  { v: 500, label: '500', tone: '#3F7F55' },
  { v: 100, label: '100', tone: '#B0473B' },
  { v: 50, label: '50', tone: '#7A5294' },
  { v: 20, label: '20', tone: '#2E46A0' },
  { v: 10, label: '10', tone: '#557F4E' }
];
/* Prototype PINs, shown as hints on screen. One PIN per person. */
var PINS = { ali: '1111', sana: '2222', imran: '1234' };
var MANAGER_PIN = '1234';
/* Payment methods in the local order the audit asks for. */
var METHODS = [
  { id: 'cash', label: 'Cash', d: ICONS.cash, sub: 'Keypad or notes' },
  { id: 'jazz', label: 'JazzCash', d: ICONS.wallet, sub: 'Mobile wallet' },
  { id: 'easy', label: 'Easypaisa', d: ICONS.phone, sub: 'Mobile wallet' },
  { id: 'raast', label: 'Raast QR', d: ICONS.qr, sub: 'Any bank app' },
  { id: 'card', label: 'Card', d: ICONS.card, sub: 'Card machine' },
  { id: 'bank', label: 'Bank transfer', d: ICONS.bank, sub: 'IBAN' },
  { id: 'khata', label: 'Khata', d: ICONS.khata, sub: 'Pay later' },
  { id: 'split', label: 'Split', d: ICONS.split, sub: 'Two or more ways' }
];
/* App navigation: one menu for rail (counter), sidebar (back office) and phone tabs.
   roles = backend roles that see the area (owner, cashier, inventory = stockkeeper). */
var NAV = [
  { id: 'home', d: ICONS.home, roles: ['owner', 'cashier', 'inventory'], group: 'main', ms: 'UI-M7' },
  { id: 'sell', d: ICONS.bag, roles: ['owner', 'cashier'], group: 'main', ms: 'UI-M2', href: 'Main.dc.html' },
  { id: 'bills', d: ICONS.bills, roles: ['owner', 'cashier'], group: 'main', ms: 'UI-M2' },
  { id: 'khata', d: ICONS.khata, roles: ['owner', 'cashier'], group: 'main', ms: 'UI-M3' },
  { id: 'stock', d: ICONS.stock, roles: ['owner', 'cashier', 'inventory'], group: 'main', ms: 'UI-M4' },
  { id: 'labels', d: ICONS.barcode, roles: ['owner', 'cashier', 'inventory'], group: 'main', ms: 'UI-M4' },
  { id: 'printers', d: ICONS.printer, roles: ['owner', 'cashier', 'inventory'], group: 'main', ms: 'UI-M8' },
  { id: 'orders', d: ICONS.orders, roles: ['owner', 'cashier', 'inventory'], group: 'main', ms: 'UI-M8' },
  { id: 'cash', d: ICONS.cash, roles: ['owner'], group: 'main', ms: 'UI-M6' },
  { id: 'chats', d: ICONS.chat, roles: ['owner', 'cashier'], group: 'main', ms: 'UI-M8' },
  { id: 'suppliers', d: ICONS.truck, roles: ['owner', 'inventory'], group: 'office', ms: 'UI-M5' },
  { id: 'couriers', d: ICONS.box, roles: ['owner'], group: 'office', ms: 'UI-M8' },
  { id: 'expenses', d: ICONS.coins, roles: ['owner'], group: 'office', ms: 'UI-M6' },
  { id: 'staff', d: ICONS.users, roles: ['owner'], group: 'office', ms: 'UI-M6' },
  { id: 'reports', d: ICONS.trend, roles: ['owner'], group: 'office', ms: 'UI-M7' },
  { id: 'settings', d: ICONS.settings, roles: ['owner'], group: 'foot', ms: 'UI-M8' }
];
/* Copy deck: English · Roman Urdu · Urdu. Roman words follow the source app's existing labels.
   Urdu is a first draft until a native reader signs it off (gate D3). */
var COPY = {
  home: ['Home', 'Ghar', 'ہوم'], sell: ['Sell', 'Sale', 'فروخت'], bills: ['Bill book', 'Bill Book', 'بل بُک'], khata: ['Khata', 'Khata', 'کھاتہ'], stock: ['Stock', 'Stock', 'اسٹاک'],
  orders: ['Orders', 'Orders', 'آرڈرز'], cash: ['Cash', 'Cash Hisaab', 'کیش'], suppliers: ['Suppliers', 'Suppliers', 'سپلائرز'],
  expenses: ['Expenses', 'Kharchay', 'اخراجات'], staff: ['Staff', 'Staff aur Tankhwa', 'عملہ'], reports: ['Reports', 'Reports', 'رپورٹس'],
  settings: ['Settings', 'Settings', 'ترتیبات'], chats: ['WhatsApp', 'WhatsApp', 'واٹس ایپ'], couriers: ['Couriers', 'Courier', 'کوریئر'], more: ['More', 'Aur', 'مزید'], backOffice: ['Back office', 'Back office', 'بیک آفس'],
  search: ['Search items, customers, bills', 'Item, customer, bill dhoondein', 'آئٹم، گاہک یا بل تلاش کریں'], searchItems: ['Search items or barcode', 'Item ya barcode dhoondein', 'آئٹم یا بارکوڈ تلاش کریں'],
  openRegister: ['Open register', 'Register kholein', 'رجسٹر کھولیں']
};
COPY.cashShort = ['Cash', 'Cash', 'کیش'];
COPY.billsShort = ['Bills', 'Bills', 'بل'];
COPY.labels = ['Labels', 'Labels', 'لیبلز'];
COPY.printers = ['Printers', 'Printers', 'پرنٹرز'];
COPY.labelsShort = ['Labels', 'Labels', 'لیبلز'];
COPY.printersShort = ['Printers', 'Printers', 'پرنٹرز'];
/* Bill book sample: Ali's bills today on Counter 1 (shift opened 10:02 am, float Rs 10,000).
   lines = [itemId, colour, size, qty]; pay cash|khata; print printed|failed|unknown|queued. */
var BILLS = __G.__orbaBills || (__G.__orbaBills = [
  { no: 1043, time: '12:24 pm', cust: null, lines: [['tee', 0, 1, 2], ['chappal', 0, 2, 1], ['socks', null, null, 1]], pay: 'cash', recv: 10000, collected: 0, returned: 0, refundOwed: 0, print: 'printed' },
  { no: 1040, time: '11:30 am', cust: 'c4', lines: [['suit', 0, 1, 1], ['shawl', 1, 0, 1]], pay: 'cash', recv: 9200, collected: 0, returned: 0, refundOwed: 0, print: 'printed' },
  { no: 1039, time: '11:12 am', cust: null, lines: [['jeans', 0, 2, 1], ['belt', null, null, 1]], pay: 'cash', recv: 5200, collected: 0, returned: 0, refundOwed: 0, print: 'unknown' },
  { no: 1038, time: '10:55 am', cust: 'c3', lines: [['tee', 2, 3, 1]], pay: 'khata', recv: 0, collected: 500, returned: 0, refundOwed: 0, print: 'printed' },
  { no: 1037, time: '10:41 am', cust: null, lines: [['lawn', 0, 0, 1]], pay: 'cash', recv: 5000, collected: 0, returned: 0, refundOwed: 0, print: 'failed' },
  { no: 1036, time: '10:20 am', cust: 'c5', lines: [['khussa', 1, 2, 1], ['belt', null, null, 1]], pay: 'cash', recv: 5000, collected: 0, returned: 1200, refundOwed: 1200, print: 'printed' },
  { no: 1035, time: '10:12 am', cust: 'c1', lines: [['shawl', 0, 0, 1]], pay: 'khata', recv: 0, collected: 800, returned: 0, refundOwed: 0, print: 'printed' },
  { no: 1034, time: '10:08 am', cust: null, lines: [['socks', null, null, 2]], pay: 'cash', recv: 1500, collected: 0, returned: 0, refundOwed: 0, print: 'printed' },
  { no: 1033, time: '10:05 am', cust: null, lines: [['sneaker', 0, 3, 1]], pay: 'cash', recv: 7000, collected: 0, returned: 0, refundOwed: 0, print: 'printed' }
]);
function billLines(b) { return b.lines.map(function (l) { return mkLine(l[0], l[1], l[2], l[3]); }); }
function billGoods(b) { if (b.goods != null) return b.goods; return billLines(b).reduce(function (a, l) { return a + l.price * l.qty; }, 0); }
function billFee(b) { return b.fee != null ? b.fee : FBR_FEE; }
function billTotal(b) { return b.total != null ? b.total : billGoods(b) + FBR_FEE; }
function billCash(b) { return b.pay === 'cash' ? billTotal(b) : (b.cashPart || 0); }
function billMethod(b) { return b.method || (b.pay === 'khata' ? 'Khata' : 'Cash'); }
function payKey(label) { return { Cash: 'cash', Khata: 'khata', JazzCash: 'jazz', Easypaisa: 'easy', 'Raast QR': 'raast', Card: 'card', 'Bank transfer': 'bank', Split: 'split' }[label] || 'cash'; }
/* a finished sale goes into the shared bill book; stock goes down; a Khata sale becomes a Khata bill */
function recordSale(sale) {
  var no = sale.billNo, ex = BILLS.filter(function (b) { return b.no === no; })[0];
  var cashPart = sale.method === 'Split' ? (sale.parts || []).reduce(function (a, x) { return a + (x.method === 'Cash' ? x.amount : 0); }, 0) : 0;
  var b = { no: no, time: ex ? ex.time : (sale.time || demoTime()), cust: sale.customer ? sale.customer.id : null, lines: sale.lines.map(function (l) { return [l.id, l.ci == null ? null : l.ci, l.si == null ? null : l.si, l.qty]; }),
    pay: payKey(sale.method), method: sale.method, recv: sale.received || sale.total, collected: 0, returned: 0, refundOwed: 0, print: SET.pr.auto ? 'printed' : 'none',
    goods: sale.goods, fee: sale.fee, tax: sale.tax, round: sale.round || 0, total: sale.total, cashPart: cashPart, fresh: true, staff: sale.staff || 'Ali' };
  if (ex) Object.assign(ex, b); else { b.isNew = true; BILLS.unshift(b); sale.lines.forEach(function (l) { var it = findItem(l.id); if (it && !it.measured) adjAdd(it, l.ci, l.si, -l.qty); }); }
  if (b.pay === 'khata' && b.cust) { var kno = String(no), kx = KH_INV.filter(function (i) { return i.no === kno; })[0], ki = { no: kno, cust: b.cust, d: 20261114, by: b.staff, lines: b.lines.map(function (x) { return x.slice(); }), col: [], ret: [], total: sale.total }; if (kx) Object.assign(kx, ki); else KH_INV.push(ki); }
  return b;
}
function billFbrNo(b) { return fbrNo(b.no, String(b.time || '12:24 pm').replace(/\D/g, '').slice(0, 4).padStart(4, '0')); }
function billItems(b) { return b.lines.reduce(function (a, l) { return a + l[3]; }, 0); }
/* ===== figures both Homes read (sync pass, 23 Nov) ===== */
function nextBillNo() { return BILLS.reduce(function (a, b) { return Math.max(a, b.no); }, 1043) + 1; }
function dayStats(staff) {
  var o = { all: 0, n: 0, cash: 0, cashN: 0, kh: 0, other: 0, ret: 0, retN: 0, items: 0 };
  BILLS.forEach(function (b) { if (staff && (b.staff || 'Ali') !== staff) return; var g = billGoods(b); o.all += g; o.n++; o.items += billItems(b); if (b.pay === 'cash') { o.cash += g; o.cashN++; } else if (b.pay === 'khata') o.kh += g; else o.other += g; if (b.returned) { o.ret += b.returned; o.retN++; } });
  o.retN += LEDGER.filter(function (x) { return x.src === 'return'; }).length; return o;
}
/* same rule as Stock › Running low: any size or colour with 1 to 3 left */
function lowCount() {
  return ITEMS.filter(function (it) {
    if (it.measured) return false;
    if (!it.colours) { var a0 = avail(it, null, null); return a0 >= 1 && a0 <= 3; }
    for (var ci = 0; ci < it.colours.length; ci++) { for (var si = 0; si < (it.sizes ? it.sizes.length : 1); si++) { var a = avail(it, ci, it.sizes ? si : null); if (a >= 1 && a <= 3) return true; } }
    return false;
  }).length;
}
/* the bill maths the till uses: tax per category, FBR fee, rounding */
function billMath(lines, goods) {
  var on = SET.fbr.on && lines.length > 0, fee = on ? FBR_FEE : 0, tax = on ? Math.round(taxFor(lines, goods)) : 0, added = on && !SET.fbr.incl;
  var g0 = goods + (added ? tax : 0) + fee, g = lines.length ? roundBill(g0) : 0;
  var rs = {}; lines.forEach(function (l) { rs[rateOf(findItem(l.id))] = 1; }); var rk = Object.keys(rs);
  return { on: on, fee: fee, tax: tax, added: added, total: g, rnd: g - g0, pre: added ? goods : goods - tax, label: 'Sales tax ' + (rk.length === 1 ? rk[0] + '% ' : '') + (added ? 'added' : 'inside') };
}
var HELD_N = 2;
function billById(no) { return BILLS.filter(function (b) { return b.no === no; })[0]; }
/* Standalone boards have no app shell around them. When a button would change page,
   open the board that shows that page instead (the viewer and canvas follow .dc.html links). */
var __boardNavigator: ((name: string) => void) | null = null;
var __sectionNavigator: ((page: string, opts?: any) => void) | null = null;
export function setBoardNavigator(fn: ((name: string) => void) | null) {
  __boardNavigator = fn;
}
export function setSectionNavigator(fn: ((page: string, opts?: any) => void) | null) {
  __sectionNavigator = fn;
}
function navigateSection(page: string, opts?: any) {
  if (__sectionNavigator) {
    __sectionNavigator(page, opts || {});
    return true;
  }
  var boardMap: Record<string, string> = {
    sell: "Main",
    bills: "AppBills",
    stock: "AppStockShoes",
    labels: "OrbaLabels",
    printers: "SettingsPrinter",
    settings: "AppSettings"
  };
  if (boardMap[page]) {
    openBoard(boardMap[page]);
    return true;
  }
  return false;
}
function openBoard(name: string) {
  if (!name) return;
  if (__sectionNavigator) {
    if (name === "Main") { __sectionNavigator("sell"); return; }
    if (name === "AppBills" || name === "AppBillsShoes") { __sectionNavigator("bills"); return; }
    if (name === "AppStock" || name === "AppStockShoes") { __sectionNavigator("stock"); return; }
    if (name === "OrbaLabels") { __sectionNavigator("labels"); return; }
    if (name === "SettingsPrinter") { __sectionNavigator("printers"); return; }
  }
  if (__boardNavigator) {
    __boardNavigator(name);
    return;
  }
  if (typeof window !== "undefined") {
    window.location.href = "/screen/" + name;
  }
}
var ROLE_NAME = { owner: 'Owner', cashier: 'Cashier', inventory: 'Stockkeeper' };
function tr(key, lang) { var c = COPY[key]; if (!c) return key; return lang === 'ur' ? c[2] : (lang === 'roman' ? c[1] : c[0]); }
function methodById(id) { for (var i = 0; i < METHODS.length; i++) { if (METHODS[i].id === id) return METHODS[i]; } return METHODS[0]; }
function digits(v, max) { return String(v == null ? '' : v).replace(/\D/g, '').slice(0, max || 12); }
function toInt(v) { var d = digits(v, 9); return d ? parseInt(d, 10) : 0; }
function mkLine(id, ci, si, qty) {
  var it = findItem(id); ci = ci || 0; si = si || 0;
  var key = it.colours ? id + '|' + ci + '|' + si : id;
  return { key: key, id: id, ci: ci, si: si, name: it.name, variant: variantText(it, ci, si), sku: skuOf(it, ci, si), price: it.price, qty: qty, disc: 0, note: '' };
}
function lineTotal(l) { return l.price * l.qty - (l.disc || 0); }
function custById(id) { for (var i = 0; i < CUSTOMERS.length; i++) { if (CUSTOMERS[i].id === id) return CUSTOMERS[i]; } return null; }
function staffById(id) { for (var i = 0; i < STAFF.length; i++) { if (STAFF[i].id === id) return STAFF[i]; } return STAFF[0]; }
function initials(name) { return name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase(); }
function discAmount(d, sub) { if (!d) return 0; var a = d.mode === 'pct' ? Math.round(sub * d.value / 100) : d.value; return Math.min(a, sub); }
/* ===== end shared library ===== */


/* ============================================================
   MOBILE APP (MA1–MA2): business kits, roles, barcode drawing
   ============================================================ */
var KITS = [
  { id: 'clothing', name: 'Clothing and fashion', sub: 'Suits, kurtas, lawn, kids wear', icon: 'shirt', cats: ['Men', 'Women', 'Kids', 'Unstitched', 'Accessories'], fields: ['Size', 'Colour', 'Fabric'], variant: 'size-colour', sizes: ['S', 'M', 'L', 'XL', 'XXL'], barcode: 'zyro', unit: 'piece', extras: ['Size and colour on every label', 'Low stock by size'] },
  { id: 'shoes', name: 'Footwear & Bags', sub: 'Ladies, Men, Kids, handbags and imported bags', icon: 'shoe', cats: ['Ladies', 'Men', 'Kids', 'Bags', 'Shoe care'], fields: ['Article', 'Colour', 'Shoe size (bags: optional)'], variant: 'size-colour', sizes: ['38', '39', '40', '41', '42', '43'], barcode: 'zyro', unit: 'pair', extras: ['Shoes sold by pair; bags sold by piece', 'Separate clearance pools and size/colour labels', 'Wholesale cartons and individual items'] },
  { id: 'jewellery', name: 'Jewellery', sub: 'Gold, silver, artificial', icon: 'gem', cats: ['Gold', 'Silver', 'Artificial', 'Bridal sets'], fields: ['Karat', 'Weight (g)', 'Making charge'], variant: 'piece', sizes: [], barcode: 'zyro', unit: 'piece', extras: ['Every piece gets its own code', 'Weight on the label'] },
  { id: 'pharmacy', name: 'Pharmacy', sub: 'Medicines and personal care', icon: 'pill', cats: ['Tablets', 'Syrups', 'Injections', 'Medical devices', 'Personal care'], fields: ['Batch', 'Expiry date', 'Pack size'], variant: 'batch', sizes: [], barcode: 'maker', unit: 'pack', extras: ['Scan the maker’s barcode', 'Expiry alerts 60 days ahead'] },
  { id: 'grocery', name: 'Grocery and general store', sub: 'Kiryana, mart, daily items', icon: 'basket', cats: ['Atta and rice', 'Oil and ghee', 'Drinks', 'Snacks', 'Household'], fields: ['Pack size', 'Unit'], variant: 'unit', sizes: [], barcode: 'maker', unit: 'pack', extras: ['Scan the maker’s barcode', 'Loose items by kg or litre'] },
  { id: 'cosmetics', name: 'Cosmetics and beauty', sub: 'Makeup, skin and hair care', icon: 'drop', cats: ['Makeup', 'Skin care', 'Hair care', 'Fragrance'], fields: ['Shade', 'Expiry date'], variant: 'shade', sizes: [], barcode: 'maker', unit: 'piece', extras: ['Shades as variants', 'Expiry alerts'] },
  { id: 'mobile', name: 'Mobiles and electronics', sub: 'Phones, chargers, accessories', icon: 'phone', cats: ['Phones', 'Chargers', 'Covers', 'Audio'], fields: ['IMEI or serial', 'Warranty'], variant: 'serial', sizes: [], barcode: 'maker', unit: 'piece', extras: ['IMEI on every phone sold', 'Warranty on the receipt'] },
  { id: 'other', name: 'Something else', sub: 'Start empty and add your own', icon: 'layers', cats: [], fields: [], variant: 'none', sizes: [], barcode: 'zyro', unit: 'piece', extras: ['Add categories as you go'] }
];
function kitById(id) { return KITS.filter(function (k) { return k.id === id; })[0] || KITS[0]; }
var MROLES = [
  { id: 'owner', name: 'Owner', who: 'You', can: 'Everything, in every branch', tone: 0 },
  { id: 'manager', name: 'Manager', who: 'Runs the shop when you’re away', can: 'Sell, returns, stock, orders, approve discounts. Not staff pay or settings', tone: 1 },
  { id: 'cashier', name: 'Cashier', who: 'Counter staff, by shift', can: 'Sell, take payments, print bills, own shift only', tone: 2 },
  { id: 'stock', name: 'Stockkeeper', who: 'Stock room and receiving', can: 'Items, stock in, counts, barcode labels', tone: 3 },
  { id: 'orders', name: 'Online orders', who: 'WhatsApp and Instagram desk', can: 'Orders, customer messages, packing', tone: 4 }
];
/* Draws a barcode-like set of bars for a label preview (not a scannable encoding). */
function barsFor(code, width) {
  var seq = [2, 1, 1, 2, 3, 1], x = 0, out = [];
  for (var i = 0; i < code.length; i++) { var c = code.charCodeAt(i); seq.push(1 + (c % 3), 1 + ((c >> 2) % 2), 1 + ((c >> 3) % 3), 1 + ((c >> 1) % 2)); }
  seq.push(2, 3, 3, 1, 1, 1, 2);
  var total = seq.reduce(function (a, b) { return a + b; }, 0), k = (width || 200) / total;
  seq.forEach(function (w, i) { if (i % 2 === 0) out.push({ x: +(x * k).toFixed(2), w: +(w * k).toFixed(2) }); x += w; });
  return out;
}

/* Web catalog: category types decide what Add item asks. */
var SIZESETS = [
  ['sxxl', 'S to XXL', ['S', 'M', 'L', 'XL', 'XXL']], ['waist', 'Waist 28 to 36', ['28', '30', '32', '34', '36']], ['chest', 'Chest 36 to 46', ['36', '38', '40', '42', '44', '46']],
  ['eu', 'EU 39 to 44', ['39', '40', '41', '42', '43', '44']], ['eu45', 'Men 39 to 45', ['39', '40', '41', '42', '43', '44', '45']], ['kidsf', 'Kids 28 to 35', ['28', '29', '30', '31', '32', '33', '34', '35']], ['euw', 'EU 36 to 41', ['36', '37', '38', '39', '40', '41']], ['kids', 'Kids 2 to 11 years', ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y']], ['free', 'One size', ['One size']]
];
function sizeSet(id) { return SIZESETS.filter(function (x) { return x[0] === id; })[0] || SIZESETS[0]; }
var CTYPES = {
  sc: { label: 'Sizes and colours', ex: 'Kurtas, suits, shoes', asks: 'colours, sizes and how many of each', icon: 'shirt', bc: 'zyro' },
  piece: { label: 'Each piece is different', ex: 'Gold rings, bangles, sets', asks: 'karat, weight and making charge for each piece', icon: 'gem', bc: 'zyro' },
  batch: { label: 'Batches with expiry', ex: 'Medicines, baby milk', asks: 'batch number, expiry and packs in each batch', icon: 'pill', bc: 'maker' },
  pack: { label: 'Packs or loose', ex: 'Atta, rice, oil, fabric', asks: 'pack size, or price per kg, litre or metre', icon: 'basket', bc: 'maker' },
  shade: { label: 'Shades', ex: 'Lipstick, foundation', asks: 'shade names, how many of each and expiry', icon: 'drop', bc: 'maker' },
  serial: { label: 'One serial per unit', ex: 'Mobiles, laptops', asks: 'the IMEI or serial of every unit and warranty', icon: 'phone', bc: 'serial' },
  simple: { label: 'Just a quantity', ex: 'Belts, socks, bags', asks: 'only how many you have', icon: 'layers', bc: 'zyro' }
};
var CTYPE_ORDER = ['sc', 'simple', 'piece', 'batch', 'pack', 'shade', 'serial'];
var SHOPCATS = {
  clothing: [['men', 'Men', 'sc', 'sxxl', 'kurta'], ['women', 'Women', 'sc', 'free', 'lawn'], ['foot', 'Footwear', 'sc', 'eu', 'chappal'], ['acc', 'Accessories', 'simple', '', 'belt'], ['fabric', 'Fabric by the metre', 'pack', '', 'fabric'], ['kids', 'Kids', 'sc', 'kids', 'tee']],
  shoes: [['men', 'Men', 'sc', 'eu45', 'sneaker'], ['women', 'Ladies', 'sc', 'euw', 'khussa'], ['kids', 'Kids', 'sc', 'kidsf', 'sneaker'], ['bags', 'Bags', 'simple', '', 'bag'], ['acc', 'Shoe care', 'simple', '', '']],
  jewellery: [['gold', 'Gold', 'piece'], ['silver', 'Silver', 'piece'], ['bridal', 'Bridal sets', 'piece'], ['artificial', 'Artificial', 'simple']],
  pharmacy: [['tablets', 'Tablets', 'batch'], ['syrups', 'Syrups', 'batch'], ['injections', 'Injections', 'batch'], ['devices', 'Medical devices', 'simple'], ['care', 'Personal care', 'batch']],
  grocery: [['atta', 'Atta and rice', 'pack'], ['oil', 'Oil and ghee', 'pack'], ['drinks', 'Drinks', 'pack'], ['snacks', 'Snacks', 'pack'], ['household', 'Household', 'pack']],
  cosmetics: [['makeup', 'Makeup', 'shade'], ['skin', 'Skin care', 'batch'], ['hair', 'Hair care', 'batch'], ['fragrance', 'Fragrance', 'simple']],
  mobile: [['phones', 'Phones', 'serial'], ['chargers', 'Chargers', 'simple'], ['covers', 'Covers', 'simple'], ['audio', 'Audio', 'serial']],
  other: [['general', 'General', 'simple']]
};
function catsFor(kit) {
  return (SHOPCATS[kit] || SHOPCATS.clothing).map(function (c, i) {
    var items = kit === 'clothing' ? ITEMS.filter(function (x) { return x.cat === c[0]; }) : kit==='shoes'&&fwMode()?ITEMS.filter(x=>x.fwProduct&&x.cat===c[0]):[];
    var pcs = items.reduce(function (a, it) { return a + (it.measured ? 0 : totalStock(it)); }, 0);
    if(kit==='shoes'&&fwMode()){var fs=oi5Feet().filter(x=>x.cat===c[0]);return {id:c[0],label:c[1],type:c[2],sizes:c[3]||'',art:c[4]||'',items:items.length+fs.length,pieces:pcs+fs.reduce((n,x)=>n+(x.st?Object.values(x.st).flat().reduce((a,b)=>a+b,0):x.qty||0),0),counter:true,order:i};}return { id: c[0], label: c[1], type: c[2], sizes: c[3] || '', art: c[4] || '', items: items.length, pieces: pcs, counter: !(kit === 'clothing' && c[0] === 'kids'), order: i };
  });
}

var OI3_C128=["212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", "114131", "311141", "411131", "211412", "211214", "211232", "2331112"];
var OI3_FOOT_FIXTURES=[
  { id: 'oxford', name: 'Leather Oxford', art: 'sneaker', no: 'ART 7012', cat: 'men', type: 'Formal', run: 'm', price: 7490, sold: 14, st: { Black: [1, 2, 0, 0, 3, 2, 1], Brown: [0, 1, 2, 2, 1, 1, 0] } },
  { id: 'loafer', name: 'Penny Loafer', art: 'sneaker', no: 'ART 7031', cat: 'men', type: 'Formal', run: 'm', price: 6990, sold: 9, st: { Black: [1, 2, 3, 3, 2, 1, 1], Tan: [1, 1, 2, 2, 2, 1, 0] } },
  { id: 'peshawari', name: 'Peshawari Chappal', art: 'chappal', no: 'ART 5104', cat: 'men', type: 'Chappal', run: 'm', price: 3990, sold: 31, st: { Brown: [2, 3, 1, 0, 2, 2, 1], Black: [1, 2, 3, 3, 2, 2, 1], Tan: [0, 1, 1, 1, 1, 0, 0] } },
  { id: 'jogger', name: 'Comfort Jogger', art: 'sneaker', no: 'ART 9201', cat: 'men', type: 'Joggers', run: 'm', price: 4490, sold: 22, st: { Grey: [1, 2, 3, 3, 2, 1, 1], Navy: [1, 2, 2, 3, 2, 1, 1], White: [0, 1, 2, 2, 1, 1, 0] } },
  { id: 'sandal', name: 'Leather Sandal', art: 'chappal', no: 'ART 5220', cat: 'men', type: 'Sandals', run: 'm', price: 2990, sold: 0, st: { Brown: [2, 3, 4, 4, 3, 2, 2] } },
  { id: 'slide', name: 'Everyday Slide', art: 'chappal', no: 'ART 6001', cat: 'men', type: 'Slippers', run: 'm', price: 1290, sold: 40, st: { Black: [2, 3, 1, 1, 2, 1, 1], Navy: [1, 1, 1, 0, 1, 1, 0] } },
  { id: 'khussa', name: 'Embroidered Khussa', art: 'khussa', no: 'ART 3305', cat: 'women', type: 'Khussa', run: 'w', price: 2490, sold: 18, st: { Maroon: [1, 2, 3, 2, 1, 1], Gold: [1, 0, 0, 1, 1, 0], Black: [1, 2, 2, 2, 1, 1] } },
  { id: 'pump', name: 'Block Heel Pump', art: 'khussa', no: 'ART 3412', cat: 'women', type: 'Heels', run: 'w', price: 4990, sold: 6, st: { Black: [1, 2, 2, 2, 1, 1], Beige: [1, 1, 2, 1, 1, 0] } },
  { id: 'flat', name: 'Flat Sandal', art: 'chappal', no: 'ART 3520', cat: 'women', type: 'Sandals', run: 'w', price: 2690, sold: 0, st: { Tan: [2, 3, 3, 3, 2, 2], White: [1, 2, 2, 2, 1, 1] } },
  { id: 'school', name: 'School Shoe', art: 'sneaker', no: 'ART 1101', cat: 'kids', type: 'School', run: 'k', price: 2490, sold: 27, st: { Black: [2, 2, 3, 0, 0, 2, 1, 1] } },
  { id: 'kidsneaker', name: 'Kids Sneaker', art: 'sneaker', no: 'ART 1220', cat: 'kids', type: 'Sneakers', run: 'k', price: 2890, sold: 11, st: { Navy: [1, 1, 2, 2, 2, 1, 1, 0], Rose: [1, 1, 1, 2, 1, 1, 0, 0] } },
  { id: 'polish', name: 'Shoe Care Kit', art: '', no: 'ART 8001', cat: 'acc', type: 'Polish and brush', run: '', price: 650, sold: 12, qty: 40 }
].map(function(x){return Object.assign({},x,{sizes:x.run?({ m: ['39', '40', '41', '42', '43', '44', '45'], w: ['36', '37', '38', '39', '40', '41'], k: ['28', '29', '30', '31', '32', '33', '34', '35'] })[x.run].slice():[]});});
/* OI-3: local session registry and label output. Never dispatches to physical devices. */
function oi3State(){return __G.__orbaOi3||(__G.__orbaOi3={seq:0,byKey:Object.create(null),byCode:Object.create(null),batches:[],jobs:[],handoff:null});}
function oi3Register(scope,id,c,z,name,price,alias){var st=oi3State(),k=JSON.stringify([scope,id,String(c??''),String(z??'')]),x=st.byKey[k];if(x){x.name=String(name);x.price=Number(price);return x;}var code=orbaStableCode(k);if(st.byCode[code]&&st.byCode[code].key!==k||ITEMS.some(function(i){return i.code===code||i.sku===code;})||(fwMode()&&Object.values(st.byCode).some(r=>r.key!==k&&(String(r.alias).toUpperCase()===code||String(r.code).toUpperCase()===String(alias).toUpperCase()))))throw Error('Barcode namespace collision; stop and review permanent registry');orbaReserveCode(k,code);x={key:k,scope:scope,id:id,colour:String(c??''),size:String(z??''),name:String(name),price:Number(price),alias:alias||'',code:code};st.byKey[k]=x;st.byCode[code]=x;return x;}
function oi3Foot(a,c,z){return oi3Register('footwear',a.id,c,z,a.name,a.salePrice||a.price,a.no);}
function oi3Generic(it,ci,si){return oi3Register('generic',it.id,it.colours?it.colours[ci??0]:'',it.sizes?it.sizes[si]: '',it.name,it.price,skuOf(it,ci??0,si));}
function oi3Seed(){var fs=KEEP['Inventory|shoes']?.data||OI3_FOOT_FIXTURES.concat(__G.__orbaOi2Articles||[]);fs.forEach(function(a){if(a.st)Object.keys(a.st).forEach(function(c){a.sizes.forEach(function(z){oi3Foot(a,c,z);});});else oi3Foot(a,'','');});ITEMS.filter(function(i){return !i.measured&&(!fwMode()||fwAllowed(i));}).forEach(function(i){(i.colours||[null]).forEach(function(c,ci){(i.sizes||[null]).forEach(function(z,si){oi3Generic(i,i.colours?ci:null,i.sizes?si:null);});});});}
function oi3Batch(source,lines){var s=oi3State(),id='LB-'+(s.batches.length+1);var b={id:id,source:source,lines:lines.filter(function(l){return l.q>0;}).map(function(l){return {code:l.code,q:l.q,confirmed:0};})};if(!b.lines.length)return null;s.batches.push(b);return id;}
function oi3Pending(b){return b.lines.reduce(function(n,l){return n+l.q-l.confirmed;},0);}
function oi3Handoff(p,id){if(id)oi3State().handoff=id;if(p&&p.onNavigate)p.onNavigate('settings',{section:'printer'});}
function oi3Media(k,dpi){var m={'38':[38,25],'38.1':[38.1,25.4],'50':[50,30]}[k];if(!m||![203,300].includes(dpi))throw Error('Invalid label media');return {w:m[0],h:m[1],dpi:dpi};}
function oi3Esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function oi3SVG(x,m){if(!x||!/^290\d{9}$/.test(x.code))throw Error('Invalid internal code');var a=[105];for(var i=0;i<x.code.length;i+=2)a.push(Number(x.code.slice(i,i+2)));var chk=a[0];for(var i=1;i<a.length;i++)chk+=a[i]*i;a.push(chk%103,106);var patterns=a.map(function(i){return OI3_C128[i];}),modules=patterns.join('').split('').reduce(function(n,c){return n+Number(c);},20),dot=25.4/m.dpi,mod=Math.max(2,Math.ceil(.25/dot-.00001)),unit=mod*dot,w=modules*unit;if(w>m.w-1.5)throw Error('Label too narrow for scannable code');var start=Math.floor((m.w-w)/2/dot)*dot+10*unit,rects='',y=9,barH=m.h-15;patterns.forEach(function(p){Array.from(p).forEach(function(c,i){var z=Number(c)*unit;if(i%2===0)rects+='<rect x="'+start.toFixed(5)+'" y="'+y+'" width="'+z.toFixed(5)+'" height="'+barH.toFixed(5)+'"/>';start+=z;});});var title=Array.from(x.name).slice(0,m.w<40?20:28).join(''),variant=[x.colour,x.size].filter(Boolean).join(' · ')||'One size';return '<svg xmlns="http://www.w3.org/2000/svg" width="'+m.w+'mm" height="'+m.h+'mm" viewBox="0 0 '+m.w+' '+m.h+'"><rect width="100%" height="100%" fill="white"/><g fill="black" font-family="Arial,sans-serif" text-anchor="middle"><text x="'+m.w/2+'" y="3.6" font-size="2.65" font-weight="bold">'+oi3Esc(title)+'</text><text x="'+m.w/2+'" y="7" font-size="2.35">'+oi3Esc(Array.from(variant).slice(0,24).join(''))+'</text>'+rects+'<text x="'+m.w/2+'" y="'+(m.h-2.9)+'" font-size="2.5">'+x.code+'</text></g></svg>';}
function oi3Job(b,code,qty,reason,media){var s=oi3State();if(s.jobs.some(function(j){return j.status==='awaiting';}))throw Error('Reconcile the previous label file first');var lines;if(b){var left=250;lines=b.lines.filter(function(l){return l.q>l.confirmed;}).map(function(l){var q=Math.min(left,l.q-l.confirmed);left-=q;return {code:l.code,q:q};}).filter(function(l){return l.q>0;});}else{if(!s.byCode[code]||!Number.isInteger(qty)||qty<1||qty>250||!String(reason).trim())throw Error('Choose product, 1–250 copies and reason');lines=[{code:code,q:qty}];}var total=lines.reduce(function(n,l){return n+l.q;},0);if(!total||total>250)throw Error('Choose at most 250 pending labels per job');lines=lines.map(function(l){var x=s.byCode[l.code];if(!x)throw Error('Unknown variant');return {code:l.code,q:l.q,name:x.name,variant:[x.colour,x.size].filter(Boolean).join(' · '),svg:oi3SVG(x,media)};});var j={id:'LJ-'+(s.jobs.length+1),batch:b?b.id:null,reason:b?b.source:String(reason).trim(),media:media,lines:lines,total:total,status:'awaiting',created:new Date().toISOString()};s.jobs.push(j);return j;}
function oi3Document(j){var m=j.media;return '<!doctype html><html><head><meta charset="utf-8"><title>Orba LABEL '+oi3Esc(j.id)+'</title><style>@page{size:'+m.w+'mm '+m.h+'mm;margin:0}html,body{margin:0;padding:0}*{box-sizing:border-box}.label{width:'+m.w+'mm;height:'+m.h+'mm;overflow:hidden;break-after:page;display:block}.label:last-child{break-after:auto}.label svg{display:block;width:100%;height:100%}@media screen{body{background:#eee;padding:12px}.label{margin:8px auto;background:white}header{max-width:600px;margin:auto;font:14px Arial}}@media print{header{display:none}}</style></head><body><header><b>Orba label-only file · '+j.id+'</b><p>Choose the dedicated label printer and exact '+m.w+' × '+m.h+' mm paper. Scale 100%, no headers or margins. Print once, then reconcile actual output in Orba. Demo codes are not registered in live POS.</p><button onclick="window.print()">Open print dialog</button></header>'+j.lines.map(function(l){return Array.from({length:l.q},function(){return '<div class="label">'+l.svg+'</div>';}).join('');}).join('')+'</body></html>';}
function oi3Download(j){var blob=new Blob([oi3Document(j)],{type:'text/html;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='Orba_'+j.id+'_labels.html';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},30000);}
function oi3Confirm(j,counts){if(j.browserPrintOpen)throw Error('Close the label print dialog and inspect the paper first');if(j.serviceRequest&&!['reconciled','failed','cancelled','simulated'].includes(j.serviceState))throw Error('Reconcile the assigned label queue in Printers first');if(j.serviceRequest&&(['failed','cancelled','simulated'].includes(j.serviceState)||j.serviceState==='reconciled'&&j.serviceOutcome!=='printed')&&Object.values(counts).some(x=>x!==0))throw Error('No verified physical output for this job');var s=oi3State();if(j.status!=='awaiting')throw Error('Job already reconciled');var q=j.lines.map(function(l){var v=counts[l.code];if(!Number.isInteger(v)||v<0||v>l.q)throw Error('Enter exact printed copies for every variant');return v;});var b=j.batch?s.batches.find(function(b){return b.id===j.batch;}):null;if(j.batch&&!b)throw Error('Missing source batch');if(b)j.lines.forEach(function(l,i){var t=b.lines.find(function(x){return x.code===l.code;});if(!t||t.confirmed+q[i]>t.q)throw Error('Pending quantity mismatch');});if(b)j.lines.forEach(function(l,i){b.lines.find(function(x){return x.code===l.code;}).confirmed+=q[i];});j.confirmed=q.reduce(function(n,x){return n+x;},0);j.counts=q;j.status=j.confirmed===j.total?'confirmed':j.confirmed?'partial':'none';j.reconciled=new Date().toISOString();}

/* OI-5: original register session checkout. No external payments, tax submissions or hardware dispatch. */
function oi5State(){return __G.__orbaOi5||(__G.__orbaOi5={seq:0,pending:null,posted:Object.create(null),receipts:[],refs:Object.create(null),catalog:Object.create(null)});}
function oi5Feet(){return KEEP['Inventory|shoes']?.data||OI3_FOOT_FIXTURES.concat(__G.__orbaOi2Articles||[]);}
function oi5FootItem(reg){var a=oi5Feet().find(x=>x.id===reg.id), id='oi5f_'+reg.code,old=oi5State().catalog[id];if(!a)return old||null;var ci=a.st&&Object.prototype.hasOwnProperty.call(a.st,reg.colour),zi=a.sizes?.indexOf(reg.size);if(a.st&&(!ci||zi<0))return old||null;var it={id:id,art:a.art||'sneaker',name:a.name,cat:fwMode()?(a.st?a.cat:'acc'):(a.st?'foot':'acc'),unit:fwMode()?(a.st?'/ pair':'/ pc'):undefined,price:Number(a.salePrice||a.price),sku:reg.code,stock:a.st?Number(a.st[reg.colour][zi]):Number(a.qty||0),oi5Foot:true,oi5Article:a.id,oi5Colour:reg.colour,oi5Size:reg.size,oi5Code:reg.code,oi5No:a.no};if(a.st){it.colours=[reg.colour];it.sizes=[reg.size];it.sizeLabel='Size · '+(a.sizeSystem||'EU');}oi5State().catalog[id]=it;return it;}
var oi5Find0=findItem;findItem=function(id){if(String(id).startsWith('oi5f_')){var r=oi3State().byCode[String(id).slice(5)];return r?oi5FootItem(r):oi5State().catalog[id]||null;}return oi5Find0(id);};
var oi5Avail0=avail;avail=function(it,ci,si){if(!it)return 0;if(!it.oi5Foot)return oi5Avail0(it,ci,si);var a=oi5Feet().find(x=>x.id===it.oi5Article);if(!a)return 0;if(!a.st)return Math.max(0,Number(a.qty||0));var zi=a.sizes.indexOf(it.oi5Size);return zi<0?0:Math.max(0,Number(a.st[it.oi5Colour]?.[zi]||0));};
function oi5Resolve(t){oi3Seed();var reg=oi3State().byCode[t], hits=[];function add(it,ci,si){if(it&&!it.measured){var k=JSON.stringify([it.id,ci||0,si||0]);if(!hits.some(x=>x.k===k))hits.push({it:it,ci:ci||0,si:si||0,k:k});}}if(reg){if(reg.scope==='footwear')add(oi5FootItem(reg),0,0);else if(reg.scope==='generic'){var g=findItem(reg.id),c=g?.colours?g.colours.indexOf(reg.colour):0,z=g?.sizes?g.sizes.indexOf(reg.size):0;if(c>=0&&z>=0)add(g,c,z);}}
var aliases={'8964000101':['tee',0,1],'8964000317':['kurta',1,2],'8964000522':['jeans',0,1],'8964000910':['socks',0,0]},a=aliases[t];if(a)add(findItem(a[0]),a[1],a[2]);ITEMS.forEach(it=>{if(it.measured)return;if(it.code===t)add(it,0,it.oi2CodeSize||0);(it.colours||[null]).forEach((_,c)=>(it.sizes||[null]).forEach((_,z)=>{if(skuOf(it,c,z)===t)add(it,c,z);}));});return fwMode()?hits.filter(x=>fwAllowed(x.it)):hits;}
function oi5FootSearch(q){if(!q&&!fwMode())return [];oi3Seed();return Object.values(oi3State().byCode).filter(r=>r.scope==='footwear'&&[r.code,r.alias,r.name,r.colour+' '+r.size].some(v=>String(v).toLowerCase().includes(q))).map(oi5FootItem).filter(Boolean);}
function oi5Bundle(lines,discount){var offer=SET.oi5Offer,eligible=[];if(!offer?.enabled||!Array.isArray(offer.articleIds)||discount||lines.some(l=>l.disc))return {saving:0,groups:[]};lines.forEach(l=>{var it=findItem(l.id);if(it?.oi5Foot&&it.cat==='foot'&&offer.articleIds.includes(it.oi5Article)&&Number.isSafeInteger(l.price)&&l.qty<=1000)for(var j=0;j<l.qty;j++)eligible.push({key:l.key,price:l.price});});eligible.sort((a,b)=>b.price-a.price||a.key.localeCompare(b.key));var dp=[{cost:0,groups:[]}];for(var i=1;i<=eligible.length;i++){var e=eligible[i-1],best={cost:dp[i-1].cost+e.price,groups:dp[i-1].groups};[[2,2500],[3,3500]].forEach(([q,p])=>{if(i>=q&&dp[i-q].cost+p<best.cost)best={cost:dp[i-q].cost+p,groups:dp[i-q].groups.concat([{keys:eligible.slice(i-q,i).map(x=>x.key),price:p}])};});dp.push(best);}return {saving:eligible.reduce((n,x)=>n+x.price,0)-dp.at(-1).cost,groups:dp.at(-1).groups};}
function oi5Quote(st,props){var lines=st.lines,sub=lines.reduce((n,l)=>n+lineTotal(l),0),bundle=oi5Bundle(lines,st.discount),discount=discAmount(st.discount,sub)+bundle.saving,goods=sub-discount,mode=props.fbr&&props.fbr!=='auto'?props.fbr:SET.fbr.on?'connected':'notRequired',fee=mode!=='notRequired'&&lines.length?FBR_FEE:0,tax=mode!=='notRequired'?Math.round(taxFor(lines,goods)):0,added=mode!=='notRequired'&&!SET.fbr.incl,total=lines.length?roundBill(goods+(added?tax:0)+fee):0;return {businessProfile:fwMode()?'shoes':null,manualDiscount:st.discount?oi6Clone(st.discount):null,billNo:st.billNo,customerId:st.customerId,staffId:st.staffId,lines:JSON.parse(JSON.stringify(lines)),discount:discount,bundle:bundle,subtotal:sub,goods:goods,fee:fee,tax:tax,taxAdded:added,round:total-goods-(added?tax:0)-fee,total:total,count:lines.reduce((n,l)=>n+l.qty,0),fbrMode:mode};}
function oi5Sig(q){return JSON.stringify(q);}
function oi5StockOK(q){var keys=new Set(),variants=new Set();return q.lines.length>0&&Number.isSafeInteger(q.total)&&q.total>0&&q.lines.every(l=>{var it=findItem(l.id),k=l.key;if(keys.has(k)||!it)return false;keys.add(k);var ci=l.ci??0,si=l.si??0;if(!Number.isInteger(ci)||!Number.isInteger(si)||ci<0||si<0||ci>=(it.colours?.length||1)||si>=(it.sizes?.length||1))return false;var v=JSON.stringify([it.id,ci,si]);if(variants.has(v))return false;variants.add(v);return it&&(!fwMode()||fwAllowed(it)&&!sfArchivedItem(it))&&!it.measured&&Number.isSafeInteger(l.qty)&&l.qty>0&&l.qty<=avail(it,l.ci,l.si)&&Number.isSafeInteger(l.price)&&l.price>=0&&l.price===it.price&&Number.isSafeInteger(l.disc||0)&&(l.disc||0)>=0&&(l.disc||0)<=l.price*l.qty;});}
function oi5Digital(m){return ['jazz','easy','card','bank','raast'].includes(m);}
function oi5Ref(m,r){r=String(r||'').trim();return oi5Digital(m)&&/^[A-Za-z0-9][A-Za-z0-9._/-]{5,39}$/.test(r)?m+'|'+r.toUpperCase():null;}
function oi5PayOK(q,p){var parts=p?.parts||[],refs=new Set(),kh=0;if(!parts.length||parts.reduce((n,x)=>n+x.amount,0)!==q.total||parts.some(x=>!Number.isSafeInteger(x.amount)||x.amount<=0))return false;if(p.method==='Split'?(parts.length<2||parts.some(x=>x.method==='Khata')):parts.length!==1||parts[0].method!==p.method)return false;for(var x of parts){var m=METHODS.find(v=>v.label===x.method)?.id;if(!m||m==='split'||SET.pay[m]===false)return false;if(m==='khata')kh+=x.amount;if(oi5Digital(m)){var r=oi5Ref(m,x.ref);if(!r||x.checked!==true||refs.has(r)||oi5State().refs[r])return false;refs.add(r);}}if(kh){var c=custById(q.customerId);if(!c||(fwMode()?fwCustomerOwed(c.id)/100:c.khata)+kh>SET.khataLimit)return false;}return Number.isSafeInteger(p.received)&&Number.isSafeInteger(p.change)&&p.change>=0&&(p.method==='Cash'?p.received-p.change===q.total:p.received===q.total&&p.change===0);}
function oi5Receipt(s){var a=oi5State(),j=a.receipts.find(x=>x.saleId===s.oi5Id);if(j)return j;j={id:'OI5-R-'+s.oi5Id,saleId:s.oi5Id,purpose:'receipt',media:[58,80].includes(+SET.pr.paper)?+SET.pr.paper:80,copies:SET.pr.copies?2:1,state:'prepared',physical:false,document:JSON.parse(JSON.stringify(s))};a.receipts.push(j);return j;}
function oi5Commit(q,p,attempt){var a=oi5State();if(a.posted[attempt.id]){var prior=a.posted[attempt.id];if(oi5Sig(q)!==attempt.sig||prior.oi5Id!==attempt.id||JSON.stringify(prior.parts)!==JSON.stringify(p.parts)||prior.method!==p.method||prior.received!==p.received||prior.change!==p.change||Object.keys(q).some(k=>JSON.stringify(q[k])!==JSON.stringify(prior[k])))throw Error('Conflicting checkout replay');return prior;}if(fwMode()){if(SET.shift.c1!=='open')throw Error('Open a shift before posting a sale');var md=q.manualDiscount;if(md&&(!['pct','fixed','amt','rs'].includes(md.mode)||!Number.isSafeInteger(md.value)||md.value<0||(md.mode==='pct'&&md.value>100)))throw Error('Invalid manual discount');var fresh=oi5Quote({billNo:q.billNo,customerId:q.customerId,staffId:q.staffId,lines:q.lines,discount:md},{fbr:q.fbrMode});if(oi5Sig(fresh)!==oi5Sig(q))throw Error('Checkout totals or offer changed; review again');}if(!a.pending||a.pending.id!==attempt.id||attempt.sig!==oi5Sig(q)||!oi5StockOK(q)||!oi5PayOK(q,p)||BILLS.some(b=>b.no===q.billNo))throw Error('Checkout changed, stock unavailable, duplicate reference or invalid payment. Review before retry.');var oldBills=BILLS.slice(),oldKh=KH_INV.slice(),oldAdj=Object.assign({},STOCK_ADJ),oldFeet=KEEP['Inventory|shoes'],oldData=oldFeet?.data;var sale=Object.assign({},p,q,{oi5:true,oi5Id:attempt.id,customer:q.customerId?JSON.parse(JSON.stringify(custById(q.customerId))):null,staff:staffById(q.staffId).short,time:demoTime()});try{var feet=oi5Feet().map(x=>JSON.parse(JSON.stringify(x)));q.lines.forEach(l=>{var it=findItem(l.id);if(it.oi5Foot){var f=feet.find(x=>x.id===it.oi5Article);if(f.st)f.st[it.oi5Colour][f.sizes.indexOf(it.oi5Size)]-=l.qty;else f.qty-=l.qty;}});var b=recordSale(sale);if(q.lines.some(l=>findItem(l.id)?.oi5Foot)){KEEP['Inventory|shoes']=KEEP['Inventory|shoes']||{};KEEP['Inventory|shoes'].data=feet;}b.print='none';b.oi5Snapshot=JSON.parse(JSON.stringify(sale));b.parts=JSON.parse(JSON.stringify(p.parts));p.parts.forEach(x=>{var r=oi5Ref(payKey(x.method),x.ref);if(r)a.refs[r]=attempt.id;});a.posted[attempt.id]=sale;a.pending=null;if(SET.pr.auto)oi5Receipt(sale);return sale;}catch(e){BILLS.splice(0,BILLS.length,...oldBills);KH_INV.splice(0,KH_INV.length,...oldKh);Object.keys(STOCK_ADJ).forEach(k=>delete STOCK_ADJ[k]);Object.assign(STOCK_ADJ,oldAdj);if(oldFeet){KEEP['Inventory|shoes']=oldFeet;oldFeet.data=oldData;}else delete KEEP['Inventory|shoes'];throw e;}}
/* Footwear is authoritative in the native Inventory|shoes data; do not double decrement generic ledger. */
var oi5Adj0=adjAdd;adjAdd=function(it,ci,si,d){if(it?.oi5Foot)return;return oi5Adj0(it,ci,si,d);};
/* Keep historical lines of newly posted training sales unchanged. */
var oi5BillLines0=billLines;billLines=function(b){return b?.oi5Snapshot?JSON.parse(JSON.stringify(b.oi5Snapshot.lines)):oi5BillLines0(b);};
var oi5Sku0=skuOf;skuOf=function(it,ci,si){return it?.oi5Foot?it.oi5Code:oi5Sku0(it,ci,si);};

/* OI-6: session-only receipt archive and non-fiscal training returns. */
function oi6State(){return __G.__orbaOi6||(__G.__orbaOi6={returns:[],exports:[],seq:0});}
function oi6Clone(v){return JSON.parse(JSON.stringify(v));}
function oi6Money(p){return (p/100).toLocaleString('en-PK',{minimumFractionDigits:2,maximumFractionDigits:2});}
function oi6Allocate(total,weights){if(!Number.isSafeInteger(total)||total<0||weights.some(x=>!Number.isSafeInteger(x)||x<0))throw Error('Invalid allocation');var sum=weights.reduce((a,b)=>a+b,0);if(!Number.isSafeInteger(sum)||total>sum)throw Error('Allocation exceeds available value');if(!sum)return weights.map(()=>0);var cells=weights.map((w,i)=>{var v=BigInt(total)*BigInt(w);return {i,n:Number(v/BigInt(sum)),r:v%BigInt(sum)};});var left=total-cells.reduce((n,x)=>n+x.n,0);cells.slice().sort((a,b)=>a.r===b.r?a.i-b.i:a.r>b.r?-1:1).slice(0,left).forEach(x=>x.n++);return cells.map(x=>x.n);}
function oi6Code(s){return '91'+String(s.billNo).padStart(10,'0');}
function oi6Barcode(code){if(!/^91\d{10}$/.test(code))throw Error('Invalid bill lookup code');var a=[105];for(var i=0;i<code.length;i+=2)a.push(Number(code.slice(i,i+2)));a.push(a.reduce((n,v,i)=>n+v*(i||1),0)%103,106);var x=10,r='';a.forEach(v=>Array.from(OI3_C128[v]).forEach((w,i)=>{if(i%2===0)r+='<rect x="'+x+'" y="0" width="'+w+'" height="36"/>';x+=Number(w);}));return '<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 '+(x+10)+' 36" style="max-width:44mm;display:block;margin:auto" role="img" aria-label="Bill lookup barcode"><rect width="100%" height="100%" fill="white"/><g fill="black">'+r+'</g></svg>';}
function oi6Snapshot(s){if(s.oi6Receipt)return s.oi6Receipt;var weights=s.lines.map(l=>lineTotal(l)*100),net=fwReceiptNet(s);var snap={version:Number(SET.oi6ReceiptVersion||1),code:oi6Code(s),created:new Date().toISOString(),shop:oi6Clone(SET.shop),design:oi6Clone(SET.rc),media:[58,80].includes(+SET.pr.paper)?+SET.pr.paper:80,lines:s.lines.map((l,i)=>({key:l.key,qty:l.qty,gross:l.price*l.qty*100,net:net[i]}))};s.oi6Receipt=snap;return snap;}
var oi6Receipt0=oi5Receipt;oi5Receipt=function(s){oi6Snapshot(s);return oi6Receipt0(s);};
var oi6Commit0=oi5Commit;oi5Commit=function(q,p,attempt){fwReceiptNet(q);var s=oi6Commit0(q,p,attempt);oi6Snapshot(s);var b=BILLS.find(x=>x.no===s.billNo);if(b?.oi5Snapshot&&!b.oi5Snapshot.oi6Receipt)b.oi5Snapshot.oi6Receipt=oi6Clone(s.oi6Receipt);return s;};
function oi6Document(s,media,copy){var r=s.oi6Receipt;if(!r||![58,80,'A4'].includes(media))throw Error('Historical receipt snapshot missing or invalid media');var d=r.design,esc=oi3Esc,m=oi6Money;function row(a,b){return '<div class="row"><span>'+esc(a)+'</span><strong>'+esc(b)+'</strong></div>';}var title='Orba RECEIPT '+s.billNo+(copy?' COPY':'');return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style>@page{size:'+(media==='A4'?'A4':media+'mm 297mm')+';margin:3mm}*{box-sizing:border-box}body{margin:0;color:#111;font:12px Arial,sans-serif}main{max-width:'+(media==='A4'?'180':media-8)+'mm;margin:auto;padding:2mm 0;overflow-wrap:anywhere}.row{display:flex;justify-content:space-between;gap:8px;align-items:start;margin:4px 0}.row strong{white-space:nowrap;text-align:right}h1{font-size:18px;margin:6px 0}p{margin:5px 0}.center{text-align:center}.rule{border-top:1px dashed #555;margin:9px 0}.item{break-inside:avoid;border-bottom:1px solid #ddd;padding:5px 0}.total{font-size:16px;font-weight:700}.mono{font-family:monospace}.notice{font-size:11px;font-weight:bold}.mark{display:inline-block;border:2px solid #111;padding:6px;font-weight:bold}header{padding:12px;background:#eee;font:14px Arial;max-width:700px;margin:auto}@media print{header{display:none}main{padding:0}}@media screen{body{background:#eee}main{background:white;padding:10px;margin:12px auto}}</style></head><body><header>Training receipt only. Select the dedicated receipt printer, correct media, 100% scale and no browser headers. Thermal page length is a 297 mm preview preset; verify roll driver before use. <button onclick="window.print()">Open print / Save as PDF dialog</button></header><main><div class="center">'+(d.logo&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(d.logoImage||'')?'<img alt="Shop logo" style="max-width:38mm;max-height:20mm;object-fit:contain" src="'+d.logoImage+'">':d.logo?'<div class="mark">'+esc(String(r.shop.name||'Orba').split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase())+'</div>':'')+'<h1>'+esc(r.shop.name||'Orba')+'</h1>'+(d.addr?'<p>'+esc([r.shop.addr,r.shop.city,r.shop.phone].filter(Boolean).join(' · '))+'</p>':'')+'<p class="notice">TRAINING · NOT A TAX INVOICE'+(copy?' · COPY':'')+'</p>'+(d.top?'<p><b>'+esc(d.top)+'</b></p>':'')+'</div><div class="rule"></div>'+row('Bill',String(s.billNo))+row('Recorded',r.created.slice(0,10)+' '+s.time)+row('Cashier',s.staff)+(d.cust&&s.customer?row('Customer',s.customer.name):'')+'<div class="rule"></div>'+s.lines.map((l,i)=>'<div class="item"><b>'+esc(l.name)+'</b><p>'+esc(l.variant||'')+'</p>'+row(l.qty+' × Rs '+m(l.price*100),'Rs '+m(r.lines[i].net))+'</div>').join('')+row('Regular total','Rs '+m(r.lines.reduce((n,x)=>n+x.gross,0)))+row('Total savings','Rs '+m(r.lines.reduce((n,x)=>n+x.gross-x.net,0)))+row('Merchandise net','Rs '+m(s.goods*100))+(s.tax?row(s.taxAdded?'Illustrative tax added':'Illustrative tax included','Rs '+m(s.tax*100)):'')+(s.fee?row('Illustrative fee','Rs '+m(s.fee*100)):'')+(s.round?row('Rounding','Rs '+m(s.round*100)):'')+'<div class="rule"></div><div class="total">'+row('TOTAL','Rs '+m(s.total*100))+'</div>'+s.parts.map(p=>row(p.method,'Rs '+m(p.amount*100))).join('')+(s.method==='Cash'?row('Cash received','Rs '+m(s.received*100))+row('Change','Rs '+m(s.change*100)):'')+'<div class="rule"></div><div class="center">'+(d.lookup!==false?oi6Barcode(r.code)+'<p class="mono">'+r.code+'</p><p>Bill lookup only · not fiscal QR</p>':'')+'<p>'+esc(String(d.foot||'').replace(/\{days\}/g,String(d.days)))+'</p><p>Return/exchange policy: '+esc(d.days)+' days, subject to shop approval.</p>'+(d.lang==='both'?'<p lang="ur" dir="rtl">شکریہ، دوبارہ تشریف لائیں۔</p>':'')+(d.powered?'<p>Powered by Orba</p>':'')+'</div></main></body></html>';}
function oi6Download(s,media,reason){if(!String(reason||'').trim())throw Error('Reason required');var a=oi6State(),doc=oi6Document(s,media,true),u=URL.createObjectURL(new Blob([doc],{type:'text/html;charset=utf-8'})),link=document.createElement('a');link.href=u;link.download='Orba_RECEIPT_'+s.billNo+'_'+media+'_COPY.html';document.body.appendChild(link);try{link.click();a.exports.push({id:'RX-'+(++a.seq),sale:s.oi5Id,media,reason:String(reason).trim(),status:'file_requested',purpose:'receipt',at:new Date().toISOString()});}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);}return doc;}
function oi6Returns(s){return oi6State().returns.filter(x=>x.sale===s.oi5Id);}
function oi6Entitlement(s,i){var line=s.lines[i];return line?line.qty-oi6Returns(s).filter(x=>x.line===i).reduce((n,x)=>n+x.qty,0):0;}
function oi6ReturnBlock(s){if(!s?.oi6Receipt)return 'No saved receipt snapshot';if(s.fbrMode!=='notRequired'||s.fee||s.tax||s.round)return 'Fiscal or rounded bills require verified adjustment policy (OI-7).';if(s.parts.some(x=>x.method==='Khata'))return 'Khata returns require invoice-level credit reconciliation.';return '';}
function oi6ReturnQuote(s,i,q){var block=oi6ReturnBlock(s);if(block)throw Error(block);if(!Number.isInteger(i)||!Number.isInteger(q)||q<1||q>oi6Entitlement(s,i))throw Error('Quantity exceeds remaining entitlement');var originalItem=findItem(s.lines[i].id);if(originalItem&&sfArchivedItem(originalItem))throw Error('Restore the original archived article in Stock before recording a return or exchange.');var l=s.oi6Receipt.lines[i],used=l.qty-oi6Entitlement(s,i),amount=Number(BigInt(l.net)*BigInt(used+q)/BigInt(l.qty)-BigInt(l.net)*BigInt(used)/BigInt(l.qty));var prior=oi6Returns(s),caps=s.parts.map((p,j)=>p.amount*100-prior.reduce((n,x)=>n+x.parts[j].amount,0));var allocations=oi6Allocate(amount,caps);return {version:prior.length,line:i,qty:q,amount,parts:s.parts.map((p,j)=>({method:p.method,amount:allocations[j]}))};}
function oi6Return(s,i,q,disposition,reason,ack,role,expected){if(role!=='owner'||ack!==true||!['restock','quarantine'].includes(disposition)||String(reason).trim().length<5)throw Error('Owner review, reason and simulated acknowledgement required');var quote=oi6ReturnQuote(s,i,q);if(fwMode()){var cash=quote.parts.filter(x=>x.method==='Cash').reduce((n,x)=>n+x.amount,0);if(cash)fwCashCheck(cash);}if(JSON.stringify(quote)!==expected)throw Error('Return quote changed; review again');var line=s.lines[i],it=findItem(line.id);if(!it||it.measured)throw Error('Original variant unavailable');var a=oi6State(),prior=oi6Returns(s),r={id:'RET-'+(a.returns.length+1),sale:s.oi5Id,bill:s.billNo,line:i,qty:q,disposition,reason:String(reason).trim(),amount:quote.amount,parts:quote.parts,at:new Date().toISOString(),training:true};if(disposition==='restock'){if(it.oi5Foot){var fs=oi5Feet().map(oi6Clone),f=fs.find(x=>x.id===it.oi5Article);if(!f)throw Error('Original article missing');if(f.st){var zi=f.sizes.indexOf(it.oi5Size);if(zi<0||!f.st[it.oi5Colour])throw Error('Original variant missing');f.st[it.oi5Colour][zi]+=q;}else f.qty+=q;KEEP['Inventory|shoes']=KEEP['Inventory|shoes']||{};KEEP['Inventory|shoes'].data=fs;}else adjAdd(it,line.ci,line.si,q);}a.returns.push(r);return r;}

/* OI-7: offline, session-only fiscal lifecycle rehearsal. Never invokes FBR or changes a sale. */
function oi7State(){return __G.__orbaOi7||(__G.__orbaOi7={seq:0,cases:[]});}
function oi7Int(n){return Number.isSafeInteger(n)&&n>=0;}
function oi7Rate(v){if(!/^(?:\d{1,2}|100)(?:\.\d{1,2})?$/.test(String(v)))throw Error('Enter explicit rate (0–100%, up to 2 decimals)');var r=Math.round(Number(v)*100);if(r>10000)throw Error('Rate exceeds rehearsal range');return r;}
function oi7Tax(gross,bp,included){if(!oi7Int(gross)||!oi7Int(bp)||bp>10000)throw Error('Invalid tax inputs');var a=BigInt(gross)*BigInt(bp),d=BigInt(included?10000+bp:10000),tax=Number((a+d/2n)/d);if(!oi7Int(tax)||!oi7Int(included?gross:gross+tax))throw Error('Amount too large');return {base:included?gross-tax:gross,tax:tax,total:included?gross:gross+tax};}
function oi7Sale(id){return BILLS.find(b=>b.oi5Snapshot?.oi5Id===id)?.oi5Snapshot;}
function oi7Eligible(s){return !!s?.oi6Receipt&&s.fbrMode==='notRequired'&&!s.tax&&!s.fee&&!s.round&&oi7Int(s.total*100)&&s.total*100===s.oi6Receipt.lines.reduce((a,x)=>a+x.net,0)&&s.parts.reduce((a,x)=>a+x.amount*100,0)===s.total*100&&!s.parts.some(x=>x.method==='Khata');}
function oi7Quote(s,rates){if(!oi7Eligible(s)||!Array.isArray(rates)||rates.length!==s.lines.length)throw Error('Select a tax-neutral saved training sale; no fiscal-preview, rounding or Khata');var lines=s.oi6Receipt.lines.map((x,i)=>{var bp=oi7Rate(rates[i]);return {key:x.key,qty:x.qty,name:s.lines[i].name,variant:s.lines[i].variant,rate:bp,...oi7Tax(x.net,bp,true)};});return {sale:s.oi5Id,bill:s.billNo,receipt:s.oi6Receipt.code,templateVersion:s.oi6Receipt.version,lines:lines,total:lines.reduce((n,x)=>n+x.total,0),tax:lines.reduce((n,x)=>n+x.tax,0),base:lines.reduce((n,x)=>n+x.base,0)};}
function oi7Cases(sale){return oi7State().cases.filter(x=>x.sale===sale);}
function oi7Create(s,rates,ack,role){if(role!=='owner'||ack!==true)throw Error('Owner rehearsal acknowledgement required');if(oi7Cases(s?.oi5Id).some(x=>x.kind==='invoice'&&x.status!=='rejected'))throw Error('Existing invoice rehearsal must be resolved; accepted is terminal');var q=oi7Quote(s,rates);return oi7Add('invoice',q.sale,q.bill,q,null,null);}
function oi7Add(kind,sale,bill,payload,parent,ret){var a=oi7State(),c={id:'SIM-'+(++a.seq),kind,sale,bill,payload:oi6Clone(payload),parent,ret,status:'prepared',events:[{status:'prepared',at:new Date().toISOString(),note:'Local rehearsal; no external submission'}]};a.cases.push(c);return c;}
function oi7Transition(id,next,note,ack,role){var c=oi7State().cases.find(x=>x.id===id);if(!c||role!=='owner'||ack!==true)throw Error('Owner rehearsal acknowledgement required');var allowed={prepared:['queued'],queued:['accepted','rejected','unknown'],unknown:['accepted','rejected','queued'],accepted:[],rejected:[]};if(!allowed[c.status]?.includes(next))throw Error('Invalid or duplicate transition');note=String(note||'').trim();if((c.status==='unknown'||next==='rejected')&&note.length<8)throw Error('Reconciliation evidence or rejection reason required (8+ characters)');if(c.status==='unknown'&&next==='queued'&&!/^NOT RECEIVED\b/i.test(note))throw Error('For retry, evidence must begin NOT RECEIVED; verify first');c.status=next;c.events.push({status:next,at:new Date().toISOString(),note:note||'Simulated transition'});return c;}
function oi7Note(parentId,returnId,ack,role){if(role!=='owner'||ack!==true)throw Error('Owner rehearsal acknowledgement required');var parent=oi7State().cases.find(x=>x.id===parentId&&x.kind==='invoice'&&x.status==='accepted');if(!parent)throw Error('Accepted rehearsal invoice required');var s=oi7Sale(parent.sale),rs=oi6Returns(s),r=rs.find(x=>x.id===returnId);if(!r)throw Error('Linked original training return required');var cases=oi7Cases(parent.sale).filter(x=>x.kind==='credit'&&x.parent===parent.id);if(cases.some(x=>x.ret===r.id&&x.status!=='rejected'))throw Error('Credit rehearsal already exists');var idx=rs.indexOf(r),earlier=rs.slice(0,idx).filter(x=>x.line===r.line);if(earlier.some(x=>!cases.some(c=>c.ret===x.id&&c.status==='accepted')))throw Error('Reconcile earlier line returns first');var l=parent.payload.lines[r.line];if(!l||!oi7Int(r.qty)||!r.qty)throw Error('Invalid return line');var before=earlier.reduce((a,x)=>a+x.qty,0),after=before+r.qty;if(after>l.qty)throw Error('Return exceeds original invoice quantity');var part=(v)=>Number(BigInt(v)*BigInt(after)/BigInt(l.qty)-BigInt(v)*BigInt(before)/BigInt(l.qty)),total=part(l.total),tax=part(l.tax);if(total!==r.amount||tax>total)throw Error('Return does not reconcile with saved training adjustment');var q={sale:s.oi5Id,bill:s.billNo,returnId:r.id,line:r.line,qty:r.qty,total,tax,base:total-tax};return oi7Add('credit',s.oi5Id,s.billNo,q,parent.id,r.id);}
function oi7Status(s){var cases=oi7Cases(s?.oi5Id),inv=cases.filter(x=>x.kind==='invoice').at(-1);return inv?'Rehearsal '+inv.id+' · '+inv.status+' (simulated) · '+cases.filter(x=>x.kind==='credit').length+' credit rehearsal(s)':'No fiscal rehearsal created';}

/* ORBA FINAL: deterministic training identity, persistent reservation when running the bundled local agent. */
function orbaStableCode(key){var h=14695981039346656037n;for(var i=0;i<key.length;i++){h^=BigInt(key.charCodeAt(i));h=BigInt.asUintN(64,h*1099511628211n);}return '290'+String(1n+h%999999999n).padStart(9,'0');}
function orbaReserveCode(key,code){if(!__G.__orbaFinalRegistry)return;var x=new XMLHttpRequest();x.open('POST','/api/registry',false);x.setRequestHeader('Content-Type','application/json');x.setRequestHeader('X-Orba-Token',__G.__orbaOI4Token);x.send(JSON.stringify({key:key,code:code}));if(x.status!==200)throw Error('Local registry unavailable or collision. Do not print; review setup.');}
function orbaRefundRows(s){return oi6Returns(s).flatMap(function(r){return r.parts.filter(p=>p.amount>0).map((p,i)=>({id:r.id+'-'+i,kind:'out',src:'return',way:payKey(p.method),amt:p.amount/100,minor:p.amount,ref:r.id,bill:r.bill,sale:r.sale,staff:s.staff,training:true,time:r.at}));});}
var orbaReturn0=oi6Return;oi6Return=function(s,i,q,disposition,reason,ack,role,expected){var oldLedger=LEDGER.slice(),oldReturns=oi6State().returns.slice(),oldAdj=Object.assign({},STOCK_ADJ),oldFeet=KEEP['Inventory|shoes'],oldData=oldFeet?.data;try{var r=orbaReturn0(s,i,q,disposition,reason,ack,role,expected);var rows=orbaRefundRows(s).filter(x=>x.ref===r.id);if(rows.reduce((n,x)=>n+x.minor,0)!==r.amount||rows.some(x=>LEDGER.some(y=>y.id===x.id)))throw Error('Refund journal mismatch');rows.forEach(x=>LEDGER.push(x));return r;}catch(e){LEDGER.splice(0,LEDGER.length,...oldLedger);oi6State().returns.splice(0,oi6State().returns.length,...oldReturns);Object.keys(STOCK_ADJ).forEach(k=>delete STOCK_ADJ[k]);Object.assign(STOCK_ADJ,oldAdj);if(oldFeet){KEEP['Inventory|shoes']=oldFeet;oldFeet.data=oldData;}else delete KEEP['Inventory|shoes'];throw e;}};
function orbaGoodsParts(b){if(!b.oi5Snapshot)return null;var s=b.oi5Snapshot,parts=s.parts||[];if(!parts.length||!s.total)return null;var gross=Math.round(s.goods*100),den=BigInt(s.total*100),used=0;return parts.map(function(p,i){var a=i===parts.length-1?gross-used:Number(BigInt(gross)*BigInt(p.amount*100)/den);used+=a;return {method:p.method,amount:a/100};});}
dayStats=function(staff){var o={all:0,n:0,cash:0,cashN:0,kh:0,other:0,ret:0,retN:0,items:0};BILLS.forEach(function(b){if(staff&&(b.staff||'Ali')!==staff)return;var g=billGoods(b),ps=orbaGoodsParts(b);o.all+=g;o.n++;o.items+=billItems(b);if(ps){ps.forEach(p=>{if(p.method==='Cash')o.cash+=p.amount;else if(p.method==='Khata')o.kh+=p.amount;else o.other+=p.amount;});if(ps.some(p=>p.method==='Cash'))o.cashN++;var rr=oi6Returns(b.oi5Snapshot);o.ret+=rr.reduce((n,r)=>n+r.amount,0)/100;o.retN+=rr.length;}else{if(b.pay==='cash'){o.cash+=g;o.cashN++;}else if(b.pay==='khata')o.kh+=g;else o.other+=g;if(b.returned){o.ret+=b.returned;o.retN++;}}});o.retN+=LEDGER.filter(x=>x.src==='return'&&!x.training&&(!staff||x.staff===staff)).length;return o;};
/* journal rows for training sales only; fiscal preview remains illustrative and not statutory. */
function orbaAccount(method){return method==='Cash'?'1000':method==='Khata'?'1100':'1010';}
function orbaTrainingJournals(){var j=[];BILLS.filter(b=>b.oi5Snapshot).forEach(b=>{var s=b.oi5Snapshot,net=s.total-s.fee-(s.taxAdded?s.tax:0)-s.round,lines=s.parts.map(p=>[orbaAccount(p.method),p.amount,0]);lines.push(['4000',0,net]);if(s.fee)lines.push(['2400',0,s.fee]);if(s.taxAdded&&s.tax)lines.push(['2410',0,s.tax]);if(s.round)lines.push(['4990',s.round<0?-s.round:0,s.round>0?s.round:0]);j.push({id:'S'+b.no,type:'sales',icon:ICONS.receipt,what:'Training '+s.method+' sale · Bill '+b.no,sub:'Local rehearsal · '+s.staff,lines:lines});oi6Returns(s).forEach(r=>j.push({id:r.id,type:'sales',icon:ICONS.ret,what:'Training refund · Bill '+b.no,sub:r.id+' · '+r.disposition,lines:[['4900',r.amount/100,0]].concat(r.parts.filter(p=>p.amount>0).map(p=>[orbaAccount(p.method),0,p.amount/100]))}));});return j;}

/* V2.1: owner-managed operations; single-counter training state, no live integrations. */
function v21State(){return SET.v21||(SET.v21={seq:0,reservations:[],transfers:[],counts:[],purchases:[],payments:[],exchanges:[]});}
function v21Owner(role){if(role!=='owner')throw Error('Owner approval required');}
function v21Qty(n,zero){if(!Number.isSafeInteger(n)||n<(zero?0:1)||n>999999)throw Error('Enter a valid whole quantity');return n;}
function v21Text(v,name){v=String(v||'').trim();if(!v||v.length>100)throw Error('Enter '+name+' (1–100 characters)');return v;}
function v21Minor(v){if(!/^\d{1,7}(\.\d{1,2})?$/.test(String(v)))throw Error('Enter a valid PKR amount');return Math.round(Number(v)*100);}
function v21Id(p){return p+'-'+(++v21State().seq);}
function v21Variant(code){var hits=oi5Resolve(String(code).trim());if(hits.length!==1)throw Error('Choose exactly one known variant barcode');var x=hits[0];return {...x,code:x.it.oi5Foot?x.it.oi5Code:oi3Generic(x.it,x.ci,x.si).code};}
function v21Stock(code){var x=v21Variant(code);return avail(x.it,x.ci,x.si);}
function v21Move(code,delta){var x=v21Variant(code),old=avail(x.it,x.ci,x.si);if(!Number.isSafeInteger(delta)||old+delta<0||!Number.isSafeInteger(old+delta))throw Error('Insufficient stock or invalid movement');if(x.it.oi5Foot){var fs=oi5Feet().map(oi6Clone),a=fs.find(z=>z.id===x.it.oi5Article);if(a.st)a.st[x.it.oi5Colour][a.sizes.indexOf(x.it.oi5Size)]+=delta;else a.qty+=delta;KEEP['Inventory|shoes']=KEEP['Inventory|shoes']||{};KEEP['Inventory|shoes'].data=fs;}else adjAdd(x.it,x.ci,x.si,delta);return old+delta;}
function v21Reserve(code,q,ref,role){v21Owner(role);q=v21Qty(q);ref=v21Text(ref,'reservation reference');var x=v21Variant(code),s=v21State();if(s.reservations.some(r=>r.ref.toLowerCase()===ref.toLowerCase()))throw Error('Reservation reference already exists');v21Move(x.code,-q);var r={id:v21Id('RS'),code:x.code,qty:q,ref:ref,status:'held'};s.reservations.push(r);return r;}
function v21Release(id,role){v21Owner(role);var r=v21State().reservations.find(x=>x.id===id);if(!r||r.status!=='held')throw Error('Reservation is not open');v21Move(r.code,r.qty);r.status='released';return r;}
function v21Dispatch(code,q,dest,ref,role){v21Owner(role);q=v21Qty(q);dest=v21Text(dest,'destination');ref=v21Text(ref,'transfer reference');var s=v21State(),x=v21Variant(code);if(/^main( branch)?$/i.test(dest)||s.transfers.some(r=>r.ref.toLowerCase()===ref.toLowerCase()))throw Error('Choose another branch and unique reference');v21Move(x.code,-q);var r={id:v21Id('TR'),code:x.code,qty:q,received:0,cancelled:0,dest,ref};s.transfers.push(r);return r;}
function v21Transfer(id,q,action,role){v21Owner(role);var r=v21State().transfers.find(x=>x.id===id);q=v21Qty(q);if(!r||q>r.qty-r.received-r.cancelled||!['receive','return'].includes(action))throw Error('Quantity exceeds in-transit balance');if(action==='receive')r.received+=q;else{v21Move(r.code,q);r.cancelled+=q;}return r;}
function v21Count(code,actual,expected,reason,role){v21Owner(role);v21Qty(actual,true);reason=v21Text(reason,'count reason');var x=v21Variant(code),current=v21Stock(x.code);if(current!==expected)throw Error('Stock changed; recount');if(v21State().reservations.some(r=>r.code===x.code&&r.status==='held'))throw Error('Release held stock before physical count');v21Move(x.code,actual-current);var r={id:v21Id('CT'),code:x.code,before:current,actual,delta:actual-current,reason};v21State().counts.push(r);return r;}
function v21PurchaseRows(){return (__G.__orbaOi2Receipts||[]).filter(r=>r.total!==null&&Number.isSafeInteger(r.total)).concat(v21State().purchases);}
function v21Due(r){return r.total-r.paid-v21State().payments.filter(p=>p.invoice===r.id).reduce((a,p)=>a+p.amount,0)-(v21State().supplierReturns||[]).filter(p=>p.invoice===r.id).reduce((a,p)=>a+p.amount,0);}
function v21SupplierPay(id,amount,ref,way,role){v21Owner(role);var r=v21PurchaseRows().find(x=>x.id===id),s=v21State();ref=v21Text(ref,'payment reference');if(!r||!Number.isSafeInteger(amount)||amount<=0||amount>v21Due(r)||!['cash','bank'].includes(way)||s.payments.some(x=>x.ref.toLowerCase()===ref.toLowerCase()))throw Error('Invalid payment, duplicate reference or amount exceeds payable');if(way==='cash')fwCashCheck(amount);var seqBefore=s.seq,paymentsBefore=s.payments.length,ledgerBefore=LEDGER.length;try{var p={id:v21Id('SP'),invoice:r.id,amount,ref,way};s.payments.push(p);ledgerAdd({id:p.id,kind:'out',src:'sup',way,amt:amount/100,what:'Training supplier payment '+r.supplier,ref,training:true});return p;}catch(e){s.payments.length=paymentsBefore;LEDGER.length=ledgerBefore;s.seq=seqBefore;throw e;}}
function v21Purchase(supplier,invoice,lines,paid,way,tagged,role){v21Owner(role);supplier=v21Text(supplier,'supplier');invoice=v21Text(invoice,'invoice reference');var ref=supplier.toLowerCase()+'|'+invoice.toLowerCase();if(v21PurchaseRows().some(r=>r.ref===ref)||(__G.__orbaOi2Receipts||[]).some(r=>r.ref===ref))throw Error('Supplier invoice already received');if(!Array.isArray(lines)||!lines.length||lines.length>100)throw Error('Add 1–100 purchase lines');var seen=new Set(),rows=lines.map(l=>{var x=v21Variant(l.code),quantity=v21Qty(l.quantity);if(sfArchivedCode(x.code))throw Error('Restore archived article before receiving');if(seen.has(x.code)||!Number.isSafeInteger(l.cost)||l.cost<0)throw Error('Duplicate variant or invalid unit cost');seen.add(x.code);return {code:x.code,quantity,cost:l.cost};}),total=rows.reduce((n,l)=>n+l.quantity*l.cost,0);if(!Number.isSafeInteger(total)||!Number.isSafeInteger(paid)||paid<0||paid>total||!['cash','bank'].includes(way))throw Error('Invalid purchase total/payment');if(way==='cash'&&paid>0)fwCashCheck(paid);var s=v21State(),seqBefore=s.seq,purchasesBefore=s.purchases.length,batchesBefore=oi3State().batches.length,ledgerBefore=LEDGER.length,beforeAdj={...STOCK_ADJ},beforeKeep=KEEP['Inventory|shoes'],beforeFeet=beforeKeep?.data;var r={id:v21Id('POV'),supplier,invoice,ref,lines:rows,total,paid,payable:total-paid,way};try{rows.forEach(l=>v21Move(l.code,l.quantity));r.labelBatch=tagged?null:oi3Batch(r.id,rows.map(l=>({code:l.code,q:l.quantity})));s.purchases.push(r);if(paid)ledgerAdd({id:r.id,kind:'out',src:'sup',way,amt:paid/100,what:'Training purchase '+supplier,ref,training:true});return r;}catch(e){Object.keys(STOCK_ADJ).forEach(k=>delete STOCK_ADJ[k]);Object.assign(STOCK_ADJ,beforeAdj);if(beforeKeep){KEEP['Inventory|shoes']=beforeKeep;if(beforeFeet===undefined)delete beforeKeep.data;else beforeKeep.data=beforeFeet;}else delete KEEP['Inventory|shoes'];s.purchases.length=purchasesBefore;oi3State().batches.length=batchesBefore;LEDGER.length=ledgerBefore;s.seq=seqBefore;throw e;}}
function v21NewProduct(name,sku,cat,price,colours,sizes,role){v21Owner(role);if(fwMode()&&!['bags','acc'].includes(cat))throw Error('Create shoes in the native Add article size matrix; this form is for bags and shoe care');name=v21Text(name,'name');sku=v21Text(sku,'article/SKU').toUpperCase();if(fwMode()){oi3Seed();if(fwNamespaceTaken(sku))throw Error('Article/SKU conflicts with existing barcode or alias');}if(!/^[A-Z0-9][A-Z0-9_-]{1,39}$/.test(sku)||ITEMS.some(i=>String(i.sku).toUpperCase()===sku)||oi5Feet().some(a=>String(a.no).toUpperCase()===sku))throw Error('Use a unique article/SKU');if(!['bags','acc','men','women','kids','foot','general'].includes(cat)||!Number.isSafeInteger(price)||price<1||price>9999999)throw Error('Invalid category or whole-rupee selling price');function list(v){var a=String(v||'').split(',').map(x=>x.trim()).filter(Boolean);if(a.length>20||a.some(x=>x.length>24)||new Set(a.map(x=>x.toLowerCase())).size!==a.length)throw Error('Use unique options, max 20');return a;};var cs=list(colours),zs=list(sizes);if(zs.length&&!cs.length)cs=['Default'];var it={id:'v21_'+sku.toLowerCase(),name,sku,cat,price,art:'',stock:0,isNew:true};if(cs.length)it.colours=cs;if(zs.length)it.sizes=zs;if(fwMode()){it.fwProduct=true;it.unit='/ pc';if(cat==='bags')it.art='bag';}var codes=[],rs=oi3State(),keysBefore=new Set(Object.keys(rs.byKey));try{(cs.length?cs:[null]).forEach((c,ci)=>(zs.length?zs:[null]).forEach((z,si)=>{if(fwMode()&&fwNamespaceTaken(skuOf(it,ci,si)))throw Error('Variant alias conflicts with existing identifier');var x=oi3Generic(it,ci,si);codes.push(x.code);}));}catch(e){for(var k of Object.keys(rs.byKey))if(!keysBefore.has(k)){delete rs.byCode[rs.byKey[k].code];delete rs.byKey[k];}throw Error('Barcode registration failed; product not created: '+e.message);}ITEMS.push(it);return {it,codes};}
function v21Offer(enabled,articleIds,genericIds,p2,p3,role){v21Owner(role);if(oi5State().pending)throw Error('Resolve pending checkout before editing offers');if(!Number.isSafeInteger(p2)||!Number.isSafeInteger(p3)||p2<1||p3<1||p2>9999999||p3>9999999)throw Error('Enter valid whole-rupee bundle prices');if(!Array.isArray(articleIds)||!Array.isArray(genericIds)||articleIds.some(id=>!oi5Feet().some(a=>a.id===id&&a.st))||genericIds.some(id=>!ITEMS.some(a=>a.id===id&&!a.measured)))throw Error('Unknown eligible article');if(enabled&&!articleIds.length&&!genericIds.length)throw Error('Choose eligible products');SET.oi5Offer={enabled:!!enabled,articleIds:[...new Set(articleIds)],genericIds:[...new Set(genericIds)],p2,p3};return SET.oi5Offer;}
/* Each offer may mix eligible selected articles, never stacks with manual discounts. */
oi5Bundle=function(lines,discount){var offer=SET.oi5Offer,eligible=[];if(!offer?.enabled||discount||lines.some(l=>l.disc))return {saving:0,groups:[]};lines.forEach(l=>{var it=findItem(l.id);if(it&&(it.oi5Foot?it.cat==='foot'&&(offer.articleIds||[]).includes(it.oi5Article):(offer.genericIds||[]).includes(it.id))&&Number.isSafeInteger(l.price)&&Number.isSafeInteger(l.qty)&&l.qty>0&&l.qty<=1000)for(var j=0;j<l.qty;j++)eligible.push({key:l.key,price:l.price});});eligible.sort((a,b)=>b.price-a.price||a.key.localeCompare(b.key));var dp=[{cost:0,groups:[]}];for(var i=1;i<=eligible.length;i++){var e=eligible[i-1],best={cost:dp[i-1].cost+e.price,groups:dp[i-1].groups};[[2,offer.p2??2500],[3,offer.p3??3500]].forEach(([q,p])=>{if(i>=q&&Number.isSafeInteger(p)&&p>0&&dp[i-q].cost+p<best.cost)best={cost:dp[i-q].cost+p,groups:dp[i-q].groups.concat([{keys:eligible.slice(i-q,i).map(x=>x.key),price:p}])};});dp.push(best);}return {saving:eligible.reduce((n,x)=>n+x.price,0)-dp.at(-1).cost,groups:dp.at(-1).groups};};
/* Unpaid Khata credit only. Paid portion requires separately verified settlement policy. */
var v21Block0=oi6ReturnBlock;oi6ReturnBlock=function(s){var b=v21Block0(s);if(b!=='Khata returns require invoice-level credit reconciliation.')return b;var inv=KH_INV.find(x=>String(x.no)===String(s.billNo)&&x.cust===s.customerId);return !inv?'Original Khata invoice not found':invOwed(inv)<=0?'Paid Khata requires a verified cash/digital settlement policy.':'';};
var v21Quote0=oi6ReturnQuote;oi6ReturnQuote=function(s,i,q){var r=v21Quote0(s,i,q);if(s.parts.some(p=>p.method==='Khata')){var inv=KH_INV.find(x=>String(x.no)===String(s.billNo)&&x.cust===s.customerId);if(!inv||r.amount>Math.round(invOwed(inv)*100))throw Error('Credit exceeds unpaid invoice balance; paid portion requires separate settlement');}return r;};
var v21Ret0=oi6Return;oi6Return=function(s,i,q,disposition,reason,ack,role,expected){var kh=s.parts.some(p=>p.method==='Khata');if(!kh)return v21Ret0(s,i,q,disposition,reason,ack,role,expected);var inv=KH_INV.find(x=>String(x.no)===String(s.billNo)&&x.cust===s.customerId);if(!inv)throw Error('Missing Khata invoice');var r=v21Ret0(s,i,q,disposition,reason,ack,role,expected);inv.ret.push({id:r.id,d:20261114,amt:r.amount/100,item:s.lines[i].name,by:'Owner'});LEDGER.filter(x=>x.ref===r.id).forEach(x=>{x.kind='credit';x.way='khata';});return r;};
/* Atomic cash-only exchange: linked return and separate full-value replacement sale, no new fiscal preview. */
function v21Exchange(s,line,q,code,replacementQty,reason,role,ack){v21Owner(role);if(!ack||s.parts.length!==1||s.parts[0].method!=='Cash'||oi6ReturnBlock(s)||oi5State().pending||SET.shift.c1!=='open')throw Error('Exchange requires open shift, original non-fiscal cash sale and no pending checkout');q=v21Qty(q);replacementQty=v21Qty(replacementQty);reason=v21Text(reason,'exchange reason');if(reason.length<5)throw Error('Explain exchange (at least 5 characters)');var ret=oi6ReturnQuote(s,line,q),x=v21Variant(code);if(sfArchivedCode(code))throw Error('Restore archived replacement article first');if(avail(x.it,x.ci,x.si)<replacementQty)throw Error('Replacement unavailable');var l=mkLine(x.it.id,x.ci,x.si,replacementQty);var quote=oi5Quote({billNo:nextBillNo(),customerId:s.customerId,staffId:'ali',lines:[l],discount:null},{fbr:'notRequired'});if(!oi5StockOK(quote)||quote.round||quote.fee||quote.tax)throw Error('Replacement quote not valid');var diff=quote.total*100-ret.amount;if(diff<0&&fwDrawerMinor()< -diff)throw Error('Insufficient cash for exchange');var a=oi5State(),bk={b:BILLS.slice(),k:KH_INV.slice(),adj:{...STOCK_ADJ},feet:KEEP['Inventory|shoes']?.data,ledger:LEDGER.slice(),r:oi6State().returns.slice(),posted:{...a.posted},receipts:a.receipts.slice(),pending:a.pending};try{var id='S'+(++a.seq),attempt={id,sig:oi5Sig(quote),quote};a.pending=attempt;var sale=oi5Commit(quote,{method:'Cash',parts:[{method:'Cash',amount:quote.total}],received:quote.total,change:0},attempt);var r=oi6Return(s,line,q,'restock',reason,true,role,JSON.stringify(ret));var ex={id:v21Id('EX'),returnId:r.id,original:s.billNo,replacement:sale.billNo,difference:diff};v21State().exchanges.push(ex);return ex;}catch(e){BILLS.splice(0,BILLS.length,...bk.b);KH_INV.splice(0,KH_INV.length,...bk.k);Object.keys(STOCK_ADJ).forEach(k=>delete STOCK_ADJ[k]);Object.assign(STOCK_ADJ,bk.adj);if(bk.feet){KEEP['Inventory|shoes']=KEEP['Inventory|shoes']||{};KEEP['Inventory|shoes'].data=bk.feet;}else delete KEEP['Inventory|shoes'];LEDGER.splice(0,LEDGER.length,...bk.ledger);oi6State().returns.splice(0,oi6State().returns.length,...bk.r);a.posted=bk.posted;a.receipts=bk.receipts;a.pending=bk.pending;throw e;}}
/* Native owner action opens a responsive, keyboard-accessible dialog. */
function v21UI(role,mode,refresh,sale,initialTab,initialCode,easyMatrix){v21Owner(role);var prior=document.getElementById('orba-v21-dialog');if(prior)prior.remove();var prev=document.activeElement,dialog=document.createElement('dialog');dialog.id='orba-v21-dialog';dialog.setAttribute('aria-label','Orba operations');dialog.style.cssText='width:min(720px,calc(100vw - 24px));max-height:92vh;border:1px solid #D9CFC0;border-radius:20px;padding:0;color:#162660;background:#F1E4D1;font:15px Outfit,Segoe UI,system-ui,sans-serif;box-shadow:0 20px 70px #16266044';document.body.appendChild(dialog);var esc=oi3Esc,sections=mode==='bill'?['Exchange']:mode==='logo'?['Receipt logo']:mode==='supplier'?['Receive invoice','Supplier payable','Supplier returns']:mode==='cash'?['Cash shift','Cash movements']:mode==='khata'?['Customers','Collections']:mode==='expenses'?['Expenses']:['Overview','Catalogue','Bundle offers','Receive invoice','Supplier payable','Reservations','Transfers','Stock count',...(fwMode()?['Quarantine','Supplier returns']:[])];var tab=sections.includes(initialTab)?initialTab:sections[0],msg='',draft=[],countExpected=null,purchaseFields={},editing=null,lastReceipt=null;function close(){if(draft.length&&!confirm('Discard the unreceived purchase draft?'))return;dialog.close();}dialog.addEventListener('cancel',e=>{if(draft.length){e.preventDefault();close();}});function rememberPurchase(){if(tab!=='Receive invoice')return;for(let id of ['supplier','invoice','paid','way','tagged']){let e=dialog.querySelector('#'+id);if(e)purchaseFields[id]=e.type==='checkbox'?e.checked:e.value;}}dialog.addEventListener('close',()=>{dialog.remove();if(refresh)refresh();if(prev?.isConnected)prev.focus();});var css='<style>#orba-v21-dialog::backdrop{background:#16266066}#orba-v21-dialog *{box-sizing:border-box}#orba-v21-dialog button,#orba-v21-dialog input,#orba-v21-dialog select{font:inherit;border:1px solid #D9CFC0;border-radius:10px;padding:10px;min-height:44px;color:#162660;background:white}#orba-v21-dialog button{cursor:pointer;font-weight:600}#orba-v21-dialog button.primary{background:#162660;color:white;border:0}#orba-v21-dialog button[disabled]{opacity:.5;cursor:not-allowed}#orba-v21-dialog label{display:grid;gap:5px;font-size:13px;font-weight:600;min-width:0}#orba-v21-dialog input,#orba-v21-dialog select{width:100%;min-width:0}#orba-v21-dialog .fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:12px}#orba-v21-dialog .panel{background:white;border:1px solid #E9E1D5;border-radius:14px;padding:14px;display:grid;gap:10px}#orba-v21-dialog .row{display:flex;flex-wrap:wrap;align-items:center;gap:8px}#orba-v21-dialog .muted{color:#5B6585;font-size:13px}#orba-v21-dialog .list{max-height:220px;overflow:auto;display:grid;gap:5px}#orba-v21-dialog .check{display:flex;align-items:center;gap:8px;min-height:36px}#orba-v21-dialog .check input{width:20px;min-height:20px}#orba-v21-dialog .record{padding:9px;background:#F8F2E9;border-radius:10px;overflow-wrap:anywhere}#orba-v21-dialog h2,#orba-v21-dialog h3,#orba-v21-dialog p{margin:0}#orba-v21-dialog .primary:focus-visible,#orba-v21-dialog button:focus-visible,#orba-v21-dialog input:focus-visible,#orba-v21-dialog select:focus-visible{outline:3px solid #2E46A0;outline-offset:2px}</style>';function field(id,label,value='',type='text'){return '<label>'+esc(label)+'<input id="'+id+'" type="'+type+'" value="'+esc(value)+'"></label>'}function select(id,label,opts){return '<label>'+esc(label)+'<select id="'+id+'">'+opts.map(x=>'<option value="'+esc(x[0])+'">'+esc(x[1])+'</option>').join('')+'</select></label>'}function btn(id,text,primary=false){return '<button type="button" id="'+id+'"'+(primary?' class="primary"':'')+'>'+esc(text)+'</button>'}function check(id,label,checked=false){return '<label class="check"><input id="'+id+'" type="checkbox"'+(checked?' checked':'')+'>'+esc(label)+'</label>'}function options(){oi3Seed();return Object.values(oi3State().byCode).filter(x=>!fwMode()||fwRegAllowed(x)).filter(x=>x.scope==='footwear'?oi5Feet().some(a=>a.id===x.id):ITEMS.some(a=>a.id===x.id)).map(x=>[x.code,x.name+' · '+[x.colour,x.size].filter(Boolean).join(' / ')+' · '+x.code]);}function variant(){var rows=options();if(initialCode)rows.sort((a,b)=>Number(b[0]===initialCode)-Number(a[0]===initialCode));if(tab==='Exchange')rows=rows.filter(r=>!sfArchivedCode(r[0]));return field('variantSearch','Search article, colour, size or barcode')+select('vcode','Exact variant / barcode',rows)+'<p id="variant-info" class="muted" role="status"></p>';}function val(id){return dialog.querySelector('#'+id).value;}function checked(id){return dialog.querySelector('#'+id).checked;}function numeric(id){var v=val(id);if(!/^\d+$/.test(v))throw Error(id==='line'?'Choose an eligible original line':'Enter whole quantities');return Number(v);}function bind(id,fn){var b=dialog.querySelector('#'+id);if(b)b.onclick=()=>{try{var r=fn();if(r!==false){msg=typeof r==='string'?r:'Saved in training session';render();}}catch(e){dialog.querySelector('#v21-msg').textContent=e.message;dialog.querySelector('#v21-msg').style.color='#B42318';}};}function money(n){return 'Rs '+oi6Money(n);}function records(a,fmt){return a.length?'<div class="list">'+a.map(x=>'<div class="record">'+esc(fmt(x))+'</div>').join('')+'</div>':'<p class="muted">No records yet.</p>';}function render(){var st=v21State(),html='',offer=SET.oi5Offer||{},rs=st.reservations.filter(x=>x.status==='held'),ts=st.transfers.filter(x=>x.qty>x.received+x.cancelled);if(tab==='Overview'){html='<div class="panel"><h3>Choose a stock task</h3><p class="muted">Receive, manage, count or move exact variants. Use Add footwear in Stock for new shoes.</p><div class="fields">'+sections.filter(x=>x!=='Overview').map(x=>'<button type="button" data-op="'+esc(x)+'">'+esc(x==='Catalogue'?'Add bag / accessory':x)+'</button>').join('')+'</div></div>';}else if(tab==='Catalogue'){html='<div class="panel"><h3>'+ (fwMode()?'Add a bag or shoe-care item':'Add a bag or general product') +'</h3><div class="fields">'+field('name','Product name')+field('sku','Unique article / SKU')+select('cat','Category',fwMode()?[['bags','Bags'],['acc','Shoe care']]:[['bags','Bags'],['general','General products'],['acc','Accessories'],['men','Men'],['women','Women'],['kids','Kids'],['foot','Footwear']])+field('price','Selling price · PKR','1290')+field('colours','Colours · comma separated')+field('sizes',fwMode()?'Bag dimensions / size · optional':'Sizes · optional')+'</div><p class="muted">Leave both options blank for one-size stock. Receive opening stock in Receive invoice.</p>'+btn('create','Create product & barcode identities',true)+'</div>'+records(ITEMS.filter(x=>fwMode()?x.fwProduct:String(x.id).startsWith('v21_')),x=>x.name+' · '+x.sku+' · Rs '+x.price+' · '+totalStock(x)+' pcs available');}
else if(tab==='Bundle offers'&&fwMode()){html=fwPoolForm(st,field,select,btn,check,records,esc);}
else if(tab==='Bundle offers'){html='<div class="panel"><h3>Clearance bundle</h3>'+check('enabled','Enable selected-product offer',offer.enabled)+'<div class="fields">'+field('p2','Any 2 eligible units · PKR',offer.p2??2500)+field('p3','Any 3 eligible units · PKR',offer.p3??3500)+'</div><p class="muted">Only checked products qualify. The register chooses the cheapest eligible combination. No stacking with manual discounts.</p><div class="list">'+oi5Feet().filter(a=>a.st).map(a=>check('f_'+a.id,a.name+' · '+a.no,(offer.articleIds||[]).includes(a.id))).join('')+ITEMS.filter(a=>!a.measured).map(a=>check('g_'+a.id,a.name+' · '+a.sku,(offer.genericIds||[]).includes(a.id))).join('')+'</div>'+btn('offerSave','Save bundle offer',true)+'</div>';}
else if(tab==='Receive invoice'){html='<div class="panel"><h3>Build purchase lines</h3>'+variant()+btn('bulkReceive','Enter quantities by size matrix')+'<div class="fields">'+field('qty','Received quantity','1')+field('cost','Unit purchase cost · PKR','')+'</div>'+btn('addLine',editing===null?'Add line':'Update line')+(editing===null?'':btn('cancelLine','Cancel edit'))+'<div class="orba-receive-lines">'+(draft.length?draft.map((x,i)=>'<div class="orba-receive-line"><div><strong>'+esc(options().find(y=>y[0]===x.code)?.[1]||x.code)+'</strong><p class="muted">'+x.quantity+' × '+money(x.cost)+'</p><b>'+money(x.quantity*x.cost)+'</b></div><div class="row"><button type="button" data-edit-line="'+i+'" aria-label="Edit purchase line '+(i+1)+'">Edit</button><button type="button" data-remove-line="'+i+'" aria-label="Remove purchase line '+(i+1)+'">Remove</button></div></div>').join(''):'<p class="muted">No purchase lines yet. Select an exact variant and add its quantity.</p>')+'</div>'+(draft.length?btn('clearLines','Clear draft lines'):'')+'<div class="orba-receive-total"><span>'+draft.length+' variants · '+draft.reduce((n,x)=>n+x.quantity,0)+' units (pairs / pieces)</span><strong>Total '+money(draft.reduce((n,x)=>n+x.quantity*x.cost,0))+'</strong><span id="purchase-balance"></span></div><div class="fields">'+field('supplier','Supplier')+field('invoice','Supplier invoice no.')+field('paid','Paid now · PKR','0')+select('way','Payment method',[['cash','Cash'],['bank','Bank (manual rehearsal)']])+'</div>'+check('tagged','All units already have valid labels')+btn('receive','Receive invoice & create pending labels',true)+(lastReceipt?.labelBatch&&!draft.length?btn('receiptLabels','Open received-stock labels'):'')+'</div>';}
else if(tab==='Supplier payable'){var rows=v21PurchaseRows(),open=rows.filter(r=>v21Due(r)>0);html='<div class="panel"><h3>Supplier balances</h3><strong>Total payable '+money(rows.reduce((a,r)=>a+v21Due(r),0))+'</strong>'+records(rows,r=>r.supplier+' · '+r.invoice+' · total '+money(r.total)+' · due '+money(v21Due(r)))+(open.length?select('invoice','Outstanding invoice',open.map(r=>[r.id,r.supplier+' · '+r.invoice+' · '+money(v21Due(r))]))+'<div class="fields">'+field('amount','Amount · PKR')+field('ref','Payment reference')+select('way','Payment method',[['cash','Cash'],['bank','Bank (manual rehearsal)']])+'</div>'+btn('pay','Record supplier payment',true):'<p class="muted">No outstanding training invoices.</p>')+'</div>';}
else if(tab==='Reservations'){html='<div class="panel"><h3>Hold sellable stock</h3>'+variant()+'<div class="fields">'+field('qty','Quantity','1')+field('ref','Customer / order reference')+'</div>'+btn('reserve','Reserve stock',true)+'<p class="muted">Held stock is removed from available quantity. Release before checkout; no automatic expiry.</p>'+records(st.reservations,r=>r.id+' · '+r.ref+' · '+r.qty+' · '+r.status)+(rs.length?select('held','Open reservation',rs.map(r=>[r.id,r.ref+' · '+r.qty]))+btn('release','Release to sellable stock'):'')+'</div>';}
else if(tab==='Transfers'){html='<div class="panel"><h3>Dispatch from main branch</h3>'+variant()+'<div class="fields">'+field('qty','Quantity','1')+field('dest','Destination branch')+field('ref','Transfer reference')+'</div>'+btn('dispatch','Dispatch stock',true)+'<p class="muted">Received destination stock is tracked separately; this counter cannot sell it.</p>'+records(st.transfers,r=>r.id+' · '+r.dest+' · dispatched '+r.qty+' · received '+r.received+' · returned '+r.cancelled+' · transit '+(r.qty-r.received-r.cancelled))+(ts.length?select('transit','Open transfer',ts.map(r=>[r.id,r.id+' · '+r.dest+' · '+(r.qty-r.received-r.cancelled)+' in transit']))+field('receiveQty','Quantity to reconcile','1')+'<div class="row">'+btn('arrive','Confirm destination receipt')+btn('back','Return remaining to source')+'</div>':'')+'</div>';}
else if(tab==='Stock count'){html='<div class="panel"><h3>Count exact sellable variant</h3>'+variant()+btn('startCount','Read current quantity')+'<strong id="expected">Read expected quantity before counting</strong>'+field('actual','Actual counted quantity','0')+field('reason','Reason / count reference')+btn('count','Post counted adjustment',true)+records(st.counts,r=>r.id+' · '+r.code+' · '+r.before+' → '+r.actual+' · '+r.reason)+'</div>';}
else if(tab==='Quarantine'){var qr=fwQuarantineRows();html='<div class="panel"><h3>Damaged or incomplete stock</h3><p class="muted">Quarantine an entire incomplete pair or damaged piece. It cannot be sold as regular stock. Restore only after inspection.</p>'+variant()+field('qty','Quantity','1')+select('condition','Condition',[['damage','Damaged'],['missing','Missing left/right shoe'],['mismatch','Mismatched pair']])+field('reason','Reason / inspection note')+btn('quarantine','Move to quarantine',true)+records(qr,x=>x.id+' · '+x.code+' · remaining '+x.remaining+' · '+x.reason)+(qr.some(x=>x.remaining>0)?select('qid','Open quarantine record',qr.filter(x=>x.remaining>0).map(x=>[x.id,x.id+' · '+x.code+' · '+x.remaining]))+field('restoreQty','Quantity','1')+field('restoreReason','Inspection / disposal reason')+'<div class="row">'+btn('restore','Restore sellable')+btn('writeoff','Write off damaged')+'</div>':'')+'</div>';}
else if(tab==='Supplier returns'){var pr=v21PurchaseRows().filter(x=>v21Due(x)>0&&x.lines.every(l=>Number.isSafeInteger(l.cost))),opts=pr.flatMap(x=>x.lines.map((l,i)=>[x.id+'|'+i,x.invoice+' · '+l.code+' · '+money(l.cost)]));html='<div class="panel"><h3>Return to supplier</h3><p class="muted">Unpaid invoice credit only. Return available units at their original invoice cost. Paid amounts require a separate verified settlement.</p>'+(opts.length?select('supLine','Original invoice / variant',opts)+field('qty','Quantity','1')+field('ref','Supplier return reference')+btn('supReturn','Record supplier credit',true):'<p>No eligible unpaid invoice lines.</p>')+records(st.supplierReturns||[],r=>r.id+' · '+r.invoice+' · '+r.qty+' · credit '+money(r.amount))+'</div>';}
else if(tab==='Cash shift'){var open=SET.shift.c1==='open';html='<div class="panel"><h3>Counter 1 · '+(open?'Open':'Closed')+'</h3><strong>Expected drawer '+money(fwDrawerMinor())+'</strong>'+(open?field('counted','Counted cash · PKR',(fwDrawerMinor()/100).toFixed(2))+field('reason','Variance reason (required if different)')+btn('closeShift','Close and save counted cash',true):field('opening','Opening counted cash · PKR','0')+btn('openShift','Open new shift',true))+records(SET.fwShiftHistory||[],r=>r.id+' · expected '+money(r.expected)+' · counted '+money(r.counted)+' · variance '+money(r.variance))+'</div>';}
else if(tab==='Cash movements'||tab==='Expenses'){var expense=tab==='Expenses';html='<div class="panel"><h3>'+ (expense?'Record expense':'Cash movement')+'</h3><p class="muted">Manual training settlement. Cash-out requires sufficient funds and an open shift.</p>'+ (expense?select('way','Payment method',[['cash','Cash'],['bank','Bank (manual rehearsal)']]):select('movement','Movement',[['in','Cash in'],['out','Cash out']]))+field('amount','Amount · PKR')+field('ref','Unique reference')+field('reason','Description')+btn('postMovement','Record movement',true)+records(LEDGER.filter(x=>expense?x.src==='exp':x.way==='cash'),x=>x.id+' · '+x.kind+' · '+x.what+' · '+money(Math.round(x.amt*100)))+'</div>';}
else if(tab==='Customers'){html='<div class="panel"><h3>Customer accounts</h3>'+field('name','Customer name')+field('phone','Phone number')+btn('customerAdd','Add customer',true)+records(CUSTOMERS,c=>c.name+' · '+c.phone+' · due '+money(fwCustomerOwed(c.id)))+'</div>';}
else if(tab==='Collections'){var invs=KH_INV.filter(x=>fwInvoiceOwed(x)>0);html='<div class="panel"><h3>Invoice-level collections</h3><strong>Total receivable '+money(invs.reduce((n,i)=>n+fwInvoiceOwed(i),0))+'</strong>'+(invs.length?select('invoice','Original invoice',invs.map(i=>[String(i.no),(custById(i.cust)?.name||'Customer')+' · '+i.no+' · '+money(fwInvoiceOwed(i))]))+field('amount','Collected amount · PKR')+field('ref','Payment reference')+select('way','Payment method',[['cash','Cash'],['bank','Bank (manual rehearsal)']])+btn('collect','Record collection',true):'<p>No outstanding invoices.</p>')+records(KH_INV,i=>i.no+' · due '+money(fwInvoiceOwed(i)))+'</div>';}
else if(tab==='Exchange'){html='<div class="panel"><h3>Linked exchange · Bill '+esc(sale.billNo)+'</h3><div class="ix-steps"><span>1 · Original item</span><span>2 · Replacement</span><span>3 · Review settlement</span></div><p class="muted">Cash-only, non-fiscal training sale. Sellable returns only. A linked return and a new receipt are recorded; no real cash moves.</p>'+select('line','Returned original line',sale.lines.map((l,i)=>[String(i),l.name+' · '+l.variant+' · '+oi6Entitlement(sale,i)+' remaining']).filter(x=>oi6Entitlement(sale,Number(x[0]))>0))+field('qty','Returned quantity','1')+variant()+field('replacementQty','Replacement quantity','1')+field('reason','Exchange reason')+btn('review','Review difference')+'<div id="exchangeReview" class="ix-review" role="status">Review before confirming</div>'+check('ack','I confirm training cash settlement')+'<p id="ix-exchange-hint" role="status" class="muted">Review the difference first.</p>'+btn('exchange','Record exchange',true)+records(st.exchanges.filter(x=>x.original===sale.billNo),x=>x.id+' · replacement '+x.replacement+' · difference '+money(x.difference))+'</div>';}
else if(tab==='Receipt logo'){html='<div class="panel"><h3>Receipt image logo</h3><p class="muted">PNG or JPEG only, converted to a small PNG. Saved logo applies to future receipts; old snapshots are unchanged.</p>'+(SET.rc.logoImage?'<img src="'+esc(SET.rc.logoImage)+'" alt="Saved receipt logo" style="max-width:180px;max-height:100px;object-fit:contain">':'<p>No uploaded logo.</p>')+'<label>Upload logo<input id="logoFile" type="file" accept="image/png,image/jpeg"></label>'+btn('removeLogo','Remove uploaded logo')+'</div>';}
dialog.innerHTML=css+'<div style="padding:18px;display:grid;gap:14px"><div class="row"><div style="flex:1"><p class="muted">ORBA · '+(fwMode()?'FOOTWEAR & BAGS':'V2.1')+' TRAINING</p><h2 id="orba-operation-heading">'+esc(mode==='bill'?'Exchange':mode==='logo'?'Receipt design':mode==='supplier'?'Supplier operations':mode==='cash'?'Cash operations':mode==='khata'?'Customer credit':mode==='expenses'?'Expenses':'Stock operations')+'</h2></div>'+btn('close','Close')+'</div><div class="row orba-operation-tabs" role="tablist" aria-label="Operation tasks">'+sections.map((x,i)=>'<button id="t'+i+'" role="tab" aria-selected="'+(tab===x)+'" style="background:'+(tab===x?'#D0E6FD':'white')+'">'+esc(x)+'</button>').join('')+'</div><p role="status" id="v21-msg" style="min-height:20px;color:#14532D">'+esc(msg)+'</p>'+html+'<p class="muted">Local rehearsal only · no real payments, fiscal submission or hardware dispatch.</p></div>';dialog.setAttribute('aria-labelledby','orba-operation-heading');dialog.querySelectorAll('[data-op]').forEach(b=>b.onclick=()=>{rememberPurchase();tab=b.dataset.op;render();});var vs=dialog.querySelector('#variantSearch'),vv=dialog.querySelector('#vcode');if(vs&&vv){var opts=Array.from(vv.options).map(o=>({value:o.value,text:o.text}));const info=()=>{let el=dialog.querySelector('#variant-info');if(!vv.value){el.textContent=vv.options.length?'Select the exact variant from the matching results.':'No matching variants. Clear or change the search.';return;}try{let x=v21Variant(vv.value);el.textContent=vv.options.length+' matching variants · '+v21Stock(vv.value)+' available '+(x.it.oi5Foot?'pairs':'pieces');}catch(e){el.textContent=e.message;}};vv.onchange=info;vs.oninput=()=>{var q=vs.value.trim().toLowerCase(),old=vv.value;vv.replaceChildren(...opts.filter(o=>o.text.toLowerCase().includes(q)).map(o=>new Option(o.text,o.value)));if(Array.from(vv.options).some(o=>o.value===old))vv.value=old;else if(vv.options.length!==1)vv.selectedIndex=-1;info();};info();}if(tab==='Receive invoice'){for(let [id,value] of Object.entries(purchaseFields)){let e=dialog.querySelector('#'+id);if(e){if(e.type==='checkbox')e.checked=value;else e.value=value;}}const balance=()=>{let e=dialog.querySelector('#purchase-balance');try{let total=draft.reduce((n,x)=>n+x.quantity*x.cost,0),paid=v21Minor(val('paid'));e.textContent=paid>total?'Paid amount exceeds invoice total.':'Payable '+money(total-paid);}catch(_){e.textContent='Enter a valid payment amount.';}};dialog.querySelector('#paid').oninput=balance;balance();dialog.querySelector('#receive').disabled=!draft.length;dialog.querySelectorAll('[data-edit-line]').forEach(b=>b.onclick=()=>{rememberPurchase();editing=Number(b.dataset.editLine);render();let x=draft[editing];dialog.querySelector('#vcode').value=x.code;dialog.querySelector('#qty').value=x.quantity;dialog.querySelector('#cost').value=(x.cost/100).toFixed(2);dialog.querySelector('#vcode').dispatchEvent(new Event('change'));dialog.querySelector('#qty').focus();});dialog.querySelectorAll('[data-remove-line]').forEach(b=>b.onclick=()=>{rememberPurchase();draft.splice(Number(b.dataset.removeLine),1);editing=null;msg='Draft line removed';render();});}var ps=dialog.querySelector('#poolSearch'),pk=dialog.querySelector('#poolKind');if(ps&&pk){var filter=()=>{var q=ps.value.toLowerCase();dialog.querySelectorAll('[data-pool-kind]').forEach(e=>{var show=e.dataset.poolKind===pk.value&&e.textContent.toLowerCase().includes(q);e.style.display=show?'flex':'none';if(e.dataset.poolKind!==pk.value)e.querySelector('input').checked=false;});};ps.oninput=filter;pk.onchange=filter;filter();}bind('close',()=>{close();return false});sections.forEach((t,i)=>bind('t'+i,()=>{rememberPurchase();tab=t;countExpected=null;msg='';render();return false}));bind('create',()=>{var r=v21NewProduct(val('name'),val('sku'),val('cat'),numeric('price'),val('colours'),val('sizes'),role);return r.it.name+' created · '+r.codes.length+' variants';});bind('fwPoolSave',()=>{var kind=val('poolKind'),ids=Array.from(dialog.querySelectorAll('input[data-fw-member]:checked')).map(e=>e.value);fwPoolSave(val('poolName'),kind,ids,numeric('pool2'),numeric('pool3'),checked('poolEnabled'),role);return 'Independent offer pool saved';});bind('fwPoolRemove',()=>{fwPoolRemove(val('removePool'),role);return 'Offer disabled';});bind('offerSave',()=>{var f=oi5Feet().filter(a=>a.st&&checked('f_'+a.id)).map(a=>a.id),g=ITEMS.filter(a=>!a.measured&&checked('g_'+a.id)).map(a=>a.id);v21Offer(checked('enabled'),f,g,numeric('p2'),numeric('p3'),role);return 'Bundle configuration saved';});bind('bulkReceive',()=>{if(editing!==null)throw Error('Finish or cancel your line edit first');rememberPurchase();sfBulk(dialog,draft,val('vcode'),()=>{msg='Bulk quantities added to purchase draft';render();});return false;});bind('addLine',()=>{rememberPurchase();var code=val('vcode');if(!code)throw Error('Choose an exact variant first');v21Variant(code);if(sfArchivedCode(code))throw Error('Restore archived article before receiving');if(draft.some((x,i)=>x.code===code&&i!==editing))throw Error('Variant already in draft. Edit its existing line.');if(editing===null&&draft.length>=100)throw Error('Maximum 100 purchase lines');var row={code,quantity:v21Qty(numeric('qty')),cost:v21Minor(val('cost'))};if(!Number.isSafeInteger(row.quantity*row.cost))throw Error('Line total is too large');if(editing===null)draft.push(row);else draft[editing]=row;editing=null;return 'Purchase draft updated';});bind('cancelLine',()=>{rememberPurchase();editing=null;return 'Edit cancelled'});bind('clearLines',()=>{rememberPurchase();draft=[];editing=null;return 'Draft cleared'});bind('receive',()=>{if(editing!==null)throw Error('Finish or cancel the line edit before receiving');var r=v21Purchase(val('supplier'),val('invoice'),draft,v21Minor(val('paid')),val('way'),checked('tagged'),role);draft=[];editing=null;purchaseFields={};lastReceipt=r;return r.id+' received · payable '+money(v21Due(r))+(r.labelBatch?' · labels '+r.labelBatch:'');});bind('receiptLabels',()=>{let batch=lastReceipt?.labelBatch;dialog.close();setTimeout(()=>v26LabelLink(null,batch),0);return false;});bind('pay',()=>{var r=v21SupplierPay(val('invoice'),v21Minor(val('amount')),val('ref'),val('way'),role);return r.id+' recorded';});bind('quarantine',()=>fwQuarantine(val('vcode'),numeric('qty'),val('condition'),val('reason'),role).id+' held for inspection');bind('restore',()=>fwResolveQuarantine(val('qid'),numeric('restoreQty'),'restore',val('restoreReason'),role).id+' restored');bind('writeoff',()=>fwResolveQuarantine(val('qid'),numeric('restoreQty'),'writeoff',val('restoreReason'),role).id+' written off');bind('supReturn',()=>{var [id,i]=val('supLine').split('|');return fwSupplierReturn(id,Number(i),numeric('qty'),val('ref'),role).id+' credit posted';});bind('openShift',()=>{fwOpenShift(v21Minor(val('opening')),'Owner',role);return 'Shift open';});bind('closeShift',()=>fwCloseShift(v21Minor(val('counted')),val('reason'),role).id+' closed');bind('postMovement',()=>fwMovement(tab==='Expenses'?'out':val('movement'),tab==='Expenses'?val('way'):'cash',v21Minor(val('amount')),val('ref'),val('reason'),tab==='Expenses'?'exp':'cash',role).id+' posted');bind('customerAdd',()=>fwCustomerAdd(val('name'),val('phone'),role).name+' created');bind('collect',()=>fwCollect(val('invoice'),v21Minor(val('amount')),val('ref'),val('way'),role).id+' posted');bind('reserve',()=>v21Reserve(val('vcode'),numeric('qty'),val('ref'),role).id+' held');bind('release',()=>v21Release(val('held'),role).id+' released');bind('dispatch',()=>v21Dispatch(val('vcode'),numeric('qty'),val('dest'),val('ref'),role).id+' dispatched');bind('arrive',()=>v21Transfer(val('transit'),numeric('receiveQty'),'receive',role).id+' receipt recorded');bind('back',()=>v21Transfer(val('transit'),numeric('receiveQty'),'return',role).id+' returned');bind('startCount',()=>{countExpected={code:val('vcode'),qty:v21Stock(val('vcode'))};dialog.querySelector('#expected').textContent='Expected sellable quantity: '+countExpected.qty;return false});bind('count',()=>{if(!countExpected||countExpected.code!==val('vcode'))throw Error('Read expected quantity first');var r=v21Count(val('vcode'),numeric('actual'),countExpected.qty,val('reason'),role);countExpected=null;return r.id+' posted';});var review=null;function exchangeReady(){if(tab!=='Exchange')return;var b=dialog.querySelector('#exchange'),hint=dialog.querySelector('#ix-exchange-hint');if(!b||!hint)return;var reasonOK=val('reason').trim().length>=5,ack=checked('ack');b.disabled=!review||!reasonOK||!ack;hint.textContent=!review?'Review the current difference first.':!reasonOK?'Enter an exchange reason (at least 5 characters).':!ack?'Acknowledge the simulated settlement.':'Ready to record linked exchange.';}if(tab==='Exchange'){var invalidate=()=>{review=null;dialog.querySelector('#ack').checked=false;dialog.querySelector('#exchangeReview').textContent='Selection changed · review again';exchangeReady();};['line','qty','vcode','replacementQty','variantSearch'].forEach(id=>{let el=dialog.querySelector('#'+id);el?.addEventListener('input',invalidate);el?.addEventListener('change',invalidate);});['reason','ack'].forEach(id=>dialog.querySelector('#'+id)?.addEventListener('input',exchangeReady));exchangeReady();}bind('review',()=>{review=null;exchangeReady();var r=oi6ReturnQuote(sale,numeric('line'),numeric('qty')),x=v21Variant(val('vcode')),q=v21Qty(numeric('replacementQty'));if(sfArchivedCode(val('vcode')))throw Error('Restore archived replacement article first');if(avail(x.it,x.ci,x.si)<q)throw Error('Replacement unavailable');var qt=oi5Quote({billNo:nextBillNo(),customerId:sale.customerId,staffId:'ali',lines:[mkLine(x.it.id,x.ci,x.si,q)],discount:null},{fbr:'notRequired'});if(!oi5StockOK(qt)||qt.round||qt.fee||qt.tax)throw Error('Replacement quote not valid');if(qt.total*100-r.amount<0&&fwDrawerMinor()<r.amount-qt.total*100)throw Error('Insufficient drawer cash for exchange difference');dialog.querySelector('#v21-msg').textContent='';dialog.querySelector('#v21-msg').style.color='#14532D';review=JSON.stringify([val('line'),val('qty'),val('vcode'),val('replacementQty'),r,qt]);dialog.querySelector('#exchangeReview').innerHTML='<div><span>Original return credit</span><strong>'+money(r.amount)+'</strong></div><div><span>Replacement total</span><strong>'+money(qt.total*100)+'</strong></div><div class="ix-net"><span>'+(qt.total*100===r.amount?'Even exchange':qt.total*100>r.amount?'Collect from customer':'Refund to customer')+'</span><strong>'+money(Math.abs(qt.total*100-r.amount))+'</strong></div>';dialog.querySelector('#ack').checked=false;exchangeReady();return false});bind('exchange',()=>{var r=oi6ReturnQuote(sale,numeric('line'),numeric('qty')),x=v21Variant(val('vcode')),qt=oi5Quote({billNo:nextBillNo(),customerId:sale.customerId,staffId:'ali',lines:[mkLine(x.it.id,x.ci,x.si,v21Qty(numeric('replacementQty')))],discount:null},{fbr:'notRequired'});if(review!==JSON.stringify([val('line'),val('qty'),val('vcode'),val('replacementQty'),r,qt]))throw Error('Review current difference first');return v21Exchange(sale,numeric('line'),numeric('qty'),val('vcode'),numeric('replacementQty'),val('reason'),role,checked('ack')).id+' recorded';});bind('removeLogo',()=>{delete SET.rc.logoImage;SET.oi6ReceiptVersion=Number(SET.oi6ReceiptVersion||1)+1;return 'Logo removed for future receipts';});var file=dialog.querySelector('#logoFile');if(file)file.onchange=()=>{var f=file.files[0];if(!f)return;if(!['image/png','image/jpeg'].includes(f.type)||f.size>2000000){dialog.querySelector('#v21-msg').textContent='Choose PNG/JPEG under 2 MB';return;}var reader=new FileReader();reader.onload=()=>{var im=new Image();im.onload=()=>{if(!dialog.open)return;var scale=Math.min(1,320/im.width,180/im.height),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(im.width*scale));cv.height=Math.max(1,Math.round(im.height*scale));cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);SET.rc.logoImage=cv.toDataURL('image/png');SET.oi6ReceiptVersion=Number(SET.oi6ReceiptVersion||1)+1;msg='Logo saved for future receipts';render();};im.onerror=()=>dialog.querySelector('#v21-msg').textContent='Invalid image';im.src=reader.result;};reader.readAsDataURL(f);};}render();dialog.showModal();if(easyMatrix&&tab==='Receive invoice')dialog.querySelector('#bulkReceive')?.click();}

/* Dedicated Footwear & Bags training profile; no migration of existing business data. */
var FW_CATS=[{id:'all',label:'All'},{id:'women',label:'Ladies'},{id:'men',label:'Men'},{id:'kids',label:'Kids'},{id:'bags',label:'Bags'},{id:'acc',label:'Shoe care'}];
function fwMode(){return SET.fwProfile?.id==='shoes';}
function fwAllowed(it){return !!it&&(!!it.oi5Foot||!!it.fwProduct);}
function fwRegAllowed(r){return !!r&&(r.scope==='footwear'?oi5Feet().some(a=>a.id===r.id):!!ITEMS.find(a=>a.id===r.id&&a.fwProduct));}
function fwActivate(name,city,samples){if(fwMode())return SET.fwProfile;if(BILLS.some(b=>b.oi5Snapshot)||oi5State().pending||v21State().purchases.length||(__G.__orbaOi2Articles||[]).length)throw Error('Start a fresh training session before selecting a new business.');SET.fwProfile={id:'shoes',name:String(SET.shop?.name||name||'Hamza Fashion').trim()||'Hamza Fashion',city:String(SET.shop?.city||city||''),samples:!!samples,pools:[]};SET.shift={c1:samples?'open':'closed',float:samples?10000:0,by:samples?'Ali':''};SET.fwShiftAnchor=0;SET.fwShiftHistory=[];SET.round=1;SET.oi5Offer={enabled:false,articleIds:[],genericIds:[]};KEEP['Inventory|shoes']={data:samples?OI3_FOOT_FIXTURES.map(oi6Clone):[]};if(samples){var bag=v21NewProduct('Imported shoulder bag','BAG-100','bags',2400,'Black,Tan','','owner');bag.codes.forEach((code,i)=>v21Move(code,i?4:6));var care=v21NewProduct('Shoe brush','CARE-100','acc',450,'','','owner');v21Move(care.codes[0],10);}return SET.fwProfile;}
function fwSellItems(){oi3Seed();return ITEMS.filter(fwAllowed).concat(Object.values(oi3State().byCode).filter(r=>r.scope==='footwear'&&fwRegAllowed(r)).map(oi5FootItem).filter(Boolean));}
function fwBagQty(){return ITEMS.filter(i=>i.fwProduct&&i.cat==='bags').reduce((n,i)=>n+totalStock(i),0);}
function fwBill(b){return b.oi5Snapshot?.businessProfile==='shoes';}
function fwPanel(p){return ['home','reports','suppliers','cash','khata','orders','chats','couriers','expenses','staff','printer','addstock'].includes(p);}
function fwPanelTitle(p){return ({home:SET.shop.name,reports:'Footwear & bags report',suppliers:'Supplier invoices & payables',cash:'Cash and payment reconciliation',khata:'Customer credit',orders:'Orders',chats:'WhatsApp',couriers:'Couriers',expenses:'Expenses',staff:'Team & permissions',printer:'Printer setup',addstock:'Receive stock'})[p]||'';}
function fwPanelNote(p){if(['orders','chats','couriers','staff'].includes(p))return 'Original design is retained in the board catalogue. This business-specific operational integration is not verified; no live action is available here.';if(p==='khata')return 'Customer accounts and invoice collections use the same training ledger as Sell. Unpaid Khata credit supported; paid return settlement remains restricted.';if(p==='printer')return 'Configure independent printers in Settings. Diagnostic hardware verification is separate.';if(p==='addstock')return 'Receive exact shoe size/colour or bag variant using Stock operations.';if(p==='suppliers')return 'Receive one supplier invoice for multiple exact variants, then reconcile outstanding balance.';return 'Only transactions and stock from this business profile are counted. Local training data; no live sync.';}
function fwPanelCards(p,role){if(!fwMode()||!['home','reports','cash','khata','suppliers'].includes(p))return [];var b=BILLS.filter(fwBill),ss=b.map(x=>x.oi5Snapshot),r=ss.flatMap(oi6Returns),net=ss.reduce((a,x)=>a+x.total*100,0)-r.reduce((a,x)=>a+x.amount,0),pay=v21PurchaseRows().reduce((a,x)=>a+v21Due(x),0),cash=ss.reduce((a,x)=>a+x.parts.filter(y=>y.method==='Cash').reduce((n,y)=>n+y.amount*100,0),0)-r.reduce((a,x)=>a+x.parts.filter(y=>y.method==='Cash').reduce((n,y)=>n+y.amount,0),0);if(p==='suppliers')return [{label:'Open payable',value:'Rs '+oi6Money(pay)},{label:'Invoices',value:String(v21PurchaseRows().length)}];if(p==='cash')return [{label:'Shift status',value:SET.shift.c1==='open'?'Open':'Closed'},{label:'Recorded drawer (training)',value:'Rs '+oi6Money(Math.round(drawerCash()*100))},{label:'Net sales cash (before expenses)',value:'Rs '+oi6Money(cash)},{label:'Posted refunds',value:'Rs '+oi6Money(r.reduce((n,x)=>n+x.amount,0))}];if(p==='khata')return [{label:'Outstanding receivable',value:'Rs '+oi6Money(KH_INV.reduce((n,i)=>n+fwInvoiceOwed(i),0))},{label:'New credit sales',value:String(ss.filter(x=>x.parts.some(y=>y.method==='Khata')).length)}];var pairs=oi5Feet().filter(x=>x.st).reduce((n,x)=>n+Object.values(x.st).flat().reduce((a,q)=>a+q,0),0);var a=[{label:'Available shoe pairs',value:String(pairs)},{label:'Available bag pieces',value:String(fwBagQty())},{label:'Bills in this session',value:String(b.length)}];if(role==='owner')a.push({label:'Net bill value',value:'Rs '+oi6Money(net)});return a;}
function fwPanelActions(p,role,self){if(!fwMode())return [];var a=[];if(p==='home'||p==='reports'||p==='addstock'){a.push({label:'Open stock',run:()=>self.go('stock')});if(role==='owner')a.push({label:'Stock operations',run:()=>v21UI('owner','stock',()=>self.setState({q:''}))});}if(['cash','khata','expenses'].includes(p)&&role==='owner')a.push({label:p==='cash'?'Manage cash shift':p==='khata'?'Manage customers & collections':'Record expenses',run:()=>v21UI('owner',p,()=>self.setState({q:''}))});if(p==='suppliers'&&role==='owner')a.push({label:'Receive & pay',run:()=>v21UI('owner','supplier',()=>self.setState({q:''}))});if(['home','reports','cash','khata'].includes(p)&&role!=='inventory')a.push({label:'Bill Book',run:()=>self.go('bills')});if(p==='printer'&&role==='owner')a.push({label:'Printer settings',run:()=>self.setState({page:'settings',setSec:'printer'})});return a;}
function fwBagUI(role,refresh){var old=document.getElementById('fw-bag-dialog');if(old)old.remove();var x=document.createElement('dialog');x.id='fw-bag-dialog';x.style.cssText='width:min(680px,calc(100vw - 24px));max-height:90vh;border:1px solid #D9CFC0;border-radius:18px;background:#F1E4D1;color:#162660;padding:18px;font:15px Outfit,Segoe UI,sans-serif';var rows=ITEMS.filter(i=>i.fwProduct);x.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><h2 style="margin:0">Bags &amp; pieces</h2><button id="fwBagClose">Close</button></div><p>Bag colours and optional dimensions are separate variants. All quantities are pieces, not pairs.</p><div style="display:grid;gap:8px">'+(rows.length?rows.map(i=>'<div style="background:white;border-radius:12px;padding:12px"><strong>'+oi3Esc(i.name)+'</strong><div>'+oi3Esc(i.sku)+' · Rs '+i.price+'</div>'+ (i.colours||[null]).flatMap((c,ci)=>(i.sizes||[null]).map((z,si)=>'<div style="display:flex;justify-content:space-between;gap:8px;margin-top:6px"><span>'+oi3Esc([c,z].filter(Boolean).join(' · ')||'One size')+'</span><strong>'+avail(i,ci,si)+' pcs</strong></div>')).join('')+'</div>').join(''):'<p>No bags or shoe-care items yet.</p>')+'</div>'+(role==='owner'?'<button id="fwBagManage" style="margin-top:12px;background:#162660;color:white;border:0;border-radius:10px;padding:12px;font-weight:700">Add or receive bags</button>':'');document.body.appendChild(x);x.querySelector('#fwBagClose').onclick=()=>x.close();x.addEventListener('close',()=>{x.remove();if(refresh)refresh();});if(role==='owner')x.querySelector('#fwBagManage').onclick=()=>{x.close();v21UI('owner','stock',refresh);};x.showModal();}
function fwPoolMembers(kind){oi3Seed();var parents=kind==='pairs'?oi5Feet().filter(a=>a.st).map(a=>({id:'f:'+a.id,name:a.name+' · '+a.no+' · All variants'})):ITEMS.filter(a=>a.fwProduct&&a.cat==='bags').map(a=>({id:'g:'+a.id,name:a.name+' · '+a.sku+' · All variants'}));return parents.concat(Object.values(oi3State().byCode).filter(r=>fwRegAllowed(r)&&(kind==='pairs'?r.scope==='footwear'&&oi5Feet().some(a=>a.id===r.id&&a.st):r.scope==='generic'&&ITEMS.some(a=>a.id===r.id&&a.cat==='bags'))).map(r=>({id:'v:'+r.code,name:r.name+' · '+[r.colour,r.size].filter(Boolean).join(' / ')+' · '+r.code})));}
function fwPoolSave(name,kind,ids,p2,p3,enabled,role){v21Owner(role);if(!fwMode()||oi5State().pending)throw Error('Resolve pending checkout first');name=v21Text(name,'offer name');if(!['pairs','bags'].includes(kind)||!Number.isSafeInteger(p2)||!Number.isSafeInteger(p3)||p2<=0||p3<=0||p2>9999999||p3>9999999||!ids.length||ids.some(id=>!fwPoolMembers(kind).some(x=>x.id===id)))throw Error('Choose valid products in one unit type and valid prices');var ps=SET.fwProfile.pools,key=name.toLowerCase();if(enabled&&ps.some(p=>p.key!==key&&p.enabled&&fwPoolOverlap(p.ids,ids)))throw Error('Product already belongs to an active offer pool');var p={key,name,kind,ids:[...new Set(ids)],p2,p3,enabled:!!enabled};SET.fwProfile.pools=ps.filter(x=>x.key!==key).concat(p);return p;}
function fwPoolRemove(key,role){v21Owner(role);if(oi5State().pending)throw Error('Resolve pending checkout first');var p=SET.fwProfile.pools.find(x=>x.key===key);if(!p)throw Error('Select an existing pool');p.enabled=false;}
function fwPoolForm(st,field,select,btn,check,records,esc){var ps=SET.fwProfile.pools;return '<div class="panel"><h3>Independent clearance pools</h3><p class="muted">Choose only shoe pairs or only bag pieces per pool. Saving the same name updates that pool. No product may belong to two active offers.</p>'+field('poolName','Offer name','Footwear clearance')+select('poolKind','Unit type',[['pairs','Shoe pairs'],['bags','Bag pieces']])+field('pool2','Any 2 · PKR','2500')+field('pool3','Any 3 · PKR','3500')+check('poolEnabled','Enable offer',true)+field('poolSearch','Search eligible articles')+'<div class="list">'+['pairs','bags'].map(k=>fwPoolMembers(k).map(x=>'<label class="check" data-pool-kind="'+k+'"><input type="checkbox" data-fw-member="true" value="'+esc(x.id)+'">'+esc(x.name)+'</label>').join('')).join('')+'</div>'+btn('fwPoolSave','Save independent offer',true)+'</div>'+records(ps,x=>x.name+' · '+x.kind+' · 2 / '+x.p2+' · 3 / '+x.p3+' · '+(x.enabled?'Active':'Disabled'))+(ps.length?'<div class="panel">'+select('removePool','Existing pool',ps.map(x=>[x.key,x.name]))+btn('fwPoolRemove','Disable selected offer')+'</div>':'');}
var fwBundlePrev=oi5Bundle;oi5Bundle=function(lines,discount){if(!fwMode())return fwBundlePrev(lines,discount);if(discount||lines.some(l=>l.disc))return {saving:0,groups:[]};var saving=0,groups=[];for(var p of SET.fwProfile.pools.filter(x=>x.enabled)){var eligible=[];lines.forEach(l=>{var it=findItem(l.id),id=it?.oi5Foot?'f:'+it.oi5Article:'g:'+it?.id;if((p.ids.includes(id)||p.ids.includes('v:'+(it?.oi5Foot?it.oi5Code:it?oi3Generic(it,l.ci??0,l.si??0).code:'')))&&Number.isSafeInteger(l.qty)&&l.qty>0&&l.qty<=1000&&Number.isSafeInteger(l.price))for(var j=0;j<l.qty;j++)eligible.push({key:l.key,price:l.price});});eligible.sort((a,b)=>b.price-a.price||a.key.localeCompare(b.key));var dp=[{cost:0,groups:[]}];for(var i=1;i<=eligible.length;i++){var best={cost:dp[i-1].cost+eligible[i-1].price,groups:dp[i-1].groups};for(var [q,price] of [[2,p.p2],[3,p.p3]])if(i>=q&&dp[i-q].cost+price<best.cost)best={cost:dp[i-q].cost+price,groups:dp[i-q].groups.concat([{keys:eligible.slice(i-q,i).map(x=>x.key),price}])};dp.push(best);}saving+=eligible.reduce((n,x)=>n+x.price,0)-dp.at(-1).cost;groups.push(...dp.at(-1).groups);}return {saving,groups};};
__G.__orbaQuickMode=true;__G.__orbaFwDirect=true;__G.__orbaReview=true;__G.__orbaWorkingPages=true;
if(!fwMode())fwActivate('Stride Footwear','',true);

function fwArticleTiles(q){var s=String(q||'').toLowerCase(),all=fwSellItems().filter(i=>!sfArchivedItem(i)),out=all.filter(i=>!i.oi5Foot&&(!s||[i.name,i.sku].some(x=>String(x).toLowerCase().includes(s)))),map=new Map();for(var i of all.filter(x=>x.oi5Foot)){if(s&&![i.name,i.oi5No,i.oi5Code,i.oi5Colour+' '+i.oi5Size].some(x=>String(x).toLowerCase().includes(s)))continue;if(!map.has(i.oi5Article)){var a=oi5Feet().find(x=>x.id===i.oi5Article);map.set(i.oi5Article,{...i,fwGroup:a.id,sku:a.no,stock:0,colours:a.st?Object.keys(a.st):undefined,sizes:a.sizes});}}return out.concat([...map.values()]);}
function fwGroupStock(i){var a=oi5Feet().find(x=>x.id===i.fwGroup),v=a?.st?Object.values(a.st).flat().reduce((n,x)=>n+x,0):a?.qty||0;return {text:v+' '+(a?.st?'pairs':'pcs'),dot:v?'#2F9E63':'#B42318',fg:v?'#5B6585':'#B42318'};}
function fwPickArticle(id,register){if(sfMeta('footwear:'+id).archived){register.showToast('warn','Article archived · restore in Stock');return;}var a=oi5Feet().find(x=>x.id===id);if(!a)return;oi3Seed();if(!a.st){var r=Object.values(oi3State().byCode).find(x=>x.scope==='footwear'&&x.id===id);register.addItem(oi5FootItem(r),0,0,1);return;}var x=document.createElement('dialog');x.id='fw-variant-dialog';x.style.cssText='width:min(720px,calc(100vw - 24px));max-height:90vh;overflow:auto;border:1px solid #D9CFC0;border-radius:20px;background:#F1E4D1;color:#162660;padding:20px;font:15px Outfit,Segoe UI,sans-serif';var e=oi3Esc;var html='<div style="display:flex;justify-content:space-between;gap:12px"><h2 style="margin:0">'+e(a.name)+'</h2><button id="fw-variant-close" style="border:1px solid #D9CFC0;border-radius:10px;background:white;padding:10px">Close</button></div><p>'+e(a.no)+' · '+e(a.sizeSystem||'EU')+' · Rs '+(a.salePrice||a.price)+' / pair</p><p>Choose exact colour and size. Scanner can add directly.</p>';for(var c of Object.keys(a.st)){html+='<div style="padding:12px;background:white;border-radius:12px;margin:10px 0"><strong>'+e(c)+'</strong><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">';for(var j=0;j<a.sizes.length;j++){var z=a.sizes[j],r=oi3Foot(a,c,z),q=a.st[c][j],it=oi5FootItem(r),held=register.state.lines.filter(l=>l.id===it.id).reduce((n,l)=>n+l.qty,0);html+='<button data-fw-code="'+e(r.code)+'" '+(q<=held?'disabled':'')+' style="min-width:72px;min-height:56px;border:1px solid #D9CFC0;border-radius:10px;color:#162660;background:'+(q<=held?'#FDF0EF':'#EEF5FE')+';font-weight:700"><span>'+e(z)+'</span><br><small style="font-weight:400">'+Math.max(0,q-held)+' left</small></button>';}html+='</div></div>';}x.innerHTML=html;document.body.appendChild(x);x.addEventListener('close',()=>x.remove());x.querySelector('#fw-variant-close').onclick=()=>x.close();x.querySelectorAll('[data-fw-code]').forEach(b=>b.onclick=()=>{var h=oi5Resolve(b.dataset.fwCode);if(h.length===1){register.addItem(h[0].it,h[0].ci,h[0].si,1);x.close();}});x.showModal();}

/* Preserve each clearance pool's charged amount in the immutable line snapshot. Partial quantities within one identical variant use cumulative line-average rounding. */
function fwReceiptNet(s){var w=s.lines.map(l=>lineTotal(l)*100),total=s.goods*100;if(s.businessProfile!=='shoes'||!s.bundle?.groups?.length)return oi6Allocate(total,w);var net=w.slice(),used=s.lines.map(()=>0),index=new Map(s.lines.map((l,i)=>[l.key,i]));if(index.size!==s.lines.length)throw Error('Duplicate sale line identity');for(var g of s.bundle.groups){var ids=g.keys.map(k=>{if(!index.has(k))throw Error('Unknown bundle line');var i=index.get(k);if(++used[i]>s.lines[i].qty)throw Error('Bundle quantity exceeds sale');return i;}),gross=ids.map(i=>s.lines[i].price*100),alloc=oi6Allocate(g.price*100,gross);ids.forEach((i,j)=>net[i]+=alloc[j]-gross[j]);}if(net.some(n=>!Number.isSafeInteger(n)||n<0)||net.reduce((a,b)=>a+b,0)!==total)throw Error('Bundle receipt allocation mismatch');return net;}

/* V2.3 shared guard helpers: training-only, fail closed. */
function fwCashMovement(){var n=0;for(var b of BILLS.filter(fwBill))n+=Math.round(billCash(b)*100);for(var x of LEDGER)if(x.way==='cash'&&(x.kind==='in'||x.kind==='out'))n+=(x.kind==='in'?1:-1)*(Number.isSafeInteger(x.minor)?x.minor:Math.round(x.amt*100));if(!Number.isSafeInteger(n))throw Error('Invalid cash balance');return n;}
function fwDrawerMinor(){if(!fwMode())return Math.round(drawerCash()*100);var n=Math.round(SET.shift.float*100)+fwCashMovement()-(SET.fwShiftAnchor||0);if(!Number.isSafeInteger(n))throw Error('Invalid cash balance');return n;}
function fwCashError(amount){if(!Number.isSafeInteger(amount)||amount<0)return 'Invalid cash amount';if(SET.shift.c1!=='open')return 'Open a shift before recording cash movement';if(fwDrawerMinor()<amount)return 'Insufficient drawer cash; no money or stock has been posted';return '';}
function fwCashCheck(amount){var error=fwCashError(amount);if(error)throw Error(error);}
function fwNamespaceTaken(value){var s=String(value).trim().toUpperCase(),rs=oi3State();if(!s)return false;return Object.values(rs.byCode).some(r=>String(r.code).toUpperCase()===s||String(r.alias).toUpperCase()===s)||ITEMS.some(it=>String(it.sku).toUpperCase()===s||String(it.code||'').toUpperCase()===s)||oi5Feet().some(a=>String(a.no).toUpperCase()===s);}

function fwPoolOverlap(a,b){function expand(xs){var set=new Set(xs);for(var r of Object.values(oi3State().byCode)){if(xs.includes((r.scope==='footwear'?'f:':'g:')+r.id))set.add('v:'+r.code);}return set;}var x=expand(a),y=expand(b);return [...x].some(k=>y.has(k));}

function fwOpenShift(amount,by,role){v21Owner(role);if(!fwMode()||SET.shift.c1==='open'||oi5State().pending||!Number.isSafeInteger(amount)||amount<0)throw Error('Close current shift and resolve checkout before opening');SET.fwShiftAnchor=fwCashMovement();SET.shift={c1:'open',float:amount/100,by:v21Text(by,'operator')};return SET.shift;}
function fwCloseShift(counted,reason,role){v21Owner(role);if(!fwMode()||SET.shift.c1!=='open'||oi5State().pending||!Number.isSafeInteger(counted)||counted<0)throw Error('Open shift and valid count required; resolve checkout first');var expected=fwDrawerMinor(),variance=counted-expected;if(variance)reason=v21Text(reason,'variance reason');var h=SET.fwShiftHistory||(SET.fwShiftHistory=[]),r={id:'SHIFT-'+(h.length+1),opening:Math.round(SET.shift.float*100),expected,counted,variance,reason:String(reason||''),at:new Date().toISOString()};h.push(r);SET.shift.c1='closed';return r;}
function fwMovement(kind,way,amount,ref,reason,src,role){v21Owner(role);ref=v21Text(ref,'reference');reason=v21Text(reason,'description');if(!fwMode()||!['in','out'].includes(kind)||!['cash','bank'].includes(way)||!['exp','cash'].includes(src)||src==='exp'&&kind!=='out'||!Number.isSafeInteger(amount)||amount<=0||LEDGER.some(x=>String(x.ref||'').toLowerCase()===ref.toLowerCase()))throw Error('Invalid or duplicate movement');if(way==='cash')fwCashCheck(kind==='out'?amount:0);return ledgerAdd({id:v21Id('CM'),kind,way,minor:amount,amt:amount/100,ref,what:reason,src,training:true});}
function fwInvoiceOwed(i){return Math.max(0,Math.round(invTotal(i)*100)-i.col.reduce((n,x)=>n+Math.round(x.amt*100),0)-i.ret.reduce((n,x)=>n+Math.round(x.amt*100),0));}
function fwCustomerOwed(id){return KH_INV.filter(i=>i.cust===id).reduce((n,i)=>n+fwInvoiceOwed(i),0);}
function fwCustomerAdd(name,phone,role){v21Owner(role);name=v21Text(name,'customer name');phone=String(phone||'').replace(/[\s()-]/g,'');if(!/^\+?[0-9]{7,15}$/.test(phone)||CUSTOMERS.some(c=>String(c.phone).replace(/[\s()-]/g,'')===phone))throw Error('Enter a valid unique phone number');var c={id:v21Id('CU'),name,phone,last:'New'};Object.defineProperty(c,'khata',{configurable:true,enumerable:true,get:()=>fwCustomerOwed(c.id)/100});CUSTOMERS.push(c);return c;}
function fwCollect(no,amount,ref,way,role){v21Owner(role);var i=KH_INV.find(x=>String(x.no)===String(no));ref=v21Text(ref,'collection reference');if(!fwMode()||!i||!Number.isSafeInteger(amount)||amount<=0||amount>fwInvoiceOwed(i)||!['cash','bank'].includes(way)||LEDGER.some(x=>String(x.ref||'').toLowerCase()===ref.toLowerCase()))throw Error('Invalid collection, duplicate reference or amount exceeds receivable');if(way==='cash')fwCashCheck(0);var r=ledgerAdd({id:v21Id('KC'),kind:'in',src:'khata',way,minor:amount,amt:amount/100,ref,what:'Collection · Bill '+i.no,training:true});i.col.push({id:r.id,amt:amount/100,d:Number(new Date().toISOString().slice(0,10).replaceAll('-','')),by:'Owner'});return r;}
function fwQuarantineRows(){var s=v21State(),base=(s.quarantine||[]).map(x=>({...x}));for(var b of BILLS.filter(fwBill)){var sale=b.oi5Snapshot;for(var r of oi6Returns(sale).filter(x=>x.disposition==='quarantine')){var l=sale.lines[r.line],it=findItem(l.id);if(it){var code=it.oi5Foot?it.oi5Code:oi3Generic(it,l.ci??0,l.si??0).code;base.push({id:r.id,code,qty:r.qty,reason:r.reason});}}}return base.map(x=>({...x,remaining:x.qty-(s.quarantineActions||[]).filter(a=>a.source===x.id).reduce((n,a)=>n+a.qty,0)}));}
function fwQuarantine(code,qty,condition,reason,role){v21Owner(role);qty=v21Qty(qty);reason=v21Text(reason,'condition note');var x=v21Variant(code);if(!['damage','missing','mismatch'].includes(condition)||(!x.it.oi5Foot&&condition!=='damage'))throw Error('Choose a valid condition for the unit type');v21Move(x.code,-qty);var r={id:v21Id('Q'),code:x.code,qty,condition,reason};(v21State().quarantine||(v21State().quarantine=[])).push(r);return r;}
function fwResolveQuarantine(id,qty,action,reason,role){v21Owner(role);qty=v21Qty(qty);reason=v21Text(reason,'inspection or disposal reason');var r=fwQuarantineRows().find(x=>x.id===id);if(!r||qty>r.remaining||!['restore','writeoff'].includes(action))throw Error('Quantity exceeds quarantined balance');if(action==='restore')v21Move(r.code,qty);var x={id:v21Id('QA'),source:id,qty,action,reason};(v21State().quarantineActions||(v21State().quarantineActions=[])).push(x);return x;}
function fwSupplierReturn(id,index,qty,ref,role){v21Owner(role);qty=v21Qty(qty);ref=v21Text(ref,'supplier return reference');var r=v21PurchaseRows().find(x=>x.id===id),line=r?.lines[index],s=v21State(),prior=s.supplierReturns||[];if(!line||!Number.isSafeInteger(line.cost)||prior.some(x=>x.ref.toLowerCase()===ref.toLowerCase())||qty>line.quantity-prior.filter(x=>x.invoice===id&&x.index===index).reduce((n,x)=>n+x.qty,0))throw Error('Invalid or duplicate supplier return');var amount=qty*line.cost;if(!Number.isSafeInteger(amount)||amount>v21Due(r))throw Error('Credit exceeds unpaid invoice; paid settlement requires review');v21Move(line.code,-qty);var row={id:v21Id('SR'),invoice:id,index,qty,amount,code:line.code,ref};(s.supplierReturns||(s.supplierReturns=[])).push(row);return row;}

if(__G.__orbaWorkingPages && fwMode() && !SET.fwWorkingInitialized){ SET.fwWorkingInitialized=true; SET.pr.label=true; SET.pr.labelSize="38.1"; SET.pr.paper=80; SET.pr.auto=true; SET.pr.oi1=Object.assign({},SET.pr.oi1,{dpi:203}); SET.fwProfile.owner="Hamza Sheikh"; }


function orbaBillDocument(s,media,copy,copies){
 var html=oi6Document(s,media,copy),thermal=media===58||media===80;
 html=html.replace('Thermal page length is a 297 mm preview preset; verify roll driver before use.', 'Select the receipt printer (not the barcode printer). Verify the driver paper width and preview before printing. '+(copies===2?'Profile requests 2 copies; select 2 copies in the print dialog.':'Select 1 copy unless you need an additional copy.'));
 if(thermal){
   html=html.replace('</head>','<style id="orba-thermal-page">@page{size:'+media+'mm 297mm;margin:3mm}.orba-measuring main{padding:0!important;margin:0!important;width:'+(media-8)+'mm!important;max-width:'+(media-8)+'mm!important}@media print{main{margin:0 auto!important}}</style></head>');
   html=html.replace('</body>','<script>function orbaFitReceipt(){var m=document.querySelector("main");if(!m)return;document.body.classList.add("orba-measuring");var px=m.getBoundingClientRect().height;document.body.classList.remove("orba-measuring");var mm=Math.ceil(px*25.4/96+10);if(mm>=30&&mm<=1000)document.getElementById("orba-thermal-page").textContent="@page{size:'+media+'mm "+mm+"mm;margin:3mm}";}window.addEventListener("beforeprint",orbaFitReceipt);window.addEventListener("load",orbaFitReceipt);</scr'+'ipt></body>');
 }
 return html;
}
function orbaQuickState(){return __G.__orbaQuick||(__G.__orbaQuick={last:null,active:null,attempts:Object.create(null),draft:false});}
function orbaQuickFocus(){setTimeout(()=>{try{window.focus();document.getElementById('pos-search')?.focus({preventScroll:true});}catch(e){}},50);}
function orbaOpenPrintDocument(html, kind, onEnd, autoClose) {
  var qs = orbaQuickState();
  if (typeof document === "undefined") {
    if (onEnd) onEnd("closed");
    return { closed: true, close: function () {} };
  }
  var existing = document.getElementById("zyro-print-dialog") as HTMLDialogElement | null;
  if (existing) {
    try { existing.close(); } catch (_) {}
    existing.remove();
  }
  var dlg = document.createElement("dialog");
  dlg.id = "zyro-print-dialog";
  dlg.setAttribute("aria-labelledby", "zyro-print-title");
  var isLabel = kind === "label";
  var title = isLabel ? "Label sheet preview" : "Receipt document preview";
  var sub = isLabel
    ? "Browser simulation preview · Print via browser dialog or download the prepared HTML file."
    : "Browser simulation preview · No local printer service connected. Print or download the HTML receipt.";
  dlg.innerHTML =
    "<div class=\"zyro-print-head\"><div><h2 id=\"zyro-print-title\">" + title + "</h2><p>" + sub + "</p></div>" +
    "<button type=\"button\" id=\"zyro-print-x\" aria-label=\"Close preview\" style=\"min-width:44px;min-height:44px;border:1px solid #D9CFC0;border-radius:999px;background:#fff;font-weight:700\">✕</button></div>" +
    "<iframe title=\"" + title + "\" sandbox=\"allow-modals allow-same-origin\"></iframe>" +
    "<div class=\"zyro-print-foot\">" +
    "<button type=\"button\" id=\"zyro-print-dl\">Download HTML</button>" +
    "<button type=\"button\" id=\"zyro-print-now\" data-primary=\"true\">Print now</button>" +
    "<button type=\"button\" id=\"zyro-print-done\">Done</button>" +
    "</div>";
  document.body.appendChild(dlg);
  var frame = dlg.querySelector("iframe") as HTMLIFrameElement;
  frame.srcdoc = html;
  var finished = false;
  var handle: any = {
    closed: false,
    close: function () {
      if (handle.closed) return;
      handle.closed = true;
      try { dlg.close(); } catch (_) {}
      dlg.remove();
      finish("closed");
    }
  };
  function finish(reason: string) {
    if (finished) return;
    finished = true;
    handle.closed = true;
    if (qs.active === handle) qs.active = null;
    try { if (onEnd) onEnd(reason); } finally { orbaQuickFocus(); }
  }
  qs.active = handle;
  dlg.addEventListener("close", function () {
    handle.closed = true;
    dlg.remove();
    finish("closed");
  });
  (dlg.querySelector("#zyro-print-x") as HTMLButtonElement).onclick = function () { handle.close(); };
  (dlg.querySelector("#zyro-print-done") as HTMLButtonElement).onclick = function () { handle.close(); };
  (dlg.querySelector("#zyro-print-dl") as HTMLButtonElement).onclick = function () {
    var url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    var a = document.createElement("a");
    a.href = url;
    a.download = isLabel ? "zyro-labels.html" : "zyro-receipt.html";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };
  (dlg.querySelector("#zyro-print-now") as HTMLButtonElement).onclick = function () {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } catch (_) {}
  };
  try {
    dlg.showModal();
  } catch (_) {
    dlg.setAttribute("open", "");
  }
  return handle;
}
function orbaQuickPrint(s,auto,notify){
 if(__G.__orbaOI4Token)return v26ReceiptRoute(s,auto,orbaAttemptRows().some(x=>x.saleId===s.oi5Id&&x.status!=='blocked'),auto?'Automatic checkout':'Register print',notify);
 var qs=orbaQuickState(),j=oi5Receipt(s),entry=qs.attempts[s.oi5Id]||(qs.attempts[s.oi5Id]={autoTried:false,requests:0,status:'Receipt ready'});
 if(auto){if(entry.autoTried)return entry.status;entry.autoTried=true;}
 if(SET.pr.oi1?.receipt===null){entry.status='Receipt printer unassigned · assign or download bill';if(!orbaAttemptLatest(s))j.state='blocked';var r=orbaAttemptStart(s,Number(SET.pr.paper)||j.media,'Register print',false);r.status='blocked';r.detail=entry.status;return entry.status;}
 try{var copy=entry.requests>0||orbaAttemptRows().some(x=>x.saleId===s.oi5Id&&x.status!=='blocked');var width=auto?j.media:([58,80].includes(Number(SET.pr.paper))?Number(SET.pr.paper):j.media);var html=orbaBillDocument(s,width,copy,j.copies);var row;orbaOpenPrintDocument(html,'receipt',(reason)=>{orbaAttemptEnd(row,j,entry,reason);if(notify)notify();},true);row=orbaAttemptStart(s,width,auto?'Automatic checkout':'Register print',copy);entry.requests++;entry.status='Print requested · select bill printer';j.state='requested';oi6State().exports.push({id:'RX-'+(++oi6State().seq),sale:s.oi5Id,media:width,reason:copy?'Cashier requested copy':auto?'Automatic receipt':'Cashier requested original',status:'print_view_opened',purpose:'receipt',at:new Date().toISOString()});}
 catch(e){entry.status=e.message;/* Preserve an earlier unresolved output when another request is blocked. */if(!orbaAttemptLatest(s)){j.state='blocked';}var row=orbaAttemptStart(s,Number(SET.pr.paper)||j.media,'Register print',false);row.status='blocked';row.detail=e.message;}
 return entry.status;
}
function orbaAttemptRows(){var q=orbaQuickState();return q.printLog||(q.printLog=[]);}
function orbaAttemptStart(s,width,source,copy){var a=orbaAttemptRows(),row={id:'PRINT-'+(a.length+1),saleId:s.oi5Id,bill:s.billNo,media:width,source:source,copy:!!copy,status:'requested',at:new Date().toISOString()};a.push(row);return row;}
function orbaAttemptLatest(s){return orbaAttemptRows().filter(x=>x.saleId===s.oi5Id&&x.status!=='blocked').slice(-1)[0];}
function orbaAttemptEnd(row,j,entry,reason){if(row){row.status='unknown';row.end=reason;row.closedAt=new Date().toISOString();}entry.status=reason==='window_closed'?'Print window closed · paper output unconfirmed':'Print dialog closed · paper output unconfirmed';j.state='unknown';}
function orbaConfirmPaper(s,out){if(__G.__orbaOI4Token)throw Error('Inspect and reconcile the Windows job in Printers.');var a=orbaAttemptLatest(s),j=oi5Receipt(s),q=orbaQuickState();if(!a||a.status!=='unknown'||q.active&&!q.active.closed||!['printed','not_printed'].includes(out))throw Error('Close the print window and inspect the actual paper first.');a.status=out==='printed'?'operator_printed':'operator_not_printed';a.reconciledAt=new Date().toISOString();j.state=a.status;var e=q.attempts[s.oi5Id];if(e)e.status=out==='printed'?'Paper confirmed by operator':'Operator reports no output · manual retry available';return a;}
function orbaQuickLast(s){var q=orbaQuickState();q.last=s;return q;}
function orbaBillOutput(s,mode,copy,reason,media){
 if(!s?.oi5||!s.oi6Receipt)throw Error('Saved bill snapshot unavailable. Open the original bill in Bill Book.');
 if(copy&&!String(reason||'').trim())throw Error('Enter a copy reason first.');
 var j=oi5Receipt(s),width=media??j.media;if(![58,80,'A4'].includes(width))throw Error('Invalid receipt media.');
 var html=orbaBillDocument(s,width,copy,j.copies),a=oi6State(),result='';
 if(mode==='print'&&__G.__orbaOI4Token){return v26ReceiptRoute(s,false,copy,'Bill Book copy');}
 if(mode==='print'){
   var q=orbaQuickState(),entry=q.attempts[s.oi5Id]||(q.attempts[s.oi5Id]={autoTried:false,requests:0,status:'Receipt ready'}),row;try{if(SET.pr.oi1?.receipt===null)throw Error('Receipt printer unassigned · assign or download bill');orbaOpenPrintDocument(html,'receipt',(reason)=>orbaAttemptEnd(row,j,entry,reason),true);row=orbaAttemptStart(s,width,'Bill Book copy',copy);entry.requests++;entry.status='Print requested · select bill printer';j.state='requested';}catch(e){row=orbaAttemptStart(s,width,'Bill Book copy',copy);row.status='blocked';row.detail=e.message;entry.status=e.message;if(!orbaAttemptLatest(s))j.state='blocked';throw e;}
   result='Print window opened · choose bill printer. Physical output not confirmed.';
 }else if(mode==='download'){
   var url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='Orba_Bill_'+s.billNo+'_'+width+'mm'+(copy?'_COPY':'')+'.html';document.body.appendChild(link);try{link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
   result='Bill file requested · open it and print on the receipt printer.';
 }else throw Error('Unsupported receipt output.');
 a.exports.push({id:'RX-'+(++a.seq),sale:s.oi5Id,media:width,reason:copy?String(reason).trim():'Original receipt',status:mode==='print'?'print_view_opened':'file_requested',purpose:'receipt',at:new Date().toISOString()});
 return result;
}

function v26Catalogue(){oi3Seed();var st=v21State(),qu=fwQuarantineRows(),pending=oi3State().batches;var rr=[],groups=new Map();for(var r of Object.values(oi3State().byCode)){if(!fwRegAllowed(r))continue;var a=r.scope==='footwear'?oi5Feet().find(x=>x.id===r.id):ITEMS.find(x=>x.id===r.id);if(!a)continue;if(r.scope==='footwear'&&a.st&&(!Object.hasOwn(a.st,r.colour)||!a.sizes.includes(r.size)))continue;var it=r.scope==='footwear'?oi5FootItem(r):findItem(r.id);if(!it)continue;var ci=r.scope==='footwear'?0:it.colours?it.colours.indexOf(r.colour):0,si=r.scope==='footwear'?0:it.sizes?it.sizes.indexOf(r.size):0;if(ci<0||si<0)continue;var h={it,ci,si},qty=avail(h.it,h.ci,h.si),held=st.reservations.filter(x=>x.code===r.code&&x.status==='held').reduce((n,x)=>n+x.qty,0),damaged=qu.filter(x=>x.code===r.code).reduce((n,x)=>n+x.remaining,0),transit=st.transfers.filter(x=>x.code===r.code).reduce((n,x)=>n+x.qty-x.received-x.cancelled,0),labels=pending.flatMap(b=>b.lines).filter(x=>x.code===r.code).reduce((n,x)=>n+x.q-x.confirmed,0),cat=r.scope==='footwear'?(a.st?a.cat:'acc'):a.cat,unit=r.scope==='footwear'&&a.st?'pairs':'pieces',pool=(SET.fwProfile?.pools||[]).find(p=>p.enabled&&(p.ids.includes('v:'+r.code)||p.ids.includes((r.scope==='footwear'?'f:':'g:')+r.id)));var v={code:r.code,name:a.name,article:a.no||a.sku,colour:r.colour,size:r.size,cat,unit,qty,held,damaged,transit,labels,price:h.it.price,offer:pool?.name||'',scope:r.scope,id:r.id};rr.push(v);var key=r.scope+':'+r.id,g=groups.get(key);if(!g){g={key,name:a.name,article:a.no||a.sku,cat,unit,variants:[],qty:0,held:0,damaged:0,transit:0,labels:0};groups.set(key,g);}g.variants.push(v);for(var k of ['qty','held','damaged','transit','labels'])g[k]+=v[k];}return {rows:rr,groups:[...groups.values()]};}
function v26LabelLink(code,batch){var s=oi3State();s.quickHandoff=code||null;s.handoff=batch||null;s.articleHandoff=null;s.openLabels=true;navigateSection('labels');}
function v27ArticleLabels(article){oi3Seed();var s=oi3State();s.articleHandoff=article.id;s.quickHandoff=null;s.handoff=null;s.openLabels=true;navigateSection('labels');}
function v27PrintLabelDocument(j,notify){if(j.serviceRequest)throw Error('Use the assigned label queue; no browser fallback');j.browserPrintOpen=true;j.browserNote='Select Xprinter in the print dialog. Paper output unconfirmed.';try{orbaOpenPrintDocument(oi3Document(j),'label',function(reason){j.browserPrintOpen=false;j.browserNote=reason==='window_closed'?'Print window closed · inspect actual labels':'Print dialog closed · inspect actual labels';if(notify)notify();},true);}catch(e){j.browserPrintOpen=false;j.browserNote='Print not opened · use Download prepared labels below';if(notify)notify();}}

function v26ServiceFetch(path,data){var o={headers:{'X-Orba-Token':__G.__orbaOI4Token},cache:'no-store'};if(data){o.method='POST';o.headers['Content-Type']='application/json';o.body=JSON.stringify(data);}return fetch(path,o).then(async r=>{var j=await r.json();if(!r.ok){var e=Error(j.error||'Service rejected request');e.rejected=r.status===409;throw e;}return j;});}
function v26UUID(){return crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint32Array(4))).map(n=>n.toString(16)).join('-');}
function v26ReceiptPayload(s,copy){var r=s.oi6Receipt;if(!r)throw Error('Missing archived receipt');var money=n=>'Rs '+oi6Money(Math.round(n*100)),lines=[String(r.shop.name||'Orba'), 'TRAINING - NOT A TAX INVOICE'+(copy?' - COPY':''),'Bill '+s.billNo+' | '+r.created.slice(0,10),'Cashier '+s.staff];s.lines.forEach((l,i)=>{lines.push(l.name+(l.variant?' / '+l.variant:''));lines.push(l.qty+' x '+money(l.price)+' = Rs '+oi6Money(r.lines[i].net));});lines.push('Merchandise '+money(s.goods));if(s.tax)lines.push('Illustrative tax '+money(s.tax));if(s.fee)lines.push('Illustrative fee '+money(s.fee));if(s.round)lines.push('Rounding '+money(s.round));lines.push('TOTAL '+money(s.total));s.parts.forEach(p=>lines.push(p.method+' '+money(p.amount)));if(s.method==='Cash')lines.push('Received '+money(s.received),'Change '+money(s.change));if(r.design.foot)lines.push(String(r.design.foot).replace(/\{days\}/g,String(r.design.days)));return {lines:lines.map(x=>String(x).replace(/[\x00-\x1f\x7f]/g,' ').slice(0,220)),code:r.design.lookup===false?'':r.code};}
function v26ApplyServiceStatus(v){__G.__orbaV26Status=v;var p=v.profiles||{};if(p.receipt)SET.pr.paper=Number(p.receipt.media);if(p.label){SET.pr.labelSize=p.label.media;SET.pr.oi1=Object.assign({},SET.pr.oi1,{dpi:p.label.dpi});}for(var row of orbaAttemptRows().filter(x=>x.serviceRequest)){var job=v.jobs.find(j=>j.request_id===row.serviceRequest);if(!job)continue;row.serviceJob=job.id;row.status=job.state==='reconciled'?(job.outcome==='printed'?'operator_printed':'operator_not_printed'):job.state==='simulated'?'simulated':job.state==='failed'||job.state==='cancelled'?'blocked':job.state;var entry=orbaQuickState().attempts[row.saleId],j=oi5State().receipts.find(x=>x.saleId===row.saleId);if(entry&&orbaAttemptRows().filter(x=>x.saleId===row.saleId).at(-1)===row){entry.status=job.queue.name+' · '+(job.state==='reconciled'?'Operator: '+job.outcome:job.state==='submitted'?'Spooler accepted · inspect paper':job.state==='simulated'?'Simulation only':job.state==='failed'?'Not sent · '+job.detail:job.state);if(j)j.state=row.status;}}for(var l of oi3State().jobs.filter(x=>x.serviceRequest)){var job=v.jobs.find(j=>j.request_id===l.serviceRequest);if(job){l.serviceState=job.state;l.serviceJob=job.id;l.serviceOutcome=job.outcome;}}}
function v26WatchService(notify,requestId){var left=40;function poll(){v26ServiceFetch('/api/status').then(v=>{v26ApplyServiceStatus(v);if(notify)notify();var j=v.jobs.find(x=>x.request_id===requestId);if((!j||['queued','running'].includes(j.state))&&--left>0)setTimeout(poll,500);}).catch(()=>{});}poll();}
function v26ReceiptRoute(s,auto,copy,source,notify){var q=orbaQuickState(),j=oi5Receipt(s),entry=q.attempts[s.oi5Id]||(q.attempts[s.oi5Id]={autoTried:false,requests:0,status:'Receipt ready'});if(auto){if(entry.autoTried)return entry.status;entry.autoTried=true;}if(orbaAttemptRows().some(x=>x.saleId===s.oi5Id&&x.serviceRequest&&['requested','queued','running','submitted','unknown'].includes(x.status)))return 'Previous receipt unresolved · inspect assigned queue in Printers';var rid='receipt-'+v26UUID(),row=orbaAttemptStart(s,Number(SET.pr.paper)||j.media,source,copy);row.serviceRequest=rid;entry.status='Sending to assigned receipt queue';j.state='requested';entry.requests++;v26ServiceFetch('/api/document',{request_id:rid,kind:'receipt',payload:v26ReceiptPayload(s,copy)}).then(()=>v26WatchService(notify,rid)).catch(e=>{row.status=e.rejected?'blocked':'unknown';j.state=row.status;entry.status=e.rejected?'Not sent · '+e.message:'Request outcome unknown · inspect Printers; do not retry blindly';if(notify)notify();});return entry.status;}
function v26LabelRoute(j,notify){j.serviceRequest='label-'+v26UUID();j.serviceState='requested';v26ServiceFetch('/api/document',{request_id:j.serviceRequest,kind:'label',payload:{media:String(j.media.w),dpi:j.media.dpi,lines:j.lines.map(l=>({code:l.code,name:l.name,variant:l.variant,q:l.q}))}}).then(()=>v26WatchService(notify,j.serviceRequest)).catch(e=>{j.serviceState=e.rejected?'failed':'unknown';j.serviceError=e.message;if(notify)notify();});}

/* Stock Finalization UI: local training data only. */
function sfStore(){return SET.sfStock||(SET.sfStock={categories:[],meta:Object.create(null),history:[]});}
function sfMeta(key){return sfStore().meta[key]||{};}
function sfArchivedCode(code){let r=oi3State().byCode[code];return !!r&&!!sfMeta(r.scope+':'+r.id).archived;}
function sfArchivedItem(it){return !!it&&!!sfMeta(it.oi5Foot?'footwear:'+(it.fwGroup||it.oi5Article):'generic:'+it.id).archived;}
function sfDialog(id,title,body,refresh){let old=document.getElementById(id);if(old)old.remove();let prev=document.activeElement,x=document.createElement('dialog');x.id=id;x.className='sf-dialog';x.setAttribute('aria-labelledby',id+'-title');x.innerHTML='<header><div><p>ORBA · STOCK</p><h2 id="'+id+'-title">'+oi3Esc(title)+'</h2></div><button type="button" data-sf-close aria-label="Close '+oi3Esc(title)+'">Close</button></header><div class="sf-body">'+body+'<p class="sf-message" role="status" aria-live="polite"></p></div>';document.body.append(x);x.querySelector('[data-sf-close]').onclick=()=>x.close();x.addEventListener('close',()=>{x.remove();if(refresh)refresh();if(prev?.isConnected)prev.focus();});x.showModal();return x;}
function sfError(x,e){x.querySelector('.sf-message').textContent=e.message;x.querySelector('.sf-message').classList.add('sf-error');}
function sfBulk(parent,draft,code,done){let groups=v26Catalogue().groups.filter(g=>g.unit==='pairs'&&!sfMeta(g.key).archived);if(!groups.length)throw Error('No active footwear articles available');let e=oi3Esc,initial=groups.find(g=>g.variants.some(v=>v.code===code))||groups[0];let x=sfDialog('sf-bulk','Bulk receiving','<p class="sf-help">Enter received quantities for one article. All selected cells use the same purchase cost. You can edit individual costs in the invoice draft afterward.</p><label>Footwear article<select id="sf-bulk-article">'+groups.map(g=>'<option value="'+e(g.key)+'">'+e(g.name+' · '+g.article)+'</option>').join('')+'</select></label><label>Unit purchase cost · PKR<input id="sf-bulk-cost" inputmode="decimal" value="'+e(parent.querySelector('#cost').value)+'"></label><div id="sf-matrix"></div><p id="sf-bulk-total" role="status"></p><button class="sf-primary" id="sf-bulk-add">Add selected quantities to draft</button><p class="sf-help">No stock changes until you receive the invoice. Existing draft variants must be edited individually.</p>');let sel=x.querySelector('#sf-bulk-article');sel.value=initial.key;let matrix=x.querySelector('#sf-matrix'),cost=x.querySelector('#sf-bulk-cost');function total(){x.querySelector('.sf-message').textContent='';let vals=[...matrix.querySelectorAll('input')].map(i=>Number(i.value)||0);let q=vals.reduce((a,b)=>a+b,0);let v=0;try{v=v21Minor(cost.value);}catch(_){}x.querySelector('#sf-bulk-total').textContent=q+' pairs · '+vals.filter(n=>n>0).length+' variants · Rs '+oi6Money(q*v);}
function render(){let g=groups.find(g=>g.key===sel.value),colors=[...new Set(g.variants.map(v=>v.colour))],sizes=[...new Set(g.variants.map(v=>v.size))];matrix.innerHTML='<div class="sf-matrix-scroll" tabindex="0" role="region" aria-label="Receive by colour and size"><table><thead><tr><th>Colour</th>'+sizes.map(z=>'<th scope="col">'+e(z)+'</th>').join('')+'</tr></thead><tbody>'+colors.map(c=>'<tr><th scope="row">'+e(c)+'</th>'+sizes.map(z=>{let v=g.variants.find(v=>v.colour===c&&v.size===z);return v?'<td><input inputmode="numeric" data-code="'+e(v.code)+'" aria-label="'+e(c+' size '+z+' quantity')+'" value="0" '+(draft.some(d=>d.code===v.code)?'disabled title="Already in draft"':'')+'></td>':'<td>—</td>';}).join('')+'</tr>').join('')+'</tbody></table></div>';matrix.querySelectorAll('input').forEach(i=>i.oninput=total);total();}sel.onchange=()=>{if([...matrix.querySelectorAll('input:not(:disabled)')].some(i=>Number(i.value)>0)&&!confirm('Discard the entered matrix quantities?')){sel.value=matrix.dataset.article;return;}render();matrix.dataset.article=sel.value;};cost.oninput=total;render();matrix.dataset.article=sel.value;let dirty=()=>[...matrix.querySelectorAll('input:not(:disabled)')].some(i=>i.value!=='0'&&i.value!=='');let allowClose=()=>!dirty()||confirm('Discard the entered matrix quantities?');x.querySelector('[data-sf-close]').onclick=()=>{if(allowClose())x.close();};x.addEventListener('cancel',ev=>{if(!allowClose())ev.preventDefault();});
x.querySelector('#sf-bulk-add').onclick=()=>{try{let c=v21Minor(cost.value),rows=[];for(let i of matrix.querySelectorAll('input:not(:disabled)')){if(!/^\d+$/.test(i.value))throw Error('Use whole, nonnegative quantities');let q=v21Qty(Number(i.value),true);if(q){v21Variant(i.dataset.code);if(sfArchivedCode(i.dataset.code)||draft.some(d=>d.code===i.dataset.code))throw Error('Variant unavailable or already in draft');rows.push({code:i.dataset.code,quantity:q,cost:c});}}if(!rows.length)throw Error('Enter at least one received quantity');if(draft.length+rows.length>100)throw Error('Maximum 100 invoice lines');if(!Number.isSafeInteger([...draft,...rows].reduce((n,l)=>n+l.quantity*l.cost,0)))throw Error('Invoice total too large');draft.push(...rows);x.close();done();}catch(err){sfError(x,err);}};}
function sfCartHas(key){let saved=orbaQuickState().savedRegister||{},ls=[...(saved.lines||[]),...(saved.held||[]).flatMap(h=>h.lines||[])];return ls.some(l=>{let it=findItem(l.id);return it&&(it.oi5Foot?'footwear:'+it.oi5Article:'generic:'+it.id)===key;});}
function sfManage(key,refresh){let group=()=>v26Catalogue().groups.find(g=>g.key===key),g=group();if(!g)return;let [scope,id]=[g.variants[0].scope,g.variants[0].id],a=scope==='footwear'?oi5Feet().find(z=>z.id===id):ITEMS.find(z=>z.id===id),m=sfMeta(key),e=oi3Esc;let x=sfDialog('sf-manage','Manage article','<div class="sf-id"><b>'+e(g.article)+'</b><span>'+g.variants.length+' permanent variants · '+g.qty+' '+g.unit+' available</span></div><label>Article name<input id="sf-name" value="'+e(a.name)+'" maxlength="100"></label><label>Regular selling price · PKR<input id="sf-price" inputmode="numeric" value="'+e(a.price)+'"></label>'+(scope==='footwear'?'<label>Individual sale price · optional<input id="sf-sale" inputmode="numeric" value="'+e(a.salePrice||'')+'"></label>':'')+'<label>Collection<select id="sf-collection"><option value="">No collection</option>'+sfStore().categories.map(c=>'<option value="'+e(c)+'">'+e(c)+'</option>').join('')+'</select></label><p class="sf-help">Article code, colours, sizes and barcodes are locked to protect stock history. Changes apply to future sales; existing receipts are retained.</p><button class="sf-primary" id="sf-save">Save changes</button><section class="sf-danger"><b>'+(m.archived?'Restore archived article':'Archive article')+'</b><p class="sf-help">'+(m.archived?'Return this article to Sell and receiving.':'Only empty articles with no held, quarantined, in-transit stock or pending labels may be archived. Barcode identities are retained.')+'</p><button id="sf-archive">'+(m.archived?'Restore article':'Archive article')+'</button></section>',refresh);x.querySelector('#sf-collection').value=m.category||'';
x.querySelector('#sf-save').onclick=()=>{try{if(oi5State().pending||sfCartHas(key))throw Error('Resolve active or held bills containing this article before editing');let name=v21Text(x.querySelector('#sf-name').value,'article name'),raw=x.querySelector('#sf-price').value,price=Number(raw),saleRaw=x.querySelector('#sf-sale')?.value||'',sale=Number(saleRaw),cat=x.querySelector('#sf-collection').value;if(!/^\d+$/.test(raw)||!Number.isSafeInteger(price)||price<1||price>9999999||saleRaw&&(!/^\d+$/.test(saleRaw)||sale<1||sale>price))throw Error('Enter valid whole-rupee prices; sale price cannot exceed regular price');if(cat&&!sfStore().categories.includes(cat))throw Error('Choose an existing collection');let before={name:a.name,price:a.price,salePrice:a.salePrice||0,category:m.category||''};if(scope==='footwear'){let fs=oi5Feet().map(oi6Clone),target=fs.find(z=>z.id===id);target.name=name;target.price=price;if(saleRaw)target.salePrice=sale;else delete target.salePrice;KEEP['Inventory|shoes']=KEEP['Inventory|shoes']||{};KEEP['Inventory|shoes'].data=fs;}else{a.name=name;a.price=price;}sfStore().meta[key]={...sfMeta(key),category:cat};sfStore().history.push({key,action:'edit',before,after:{name,price,salePrice:saleRaw?sale:0,category:cat}});oi3Seed();x.close();}catch(err){sfError(x,err);}};
x.querySelector('#sf-archive').onclick=()=>{try{let current=group();if(oi5State().pending||sfCartHas(key))throw Error('Resolve active or held bills first');let arch=!sfMeta(key).archived;if(arch&&['qty','held','damaged','transit','labels'].some(k=>current[k]>0))throw Error('Archive blocked: available stock, open movements or pending labels remain');if(arch&&!confirm('Archive this article? Its permanent barcode and history will be retained.'))return;sfStore().meta[key]={...sfMeta(key),archived:arch};sfStore().history.push({key,action:arch?'archive':'restore'});x.close();}catch(err){sfError(x,err);}};}
function sfCollections(refresh){let e=oi3Esc,x=sfDialog('sf-collections','Manage collections','<p class="sf-help">Collections are optional merchant-defined groups within the existing Ladies, Men, Kids, Bags and Accessories product types. They never change pairs into pieces.</p><label>New collection<input id="sf-new-category" maxlength="40" placeholder="e.g. Winter 2026"></label><button class="sf-primary" id="sf-add-category">Create collection</button><div id="sf-category-list"></div>',refresh);function valid(v,exclude){let n=v.trim();if(!n||n.length>40||sfStore().categories.some(c=>c!==exclude&&c.toLowerCase()===n.toLowerCase()))throw Error('Use a unique collection name of 1–40 characters');return n;}function show(){x.querySelector('.sf-message').textContent='';x.querySelector('.sf-message').classList.remove('sf-error');let cats=sfStore().categories,meta=sfStore().meta;x.querySelector('#sf-category-list').innerHTML=cats.length?cats.map((c,i)=>'<div class="sf-category-row"><label>Collection name<input data-cat-index="'+i+'" value="'+e(c)+'"></label><span>'+Object.values(meta).filter(m=>m.category===c).length+' articles</span><button data-rename="'+i+'">Rename</button><button data-delete="'+i+'">Delete</button></div>').join(''):'<p class="sf-help">No custom collections yet.</p>';x.querySelectorAll('[data-rename]').forEach(b=>b.onclick=()=>{try{let i=+b.dataset.rename,old=cats[i],n=valid(x.querySelector('[data-cat-index="'+i+'"]').value,old);cats[i]=n;Object.values(meta).forEach(m=>{if(m.category===old)m.category=n;});show();}catch(err){sfError(x,err);}});x.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{try{let i=+b.dataset.delete,c=cats[i];if(Object.values(meta).some(m=>m.category===c))throw Error('Move assigned articles to another collection before deleting');cats.splice(i,1);show();}catch(err){sfError(x,err);}});}x.querySelector('#sf-add-category').onclick=()=>{try{if(sfStore().categories.length>=50)throw Error('Maximum 50 collections');sfStore().categories.push(valid(x.querySelector('#sf-new-category').value));x.querySelector('#sf-new-category').value='';show();}catch(err){sfError(x,err);}};show();}

function easyArticleLabels(key){oi3Seed();let s=oi3State();s.articleHandoff=key;s.quickHandoff=null;s.handoff=null;s.openLabels=true;navigateSection('labels');}

function focusEntry(newArticle,op,refresh){let x=sfDialog('focus-entry','Add stock','<p class="sf-help">Choose what you are adding. Existing variants keep their original barcodes.</p><div class="focus-entry-list"><button data-entry="new"><b>New article</b><span>Footwear with colours and sizes.</span></button><button data-entry="bag"><b>New bag / accessory</b><span>Create a product measured in pieces.</span></button><button data-entry="existing"><b>Receive existing stock</b><span>Add quantities to a purchase invoice.</span></button><button data-entry="bulk"><b>Bulk size receiving</b><span>Enter footwear sizes and colours in one matrix.</span></button><button data-entry="scan"><b>Scan and receive</b><span>Identify an exact existing barcode.</span></button></div>',null);x.querySelectorAll('[data-entry]').forEach(b=>b.onclick=()=>{let k=b.dataset.entry;x.close();if(k==='new')newArticle();else if(k==='bag')scQuickBag(refresh);else if(k==='existing')op('Receive invoice');else if(k==='bulk')v21UI('owner','stock',refresh,null,'Receive invoice',null,true);else focusScan(refresh);});}
function focusScan(refresh){let x=sfDialog('focus-scan','Scan and receive','<label>Barcode<input id="focus-scan-code" autocomplete="off" placeholder="Scan or type the full barcode"></label><p class="sf-help">Only a unique exact match can be received. Unknown codes never create stock automatically.</p><button class="sf-primary" id="focus-scan-go">Find variant</button>',null);let f=x.querySelector('input');let go=()=>{try{oi3Seed();let q=f.value.trim(),hits=Object.values(oi3State().byCode).filter(r=>fwRegAllowed(r)&&[r.code,r.alias,...scAliasFor(r.code).split(" ")].some(v=>v&&String(v).toLowerCase()===q.toLowerCase()));if(!q||hits.length!==1)throw Error('No unique exact barcode match. Check the code or create an article separately.');let r=hits[0];if(sfArchivedCode(r.code))throw Error('Restore the archived article before receiving.');x.close();focusArticle(r.scope+':'+r.id,true,refresh,r.code);}catch(e){sfError(x,e);}};x.querySelector('#focus-scan-go').onclick=go;f.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go();}};f.focus();}
function focusArticle(key,owner,refresh,selected){let g=v26Catalogue().groups.find(z=>z.key===key);if(!g)return;let e=oi3Esc,arch=!!sfMeta(key).archived,allow=owner&&!arch,rows=g.variants,colors=[...new Set(rows.map(r=>r.colour||'One colour'))],sizes=[...new Set(rows.map(r=>r.size||'One size'))],btn=v=>v?'<button class="focus-cell" data-variant="'+e(v.code)+'" aria-label="'+e([v.colour,v.size,v.qty+' available'].join(' · '))+'" data-qty="'+(v.qty===0?'zero':v.qty===1?'last':'ok')+'" aria-pressed="false">'+v.qty+'</button>':'<span>—</span>';let matrix=g.unit==='pairs'?'<div class="focus-matrix-wrap"><table class="focus-matrix"><thead><tr><th>Colour / size</th>'+sizes.map(z=>'<th scope="col">'+e(z)+'</th>').join('')+'</tr></thead><tbody>'+colors.map(c=>'<tr><th scope="row">'+e(c)+'</th>'+sizes.map(z=>'<td>'+btn(rows.find(r=>(r.colour||'One colour')===c&&(r.size||'One size')===z))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>':'<div class="focus-piece-list">'+rows.map(r=>'<div><span>'+e([r.colour,r.size].filter(Boolean).join(' · ')||'One size')+'</span>'+btn(r)+'</div>').join('')+'</div>';let state=r=>'<div class="focus-state-grid">'+[['Available',r.qty],['Reserved',r.held],['Quarantine',r.damaged],['In transit',r.transit]].map(z=>'<div><span>'+z[0]+'</span><b>'+z[1]+'</b></div>').join('')+'</div>';let x=sfDialog('focus-article',g.name,'<div class="sf-id"><b>'+e(g.article)+'</b><span>'+rows.length+' variants · '+e(g.unit)+(arch?' · Archived':'')+'</span></div>'+state(g)+'<p class="sf-help">Select a size to see its barcode and actions. Red = sold out; yellow = last unit. Available excludes reserved, quarantine and transit.</p>'+matrix+'<div id="focus-variant-detail"></div><div class="focus-detail-actions">'+(allow?'<button id="focus-receive-all">Receive '+(g.unit==='pairs'?'sizes':'pieces')+'</button><button id="focus-label-all">Create labels</button><button id="focus-batch-labels">Batch replacement labels</button>':'')+(allow&&g.unit==='pairs'?'<button id="sc-add-options">Add sizes or colours</button>':'')+(owner?'<button id="focus-manage">Manage article</button>':'')+'</div>',null);function launch(f){x.close();f();}function pick(code){let r=rows.find(z=>z.code===code);if(!r)return;x.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.variant===code)));let detail=x.querySelector('#focus-variant-detail');detail.innerHTML='<div class="focus-variant-detail"><b>'+e([r.colour,r.size].filter(Boolean).join(' · ')||'One size')+'</b><span>Barcode: '+e(r.code)+'</span>'+state(r)+'<span>Pending stickers: '+r.labels+'</span>'+(allow?'<div class="focus-detail-actions"><button data-vop="Receive invoice">Receive variant</button><button data-vop="label">Create variant labels</button><button data-vop="Stock count">Count variant</button><button data-vop="Reservations">Reserve variant</button><button id="sc-link-open">Link supplier barcode</button></div>':'')+'</div>';detail.querySelector('#sc-link-open')?.addEventListener('click',()=>launch(()=>scLink(r.code,refresh)));detail.querySelectorAll('[data-vop]').forEach(b=>b.onclick=()=>launch(()=>b.dataset.vop==='label'?v26LabelLink(r.code):v21UI('owner','stock',refresh,null,b.dataset.vop,r.code)));}x.querySelectorAll('[data-variant]').forEach(b=>b.onclick=()=>pick(b.dataset.variant));x.querySelector('#focus-receive-all')?.addEventListener('click',()=>launch(()=>v21UI('owner','stock',refresh,null,'Receive invoice',rows[0].code,g.unit==='pairs')));x.querySelector('#focus-label-all')?.addEventListener('click',()=>launch(()=>easyArticleLabels(key)));x.querySelector('#focus-manage')?.addEventListener('click',()=>launch(()=>sfManage(key,refresh)));x.querySelector('#focus-batch-labels')?.addEventListener('click',()=>launch(()=>focusBatchLabels(key)));x.querySelector('#sc-add-options')?.addEventListener('click',()=>launch(()=>scAddOptions(key,refresh)));if(selected)pick(selected);}
function focusBatchLabels(key){let g=v26Catalogue().groups.find(z=>z.key===key);if(!g||sfMeta(key).archived)return;let e=oi3Esc,rows=g.variants,media=oi3Media(String(SET.pr.labelSize||'38'),SET.pr.oi1?.dpi||203);let x=sfDialog('focus-batch-labels-dialog','Batch replacement labels','<div class="sf-id"><b>'+e(g.name)+'</b><span>'+e(g.article)+' · '+media.w+' × '+media.h+' mm · '+media.dpi+' DPI</span></div><p class="sf-help">Enter copies only for variants that need replacement stickers. This does not change stock or the received-stock label queue.</p><div class="focus-batch-list">'+rows.map(r=>'<label class="focus-batch-row"><span><b>'+e([r.colour,r.size].filter(Boolean).join(' · ')||'One size')+'</b><small>'+e(r.code)+'</small></span><input inputmode="numeric" data-batch-code="'+e(r.code)+'" aria-label="Copies '+e(r.code)+'" value="0"></label>').join('')+'</div><label>Replacement reason<select id="focus-batch-reason"><option value="">Choose reason</option><option>Damaged sticker</option><option>Missing sticker</option><option>Price update</option><option>Other replacement</option></select></label><div id="focus-batch-total" role="status">0 stickers</div><div id="focus-batch-preview"></div><button class="sf-primary" id="focus-batch-prepare" disabled>Prepare and download labels</button>',null);let inputs=[...x.querySelectorAll('[data-batch-code]')],reason=x.querySelector('#focus-batch-reason'),prepare=x.querySelector('#focus-batch-prepare');function read(){let lines=inputs.map(i=>{if(!/^\d{1,3}$/.test(i.value))throw Error('Enter whole copy quantities from 0 to 250');let q=Number(i.value);if(q>250)throw Error('Maximum 250 copies per job');return {code:i.dataset.batchCode,q,confirmed:0};}).filter(r=>r.q>0),total=lines.reduce((n,r)=>n+r.q,0);if(total>250)throw Error('Maximum 250 copies per job');return {lines,total};}function update(){prepare.disabled=true;let msg=x.querySelector('.sf-message');msg.textContent='';msg.classList.remove('sf-error');try{let {lines,total}=read();x.querySelector('#focus-batch-total').textContent=total+' stickers · '+lines.length+' variants · inventory change 0';x.querySelector('#focus-batch-preview').innerHTML=lines.length?'<p class="sf-help">First selected label preview</p>'+oi3SVG(oi3State().byCode[lines[0].code],media):'';prepare.disabled=!total||!reason.value;}catch(err){sfError(x,err);x.querySelector('#focus-batch-preview').innerHTML='';}}inputs.forEach(i=>i.oninput=update);reason.onchange=update;prepare.onclick=()=>{try{let {lines,total}=read();if(!total||!reason.value)throw Error('Choose copies and a reason');if(__G.__orbaOI4Token)throw Error('Batch replacement in this prototype supports browser download only. Use the existing single-label workflow for assigned hardware.');oi3Seed();for(let l of lines){if(sfArchivedCode(l.code)||!oi3State().byCode[l.code])throw Error('Variant unavailable');}let j=oi3Job({id:null,source:'Replacement: '+reason.value,lines},null,0,'',media);oi3Download(j);x.close();v26LabelLink(null,null);}catch(err){sfError(x,err);}};update();}
function focusCartons(sizes,colours,qty,apply){if(!sizes.length||!colours.length)return;let templates=SET.focusCartons||(SET.focusCartons=[]),e=oi3Esc,signature=JSON.stringify(sizes),first=colours[0],x=sfDialog('focus-cartons','Saved carton templates','<p class="sf-help">Save a size distribution from '+e(first)+' and reuse it for every selected colour. Templates are available in this training session only. Matching size ranges are required.</p><div class="focus-carton-preview">'+sizes.map(z=>'<span>'+e(z)+' <b>'+Number(qty[first+'|'+z]||0)+'</b></span>').join('')+'</div><label>Template name<input id="focus-carton-name" maxlength="50" placeholder="e.g. Supplier A · 12 pairs"></label><button id="focus-carton-save" class="sf-primary">Save current distribution</button><div id="focus-carton-list"></div>',null);function show(){let list=x.querySelector('#focus-carton-list');list.innerHTML=templates.length?templates.map((t,i)=>'<div class="focus-carton-row"><span><b>'+e(t.name)+'</b><small>'+t.values.reduce((a,b)=>a+b,0)+' pairs · '+e(t.sizes.join(', '))+'</small></span><button data-template="'+i+'" '+(JSON.stringify(t.sizes)!==signature?'disabled title="Different size range"':'')+'>Apply</button><button data-delete-template="'+i+'">Delete</button></div>').join(''):'<p class="sf-help">No templates saved yet.</p>';list.querySelectorAll('[data-template]').forEach(b=>b.onclick=()=>{let t=templates[Number(b.dataset.template)];if(!t||JSON.stringify(t.sizes)!==signature)return;if(Object.values(qty).some(q=>Number(q)>0)&&!confirm('Replace opening quantities for all selected colours with this template?'))return;let m={};for(let c of colours)sizes.forEach((z,i)=>{if(t.values[i])m[c+'|'+z]=t.values[i];});apply(m);x.close();});list.querySelectorAll('[data-delete-template]').forEach(b=>b.onclick=()=>{templates.splice(Number(b.dataset.deleteTemplate),1);show();});}x.querySelector('#focus-carton-save').onclick=()=>{try{let name=x.querySelector('#focus-carton-name').value.trim(),values=sizes.map(z=>Number(qty[first+'|'+z]||0));if(!name||name.length>50||templates.some(t=>t.name.toLowerCase()===name.toLowerCase()))throw Error('Enter a unique template name');if(!values.some(n=>n>0)||values.some(n=>!Number.isInteger(n)||n<0||n>999))throw Error('Enter valid opening quantities before saving a template');if(templates.length>=50)throw Error('Maximum 50 templates');templates.push({name,sizes:[...sizes],values});x.querySelector('#focus-carton-name').value='';x.querySelector('.sf-message').textContent='Template saved in this session';x.querySelector('.sf-message').classList.remove('sf-error');show();}catch(err){sfError(x,err);}};show();}

// Session-only Stock workflow extension. No external registry writes from new flows.
function scLocal(){if(__G.__orbaFinalRegistry||__G.__orbaOI4Token)throw Error('This new workflow is available in local training only; connected registry integration is not verified.');}
function scAliases(){return SET.scSupplierAliases||(SET.scSupplierAliases=Object.create(null));}
function scAliasFor(code){return Object.keys(scAliases()).filter(a=>scAliases()[a]===code).join(' ');}
function scResolveSupplier(t){return scAliases()[String(t).trim().toUpperCase()]||null;}
var scResolve0=oi5Resolve;oi5Resolve=function(t){let c=scResolveSupplier(t);return scResolve0(c||t);};
var scNamespace0=fwNamespaceTaken;fwNamespaceTaken=function(t){return !!scResolveSupplier(t)||scNamespace0(t);};
var scRegister0=oi3Register;oi3Register=function(scope,id,c,z,name,price,alias){if(alias&&scResolveSupplier(alias))throw Error('Identifier reserved by a supplier barcode');return scRegister0(scope,id,c,z,name,price,alias);};
function scLink(code,refresh){let r=oi3State().byCode[code];if(!r||sfArchivedCode(code))return;let e=oi3Esc,x=sfDialog('sc-link','Link supplier barcode','<div class="sf-id"><b>'+e(r.name)+'</b><span>'+e([r.colour,r.size].filter(Boolean).join(' · ')||'One size')+'</span><span>Permanent Orba barcode: '+e(code)+'</span></div><p class="sf-help">An optional supplier barcode is an additional lookup code. Orba labels, stock and previous receipts keep the original barcode.</p><label>Supplier barcode<input id="sc-alias" autocomplete="off" maxlength="48" placeholder="Scan or type supplier code"></label><p id="sc-linked">'+e(scAliasFor(code)||'No supplier barcode linked')+'</p><button class="sf-primary" id="sc-link-save">Link barcode</button>',refresh);x.querySelector('#sc-link-save').onclick=()=>{try{scLocal();oi3Seed();let v=x.querySelector('#sc-alias').value.trim().toUpperCase();if(!/^[A-Z0-9._-]{4,48}$/.test(v)||/^290\d{9}$/.test(v))throw Error('Use 4–48 letters, digits, dots, hyphens or underscores; Orba internal barcode range is reserved.');if(scResolveSupplier(v)===code)throw Error('Already linked to this variant');if(fwNamespaceTaken(v)||scResolve0(v).length)throw Error('Barcode already belongs to an existing identifier');if(sfArchivedCode(code))throw Error('Restore article first');scAliases()[v]=code;x.querySelector('#sc-linked').textContent=scAliasFor(code);x.querySelector('#sc-alias').value='';x.querySelector('.sf-message').classList.remove('sf-error');x.querySelector('.sf-message').textContent='Linked. Permanent barcode unchanged.';}catch(e){sfError(x,e);}};}
function scRegistryUndo(keys){let rs=oi3State();for(let k of Object.keys(rs.byKey))if(!keys.has(k)){delete rs.byCode[rs.byKey[k].code];delete rs.byKey[k];}}
function scAddOptions(key,refresh){let g=v26Catalogue().groups.find(a=>a.key===key),a=g&&oi5Feet().find(a=>a.id===g.variants[0].id);if(!a?.st||sfMeta(key).archived)return;let x=sfDialog('sc-options','Add sizes or colours','<div class="sf-id"><b>'+oi3Esc(g.name)+'</b><span>'+oi3Esc(g.article)+' · '+g.variants.length+' existing variants</span></div><p class="sf-help">Existing combinations, quantities and barcodes stay unchanged. New combinations start at zero stock. Receive them through the normal purchase workflow.</p><label>Additional colours (comma separated)<input id="sc-colours" maxlength="150" placeholder="e.g. Tan, Navy"></label><label>Additional sizes (comma separated)<input id="sc-sizes" maxlength="100" placeholder="e.g. 46, 47"></label><div id="sc-options-preview" role="status"></div><button class="sf-primary" id="sc-options-save">Create new variants</button>',refresh);function parse(id,old,max){let s=x.querySelector(id).value.trim();if(!s)return [];let list=s.split(',').map(v=>v.trim());if(list.some(v=>!v||v.length>24||!/^[-a-zA-Z0-9 .\/]+$/.test(v)||['__proto__','constructor','prototype'].includes(v.toLowerCase()))||new Set([...old,...list].map(v=>String(v).toLowerCase())).size!==old.length+list.length||old.length+list.length>max)throw Error('Use unique new options, maximum '+max+' total');return list;}function calc(){let cs=parse('#sc-colours',Object.keys(a.st),20),zs=parse('#sc-sizes',a.sizes,30);let n=(Object.keys(a.st).length+cs.length)*(a.sizes.length+zs.length)-g.variants.length;if(n>200)throw Error('Maximum 200 new variants per action');return {cs,zs,n};}function preview(){try{let p=calc();x.querySelector('#sc-options-preview').textContent=p.n+' new variants · 0 opening pairs';x.querySelector('#sc-options-save').disabled=!p.n;x.querySelector('.sf-message').textContent='';}catch(e){sfError(x,e);x.querySelector('#sc-options-save').disabled=true;}}x.querySelectorAll('input').forEach(i=>i.oninput=preview);x.querySelector('#sc-options-save').onclick=()=>{try{scLocal();if(sfCartHas(key)||oi5State().pending)throw Error('Resolve active and held bills before adding variants');let p=calc();if(!p.n)throw Error('Enter new options');oi3Seed();let keys=new Set(Object.keys(oi3State().byKey)),old=oi5Feet(),next=old.map(oi6Clone),f=next.find(v=>v.id===a.id);try{f.sizes.push(...p.zs);for(let c of Object.keys(f.st))f.st[c].push(...p.zs.map(()=>0));for(let c of p.cs)f.st[c]=f.sizes.map(()=>0);for(let c of Object.keys(f.st))for(let z of f.sizes)oi3Foot(f,c,z);KEEP['Inventory|shoes']=KEEP['Inventory|shoes']||{};KEEP['Inventory|shoes'].data=next;}catch(e){scRegistryUndo(keys);throw e;}x.close();refresh();focusArticle(key,true,refresh);}catch(e){sfError(x,e);}};preview();}
function scQuickBag(refresh){let e=oi3Esc,x=sfDialog('sc-bag','New bag / accessory','<p class="sf-help">Create the article and receive its first purchase together. Each colour / size gets a permanent barcode.</p><label>Product name<input id="sc-bag-name" maxlength="100"></label><label>Article / SKU<input id="sc-bag-sku" maxlength="40"></label><label>Category<select id="sc-bag-cat"><option value="bags">Bags</option><option value="acc">Accessories</option></select></label><label>Selling price · PKR<input id="sc-bag-price" inputmode="numeric"></label><label>Colours (optional, comma separated)<input id="sc-bag-colours" placeholder="Black, Brown"></label><label>Sizes (optional, comma separated)<input id="sc-bag-sizes" placeholder="Small, Large"></label><label>Pieces per variant<input id="sc-bag-qty" inputmode="numeric" value="1"></label><label>Purchase cost per piece · PKR<input id="sc-bag-cost" inputmode="decimal"></label><label>Supplier<input id="sc-bag-supplier"></label><label>Invoice reference<input id="sc-bag-invoice"></label><label>Amount paid · PKR<input id="sc-bag-paid" inputmode="decimal" value="0"></label><label>Payment method<select id="sc-bag-way"><option value="cash">Cash</option><option value="bank">Bank</option></select></label><div id="sc-bag-total" role="status"></div><button class="sf-primary" id="sc-bag-save">Create and receive stock</button>',refresh);let val=k=>x.querySelector('#sc-bag-'+k).value;function opts(k){return val(k).split(',').map(v=>v.trim()).filter(Boolean);}function preview(){let n=Math.max(1,opts('colours').length)*Math.max(1,opts('sizes').length),q=Number(val('qty'));x.querySelector('#sc-bag-total').textContent=n+' variants · '+(Number.isSafeInteger(q)&&q>0?n*q:0)+' pieces · labels generated on receipt';}x.querySelectorAll('input').forEach(i=>i.oninput=preview);x.querySelector('#sc-bag-save').onclick=()=>{let keys=null,created=null,committed=false;try{scLocal();let supplier=v21Text(val('supplier'),'supplier'),invoice=v21Text(val('invoice'),'invoice reference'),q=v21Qty(Number(val('qty'))),cost=v21Minor(val('cost')),paid=v21Minor(val('paid')),price=Number(val('price')),count=Math.max(1,opts('colours').length)*Math.max(1,opts('sizes').length);if(!/^\d+$/.test(val('qty'))||!/^\d+$/.test(val('price'))||count>100||paid>count*q*cost||!Number.isSafeInteger(count*q*cost))throw Error('Review quantity, invoice total and payment (maximum 100 variants)');if(v21PurchaseRows().some(r=>r.ref===supplier.toLowerCase()+'|'+invoice.toLowerCase()))throw Error('Supplier invoice already received');oi3Seed();keys=new Set(Object.keys(oi3State().byKey));created=v21NewProduct(val('name'),val('sku'),val('cat'),price,val('colours'),val('sizes'),'owner');let r=v21Purchase(supplier,invoice,created.codes.map(code=>({code,quantity:q,cost})),paid,val('way'),false,'owner');committed=true;x.close();let done=sfDialog('sc-bag-done','Stock received','<div class="sf-id"><b>'+e(created.it.name)+'</b><span>'+created.codes.length*q+' pieces received · '+created.codes.length*q+' pending labels</span></div><p>Invoice '+e(r.invoice)+' · Rs '+oi6Money(r.total)+'</p><button class="sf-primary" id="sc-bag-labels">Review pending labels</button>',refresh);done.querySelector('#sc-bag-labels').onclick=()=>{done.close();v26LabelLink(null,r.labelBatch);};}catch(err){if(created&&!committed){let i=ITEMS.indexOf(created.it);if(i>=0)ITEMS.splice(i,1);}if(keys&&!committed)scRegistryUndo(keys);if(x.isConnected)sfError(x,err);}};preview();}
// Chronological observations of successful changes to stock states, not a durable accounting ledger.
function scHistory(){return SET.scMovementHistory||(SET.scMovementHistory=[]);}
function scSnapshot(){return new Map(v26Catalogue().rows.map(r=>[r.code,{name:r.name,article:r.article,variant:[r.colour,r.size].filter(Boolean).join(' · '),unit:r.unit,qty:r.qty,held:r.held,damaged:r.damaged,transit:r.transit}]));}
let scHistoryDepth=0;function scRecord(before,type,ref){let after=scSnapshot();for(let [code,r] of after){let b=before.get(code)||{qty:0,held:0,damaged:0,transit:0},delta=[r.qty-b.qty,r.held-b.held,r.damaged-b.damaged,r.transit-b.transit];if(delta.some(n=>n!==0))scHistory().push({at:new Date().toISOString(),type,ref:String(ref||''),code,...r,delta});}}
function scTrack(fn,type){return function(...args){if(scHistoryDepth||!fwMode()||!__G.__orbaQuickMode)return fn.apply(this,args);let before;try{before=scSnapshot();}catch(_){before=null;}scHistoryDepth++;try{let out=fn.apply(this,args);if(before)try{scRecord(before,type,out?.id||out?.billNo||out?.ref||'');}catch(_){SET.scHistoryIncomplete=true;}return out;}finally{scHistoryDepth--;}};}
v21Purchase=scTrack(v21Purchase,'Purchase received');v21Reserve=scTrack(v21Reserve,'Reservation');v21Release=scTrack(v21Release,'Reservation released');v21Dispatch=scTrack(v21Dispatch,'Transfer dispatched');v21Transfer=scTrack(v21Transfer,'Transfer resolved');v21Count=scTrack(v21Count,'Stock count');fwQuarantine=scTrack(fwQuarantine,'Quarantine');fwResolveQuarantine=scTrack(fwResolveQuarantine,'Quarantine resolved');fwSupplierReturn=scTrack(fwSupplierReturn,'Supplier return');oi5Commit=scTrack(oi5Commit,'Sale');oi6Return=scTrack(oi6Return,'Customer return');v21Exchange=scTrack(v21Exchange,'Exchange');
function scOpening(art){try{for(let c of Object.keys(art.st))for(let z of art.sizes){let q=art.st[c][art.sizes.indexOf(z)];if(q>0)scHistory().push({at:new Date().toISOString(),type:'Opening inventory',ref:art.no,code:oi3Foot(art,c,z).code,name:art.name,article:art.no,variant:c+' · '+z,unit:'pairs',qty:q,held:0,damaged:0,transit:0,delta:[q,0,0,0]});}}catch(_){SET.scHistoryIncomplete=true;}}
function scHistoryUI(){let e=oi3Esc,x=sfDialog('sc-history','Stock movement history','<p class="sf-help">Recorded movements in this training session only. Opening demo balances are not transactions. Label printing is excluded.</p><label>Search article, barcode or movement<input id="sc-history-search" placeholder="Search history"></label><div id="sc-history-list"></div>',null);let f=x.querySelector('input'),list=x.querySelector('#sc-history-list');function render(){let q=f.value.trim().toLowerCase(),rows=scHistory().slice().reverse().filter(r=>[r.code,r.name,r.article,r.variant,r.type,r.ref,scAliasFor(r.code)].join(' ').toLowerCase().includes(q));list.innerHTML=(SET.scHistoryIncomplete?'<p>Some movements could not be captured.</p>':'')+(rows.length?'<p>'+rows.length+' matching movements · latest first · showing up to 100</p>'+rows.slice(0,100).map(r=>'<div class="sc-history-row"><b>'+e(r.type)+' · '+e(r.name)+'</b><small>'+e(r.variant)+' · '+e(r.code)+' · '+e(r.ref)+'</small><small>'+e(new Date(r.at).toLocaleString())+'</small><div>'+['Available','Reserved','Quarantine','In transit'].map((k,i)=>r.delta[i]?'<span>'+k+' '+(r.delta[i]>0?'+':'')+r.delta[i]+'</span>':'').join('')+'</div><small>Available after: '+r.qty+' '+e(r.unit)+'</small></div>').join(''):'<p>No matching movements recorded.</p>');}f.oninput=render;render();}


export {
  ADVANCES,
  ART,
  BILLS,
  CASH_CATS,
  CASH_DRAFTS,
  CATS,
  CONSENT,
  COPY,
  CTYPES,
  CTYPE_ORDER,
  CUSTOMERS,
  EMPLOYEES,
  EXP_BILLS,
  EXP_CATS,
  EXP_REC,
  FBR_FEE,
  FW_CATS,
  HELD_N,
  ICONS,
  ITEMS,
  ITEMS_RAW_PRICE,
  KEEP,
  KH_INV,
  KITS,
  LEDGER,
  MANAGER_PIN,
  METHODS,
  MONTHS,
  MROLES,
  NAV,
  NOTES,
  OI3_C128,
  OI3_FOOT_FIXTURES,
  ORDER_SRC,
  PAYRUNS,
  PINS,
  POS,
  POS_ID,
  ROLE_NAME,
  SET,
  SHIFTS,
  SHIPMENTS,
  SHOPCATS,
  SIZESETS,
  SORDERS,
  STAFF,
  STATUS,
  STOCK_ADJ,
  SUPPLIERS,
  SW,
  TAXR,
  TAX_GROUP,
  TINT,
  TOKENS,
  VBILLS,
  WAY_BY,
  WAY_IN,
  WAY_NAME,
  WAY_OUT,
  adjAdd,
  adjOf,
  artFor,
  avail,
  barsFor,
  beep,
  billById,
  billCash,
  billFbrNo,
  billFee,
  billGoods,
  billItems,
  billLines,
  billMath,
  billMethod,
  billTotal,
  catsFor,
  chip,
  custById,
  dShort,
  dayStats,
  daysAgo,
  demoTime,
  digits,
  discAmount,
  dotsFor,
  drawerCash,
  easyArticleLabels,
  empById,
  fbrNo,
  findItem,
  firstInStock,
  focusArticle,
  focusBatchLabels,
  focusCartons,
  focusEntry,
  focusScan,
  fwActivate,
  fwAllowed,
  fwArticleTiles,
  fwBagQty,
  fwBagUI,
  fwBill,
  fwBundlePrev,
  fwCashCheck,
  fwCashError,
  fwCashMovement,
  fwCloseShift,
  fwCollect,
  fwCustomerAdd,
  fwCustomerOwed,
  fwDrawerMinor,
  fwGroupStock,
  fwInvoiceOwed,
  fwMode,
  fwMovement,
  fwNamespaceTaken,
  fwOpenShift,
  fwPanel,
  fwPanelActions,
  fwPanelCards,
  fwPanelNote,
  fwPanelTitle,
  fwPickArticle,
  fwPoolForm,
  fwPoolMembers,
  fwPoolOverlap,
  fwPoolRemove,
  fwPoolSave,
  fwQuarantine,
  fwQuarantineRows,
  fwReceiptNet,
  fwRegAllowed,
  fwResolveQuarantine,
  fwSellItems,
  fwSupplierReturn,
  initials,
  invCollected,
  invOwed,
  invReturned,
  invTotal,
  keepSync,
  khOwed,
  kitById,
  ledgerAdd,
  ledgerSum,
  lineTotal,
  lowCount,
  lum,
  methodById,
  mkLine,
  monthName,
  n,
  navigateSection,
  nextBillNo,
  oi3Batch,
  oi3Confirm,
  oi3Document,
  oi3Download,
  oi3Esc,
  oi3Foot,
  oi3Generic,
  oi3Handoff,
  oi3Job,
  oi3Media,
  oi3Pending,
  oi3Register,
  oi3SVG,
  oi3Seed,
  oi3State,
  oi5Adj0,
  oi5Avail0,
  oi5BillLines0,
  oi5Bundle,
  oi5Commit,
  oi5Digital,
  oi5Feet,
  oi5Find0,
  oi5FootItem,
  oi5FootSearch,
  oi5PayOK,
  oi5Quote,
  oi5Receipt,
  oi5Ref,
  oi5Resolve,
  oi5Sig,
  oi5Sku0,
  oi5State,
  oi5StockOK,
  oi6Allocate,
  oi6Barcode,
  oi6Clone,
  oi6Code,
  oi6Commit0,
  oi6Document,
  oi6Download,
  oi6Entitlement,
  oi6Money,
  oi6Receipt0,
  oi6Return,
  oi6ReturnBlock,
  oi6ReturnQuote,
  oi6Returns,
  oi6Snapshot,
  oi6State,
  oi7Add,
  oi7Cases,
  oi7Create,
  oi7Eligible,
  oi7Int,
  oi7Note,
  oi7Quote,
  oi7Rate,
  oi7Sale,
  oi7State,
  oi7Status,
  oi7Tax,
  oi7Transition,
  openBoard,
  orbaAccount,
  orbaAttemptEnd,
  orbaAttemptLatest,
  orbaAttemptRows,
  orbaAttemptStart,
  orbaBillDocument,
  orbaBillOutput,
  orbaConfirmPaper,
  orbaGoodsParts,
  orbaOpenPrintDocument,
  orbaQuickFocus,
  orbaQuickLast,
  orbaQuickPrint,
  orbaQuickState,
  orbaRefundRows,
  orbaReserveCode,
  orbaReturn0,
  orbaStableCode,
  orbaTrainingJournals,
  payKey,
  payLine,
  phoneFmt,
  phoneIntl,
  phoneOk,
  pinOf,
  poById,
  poLineName,
  poQty,
  poRecv,
  poValue,
  qrPath,
  rateOf,
  recordSale,
  reserved,
  roundBill,
  rs,
  rz,
  scAddOptions,
  scAliasFor,
  scAliases,
  scHistory,
  scHistoryDepth,
  scHistoryUI,
  scLink,
  scLocal,
  scNamespace0,
  scOpening,
  scQuickBag,
  scRecord,
  scRegister0,
  scRegistryUndo,
  scResolve0,
  scResolveSupplier,
  scSnapshot,
  scTrack,
  selv,
  sfArchivedCode,
  sfArchivedItem,
  sfBulk,
  sfCartHas,
  sfCollections,
  sfDialog,
  sfError,
  sfManage,
  sfMeta,
  sfStore,
  sizeSet,
  skuOf,
  staffById,
  stockInfo,
  supById,
  swv,
  taxFor,
  taxIn,
  toInt,
  totalStock,
  tr,
  trackDirty,
  v21Block0,
  v21Count,
  v21Dispatch,
  v21Due,
  v21Exchange,
  v21Id,
  v21Minor,
  v21Move,
  v21NewProduct,
  v21Offer,
  v21Owner,
  v21Purchase,
  v21PurchaseRows,
  v21Qty,
  v21Quote0,
  v21Release,
  v21Reserve,
  v21Ret0,
  v21State,
  v21Stock,
  v21SupplierPay,
  v21Text,
  v21Transfer,
  v21UI,
  v21Variant,
  v26ApplyServiceStatus,
  v26Catalogue,
  v26LabelLink,
  v26LabelRoute,
  v26ReceiptPayload,
  v26ReceiptRoute,
  v26ServiceFetch,
  v26UUID,
  v26WatchService,
  v27ArticleLabels,
  v27PrintLabelDocument,
  variantText,
  wayList
};
