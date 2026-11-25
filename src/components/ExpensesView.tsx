import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Wallet } from 'lucide-react';
import type { Expense, WorkspacePayload } from '../types/pos.ts';
import { api } from '../lib/api.ts';
import { formatMoney } from '../lib/format.ts';
import { Modal } from './BrandMark.tsx';

const EXPENSE_CATEGORIES: Expense['category'][] = [
  'Rent',
  'Utilities',
  'Salaries',
  'Supplies',
  'Transport',
  'Maintenance',
  'Marketing',
  'Other',
];

const PAYMENT_SOURCES: Expense['paymentSource'][] = [
  'Cash Drawer',
  'Bank Transfer',
  'EasyPaisa',
  'JazzCash',
];

export function ExpensesView({
  workspace,
  onRefresh,
  notify,
}: {
  workspace: WorkspacePayload;
  onRefresh: () => Promise<void>;
  notify: (type: 'ok' | 'err', msg: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const [catFilter, setCatFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Supplies');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<Expense['paymentSource']>('Cash Drawer');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  const summary = useMemo(() => {
    const todayTotal = workspace.expenses
      .filter((e) => e.date === todayStr)
      .reduce((s, e) => s + e.amount, 0);
    const totalAll = workspace.expenses.reduce((s, e) => s + e.amount, 0);
    const fromCash = workspace.expenses
      .filter((e) => e.paymentSource === 'Cash Drawer')
      .reduce((s, e) => s + e.amount, 0);
    return { todayTotal, totalAll, fromCash };
  }, [workspace.expenses, todayStr]);

  const filtered = useMemo(
    () =>
      workspace.expenses.filter((e) => (catFilter === 'all' ? true : e.category === catFilter)),
    [workspace.expenses, catFilter]
  );

  async function saveExpense(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createExpense({
        title,
        category,
        amount: Number(amount) || 0,
        paymentSource: source,
        date,
        notes,
      });
      setModalOpen(false);
      setTitle('');
      setAmount('');
      setNotes('');
      await onRefresh();
      notify('ok', 'Expense logged.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to save expense.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#5B6585]">
            {workspace.settings.branchName} · Operating Costs
          </p>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#162660] leading-tight">
            Expenses
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="h-11 px-4 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[14px] font-bold inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Today's Expenses</p>
          <p className="text-[24px] font-bold text-[#162660] tabular-num mt-1">
            {formatMoney(summary.todayTotal, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">Recorded today</p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Total Logged</p>
          <p className="text-[24px] font-bold text-[#162660] tabular-num mt-1">
            {formatMoney(summary.totalAll, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">{workspace.expenses.length} entries</p>
        </div>
        <div className="bg-white border border-[#E9E1D5] rounded-[18px] p-4">
          <p className="text-[12px] font-semibold text-[#5B6585]">Paid from Cash Drawer</p>
          <p className="text-[24px] font-bold text-[#7A5320] tabular-num mt-1">
            {formatMoney(summary.fromCash, cur)}
          </p>
          <p className="text-[12px] text-[#5B6585]">Auto-deducted from shift cash</p>
        </div>
      </div>

      <div className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
        <div className="p-4 border-b border-[#F6F0E7] flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCatFilter('all')}
            className={`h-9 px-3 rounded-full text-[13px] font-semibold border ${
              catFilter === 'all'
                ? 'bg-[#162660] text-white border-[#162660]'
                : 'bg-white text-[#454F70] border-[#E9E1D5]'
            }`}
          >
            All
          </button>
          {EXPENSE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCatFilter(c)}
              className={`h-9 px-3 rounded-full text-[13px] font-semibold border ${
                catFilter === c
                  ? 'bg-[#162660] text-white border-[#162660]'
                  : 'bg-white text-[#454F70] border-[#E9E1D5]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Wallet className="w-8 h-8 text-[#5B6585] mx-auto mb-2" />
            <p className="text-[15px] font-bold text-[#162660]">No expenses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-[#F6F0E7] bg-[#F8F2E9]/70 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                  <th className="py-3 px-4">Expense</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Paid From</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#F8F2E9]/60">
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#162660]">{exp.title}</p>
                      {exp.notes && <p className="text-[12px] text-[#5B6585]">{exp.notes}</p>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#F6F0E7] text-[#454F70]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#454F70]">{exp.paymentSource}</td>
                    <td className="py-3 px-3 text-[#5B6585] tabular-num">{exp.date}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#B42318] tabular-num">
                      {formatMoney(exp.amount, cur)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={async () => {
                          await api.deleteExpense(exp.id);
                          await onRefresh();
                          notify('ok', 'Expense deleted.');
                        }}
                        aria-label={`Delete ${exp.title}`}
                        className="w-8 h-8 rounded-[8px] hover:bg-[#FDF0EF] text-[#5B6585] hover:text-[#B42318] inline-flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Shop Expense" maxWidth="max-w-md">
        <form onSubmit={saveExpense} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Expense Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Packaging bags, Electricity bill"
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Expense['category'])}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px]"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
                Amount ({cur})
              </label>
              <input
                type="number"
                min={1}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[15px] font-bold tabular-num"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Payment Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as Expense['paymentSource'])}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px]"
              >
                {PAYMENT_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Notes</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional receipt ref or note"
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
