import type { AppLang, ShopKitId } from '@/types/pos';

export const DESIGN_TOKENS = {
  brand: {
    primary: '#162660',
    primaryHover: '#111E50',
    primaryActive: '#0F1B47',
    primaryText: '#2E46A0',
    accent: '#D0E6FD',
    accentHover: '#DCECFE',
    accentDeep: '#2E46A0',
    accentTint: '#EEF5FE',
    accentTintHover: '#D0E6FD',
    accentLine: '#B5D3F5',
    accentInk: '#7A5320',
    accentOnDark: '#D0E6FD',
    dangerHover: '#9A1E14',
  },
  ink: {
    strong: '#162660',
    body: '#454F70',
    muted: '#5B6585',
    dim: '#5B6585',
    onDark: '#FFFFFF',
    mutedOnDark: '#BFD0EE',
    dimOnDark: '#A9BCE0',
  },
  surface: {
    page: '#F1E4D1',
    card: '#FFFFFF',
    raised: '#F8F2E9',
    neutral: '#F6F0E7',
    track: '#ECE4D8',
    hover: '#F8F2E9',
  },
  line: {
    divider: '#F6F0E7',
    card: '#E9E1D5',
    control: '#D9CFC0',
    field: '#8A8276',
    dashed: '#C8BCAA',
  },
  status: {
    ok: { bg: '#E8F6EE', fg: '#14532D', accent: '#2F9E63', onDark: '#7FD6A4' },
    warn: { bg: '#FFF3C4', fg: '#6B4E00', accent: '#C99A06', line: '#EBD892', onDark: '#F2D06B' },
    err: { bg: '#FDF0EF', fg: '#B42318', accent: '#E36B5D', line: '#F2C4BE', onDark: '#F7A59B' },
    info: { bg: '#EAF2FD', fg: '#24398A', onDark: '#A9C6FF' },
    neutral: { bg: '#F6F0E7', fg: '#454F70' },
  },
  type: {
    family: "Outfit, 'Segoe UI', Roboto, system-ui, sans-serif",
    display: 'Outfit, sans-serif',
    mono: "'JetBrains Mono', monospace",
    urdu: "'Noto Naskh Arabic', serif",
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    pill: 999,
  },
} as const;

export const SHOP_KITS: Array<{ id: ShopKitId; label: string }> = [
  { id: 'clothing', label: 'Clothing' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'pharmacy', label: 'Pharmacy' },
  { id: 'grocery', label: 'Grocery' },
  { id: 'cosmetics', label: 'Cosmetics' },
  { id: 'mobile', label: 'Mobiles' },
  { id: 'other', label: 'Other' },
];

export const APP_LANGS: Array<{ id: AppLang; label: string; dir: 'ltr' | 'rtl' }> = [
  { id: 'en', label: 'English', dir: 'ltr' },
  { id: 'roman', label: 'Roman Urdu', dir: 'ltr' },
  { id: 'ur', label: 'اردو', dir: 'rtl' },
];
