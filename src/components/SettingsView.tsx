import React, { useState } from 'react';
import { Store, Users, CreditCard, ReceiptText, Download, Plus, Check } from 'lucide-react';
import type { BusinessSettings, StaffUser, UserRole, WorkspacePayload } from '../types/pos.ts';
import { api } from '../lib/api.ts';
import { downloadCsv, getInitials } from '../lib/format.ts';
import { Modal } from './BrandMark.tsx';

export function SettingsView({
  workspace,
  user,
  onRefresh,
  notify,
}: {
  workspace: WorkspacePayload;
  user: StaffUser;
  onRefresh: () => Promise<void>;
  notify: (type: 'ok' | 'err', msg: string) => void;
}) {
  const [section, setSection] = useState<'shop' | 'team' | 'payments' | 'receipt' | 'backup'>('shop');
  const [form, setForm] = useState<BusinessSettings>(() => ({ ...workspace.settings }));
  const [saving, setSaving] = useState(false);

  // Add staff modal
  const [staffOpen, setStaffOpen] = useState(false);
  const [stName, setStName] = useState('');
  const [stEmail, setStEmail] = useState('');
  const [stPhone, setStPhone] = useState('');
  const [stRole, setStRole] = useState<UserRole>('cashier');
  const [stPwd, setStPwd] = useState('zyro1234');

  const canEdit = user.role === 'owner' || user.role === 'manager';

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(form as unknown as Record<string, unknown>);
      await onRefresh();
      notify('ok', 'Shop settings saved.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  }

  async function addStaff(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createStaff({
        name: stName,
        email: stEmail,
        phone: stPhone,
        role: stRole,
        password: stPwd,
      });
      setStaffOpen(false);
      setStName('');
      setStEmail('');
      setStPhone('');
      await onRefresh();
      notify('ok', 'Team member added.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not add staff.');
    } finally {
      setSaving(false);
    }
  }

  function downloadJsonBackup() {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zyro-pos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('ok', 'Full JSON backup downloaded.');
  }

  const navItems = [
    { id: 'shop' as const, label: 'Shop Profile', sub: 'Name, branch & type', icon: Store },
    { id: 'team' as const, label: 'Team & Roles', sub: `${workspace.staff.length} staff accounts`, icon: Users },
    { id: 'payments' as const, label: 'Payments', sub: 'Cash, card, wallets, Khata', icon: CreditCard },
    { id: 'receipt' as const, label: 'Tax & 80mm Receipt', sub: 'NTN, FBR & footer', icon: ReceiptText },
    { id: 'backup' as const, label: 'Backup & Export', sub: 'CSV & JSON downloads', icon: Download },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <div>
        <p className="text-[13px] font-semibold text-[#5B6585]">
          {workspace.settings.branchName} · Configuration
        </p>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-[#162660] leading-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Settings Menu (matches Orba master-detail layout) */}
        <nav className="lg:col-span-4 bg-white border border-[#E9E1D5] rounded-[20px] p-2.5 space-y-1">
          {navItems.map((it) => {
            const Icon = it.icon;
            const active = section === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => setSection(it.id)}
                className={`w-full min-h-[54px] px-3 py-2 rounded-[14px] flex items-center gap-3 text-left transition-colors ${
                  active
                    ? 'bg-[#EEF5FE] text-[#162660]'
                    : 'hover:bg-[#F8F2E9] text-[#454F70]'
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    active ? 'bg-[#162660] text-white' : 'bg-[#F6F0E7] text-[#454F70]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-[14px] truncate ${active ? 'font-bold' : 'font-semibold'}`}>
                    {it.label}
                  </p>
                  <p className="text-[12px] text-[#5B6585] truncate">{it.sub}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Right Detail Panel */}
        <div className="lg:col-span-8 bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6">
          {section === 'shop' && (
            <form onSubmit={saveSettings} className="space-y-4">
              <h2 className="text-[19px] font-bold text-[#162660]">Shop Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Shop Name</label>
                  <input
                    disabled={!canEdit}
                    value={form.shopName}
                    onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                    className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Branch Name</label>
                  <input
                    disabled={!canEdit}
                    value={form.branchName}
                    onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                    className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Business Type</label>
                  <select
                    disabled={!canEdit}
                    value={form.shopType}
                    onChange={(e) =>
                      setForm({ ...form, shopType: e.target.value as BusinessSettings['shopType'] })
                    }
                    className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px]"
                  >
                    <option value="clothing">Clothing & Fashion</option>
                    <option value="shoes">Footwear & Shoes</option>
                    <option value="general">General Retail / Mart</option>
                    <option value="cosmetics">Cosmetics & Beauty</option>
                    <option value="electronics">Mobile & Electronics</option>
                    <option value="pharmacy">Pharmacy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Currency Symbol</label>
                  <input
                    disabled={!canEdit}
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Shop Phone</label>
                  <input
                    disabled={!canEdit}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Address</label>
                  <input
                    disabled={!canEdit}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                  />
                </div>
              </div>
              {canEdit && (
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-5 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[14px] font-bold"
                  >
                    {saving ? 'Saving...' : 'Save Shop Profile'}
                  </button>
                </div>
              )}
            </form>
          )}

          {section === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-[19px] font-bold text-[#162660]">Team & Staff Accounts</h2>
                  <p className="text-[13px] text-[#5B6585]">Manage owner, cashier, and stock clerk access</p>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setStaffOpen(true)}
                    className="h-10 px-4 rounded-[12px] bg-[#162660] text-white text-[13px] font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Staff
                  </button>
                )}
              </div>
              <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[16px]">
                {workspace.staff.map((st) => (
                  <div key={st.id} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                        style={{ background: st.avatarBg, color: st.avatarFg }}
                      >
                        {getInitials(st.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-[#162660] truncate">{st.name}</p>
                        <p className="text-[12px] text-[#5B6585] truncate">{st.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EEF5FE] text-[#24398A] text-[12px] font-bold capitalize">
                        {st.role}
                      </span>
                      {canEdit && st.id !== user.id && (
                        <button
                          type="button"
                          onClick={async () => {
                            await api.updateStaff(st.id, { active: !st.active });
                            await onRefresh();
                            notify('ok', `Staff ${st.active ? 'disabled' : 'enabled'}.`);
                          }}
                          className={`h-8 px-2.5 rounded-[8px] text-[12px] font-semibold ${
                            st.active
                              ? 'bg-[#E8F6EE] text-[#14532D]'
                              : 'bg-[#FDF0EF] text-[#B42318]'
                          }`}
                        >
                          {st.active ? 'Active' : 'Disabled'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'payments' && (
            <form onSubmit={saveSettings} className="space-y-4">
              <h2 className="text-[19px] font-bold text-[#162660]">Accepted Payment Methods</h2>
              <p className="text-[13px] text-[#5B6585]">
                Choose which payment options appear in the POS Checkout Tender screen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    { key: 'cash', label: 'Cash Drawer' },
                    { key: 'card', label: 'Debit / Credit Card' },
                    { key: 'easypaisa', label: 'EasyPaisa' },
                    { key: 'jazzcash', label: 'JazzCash' },
                    { key: 'bank', label: 'Bank Transfer (IBFT)' },
                    { key: 'khata', label: 'Customer Khata Credit' },
                  ] as const
                ).map((m) => {
                  const checked = form.enabledPayments[m.key];
                  return (
                    <button
                      key={m.key}
                      type="button"
                      disabled={!canEdit}
                      onClick={() =>
                        setForm({
                          ...form,
                          enabledPayments: { ...form.enabledPayments, [m.key]: !checked },
                        })
                      }
                      className={`p-3.5 rounded-[14px] border flex items-center justify-between text-left transition-colors ${
                        checked
                          ? 'bg-[#EEF5FE] border-[#B5D3F5] text-[#162660]'
                          : 'bg-white border-[#E9E1D5] text-[#5B6585]'
                      }`}
                    >
                      <span className="text-[14px] font-bold">{m.label}</span>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          checked ? 'bg-[#162660] text-white' : 'bg-[#ECE4D8]'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {canEdit && (
                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
                >
                  Save Payment Options
                </button>
              )}
            </form>
          )}

          {section === 'receipt' && (
            <form onSubmit={saveSettings} className="space-y-4">
              <h2 className="text-[19px] font-bold text-[#162660]">Tax & 80mm Thermal Receipt</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                    Default Sales Tax (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    disabled={!canEdit}
                    value={form.taxRate}
                    onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) || 0 })}
                    className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px] font-bold tabular-num"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                    NTN / Tax Registration #
                  </label>
                  <input
                    disabled={!canEdit}
                    value={form.ntnNumber}
                    onChange={(e) => setForm({ ...form, ntnNumber: e.target.value })}
                    className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                  Receipt Header Note
                </label>
                <input
                  disabled={!canEdit}
                  value={form.receiptHeader}
                  onChange={(e) => setForm({ ...form, receiptHeader: e.target.value })}
                  className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                  Receipt Footer Message
                </label>
                <input
                  disabled={!canEdit}
                  value={form.receiptFooter}
                  onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
                  className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
                />
              </div>
              {canEdit && (
                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
                >
                  Save Receipt & Tax Settings
                </button>
              )}
            </form>
          )}

          {section === 'backup' && (
            <div className="space-y-4">
              <h2 className="text-[19px] font-bold text-[#162660]">Backup & Data Export</h2>
              <p className="text-[13px] text-[#5B6585]">
                Export your products, customers, sales records, or a full workspace JSON snapshot at any time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={downloadJsonBackup}
                  className="p-4 rounded-[16px] border border-[#E9E1D5] hover:bg-[#F8F2E9] text-left flex items-center gap-3"
                >
                  <span className="w-10 h-10 rounded-[12px] bg-[#EEF5FE] text-[#2E46A0] flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-[#162660]">Full JSON Backup</p>
                    <p className="text-[12px] text-[#5B6585]">All tables & settings</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      'zyro-products.csv',
                      ['SKU', 'Name', 'Variant', 'Cost', 'Price', 'Stock'],
                      workspace.products.map((p) => [
                        p.sku,
                        p.name,
                        p.variant,
                        p.costPrice,
                        p.salePrice,
                        p.stockQty,
                      ])
                    )
                  }
                  className="p-4 rounded-[16px] border border-[#E9E1D5] hover:bg-[#F8F2E9] text-left flex items-center gap-3"
                >
                  <span className="w-10 h-10 rounded-[12px] bg-[#E8F6EE] text-[#14532D] flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-[#162660]">Products CSV</p>
                    <p className="text-[12px] text-[#5B6585]">{workspace.products.length} items</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      'zyro-customers.csv',
                      ['Name', 'Phone', 'Email', 'Address', 'Balance Due', 'Total Spent'],
                      workspace.customers.map((c) => [
                        c.name,
                        c.phone,
                        c.email || '',
                        c.address || '',
                        c.balanceDue,
                        c.totalSpent,
                      ])
                    )
                  }
                  className="p-4 rounded-[16px] border border-[#E9E1D5] hover:bg-[#F8F2E9] text-left flex items-center gap-3"
                >
                  <span className="w-10 h-10 rounded-[12px] bg-[#F6F0E7] text-[#7A5320] flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-[#162660]">Customers & Khata CSV</p>
                    <p className="text-[12px] text-[#5B6585]">{workspace.customers.length} customers</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal open={staffOpen} onClose={() => setStaffOpen(false)} title="Add Team Member" maxWidth="max-w-md">
        <form onSubmit={addStaff} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Full Name</label>
            <input
              required
              value={stName}
              onChange={(e) => setStName(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Email</label>
              <input
                type="email"
                required
                value={stEmail}
                onChange={(e) => setStEmail(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Role</label>
              <select
                value={stRole}
                onChange={(e) => setStRole(e.target.value as UserRole)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px]"
              >
                <option value="cashier">Cashier</option>
                <option value="stock">Stock Clerk</option>
                <option value="manager">Manager</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Phone</label>
              <input
                value={stPhone}
                onChange={(e) => setStPhone(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Password</label>
              <input
                type="password"
                minLength={6}
                required
                value={stPwd}
                onChange={(e) => setStPwd(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setStaffOpen(false)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Add Staff
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
