import React, { useEffect } from 'react';
import { Printer, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { BusinessSettings, Sale } from '../types/pos.ts';
import { formatDateTime, formatMoney, paymentMethodLabel } from '../lib/format.ts';

/**
 * Exact brand mark from the provided design HTML, titled ZYRO Retail POS.
 */
export function ZyroLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="ZYRO Retail POS"
      className="shrink-0 block"
    >
      <rect width="64" height="64" rx="15" fill="#162660" />
      <circle
        cx="30"
        cy="35"
        r="16"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeDasharray="76 24.5"
        transform="rotate(8 30 35)"
      />
      <circle cx="44.5" cy="21" r="6.6" fill="#D0E6FD" stroke="#162660" strokeWidth="1.6" />
    </svg>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  maxWidth = 'max-w-lg',
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F1B47]/45 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`anim-zsheet w-full ${maxWidth} bg-white border border-[#E9E1D5] rounded-t-[22px] sm:rounded-[22px] shadow-[0_24px_64px_rgba(12,20,50,0.3)] flex flex-col max-h-[92vh] overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#F6F0E7] shrink-0">
          <div className="min-w-0">
            <h2 className="text-[19px] font-bold text-[#162660] leading-tight truncate">{title}</h2>
            {subtitle && <p className="text-[13px] text-[#5B6585] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 rounded-full bg-[#F6F0E7] hover:bg-[#ECE4D8] text-[#454F70] flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-[#F6F0E7] bg-[#F8F2E9]/60 flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function SlideDrawer({
  open,
  onClose,
  eyebrow,
  title,
  widthClass = 'max-w-[460px]',
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  widthClass?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0F1B47]/40 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`anim-zdrawer w-full ${widthClass} h-full bg-white border-l border-[#E9E1D5] shadow-[-16px_0_48px_rgba(12,20,50,0.22)] flex flex-col overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#F6F0E7] shrink-0">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[12px] font-semibold text-[#5B6585] truncate">{eyebrow}</p>
            )}
            <h2 className="text-[20px] font-bold text-[#162660] leading-tight truncate">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="w-10 h-10 rounded-full bg-[#F6F0E7] hover:bg-[#ECE4D8] text-[#454F70] flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-[#F6F0E7] bg-[#F8F2E9]/70 flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ToastBanner({
  toast,
  onClose,
}: {
  toast: { type: 'ok' | 'err'; message: string } | null;
  onClose: () => void;
}) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-6 right-3 left-3 sm:left-auto sm:right-6 z-50 flex justify-center sm:justify-end pointer-events-none">
      <div
        role="status"
        className={`anim-zup pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-[14px] shadow-[0_12px_28px_rgba(12,20,50,0.28)] text-[14px] font-semibold max-w-md ${
          toast.type === 'ok'
            ? 'bg-[#162660] text-white'
            : 'bg-[#B42318] text-white'
        }`}
      >
        {toast.type === 'ok' ? (
          <CheckCircle2 className="w-5 h-5 text-[#7FD6A4] shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-[#F7A59B] shrink-0" />
        )}
        <span className="flex-1">{toast.message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="p-1 rounded-lg hover:bg-white/15 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Receipt80Modal({
  sale,
  settings,
  onClose,
}: {
  sale: Sale | null;
  settings: BusinessSettings;
  onClose: () => void;
}) {
  if (!sale) return null;
  const cur = settings.currency || 'Rs';

  return (
    <Modal
      open={Boolean(sale)}
      onClose={onClose}
      title={`Receipt · ${sale.billNo}`}
      subtitle="80mm thermal receipt preview"
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="zyro-bs h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[14px] font-semibold"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print 80mm Receipt
          </button>
        </>
      }
    >
      <div
        id="zyro-receipt-print"
        className="mx-auto w-full max-w-[320px] bg-white border border-dashed border-[#C8BCAA] rounded-[14px] p-4 font-mono text-[12px] text-[#111111] leading-relaxed"
      >
        <div className="text-center border-b border-dashed border-[#C8BCAA] pb-3 mb-3">
          {settings.showLogoOnReceipt !== false && (
            <div className="flex justify-center mb-1.5">
              <ZyroLogo size={32} />
            </div>
          )}
          <p className="text-[16px] font-bold tracking-tight uppercase">{settings.shopName}</p>
          <p className="text-[11px] text-[#555555]">{settings.branchName}</p>
          {settings.address && <p className="text-[11px] text-[#555555] mt-0.5">{settings.address}</p>}
          {settings.phone && <p className="text-[11px] text-[#555555]">Tel: {settings.phone}</p>}
          {settings.ntnNumber && (
            <p className="text-[11px] text-[#555555]">NTN: {settings.ntnNumber}</p>
          )}
          {settings.receiptHeader && (
            <p className="text-[11px] text-[#555555] mt-1.5 italic">{settings.receiptHeader}</p>
          )}
        </div>

        <div className="flex justify-between text-[11px] mb-1">
          <span>Bill #:</span>
          <span className="font-bold">{sale.billNo}</span>
        </div>
        <div className="flex justify-between text-[11px] mb-1">
          <span>Date:</span>
          <span>{formatDateTime(sale.createdAt)}</span>
        </div>
        <div className="flex justify-between text-[11px] mb-1">
          <span>Cashier:</span>
          <span>{sale.cashierName}</span>
        </div>
        <div className="flex justify-between text-[11px] border-b border-dashed border-[#C8BCAA] pb-2 mb-2">
          <span>Customer:</span>
          <span>{sale.customerName}</span>
        </div>

        <div className="space-y-1.5 border-b border-dashed border-[#C8BCAA] pb-2 mb-2">
          {sale.items.map((item, idx) => (
            <div key={`${item.productId}_${idx}`}>
              <div className="flex justify-between gap-2 font-semibold">
                <span className="truncate">{item.name}</span>
                <span className="shrink-0 tabular-num">{formatMoney(item.lineTotal, cur)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#555555]">
                <span>
                  {item.qty} x {formatMoney(item.unitPrice, cur)}
                  {settings.showSkuOnReceipt ? ` · ${item.sku}` : ''}
                </span>
                {item.discount > 0 && (
                  <span>
                    {item.offerLabel ? `${item.offerLabel} ` : ''}-{formatMoney(item.discount, cur)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-[12px]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-num">{formatMoney(sale.subtotal, cur)}</span>
          </div>
          {sale.discountAmount > 0 && (
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="tabular-num">-{formatMoney(sale.discountAmount, cur)}</span>
            </div>
          )}
          {sale.taxAmount > 0 && (
            <div className="flex justify-between">
              <span>Tax ({settings.taxRate}%)</span>
              <span className="tabular-num">{formatMoney(sale.taxAmount, cur)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-[14px] pt-1.5 border-t border-dashed border-[#C8BCAA]">
            <span>TOTAL</span>
            <span className="tabular-num">{formatMoney(sale.total, cur)}</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-dashed border-[#C8BCAA] text-[11px] space-y-1">
          <div className="flex justify-between">
            <span>Payment</span>
            <span className="font-semibold">{paymentMethodLabel(sale.paymentMethod)}</span>
          </div>
          {sale.paymentSplit && sale.paymentSplit.length > 0 && (
            <div className="pl-2 space-y-0.5 text-[#555555]">
              {sale.paymentSplit.map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span>{paymentMethodLabel(p.method)}</span>
                  <span className="tabular-num">{formatMoney(p.amount, cur)}</span>
                </div>
              ))}
            </div>
          )}
          {sale.amountTendered > 0 && (
            <div className="flex justify-between">
              <span>Tendered</span>
              <span className="tabular-num">{formatMoney(sale.amountTendered, cur)}</span>
            </div>
          )}
          {sale.changeDue > 0 && (
            <div className="flex justify-between font-bold">
              <span>Change Returned</span>
              <span className="tabular-num">{formatMoney(sale.changeDue, cur)}</span>
            </div>
          )}
        </div>

        <div className="text-center mt-4 pt-3 border-t border-dashed border-[#C8BCAA] text-[11px] text-[#555555]">
          <p>{settings.receiptFooter || 'Thank you for shopping with us!'}</p>
          <p className="mt-1 text-[10px] tracking-wider uppercase">ZYRO RETAIL POS</p>
        </div>
      </div>
    </Modal>
  );
}
