import React, { useMemo, useState } from 'react';
import { Plus, Search, Phone, Banknote, Edit3, Trash2, BookUser } from 'lucide-react';
import type { Customer, WorkspacePayload } from '../types/pos.ts';
import { api } from '../lib/api.ts';
import { formatDateTime, formatMoney, getInitials } from '../lib/format.ts';
import { Modal, SlideDrawer } from './BrandMark.tsx';

export function CustomersView({
  workspace,
  onRefresh,
  notify,
}: {
  workspace: WorkspacePayload;
  onRefresh: () => Promise<void>;
  notify: (type: 'ok' | 'err', msg: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const [query, setQuery] = useState('');
  const [dueOnly, setDueOnly] = useState(false);

  // Add/Edit Customer modal
  const [custModalOpen, setCustModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState('50000');

  // Ledger & Payment modal
  const [ledgerCust, setLedgerCust] = useState<Customer | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  const [payNote, setPayNote] = useState('Khata payment received');
  const [saving, setSaving] = useState(false);

  const summary = useMemo(() => {
    const totalDue = workspace.customers.reduce((s, c) => s + c.balanceDue, 0);
    const withDue = workspace.customers.filter((c) => c.balanceDue > 0).length;
    const totalSpent = workspace.customers.reduce((s, c) => s + c.totalSpent, 0);
    return { totalDue, withDue, totalSpent };
  }, [workspace.customers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workspace.customers.filter((c) => {
      if (dueOnly && c.balanceDue <= 0) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.address || '').toLowerCase().includes(q)
      );
    });
  }, [workspace.customers, query, dueOnly]);

  const activeLedgerCustomer = useMemo(
    () => (ledgerCust ? workspace.customers.find((c) => c.id === ledgerCust.id) || ledgerCust : null),
    [ledgerCust, workspace.customers]
  );

  const customerEntries = useMemo(
    () =>
      activeLedgerCustomer
        ? workspace.khataEntries.filter((e) => e.customerId === activeLedgerCustomer.id)
        : [],
    [activeLedgerCustomer, workspace.khataEntries]
  );

  function openAdd() {
    setEditing(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCreditLimit('50000');
    setCustModalOpen(true);
  }

  function openEdit(c: Customer) {
    setEditing(c);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email || '');
    setAddress(c.address || '');
    setCreditLimit(String(c.creditLimit));
    setCustModalOpen(true);
  }

  async function saveCustomer(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        phone,
        email,
        address,
        creditLimit: Number(creditLimit) || 50000,
      };
      if (editing) {
        await api.updateCustomer(editing.id, payload);
        notify('ok', 'Customer updated.');
      } else {
        await api.createCustomer(payload);
        notify('ok', 'Customer added.');
      }
      setCustModalOpen(false);
      await onRefresh();
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to save customer.');
    } finally {
      setSaving(false);
    }
  }

  async function submitKhataPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!activeLedgerCustomer) return;
    const amt = Number(payAmount);
    if (!amt || amt <= 0) {
      notify('err', 'Enter a valid payment amount.');
      return;
    }
    setSaving(true);
    try {
      await api.recordKhataPayment(activeLedgerCustomer.id, amt, payMethod, payNote);
      setPayAmount('');
      await onRefresh();
      notify('ok', `Recorded ${formatMoney(amt, cur)} payment for ${activeLedgerCustomer.name}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not record payment.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#5B6585]">
            {workspace.settings.branchName} · Credit ledger
          </p>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#162660] leading-tight tracking-[-0.02em]">
            Khata
          </h1>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="zyro-bp h-12 px-5 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[14px] font-bold inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add customer
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Total Receivable (Khata)</p>
          <p className="text-[26px] font-bold text-[#162660] tabular-num mt-1">
            {formatMoney(summary.totalDue, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">{summary.withDue} customers with pending balance</p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Registered Customers</p>
          <p className="text-[26px] font-bold text-[#162660] tabular-num mt-1">
            {workspace.customers.length}
          </p>
          <p className="text-[12px] text-[#5B6585]">Active profiles</p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Lifetime Customer Spend</p>
          <p className="text-[26px] font-bold text-[#14532D] tabular-num mt-1">
            {formatMoney(summary.totalSpent, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">Repeat buyer volume</p>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
        <div className="p-4 border-b border-[#F6F0E7] flex flex-wrap items-center gap-3">
          <div className="zyro-field flex-1 min-w-[200px] h-11 flex items-center gap-2 px-3 rounded-[12px] border border-[#D9CFC0] bg-white">
            <Search className="w-4 h-4 text-[#5B6585]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer name, phone, area..."
              className="flex-1 bg-transparent border-0 outline-none text-[14px]"
            />
          </div>
          <button
            type="button"
            onClick={() => setDueOnly((v) => !v)}
            className={`h-11 px-3.5 rounded-[12px] border text-[13px] font-semibold inline-flex items-center gap-1.5 ${
              dueOnly
                ? 'bg-[#EEF5FE] border-[#B5D3F5] text-[#2E46A0]'
                : 'bg-white border-[#D9CFC0] text-[#454F70]'
            }`}
          >
            <BookUser className="w-4 h-4" />
            Balance Due Only
          </button>
        </div>

        <div className="divide-y divide-[#F6F0E7]">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-[#F8F2E9]/60 transition-colors"
            >
              <div
                onClick={() => {
                  setLedgerCust(c);
                  setPayAmount(c.balanceDue > 0 ? String(c.balanceDue) : '');
                }}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              >
                <span className="w-11 h-11 rounded-full bg-[#EEF5FE] text-[#24398A] font-bold text-[14px] flex items-center justify-center shrink-0">
                  {getInitials(c.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-[#162660] truncate">{c.name}</p>
                  <p className="text-[13px] text-[#5B6585] flex items-center gap-1.5 tabular-num">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{c.phone}</span>
                    {c.address && <span className="hidden sm:inline">· {c.address}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-5">
                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase text-[#5B6585]">Balance Due</p>
                  <p
                    className={`text-[16px] font-bold tabular-num ${
                      c.balanceDue > 0 ? 'text-[#B42318]' : 'text-[#14532D]'
                    }`}
                  >
                    {formatMoney(c.balanceDue, cur)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLedgerCust(c);
                      setPayAmount(c.balanceDue > 0 ? String(c.balanceDue) : '');
                    }}
                    className="h-9 px-3 rounded-[10px] bg-[#EEF5FE] hover:bg-[#D0E6FD] text-[#2E46A0] text-[13px] font-bold inline-flex items-center gap-1.5"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Ledger</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    aria-label={`Edit ${c.name}`}
                    className="w-9 h-9 rounded-[10px] hover:bg-[#F6F0E7] text-[#454F70] flex items-center justify-center"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await api.deleteCustomer(c.id);
                      await onRefresh();
                      notify('ok', 'Customer removed.');
                    }}
                    aria-label={`Delete ${c.name}`}
                    className="w-9 h-9 rounded-[10px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      <Modal
        open={custModalOpen}
        onClose={() => setCustModalOpen(false)}
        title={editing ? 'Edit Customer' : 'Add Customer'}
        maxWidth="max-w-md"
      >
        <form onSubmit={saveCustomer} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Full Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Phone</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                Credit Limit ({cur})
              </label>
              <input
                type="number"
                min={0}
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px] font-bold tabular-num"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCustModalOpen(false)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Customer Khata Ledger & Collect Payment SlideDrawer (matches Khata.jsx) */}
      <SlideDrawer
        open={Boolean(activeLedgerCustomer)}
        onClose={() => setLedgerCust(null)}
        eyebrow={
          activeLedgerCustomer
            ? `${activeLedgerCustomer.phone} · Lifetime Spend ${formatMoney(activeLedgerCustomer.totalSpent, cur)}`
            : ''
        }
        title={activeLedgerCustomer?.name || 'Customer Ledger'}
        widthClass="max-w-[480px]"
      >
        {activeLedgerCustomer && (
          <div className="space-y-4">
            <div className="p-4 rounded-[16px] bg-[#162660] text-white flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#BFD0EE] uppercase font-semibold">Current Khata Due</p>
                <p className="text-[28px] font-bold tabular-num">
                  {formatMoney(activeLedgerCustomer.balanceDue, cur)}
                </p>
              </div>
              <div className="text-right text-[12px] text-[#BFD0EE] tabular-num">
                <p>Credit Limit</p>
                <p className="text-[15px] font-bold text-white">
                  {formatMoney(activeLedgerCustomer.creditLimit, cur)}
                </p>
              </div>
            </div>

            {/* Record Payment Form */}
            <form
              onSubmit={submitKhataPayment}
              className="p-3.5 rounded-[14px] bg-[#F8F2E9] border border-[#E9E1D5] space-y-3"
            >
              <p className="text-[13px] font-bold text-[#162660]">Receive Khata Payment</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="number"
                  min={1}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder={`Amount (${cur})`}
                  className="h-10 px-3 rounded-[10px] border border-[#D9CFC0] bg-white font-bold tabular-num text-[14px]"
                />
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="h-10 px-3 rounded-[10px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="Note"
                  className="flex-1 h-10 px-3 rounded-[10px] border border-[#D9CFC0] bg-white text-[13px]"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 px-4 rounded-[10px] bg-[#162660] hover:bg-[#111E50] text-white text-[13px] font-bold shrink-0"
                >
                  Record
                </button>
              </div>
            </form>

            {/* Ledger Timeline */}
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B6585] mb-2">
                Ledger Entries
              </p>
              {customerEntries.length === 0 ? (
                <p className="text-[13px] text-[#5B6585] py-4 text-center">No ledger activity yet.</p>
              ) : (
                <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px] max-h-[240px] overflow-y-auto">
                  {customerEntries.map((entry) => (
                    <div key={entry.id} className="p-3 flex items-center justify-between gap-2 text-[13px]">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#162660] capitalize">
                          {entry.type === 'charge'
                            ? `Credit Sale ${entry.reference || ''}`
                            : entry.type === 'payment'
                              ? `Payment Received (${entry.method || 'Cash'})`
                              : `Return Credit ${entry.reference || ''}`}
                        </p>
                        <p className="text-[12px] text-[#5B6585]">
                          {entry.note || 'Ledger entry'} · {formatDateTime(entry.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`font-bold tabular-num shrink-0 ${
                          entry.type === 'charge' ? 'text-[#B42318]' : 'text-[#14532D]'
                        }`}
                      >
                        {entry.type === 'charge' ? '+' : '-'}
                        {formatMoney(entry.amount, cur)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
