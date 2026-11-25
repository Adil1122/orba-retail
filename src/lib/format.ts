export function formatMoney(amount: number, currency = 'Rs'): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const formatted = Math.abs(safe).toLocaleString('en-US');
  return safe < 0 ? `-${currency} ${formatted}` : `${currency} ${formatted}`;
}

export function formatNumber(n: number): string {
  return (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString('en-US');
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(iso: string): string {
  return `${formatShortDate(iso)} · ${formatTime(iso)}`;
}

export function isSameDay(iso: string, ref = new Date()): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ZR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function paymentMethodLabel(method: string): string {
  const map: Record<string, string> = {
    cash: 'Cash',
    card: 'Card',
    jazzcash: 'JazzCash',
    easypaisa: 'EasyPaisa',
    bank: 'Bank Transfer',
    khata: 'Khata Credit',
    split: 'Split Payment',
  };
  return map[method] || method;
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const csv = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
