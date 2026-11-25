import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Store, User, Phone } from 'lucide-react';
import { api, setStoredToken } from '../lib/api.ts';
import type { StaffUser } from '../types/pos.ts';
import { ZyroLogo } from './BrandMark.tsx';

export function AuthView({ onSuccess }: { onSuccess: (user: StaffUser) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('owner@zyropos.app');
  const [password, setPassword] = useState('zyro1234');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  useEffect(() => {
    const t = window.setInterval(() => {
      setClock(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    }, 15000);
    return () => window.clearInterval(t);
  }, []);

  const todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res =
        mode === 'login'
          ? await api.login(email, password)
          : await api.register({ name, email, password, shopName, phone });
      setStoredToken(res.token);
      onSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to authenticate.');
    } finally {
      setLoading(false);
    }
  }

  async function quickSignIn(demoEmail: string) {
    setError('');
    setLoading(true);
    try {
      const res = await api.login(demoEmail, 'zyro1234');
      setStoredToken(res.token);
      onSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F1E4D1] text-[#162660] flex flex-col lg:flex-row">
      {/* Mobile / Tablet compact navy header */}
      <header className="lg:hidden bg-[#162660] text-white px-5 py-4 flex items-center gap-3.5">
        <ZyroLogo size={42} />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold truncate">ZYRO Retail POS</p>
          <p className="text-[13px] text-[#A9BCE0] truncate">{todayLabel} · Counter 1</p>
        </div>
        <span className="font-bold text-[22px] tabular-num tracking-tight">{clock}</span>
      </header>

      {/* Desktop left deep navy brand column (faithful to Login visual design) */}
      <aside className="hidden lg:flex lg:w-[420px] xl:w-[460px] shrink-0 bg-gradient-to-b from-[#0F1B47] to-[#162660] text-white flex-col justify-between p-10 relative overflow-hidden">
        <svg
          aria-hidden="true"
          width="340"
          height="340"
          viewBox="0 0 64 64"
          className="absolute -right-20 -bottom-20 pointer-events-none opacity-90"
        >
          <circle
            cx="30"
            cy="35"
            r="16"
            fill="none"
            stroke="rgba(255,255,255,.06)"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeDasharray="76 24.5"
            transform="rotate(8 30 35)"
          />
        </svg>

        <div className="relative flex items-center gap-3.5">
          <ZyroLogo size={48} />
          <div>
            <p className="text-[19px] font-bold tracking-tight">ZYRO Retail POS</p>
            <p className="text-[13px] text-[#A9BCE0]">Counter 1 · Main Branch</p>
          </div>
        </div>

        <div className="relative my-auto py-8">
          <p className="text-[64px] font-bold leading-none tracking-[-0.03em] tabular-num">{clock}</p>
          <p className="text-[15px] text-[#BFD0EE] font-medium mt-2">{todayLabel}</p>

          <div className="mt-8 space-y-3 border-t border-white/12 pt-6">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[#D0E6FD]">
              Complete Retail Suite
            </p>
            <p className="text-[14px] text-[#BFD0EE] leading-relaxed">
              Fast counter billing, live inventory & stock counts, customer Khata ledger, supplier purchase orders, cash shift reconciliation, and instant 80mm receipts.
            </p>
          </div>
        </div>

        <div className="relative text-[13px] text-[#A9BCE0]">
          ZYRO Retail POS · Multi-device retail workspace
        </div>
      </aside>

      {/* Right form stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-[440px]">
          <div className="bg-white border border-[#E9E1D5] rounded-[22px] p-6 sm:p-8 shadow-[0_14px_34px_rgba(22,30,60,0.08)]">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div>
                <h1 className="text-[24px] font-bold text-[#162660] leading-tight">
                  {mode === 'login' ? 'Sign in to counter' : 'Create shop account'}
                </h1>
                <p className="text-[14px] text-[#5B6585] mt-1">
                  {mode === 'login'
                    ? 'Enter your credentials to open your ZYRO workspace.'
                    : 'Set up your business profile and start selling.'}
                </p>
              </div>
            </div>

            {/* Mode switcher track */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-[12px] bg-[#ECE4D8] mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`h-10 rounded-[9px] text-[14px] font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#162660] shadow-[0_1px_2px_rgba(22,30,60,0.08)]'
                    : 'text-[#454F70] hover:text-[#162660]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`h-10 rounded-[9px] text-[14px] font-semibold transition-all ${
                  mode === 'register'
                    ? 'bg-white text-[#162660] shadow-[0_1px_2px_rgba(22,30,60,0.08)]'
                    : 'text-[#454F70] hover:text-[#162660]'
                }`}
              >
                Register Shop
              </button>
            </div>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-[12px] bg-[#FDF0EF] border border-[#F2C4BE] text-[#B42318] text-[13px] font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-[#5B6585] absolute left-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Bilal Ahmed"
                        className="w-full h-12 pl-10 pr-3.5 rounded-[12px] border border-[#D9CFC0] bg-white focus:border-[#162660] focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">
                        Shop Name
                      </label>
                      <div className="relative flex items-center">
                        <Store className="w-4 h-4 text-[#5B6585] absolute left-3.5" />
                        <input
                          type="text"
                          required
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          placeholder="e.g. Hamza Fashion"
                          className="w-full h-12 pl-10 pr-3.5 rounded-[12px] border border-[#D9CFC0] bg-white focus:border-[#162660] focus:outline-none text-[15px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">
                        Phone
                      </label>
                      <div className="relative flex items-center">
                        <Phone className="w-4 h-4 text-[#5B6585] absolute left-3.5" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 300 0000000"
                          className="w-full h-12 pl-10 pr-3.5 rounded-[12px] border border-[#D9CFC0] bg-white focus:border-[#162660] focus:outline-none text-[15px]"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#5B6585] absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@zyropos.app"
                    className="w-full h-12 pl-10 pr-3.5 rounded-[12px] border border-[#D9CFC0] bg-white focus:border-[#162660] focus:outline-none text-[15px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#454F70] mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#5B6585] absolute left-3.5" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full h-12 pl-10 pr-11 rounded-[12px] border border-[#D9CFC0] bg-white focus:border-[#162660] focus:outline-none text-[15px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 w-9 h-9 rounded-lg hover:bg-[#F8F2E9] text-[#5B6585] flex items-center justify-center"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-[14px] bg-[#162660] hover:bg-[#111E50] disabled:opacity-60 text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_6px_16px_rgba(22,38,96,0.22)]"
              >
                <span>
                  {loading
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Open ZYRO Retail POS'
                      : 'Create Account & Continue'}
                </span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Quick Staff Switcher for fast counter access */}
            {mode === 'login' && (
              <div className="mt-6 pt-5 border-t border-[#F6F0E7]">
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B6585] mb-3">
                  Quick Counter Access
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Owner', sub: 'Bilal', email: 'owner@zyropos.app', bg: '#EAF2FD', fg: '#24398A' },
                    { label: 'Cashier', sub: 'Sana', email: 'cashier@zyropos.app', bg: '#F1E4D1', fg: '#7A5320' },
                    { label: 'Stock', sub: 'Usman', email: 'stock@zyropos.app', bg: '#E5EDE3', fg: '#2F4A2E' },
                  ].map((staff) => (
                    <button
                      key={staff.email}
                      type="button"
                      disabled={loading}
                      onClick={() => quickSignIn(staff.email)}
                      className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-[14px] border border-[#E9E1D5] bg-[#F8F2E9]/70 hover:bg-[#EEF5FE] hover:border-[#B5D3F5] transition-colors"
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
                        style={{ background: staff.bg, color: staff.fg }}
                      >
                        {staff.sub.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-[13px] font-bold text-[#162660]">{staff.label}</span>
                      <span className="text-[11px] text-[#5B6585]">{staff.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
