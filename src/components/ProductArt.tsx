import React from 'react';
import type { Product } from '../types/pos.ts';

export type ArtKey =
  | 'tee'
  | 'kurta'
  | 'suit'
  | 'jeans'
  | 'lawn'
  | 'shawl'
  | 'chappal'
  | 'sneaker'
  | 'khussa'
  | 'belt'
  | 'socks'
  | 'fabric'
  | 'bag';

const ART: Record<ArtKey, { b: string; s: string; l: string }> = {
  tee: {
    b: 'M44 20L52 17C55 23 65 23 68 17L76 20L98 33L90 50L80 45V100C66 103 54 103 40 100V45L30 50L22 33Z',
    s: 'M40 92C54 95 66 95 80 92V100C66 103 54 103 40 100ZM90 50L80 45V40L93 44Z',
    l: 'M52 17C55 25 65 25 68 17M40 45V36M80 45V36',
  },
  kurta: {
    b: 'M46 12L54 10C56 15 64 15 66 10L74 12L94 27L88 45L80 41L82 109C68 111 52 111 38 109L40 41L32 45L26 27Z',
    s: 'M38 101C52 103 68 103 82 101V109C68 111 52 111 38 109Z',
    l: 'M54 10C56 16 64 16 66 10M60 14V42M60 21v.01M60 28v.01M60 35v.01M39.5 92v12M80.5 92v12',
  },
  suit: {
    b: 'M47 10L55 8H65L73 10L92 24L86 42L79 38L80 90C68 92 52 92 40 90L41 38L34 42L28 24ZM44 90H76L78 112H64L60 98L56 112H42Z',
    s: 'M44 90H76L76.6 96H43.4ZM40 84C52 86 68 86 80 84V90C68 92 52 92 40 90Z',
    l: 'M55 8V13C58 15 62 15 65 13V8M60 14V34M40.5 76v12M79.5 76v12',
  },
  jeans: {
    b: 'M38 12H82L86 108H66L60 50L54 108H34Z',
    s: 'M38 12H82L82.5 21H37.5Z',
    l: 'M38 21H82M60 21V44M44 22c0 7 5 10 10 10M76 22c0 7-5 10-10 10M64 30v.01M40 100h12M68 100h12',
  },
  lawn: {
    b: 'M24 42H96Q100 42 100 46V60Q100 64 96 64H24Q20 64 20 60V46Q20 42 24 42ZM18 66H102V80Q102 84 98 84H22Q18 84 18 80ZM16 86H104V100Q104 104 100 104H20Q16 104 16 100Z',
    s: 'M18 66H102V70H18ZM16 86H104V90H16Z',
    l: 'M34 50a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M52 54a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M70 50a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M86 55a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M26 76H94M24 96H96',
  },
  shawl: {
    b: 'M24 26H96Q100 26 100 30V72L60 92L20 72V30Q20 26 24 26Z',
    s: 'M20 64L60 84L100 64V72L60 92L20 72Z',
    l: 'M28 76v10M36 80v10M44 84v10M52 88v10M68 88v10M76 84v10M84 80v10M92 76v10M46 48c4-9 18-9 18 2c0 7-8 10-12 6M30 34H90',
  },
  chappal: {
    b: 'M60 12C76 12 82 28 80 48C78 64 82 78 80 92C78 105 70 110 60 110C50 110 42 105 40 92C38 78 42 64 40 48C38 28 44 12 60 12Z',
    s: 'M39 38C50 33 70 33 81 38L82 51C70 46 50 46 38 51ZM41 58C52 54 68 54 79 58L80 69C68 65 52 65 40 69Z',
    l: 'M47 41v4M53 40v5M60 39.5v5M67 40v5M73 41v4M60 76V102',
  },
  sneaker: {
    b: 'M12 84C12 72 18 66 28 64L46 58C52 56 56 58 58 62C64 70 74 72 86 74C100 76 108 80 108 88V92H12Z',
    s: 'M12 88H108V94C108 97 106 98 103 98H16C13 98 12 96 12 94Z',
    l: 'M50 62L56 70M58 60L64 68M66 64L70 71M30 80H76M96 80v.01',
  },
  khussa: {
    b: 'M14 86C14 76 22 70 34 70C50 70 62 72 78 70C92 68 100 60 104 52C108 60 106 74 98 82C90 90 74 94 56 94H22C17 94 14 91 14 86Z',
    s: 'M14 89C30 93 60 93 98 84V86C88 93 72 97 56 97H22C17 97 14 94 14 89Z',
    l: 'M40 79v.01M48 78.5v.01M56 78v.01M64 77.5v.01M72 76.5v.01M30 74C44 82 70 80 90 70',
  },
  belt: {
    b: 'M10 52H96Q104 52 104 60Q104 68 96 68H10Z',
    s: 'M10 64H100Q104 64 103 66Q101 68 96 68H10Z',
    l: 'M14 46H36V74H14ZM25 60H52M70 60v.01M78 60v.01M86 60v.01',
  },
  socks: {
    b: 'M30 14H48V62C48 70 52 74 60 78C68 82 70 94 60 98C52 102 42 96 34 90C28 84 30 74 30 68ZM58 22H76V66C76 74 80 78 88 82C96 86 98 98 88 102C80 106 70 100 62 94C56 88 58 78 58 72Z',
    s: 'M30 14H48V24H30ZM58 22H76V32H58Z',
    l: 'M34 16v6M39 16v6M44 16v6M62 24v6M67 24v6M72 24v6',
  },
  fabric: {
    b: 'M28 34H90A10 22 0 0 1 90 78H28A10 22 0 0 1 28 34ZM34 78L26 106H76L70 78Z',
    s: 'M90 34A10 22 0 0 1 90 78A10 22 0 0 1 90 34Z',
    l: 'M38 46H82M38 56H82M38 66H82M90 50A4 7 0 0 1 90 62',
  },
  bag: {
    b: 'M26 40H94L98 96Q98 104 90 104H30Q22 104 22 96Z',
    s: 'M26 40H94L95 54H25ZM23 90H97L98 96Q98 104 90 104H30Q22 104 22 96Z',
    l: 'M42 40V28C42 18 78 18 78 28V40M26 56H94M52 56V66H68V56',
  },
};

export const TINT_PALETTE: { bg: string; fg: string }[] = [
  { bg: '#EAF2FD', fg: '#24398A' },
  { bg: '#F1E4D1', fg: '#7A5320' },
  { bg: '#F1E6D6', fg: '#6B4A1E' },
  { bg: '#E5EDE3', fg: '#2F4A2E' },
  { bg: '#ECE6EF', fg: '#4A3A5A' },
];

export function getCategoryTint(categoryIdOrName?: string): { bg: string; fg: string } {
  const s = (categoryIdOrName || '').toLowerCase();
  if (s.includes('pret') || s.includes('men') || s.includes('ready')) return TINT_PALETTE[0];
  if (s.includes('unstitched') || s.includes('women') || s.includes('fabric')) return TINT_PALETTE[4];
  if (s.includes('foot') || s.includes('shoe')) return TINT_PALETTE[2];
  if (s.includes('bag') || s.includes('tote') || s.includes('pack')) return TINT_PALETTE[1];
  if (s.includes('acc') || s.includes('perfume') || s.includes('care')) return TINT_PALETTE[3];
  if (s.includes('kid')) return TINT_PALETTE[1];
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  return TINT_PALETTE[Math.abs(hash) % TINT_PALETTE.length];
}

export function inferArtKey(product: Pick<Product, 'name' | 'artKey' | 'categoryId'>): ArtKey {
  if (product.artKey && product.artKey in ART) return product.artKey as ArtKey;
  const n = product.name.toLowerCase();
  if (n.includes('bag') || n.includes('tote') || n.includes('backpack') || n.includes('clutch') || n.includes('satchel')) return 'bag';
  if (n.includes('kurta') || n.includes('shalwar')) return 'kurta';
  if (n.includes('lawn') || n.includes('3-piece') || n.includes('embroidered')) return 'lawn';
  if (n.includes('suit') || n.includes('wash')) return 'suit';
  if (n.includes('chino') || n.includes('trouser') || n.includes('jean')) return 'jeans';
  if (n.includes('chappal') || n.includes('sandal')) return 'chappal';
  if (n.includes('khussa')) return 'khussa';
  if (n.includes('loafer') || n.includes('shoe') || n.includes('sneaker')) return 'sneaker';
  if (n.includes('shawl')) return 'shawl';
  if (n.includes('belt') || n.includes('wallet')) return 'belt';
  if (n.includes('sock') || n.includes('parfum') || n.includes('oud')) return 'socks';
  if (n.includes('dupatta') || n.includes('silk') || n.includes('fabric')) return 'fabric';
  return 'tee';
}

export function ProductArtSvg({
  product,
  categoryName,
  size = 56,
  className = '',
}: {
  product: Pick<Product, 'name' | 'artKey' | 'categoryId' | 'swatch'>;
  categoryName?: string;
  size?: number;
  className?: string;
}) {
  const key = inferArtKey(product);
  const glyph = ART[key];
  const fill = product.swatch || getCategoryTint(categoryName || product.categoryId).fg;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
    >
      <path d={glyph.b} fill={fill} />
      <path d={glyph.s} fill="rgba(15, 27, 71, 0.22)" />
      <path
        d={glyph.l}
        fill="none"
        stroke="rgba(255, 255, 255, 0.72)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductArtThumb({
  product,
  categoryName,
  boxClass = 'w-11 h-11 rounded-[12px]',
  svgSize = 32,
}: {
  product: Pick<Product, 'name' | 'artKey' | 'categoryId' | 'swatch'>;
  categoryName?: string;
  boxClass?: string;
  svgSize?: number;
}) {
  const tint = getCategoryTint(categoryName || product.categoryId);
  return (
    <div
      className={`zyro-ph shrink-0 flex items-center justify-center overflow-hidden ${boxClass}`}
      style={{ backgroundColor: tint.bg }}
    >
      <ProductArtSvg product={product} categoryName={categoryName} size={svgSize} />
    </div>
  );
}
