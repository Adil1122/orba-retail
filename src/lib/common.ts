// @ts-nocheck
'use client';

/* ============================================================
 * ZYRO Retail POS — Shared Design Tokens, Icons, Sample Data & Helpers
 * Converted cleanly from the source HTML specification.
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
/* ===== ZYRO Retail POS · shared library (injected into every artboard by build.py) ===== */
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
var ART = {
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
var TINT = {
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
{ id: 'fabric', label: 'Fabric' }
];

var __G = typeof window !== 'undefined' ? window : {};
var STOCK_ADJ = __G.__zyroAdj || (__G.__zyroAdj = {});
/* ===== One shop in one window (23 Nov 2026) =====
Settings, bills, Khata, the drawer, shifts and stock live here once, so every screen reads and writes the same shop.
A page reload starts the demo day again. */
var SET = __G.__zyroSet || (__G.__zyroSet = {
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
var LEDGER = __G.__zyroLedger || (__G.__zyroLedger = []);
var KEEP = __G.__zyroKeep || (__G.__zyroKeep = {});
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

var ITEMS = __G.__zyroItems || (__G.__zyroItems = [
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

var CUSTOMERS = __G.__zyroCust || (__G.__zyroCust = [
{ id: 'c1', name: 'Bilal Ahmed', phone: '03217654321', khata: 2400, last: '2 Nov' },
{ id: 'c2', name: 'Ayesha Khan', phone: '03001234567', khata: 0, last: '11 Nov' },
{ id: 'c3', name: 'Usman Ali', phone: '03459988776', khata: 850, last: '9 Nov' },
{ id: 'c4', name: 'Sana Tariq', phone: '03334455667', khata: 0, last: '28 Oct' },
{ id: 'c5', name: 'Hina Raza', phone: '03111222333', khata: 0, last: '1 Nov' },
{ id: 'c6', name: 'Kamran Butt', phone: '03004455667', khata: 4640, last: '5 Nov' },
{ id: 'c7', name: 'Nadia Shah', phone: '03339876543', khata: 6300, last: '8 Nov' },
{ id: 'c8', name: 'Farhan Malik', phone: '03451122334', khata: 2990, last: '11 Nov' }
]);

/* Khata: credit invoices made in ZYRO (statement scope: invoice-linked credit sales only).
d = yyyymmdd. lines = [itemId, colour, size, qty]. col = collections, ret = returns that reduce what is owed. */
var ITEMS_RAW_PRICE = {'tee': 1350, 'kurta': 3490, 'suit': 5990, 'jeans': 3990, 'lawn': 4950, 'shawl': 3200, 'chappal': 4500, 'sneaker': 6990, 'khussa': 2800, 'belt': 1200, 'socks': 650, 'fabric': 1250};
var KH_INV = __G.__zyroKh || (__G.__zyroKh = [
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
var POS = __G.__zyroPos || (__G.__zyroPos = [
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
function drawerCash() { var cash = 0, coll = 0; BILLS.forEach(function (b) { cash += billCash(b); coll += b.collected; }); return SET.shift.float + cash + coll + ledgerSum('in', null, true) - ledgerSum('out', null, true); }

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

function n(x) { var t = String(Math.round(Math.abs(x))), last = t.slice(-3), rest = t.slice(0, -3); if (rest) last = ',' + last; return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last; }
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
if (!it.colours) return it.stock || 0;
var t = 0;
it.colours.forEach(function (c, ci) { (it.sizes || [null]).forEach(function (s, si) { t += avail(it, ci, si); }); });
return t;
}
function skuOf(it, ci, si) {
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
var a = ART[it.art] || ART.tee;
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
/* Bill book sample: Ali's bills today on Counter 1 (shift opened 10:02 am, float Rs 10,000).
lines = [itemId, colour, size, qty]; pay cash|khata; print printed|failed|unknown|queued. */
var BILLS = __G.__zyroBills || (__G.__zyroBills = [
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
export function setBoardNavigator(fn: ((name: string) => void) | null) {
  __boardNavigator = fn;
}
function openBoard(name: string) {
  if (!name) return;
  if (__boardNavigator) {
    __boardNavigator(name);
    return;
  }
  if (typeof window !== 'undefined') {
    window.location.href = '/screen/' + name;
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
{ id: 'shoes', name: 'Shoes and bags', sub: 'Shoes, sandals, bags', icon: 'shoe', cats: ['Men', 'Women', 'Kids', 'Sandals', 'Bags'], fields: ['Size', 'Colour'], variant: 'size-colour', sizes: ['38', '39', '40', '41', '42', '43'], barcode: 'zyro', unit: 'pair', extras: ['Shoe sizes 36–46', 'Pairs, not pieces'] },
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
shoes: [['men', 'Men', 'sc', 'eu45', 'sneaker'], ['women', 'Women', 'sc', 'euw', 'khussa'], ['kids', 'Kids', 'sc', 'kidsf', 'sneaker'], ['acc', 'Shoe care', 'simple', '', '']],
jewellery: [['gold', 'Gold', 'piece'], ['silver', 'Silver', 'piece'], ['bridal', 'Bridal sets', 'piece'], ['artificial', 'Artificial', 'simple']],
pharmacy: [['tablets', 'Tablets', 'batch'], ['syrups', 'Syrups', 'batch'], ['injections', 'Injections', 'batch'], ['devices', 'Medical devices', 'simple'], ['care', 'Personal care', 'batch']],
grocery: [['atta', 'Atta and rice', 'pack'], ['oil', 'Oil and ghee', 'pack'], ['drinks', 'Drinks', 'pack'], ['snacks', 'Snacks', 'pack'], ['household', 'Household', 'pack']],
cosmetics: [['makeup', 'Makeup', 'shade'], ['skin', 'Skin care', 'batch'], ['hair', 'Hair care', 'batch'], ['fragrance', 'Fragrance', 'simple']],
mobile: [['phones', 'Phones', 'serial'], ['chargers', 'Chargers', 'simple'], ['covers', 'Covers', 'simple'], ['audio', 'Audio', 'serial']],
other: [['general', 'General', 'simple']]
};
function catsFor(kit) {
return (SHOPCATS[kit] || SHOPCATS.clothing).map(function (c, i) {
var items = kit === 'clothing' ? ITEMS.filter(function (x) { return x.cat === c[0]; }) : [];
var pcs = items.reduce(function (a, it) { return a + (it.measured ? 0 : totalStock(it)); }, 0);
return { id: c[0], label: c[1], type: c[2], sizes: c[3] || '', art: c[4] || '', items: items.length, pieces: pcs, counter: !(kit === 'clothing' && c[0] === 'kids'), order: i };
});
}

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
  empById,
  fbrNo,
  findItem,
  firstInStock,
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
  nextBillNo,
  openBoard,
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
  selv,
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
  variantText,
  wayList
};
