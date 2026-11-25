import type { Product, ProductOffer } from '../types/pos.ts';

export function isOfferActive(offer?: ProductOffer | null): offer is ProductOffer {
  if (!offer || !offer.active) return false;
  if (offer.type !== 'bogo' && (!Number.isFinite(offer.value) || offer.value <= 0)) {
    return false;
  }
  if (offer.endsAt) {
    const endMs = new Date(`${offer.endsAt}T23:59:59`).getTime();
    if (Number.isFinite(endMs) && Date.now() > endMs) return false;
  }
  return true;
}

export function formatOfferBadge(offer?: ProductOffer | null, currency = 'Rs'): string | null {
  if (!isOfferActive(offer)) return null;
  if (offer.label && offer.label.trim()) return offer.label.trim();
  if (offer.type === 'percent') return `${Math.round(offer.value)}% OFF`;
  if (offer.type === 'fixed') return `${currency} ${Math.round(offer.value).toLocaleString()} OFF`;
  if (offer.type === 'bogo') {
    const pct = offer.value && offer.value > 0 && offer.value < 100 ? Math.round(offer.value) : 100;
    return pct === 100 ? 'Buy 1 Get 1' : `BOGO ${pct}%`;
  }
  return null;
}

/**
 * Computes effective unit display price for single-unit price tags (percent / fixed offers).
 * For BOGO offers, returns the base salePrice (savings trigger at qty >= 2).
 */
export function getEffectiveUnitPrice(product: Pick<Product, 'salePrice' | 'offer'>): number {
  const base = Math.max(0, Number(product.salePrice) || 0);
  if (!isOfferActive(product.offer)) return base;
  if (product.offer.type === 'percent') {
    const disc = Math.round((base * Math.min(100, product.offer.value)) / 100);
    return Math.max(0, base - disc);
  }
  if (product.offer.type === 'fixed') {
    return Math.max(0, base - Math.round(product.offer.value));
  }
  return base;
}

/**
 * Computes total line discount for a given product and quantity from its active offer.
 */
export function computeOfferLineDiscount(
  unitPrice: number,
  qty: number,
  offer?: ProductOffer | null
): number {
  if (!isOfferActive(offer) || qty <= 0 || unitPrice <= 0) return 0;
  const minQty = Math.max(1, offer.minQty || (offer.type === 'bogo' ? 2 : 1));
  if (qty < minQty) return 0;

  if (offer.type === 'percent') {
    const perUnit = Math.round((unitPrice * Math.min(100, offer.value)) / 100);
    return Math.min(unitPrice * qty, perUnit * qty);
  }
  if (offer.type === 'fixed') {
    const perUnit = Math.min(unitPrice, Math.round(offer.value));
    return Math.min(unitPrice * qty, perUnit * qty);
  }
  if (offer.type === 'bogo') {
    const pairs = Math.floor(qty / 2);
    const secondPct = offer.value > 0 && offer.value <= 100 ? offer.value : 100;
    const perPair = Math.round((unitPrice * secondPct) / 100);
    return Math.min(unitPrice * qty, pairs * perPair);
  }
  return 0;
}
