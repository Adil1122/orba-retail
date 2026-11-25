import React, { useMemo, useState } from 'react';
import { Banknote, ArrowDownLeft, ArrowUpRight, Lock, Unlock } from 'lucide-react';
import type { WorkspacePayload } from '../types/pos.ts';
import { api } from '../lib/api.ts';
import { formatDateTime, formatMoney } from '../lib/format.ts';
import { Modal } from './BrandMark.tsx';

export function CashView({
  workspace,
  onRefresh,
  notify,
}: {
  workspace: WorkspacePayload;
  onRefresh: () => Promise<void>;
  notify: (type: 'ok' | 'err', msg: string) => void;
}) {
  const cur = workspace.settings.currency || 'Rs';
  const activeShift = useMemo(
    () => workspace.shifts.find((s) => s.status === 'open') || null,
    [workspace.shifts]
  );

  const [openModal, setOpenModal] = useState(false);
  const [floatInput, setFloatInput] = useState('15000');

  const [movModal, setMovModal] = useState<'cash_in' | 'cash_out' | null>(null);
  const [movAmount, setMovAmount] = useState('');
  const [movReason, setMovReason] = useState('');

  const [closeModal, setCloseModal] = useState(false);
  const [countedCash, setCountedCash] = useState('');
  const [closeNotes, setCloseNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const activeMovements = useMemo(
    () =>
      activeShift
        ? workspace.cashMovements.filter((m) => m.shiftId === activeShift.id)
        : [],
    [activeShift, workspace.cashMovements]
  );

  async function handleOpenShift(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.openShift(Number(floatInput) || 0);
      setOpenModal(false);
      await onRefresh();
      notify('ok', 'New cash shift opened.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not open shift.');
    } finally {
      setSaving(false);
    }
  }

  async function handleMovement(e: React.FormEvent) {
    e.preventDefault();
    if (!activeShift || !movModal) return;
    setSaving(true);
    try {
      await api.recordCashMovement(activeShift.id, movModal, Number(movAmount) || 0, movReason);
      setMovModal(null);
      setMovAmount('');
      setMovReason('');
      await onRefresh();
      notify('ok', movModal === 'cash_in' ? 'Cash in recorded.' : 'Cash out recorded.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to save cash entry.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCloseShift(e: React.FormEvent) {
    e.preventDefault();
    if (!activeShift) return;
    setSaving(true);
    try {
      await api.closeShift(activeShift.id, Number(countedCash) || 0, closeNotes);
      setCloseModal(false);
      setCountedCash('');
      setCloseNotes('');
      await onRefresh();
      notify('ok', `Shift ${activeShift.shiftNo} closed and reconciled.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Could not close shift.');
    } finally {
      setSaving(false);
    }
  }

  const expectedLive = activeShift?.expectedCash ?? activeShift?.openingFloat ?? 0;
  const variancePreview =
    countedCash !== '' ? Math.round(Number(countedCash) || 0) - expectedLive : 0;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#5B6585]">
            {workspace.settings.branchName} · Counter Drawer
          </p>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#162660] leading-tight">
            Cash & Shifts
          </h1>
        </div>
        {!activeShift ? (
          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="h-11 px-4 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[14px] font-bold inline-flex items-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            Open Cash Shift
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMovModal('cash_in')}
              className="h-10 px-3.5 rounded-[12px] border border-[#D9CFC0] bg-white hover:bg-[#F8F2E9] text-[#14532D] text-[13px] font-bold inline-flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Cash In
            </button>
            <button
              type="button"
              onClick={() => setMovModal('cash_out')}
              className="h-10 px-3.5 rounded-[12px] border border-[#D9CFC0] bg-white hover:bg-[#F8F2E9] text-[#B42318] text-[13px] font-bold inline-flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" />
              Cash Out
            </button>
            <button
              type="button"
              onClick={() => {
                setCountedCash(String(expectedLive));
                setCloseModal(true);
              }}
              className="h-10 px-4 rounded-[12px] bg-[#162660] hover:bg-[#111E50] text-white text-[13px] font-bold inline-flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              Close Shift
            </button>
          </div>
        )}
      </div>

      {/* Active Shift Banner */}
      {activeShift ? (
        <section className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F6F0E7]">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-[14px] bg-[#E8F6EE] text-[#14532D] flex items-center justify-center">
                <Banknote className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-bold text-[#162660]">
                    Active Shift · {activeShift.shiftNo}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F6EE] text-[#14532D] text-[12px] font-bold">
                    Open
                  </span>
                </div>
                <p className="text-[13px] text-[#5B6585]">
                  Opened by {activeShift.openedBy} · {formatDateTime(activeShift.openedAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-semibold text-[#5B6585]">Expected in Drawer</p>
              <p className="text-[28px] font-bold text-[#162660] tabular-num leading-tight">
                {formatMoney(expectedLive, cur)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-[14px] bg-[#F8F2E9]">
              <p className="text-[12px] text-[#5B6585] font-semibold">Opening Float</p>
              <p className="text-[18px] font-bold text-[#162660] tabular-num mt-0.5">
                {formatMoney(activeShift.openingFloat, cur)}
              </p>
            </div>
            <div className="p-3.5 rounded-[14px] bg-[#F8F2E9]">
              <p className="text-[12px] text-[#5B6585] font-semibold">Cash In Movements</p>
              <p className="text-[18px] font-bold text-[#14532D] tabular-num mt-0.5">
                +
                {formatMoney(
                  activeMovements.filter((m) => m.type === 'cash_in').reduce((s, m) => s + m.amount, 0),
                  cur
                )}
              </p>
            </div>
            <div className="p-3.5 rounded-[14px] bg-[#F8F2E9]">
              <p className="text-[12px] text-[#5B6585] font-semibold">Cash Out / Drops</p>
              <p className="text-[18px] font-bold text-[#B42318] tabular-num mt-0.5">
                -
                {formatMoney(
                  activeMovements.filter((m) => m.type === 'cash_out').reduce((s, m) => s + m.amount, 0),
                  cur
                )}
              </p>
            </div>
          </div>

          {activeMovements.length > 0 && (
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B6585] mb-2">
                Shift Cash Movements
              </p>
              <div className="divide-y divide-[#F6F0E7] border border-[#E9E1D5] rounded-[14px]">
                {activeMovements.map((m) => (
                  <div key={m.id} className="p-3 flex items-center justify-between gap-3 text-[14px]">
                    <div>
                      <p className="font-semibold text-[#162660]">{m.reason}</p>
                      <p className="text-[12px] text-[#5B6585]">
                        {m.createdBy} · {formatDateTime(m.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`font-bold tabular-num ${
                        m.type === 'cash_in' ? 'text-[#14532D]' : 'text-[#B42318]'
                      }`}
                    >
                      {m.type === 'cash_in' ? '+' : '-'}
                      {formatMoney(m.amount, cur)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-10 text-center">
          <Banknote className="w-10 h-10 text-[#5B6585] mx-auto mb-2" />
          <h2 className="text-[18px] font-bold text-[#162660]">No Shift Currently Open</h2>
          <p className="text-[14px] text-[#5B6585] mt-1">
            Open a cash shift with your counter starting float to track daily cash reconciliation.
          </p>
          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="mt-4 h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
          >
            Open Shift Now
          </button>
        </div>
      )}

      {/* Shift History */}
      <section className="bg-white border border-[#E9E1D5] rounded-[20px] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F6F0E7]">
          <h2 className="text-[17px] font-bold text-[#162660]">Shift History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#F6F0E7] bg-[#F8F2E9]/70 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]">
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-3">Opened By</th>
                <th className="py-3 px-3 text-right">Float</th>
                <th className="py-3 px-3 text-right">Expected</th>
                <th className="py-3 px-3 text-right">Counted</th>
                <th className="py-3 px-4 text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0E7] text-[14px]">
              {workspace.shifts.map((sh) => (
                <tr key={sh.id}>
                  <td className="py-3 px-4 font-bold text-[#162660] tabular-num">{sh.shiftNo}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-[#162660]">{sh.openedBy}</p>
                    <p className="text-[12px] text-[#5B6585]">{formatDateTime(sh.openedAt)}</p>
                  </td>
                  <td className="py-3 px-3 text-right tabular-num">{formatMoney(sh.openingFloat, cur)}</td>
                  <td className="py-3 px-3 text-right tabular-num">
                    {formatMoney(sh.expectedCash ?? sh.openingFloat, cur)}
                  </td>
                  <td className="py-3 px-3 text-right tabular-num">
                    {sh.status === 'closed' ? formatMoney(sh.countedCash ?? 0, cur) : 'Open'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold tabular-num">
                    {sh.status === 'open' ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#E8F6EE] text-[#14532D] text-[12px]">
                        Active
                      </span>
                    ) : (
                      <span
                        className={
                          (sh.variance ?? 0) === 0
                            ? 'text-[#14532D]'
                            : (sh.variance ?? 0) > 0
                              ? 'text-[#2E46A0]'
                              : 'text-[#B42318]'
                        }
                      >
                        {(sh.variance ?? 0) > 0 ? '+' : ''}
                        {formatMoney(sh.variance ?? 0, cur)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Open Shift Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Open Cash Shift" maxWidth="max-w-sm">
        <form onSubmit={handleOpenShift} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
              Opening Cash Float ({cur})
            </label>
            <input
              type="number"
              min={0}
              required
              value={floatInput}
              onChange={(e) => setFloatInput(e.target.value)}
              className="w-full h-12 px-3.5 rounded-[12px] border border-[#D9CFC0] text-[18px] font-bold tabular-num"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Start Shift
            </button>
          </div>
        </form>
      </Modal>

      {/* Cash In / Out Modal */}
      <Modal
        open={Boolean(movModal)}
        onClose={() => setMovModal(null)}
        title={movModal === 'cash_in' ? 'Record Cash In' : 'Record Cash Out / Safe Drop'}
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleMovement} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Amount ({cur})</label>
            <input
              type="number"
              min={1}
              required
              value={movAmount}
              onChange={(e) => setMovAmount(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[16px] font-bold tabular-num"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Reason</label>
            <input
              required
              value={movReason}
              onChange={(e) => setMovReason(e.target.value)}
              placeholder={movModal === 'cash_in' ? 'e.g. Change notes added' : 'e.g. Safe drop to owner'}
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setMovModal(null)}
              className="h-10 px-4 rounded-[10px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-[10px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Save Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Close Shift Modal */}
      <Modal
        open={closeModal}
        onClose={() => setCloseModal(false)}
        title={`Close Shift · ${activeShift?.shiftNo || ''}`}
        subtitle="Count physical cash in the drawer to reconcile shift variance"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCloseShift} className="space-y-4">
          <div className="p-3.5 rounded-[14px] bg-[#F8F2E9] flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#5B6585]">Expected Drawer Cash</span>
            <span className="text-[18px] font-bold text-[#162660] tabular-num">
              {formatMoney(expectedLive, cur)}
            </span>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">
              Physical Counted Cash ({cur})
            </label>
            <input
              type="number"
              min={0}
              required
              value={countedCash}
              onChange={(e) => setCountedCash(e.target.value)}
              className="w-full h-12 px-3.5 rounded-[12px] border border-[#D9CFC0] text-[18px] font-bold tabular-num"
            />
          </div>
          <div
            className={`p-3 rounded-[12px] text-[13px] font-bold flex items-center justify-between ${
              variancePreview === 0
                ? 'bg-[#E8F6EE] text-[#14532D]'
                : variancePreview > 0
                  ? 'bg-[#EEF5FE] text-[#24398A]'
                  : 'bg-[#FDF0EF] text-[#B42318]'
            }`}
          >
            <span>Drawer Variance</span>
            <span className="tabular-num">
              {variancePreview > 0 ? '+' : ''}
              {formatMoney(variancePreview, cur)}
            </span>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#454F70] mb-1">Closing Notes</label>
            <input
              value={closeNotes}
              onChange={(e) => setCloseNotes(e.target.value)}
              placeholder="e.g. All notes verified"
              className="w-full h-11 px-3 rounded-[12px] border border-[#D9CFC0] text-[14px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCloseModal(false)}
              className="h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[#454F70] text-[14px] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
            >
              Confirm Close Shift
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
