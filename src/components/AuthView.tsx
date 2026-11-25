import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  Cloud,
  Delete,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import { api, setStoredToken } from '../lib/api.ts';
import type { ShopKind, StaffUser } from '../types/pos.ts';
import { ZyroLogo } from './BrandMark.tsx';

export type AuthScreenMode = 'welcome' | 'login' | 'register' | 'join' | 'signin';
type LangCode = 'en' | 'roman' | 'ur';

const CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
];

const SHOP_KINDS: {
  id: ShopKind;
  label: string;
  desc: string;
  cats: string[];
  tintBg: string;
  tintFg: string;
}[] = [
  {
    id: 'clothing',
    label: 'Clothing & Apparel',
    desc: 'Unstitched, pret, footwear, bags & accessories',
    cats: ['Unstitched', 'Footwear (M/W/K)', 'Bags (M/W/K)'],
    tintBg: '#EAF2FD',
    tintFg: '#24398A',
  },
  {
    id: 'shoes',
    label: 'Footwear & Bags',
    desc: 'Men, Women & Kids footwear, totes & backpacks',
    cats: ['Footwear (M/W/K)', 'Bags (M/W/K)', 'Shoe Care'],
    tintBg: '#F1E6D6',
    tintFg: '#6B4A1E',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    desc: 'Medicines, wellness & personal care',
    cats: ['Medicines', 'Vitamins', 'Personal Care', 'Baby Care'],
    tintBg: '#E8F6EE',
    tintFg: '#14532D',
  },
  {
    id: 'grocery',
    label: 'Grocery & Mart',
    desc: 'Staples, dairy, snacks & household',
    cats: ['Staples & Flour', 'Dairy & Bakery', 'Beverages', 'Household'],
    tintBg: '#FFF3C4',
    tintFg: '#6B4E00',
  },
  {
    id: 'cosmetics',
    label: 'Cosmetics & Beauty',
    desc: 'Skincare, makeup & fragrances',
    cats: ['Skincare', 'Makeup', 'Fragrances', 'Haircare'],
    tintBg: '#ECE6EF',
    tintFg: '#4A3A5A',
  },
  {
    id: 'jewellery',
    label: 'Jewellery & Watches',
    desc: 'Sets, rings, bangles & watches',
    cats: ['Earrings', 'Necklaces', 'Bangles', 'Watches'],
    tintBg: '#F1E4D1',
    tintFg: '#7A5320',
  },
  {
    id: 'electronics',
    label: 'Mobile & Tech',
    desc: 'Handsets, chargers, audio & cases',
    cats: ['Smartphones', 'Chargers', 'Audio', 'Cases & Glass'],
    tintBg: '#EAF2FD',
    tintFg: '#24398A',
  },
  {
    id: 'general',
    label: 'General Retail',
    desc: 'Mixed counter goods & giftware',
    cats: ['Everyday Essentials', 'Apparel', 'Personal Care', 'Accessories'],
    tintBg: '#E5EDE3',
    tintFg: '#2F4A2E',
  },
];

const COPY: Record<
  LangCode,
  {
    dir: 'ltr' | 'rtl';
    pitch: string;
    bullets: string[];
    caption: string;
    welcomeTitle: string;
    welcomeSub: string;
    createTitle: string;
    createSub: string;
    signInTitle: string;
    signInSub: string;
    joinTitle: string;
    joinSub: string;
    counterPrompt: string;
    counterLink: string;
  }
> = {
  en: {
    dir: 'ltr',
    pitch: 'Sell, track stock and close the day, all in one place.',
    bullets: [
      'Ring up bills in seconds with cash, card, JazzCash & Khata',
      'Live stock counts, barcode scan-in & low-stock alerts',
      'Built for desktop counters, tablets and phones with Supabase sync',
    ],
    caption: 'Owner Home — sales, drawer cash, Khata and low stock at a glance.',
    welcomeTitle: 'Welcome to ZYRO Retail POS',
    welcomeSub: 'How do you want to start?',
    createTitle: "Create my shop's account",
    createSub: 'New to ZYRO · Set up your shop in 2 minutes',
    signInTitle: 'Sign in',
    signInSub: 'Owners and managers with email or mobile',
    joinTitle: 'Join my shop as staff',
    joinSub: 'Cashiers & stockkeepers invited by their shop owner',
    counterPrompt: 'Already set up on this counter?',
    counterLink: 'Counter sign-in (4-digit PIN)',
  },
  roman: {
    dir: 'ltr',
    pitch: 'Bikri, stock aur roz ka hisaab — sab aik hi jagah.',
    bullets: [
      'Cash, card, JazzCash aur Khata par foran bill banayein',
      'Barcode scan se stock jama karein aur kam stock par alert paayein',
      'Computer, tablet aur phone par Supabase ke sath live sync',
    ],
    caption: 'Owner Home — aaj ki bikri, cash drawer aur Khata aik nazar mein.',
    welcomeTitle: 'ZYRO Retail POS mein khush aamdeed',
    welcomeSub: 'Aap kis tarah shuru karna chahtay hain?',
    createTitle: 'Apni dukaan ka account banayein',
    createSub: 'Naye shop owner · 2 minute mein dukaan tayar',
    signInTitle: 'Sign in karein',
    signInSub: 'Owner ya manager email ya mobile se login karein',
    joinTitle: 'Staff ke taur par dukaan join karein',
    joinSub: 'Cashier ya stockkeeper jo owner ne bulaya ho',
    counterPrompt: 'Counter par pehle se PIN bana hua hai?',
    counterLink: 'Counter sign-in (4-digit PIN)',
  },
  ur: {
    dir: 'rtl',
    pitch: 'فروخت، اسٹاک اور دن کا حساب کتاب — سب ایک ہی جگہ۔',
    bullets: [
      'نقد، کارڈ، جاز کیش اور کھاتہ پر سیکنڈوں میں بل بنائیں',
      'بارکوڈ اسکین سے اسٹاک شامل کریں اور کم اسٹاک الرٹ پائیں',
      'کمپیوٹر، ٹیبلٹ اور موبائل پر Supabase کے ساتھ لائیو سنک',
    ],
    caption: 'اونر ہوم — آج کی فروخت، کیش ڈراور اور کھاتہ ایک نظر میں۔',
    welcomeTitle: 'ZYRO Retail POS میں خوش آمدید',
    welcomeSub: 'آپ کس طرح آغاز کرنا چاہتے ہیں؟',
    createTitle: 'اپنی دکان کا اکاؤنٹ بنائیں',
    createSub: 'نئے مالک کے لیے · دو منٹ میں دکان تیار کریں',
    signInTitle: 'سائن ان کریں',
    signInSub: 'مالک اور منیجر ای میل یا موبائل نمبر کے ساتھ',
    joinTitle: 'اسٹاف کے طور پر شامل ہوں',
    joinSub: 'کیشیئر یا اسٹاک کیپر جنہیں مالک نے شامل کیا ہو',
    counterPrompt: 'کیا آپ کا کاؤنٹر پن پہلے سے موجود ہے؟',
    counterLink: 'کاؤنٹر سائن ان (4 ہندسوں کا پن)',
  },
};

const REGISTER_STEPS = [
  { n: 1, label: 'Your number', sub: 'Mobile & terms' },
  { n: 2, label: 'SMS code', sub: '6-digit verification' },
  { n: 3, label: 'About you', sub: 'Name, email & password' },
  { n: 4, label: 'Your shop', sub: 'Name, city & receipt' },
  { n: 5, label: 'What you sell', sub: 'Starter categories' },
  { n: 6, label: 'Ready', sub: 'Open your shop' },
];

const JOIN_STEPS = [
  { n: 1, label: 'Your number', sub: 'Find your shop invite' },
  { n: 2, label: 'SMS code', sub: 'Verify your mobile' },
  { n: 3, label: 'Your PIN', sub: '4-digit counter PIN' },
  { n: 4, label: 'Done', sub: 'Ready at counter' },
];

export function AuthView({
  onSuccess,
  initialMode = 'welcome',
  initialEmail = '03465629140',
  onModeChange,
}: {
  onSuccess: (user: StaffUser) => void;
  initialMode?: AuthScreenMode;
  initialEmail?: string;
  onModeChange?: (mode: AuthScreenMode) => void;
}) {
  const [mode, setMode] = useState<AuthScreenMode>(initialMode);
  const [lang, setLang] = useState<LangCode>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Owner Sign In state
  const [identifier, setIdentifier] = useState(initialEmail);
  const [password, setPassword] = useState('zyro1234');
  const [showPwd, setShowPwd] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [forgotStage, setForgotStage] = useState<'none' | 'request' | 'reset'>('none');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetDemoCode, setResetDemoCode] = useState('');
  const [resetNewPwd, setResetNewPwd] = useState('');

  // 6-step Register wizard state
  const [regStep, setRegStep] = useState(1);
  const [regPhone, setRegPhone] = useState('300 4829105');
  const [regTerms, setRegTerms] = useState(true);
  const [regPhoneTaken, setRegPhoneTaken] = useState(false);
  const [regOtp, setRegOtp] = useState('');
  const [regDemoOtp, setRegDemoOtp] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShowPwd, setRegShowPwd] = useState(false);
  const [regShopName, setRegShopName] = useState('');
  const [regCity, setRegCity] = useState('Lahore');
  const [regArea, setRegArea] = useState('Liberty Market, Gulberg III');
  const [regBranches, setRegBranches] = useState('1');
  const [regShowLogo, setRegShowLogo] = useState(true);
  const [regShopKind, setRegShopKind] = useState<ShopKind>('clothing');
  const [createdUser, setCreatedUser] = useState<StaffUser | null>(null);

  // 4-step Staff Join state
  const [joinStep, setJoinStep] = useState(1);
  const [joinPhone, setJoinPhone] = useState('321 7710293');
  const [joinName, setJoinName] = useState('');
  const [joinLookupInfo, setJoinLookupInfo] = useState<{
    found: boolean;
    shopName: string;
    branchName: string;
    staffName: string;
    role: StaffUser['role'];
  } | null>(null);
  const [joinOtp, setJoinOtp] = useState('');
  const [joinDemoOtp, setJoinDemoOtp] = useState('');
  const [joinPin, setJoinPin] = useState('');
  const [joinedUser, setJoinedUser] = useState<StaffUser | null>(null);

  // Counter Sign-In state
  const [counterTab, setCounterTab] = useState<'pin' | 'email'>('pin');
  const [counterBranch, setCounterBranch] = useState('Main Branch');
  const [counterPin, setCounterPin] = useState('');
  const [nowTime, setNowTime] = useState(() => new Date());

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (initialEmail) setIdentifier(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (mode !== 'signin') return;
    const t = window.setInterval(() => setNowTime(new Date()), 15000);
    return () => window.clearInterval(t);
  }, [mode]);

  const copy = COPY[lang];

  function switchMode(next: AuthScreenMode) {
    setMode(next);
    setError('');
    setNotice('');
    setForgotStage('none');
    onModeChange?.(next);
  }

  // ==================== OWNER SIGN IN HANDLERS ====================
  async function handleOwnerLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const res = await api.login(identifier.trim(), password);
      setStoredToken(res.token, keepSignedIn);
      onSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Check your details.');
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickRoleLogin(email: string) {
    setIdentifier(email);
    setPassword('zyro1234');
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, 'zyro1234');
      setStoredToken(res.token, keepSignedIn);
      onSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quick sign-in failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotRequest(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!resetIdentifier.trim()) {
      setError('Enter your registered email or mobile number.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.forgotPassword(resetIdentifier.trim());
      setResetDemoCode(res.demoCode);
      setResetCode(res.demoCode);
      setForgotStage('reset');
      setNotice('6-digit reset code issued. Enter it below with your new password.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reset code.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotComplete(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (resetNewPwd.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(resetIdentifier.trim(), resetCode.trim(), resetNewPwd);
      setIdentifier(resetIdentifier.trim());
      setPassword(resetNewPwd);
      setForgotStage('none');
      setNotice('Password updated! You can now sign in with your new password.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed.');
    } finally {
      setLoading(false);
    }
  }

  // ==================== REGISTER 6-STEP HANDLERS ====================
  async function handleRegisterNext() {
    setError('');
    setNotice('');
    const fullPhone = `+92 ${regPhone.trim()}`;

    if (regStep === 1) {
      const digits = regPhone.replace(/\D/g, '');
      if (digits.length < 9) {
        setError('Enter a valid Pakistan mobile number (e.g. 300 4829105).');
        return;
      }
      if (!regTerms) {
        setError('Please accept the terms and privacy notice to continue.');
        return;
      }
      setLoading(true);
      try {
        const chk = await api.checkPhone(fullPhone);
        setRegPhoneTaken(chk.exists);
        if (chk.exists) {
          setError('This mobile number already has a ZYRO account. Sign in instead or use another number.');
          return;
        }
        const otpRes = await api.sendOtp(fullPhone, 'verify');
        setRegDemoOtp(otpRes.demoCode);
        setRegOtp(otpRes.demoCode);
        setRegStep(2);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not send verification SMS.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (regStep === 2) {
      if (regOtp.replace(/\D/g, '').length !== 6) {
        setError('Enter the 6-digit verification code.');
        return;
      }
      setLoading(true);
      try {
        await api.verifyOtp(fullPhone, regOtp, 'verify');
        setRegStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification code did not match.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (regStep === 3) {
      if (!regName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (regEmail.trim() && !regEmail.includes('@')) {
        setError('Please enter a valid email address or leave it blank to use your mobile number.');
        return;
      }
      if (regPassword.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (!regShopName.trim()) {
        setRegShopName(`${regName.trim().split(' ')[0]}'s Retail Store`);
      }
      setRegStep(4);
      return;
    }

    if (regStep === 4) {
      if (!regShopName.trim()) {
        setError('Enter your shop name — it appears on every customer receipt.');
        return;
      }
      setRegStep(5);
      return;
    }

    if (regStep === 5) {
      setLoading(true);
      try {
        const res = await api.register({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          shopName: regShopName.trim(),
          phone: fullPhone,
          city: regCity,
          area: regArea.trim(),
          branchCount: regBranches,
          shopKind: regShopKind,
          showLogoOnReceipt: regShowLogo,
        });
        setStoredToken(res.token, true);
        setCreatedUser(res.user);
        setRegStep(6);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not create your shop account.');
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleResendRegOtp() {
    setError('');
    setLoading(true);
    try {
      const otpRes = await api.sendOtp(`+92 ${regPhone.trim()}`, 'verify');
      setRegDemoOtp(otpRes.demoCode);
      setRegOtp(otpRes.demoCode);
      setNotice('Fresh 6-digit SMS code sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  }

  // ==================== STAFF JOIN 4-STEP HANDLERS ====================
  async function handleJoinNext() {
    setError('');
    setNotice('');
    const fullPhone = `+92 ${joinPhone.trim()}`;

    if (joinStep === 1) {
      if (joinPhone.replace(/\D/g, '').length < 9) {
        setError('Enter the mobile number your shop owner added for you.');
        return;
      }
      setLoading(true);
      try {
        const info = await api.joinLookup(fullPhone);
        setJoinLookupInfo(info);
        if (info.found && !joinName) setJoinName(info.staffName);
        const otpRes = await api.sendOtp(fullPhone, 'join');
        setJoinDemoOtp(otpRes.demoCode);
        setJoinOtp(otpRes.demoCode);
        setJoinStep(2);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not look up staff number.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (joinStep === 2) {
      if (joinOtp.replace(/\D/g, '').length !== 6) {
        setError('Enter the 6-digit SMS verification code.');
        return;
      }
      setLoading(true);
      try {
        await api.verifyOtp(fullPhone, joinOtp, 'join');
        setJoinStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid verification code.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (joinStep === 3) {
      if (joinPin.replace(/\D/g, '').length !== 4) {
        setError('Choose a 4-digit counter PIN.');
        return;
      }
      setLoading(true);
      try {
        const res = await api.joinComplete({
          phone: fullPhone,
          code: joinOtp,
          pin: joinPin,
          name: joinName.trim() || joinLookupInfo?.staffName,
        });
        setStoredToken(res.token, true);
        setJoinedUser(res.user);
        setJoinStep(4);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save your counter PIN.');
      } finally {
        setLoading(false);
      }
    }
  }

  // ==================== COUNTER SIGN-IN HANDLERS ====================
  async function submitCounterPin(pinValue: string) {
    setError('');
    setLoading(true);
    try {
      const res = await api.pinLogin(pinValue, undefined, counterBranch);
      setStoredToken(res.token, true);
      onSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid 4-digit PIN.');
      setCounterPin('');
    } finally {
      setLoading(false);
    }
  }

  function pressPinDigit(d: string) {
    if (loading) return;
    setError('');
    if (d === 'clear') {
      setCounterPin('');
      return;
    }
    if (d === 'back') {
      setCounterPin((p) => p.slice(0, -1));
      return;
    }
    const next = (counterPin + d).slice(0, 4);
    setCounterPin(next);
    if (next.length === 4) {
      void submitCounterPin(next);
    }
  }

  const pwdHasLen = regPassword.length >= 6;
  const pwdHasLetter = /[A-Za-z]/.test(regPassword);
  const pwdHasNum = /\d/.test(regPassword);

  const langSwitcher = (
    <div
      role="tablist"
      aria-label="Language"
      className="inline-flex items-center p-1 rounded-[10px] bg-[#ECE4D8] gap-0.5"
    >
      {(
        [
          { id: 'en', label: 'English' },
          { id: 'roman', label: 'Roman' },
          { id: 'ur', label: 'اردو' },
        ] as { id: LangCode; label: string }[]
      ).map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={lang === item.id}
          onClick={() => setLang(item.id)}
          className={`px-3 h-8 rounded-[8px] text-[13px] font-semibold transition-all ${
            item.id === 'ur' ? 'font-urdu' : ''
          } ${
            lang === item.id
              ? 'bg-white text-[#162660] shadow-[0_1px_3px_rgba(12,20,50,0.12)]'
              : 'text-[#5B6585] hover:text-[#162660]'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  // =========================================================================
  // 1. WELCOME SCREEN (CreateAccount.jsx welcome flow)
  // =========================================================================
  if (mode === 'welcome') {
    return (
      <div
        dir={copy.dir}
        className={`min-h-screen w-full bg-[#F1E4D1] text-[#162660] flex flex-col lg:flex-row ${
          lang === 'ur' ? 'font-urdu' : ''
        }`}
      >
        {/* Left Navy Brand Panel (Desktop) / Top Strip (Mobile) */}
        <aside
          aria-label="ZYRO Retail POS"
          className="w-full lg:w-[460px] xl:w-[540px] shrink-0 bg-[#162660] text-white px-5 py-6 sm:px-8 sm:py-8 lg:p-10 flex flex-col gap-5 lg:gap-7"
        >
          <div className="flex items-center gap-3">
            <ZyroLogo size={44} />
            <div className="min-w-0">
              <span className="text-[20px] font-bold tracking-tight block leading-none">
                ZYRO Retail POS
              </span>
              <span className="text-[12px] text-[#A9BCE0] block mt-1">
                Point of Sale & Shop Command
              </span>
            </div>
          </div>

          <p className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold leading-[1.2] tracking-[-0.02em] max-w-[460px]">
            {copy.pitch}
          </p>

          <ul className="hidden sm:flex flex-col gap-3">
            {copy.bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-[15px] text-[#BFD0EE]">
                <span className="w-[26px] h-[26px] rounded-full bg-white/10 text-[#7FD6A4] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* Live miniature preview of Owner Home (matches CreateAccount.jsx figure) */}
          <figure className="hidden lg:flex flex-col gap-2.5 mt-auto pt-2">
            <div
              aria-hidden="true"
              dir="ltr"
              className="rounded-[16px] overflow-hidden bg-[#F1E4D1] text-[#162660] shadow-[0_18px_48px_rgba(12,20,50,0.34)] border border-white/10 p-3 select-none"
            >
              {/* Miniature Hero */}
              <div className="rounded-[14px] bg-gradient-to-br from-[#0F1B47] to-[#162660] text-white p-3.5 pb-7 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[9px] font-semibold text-[#BFD0EE]">
                      Main Branch · Live Shift
                    </p>
                    <p className="text-[13px] font-bold">Today at ZYRO Flagship Store</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7FD6A4]" />
                    Shift open
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="text-[11px] text-[#D0E6FD] font-semibold">Rs</span>
                  <span className="text-[22px] font-bold tabular-num tracking-tight">31,150</span>
                  <span className="text-[9px] text-[#BFD0EE] ml-1">3 bills today</span>
                </div>
              </div>
              {/* Floating quick actions preview */}
              <div className="-mt-4 mx-2 rounded-[12px] bg-white border border-[#E9E1D5] shadow-sm p-2 grid grid-cols-4 gap-1.5">
                {[
                  { label: 'New sale', dark: true },
                  { label: 'Add stock', dark: false },
                  { label: 'Close day', dark: false },
                  { label: 'Orders', dark: false },
                ].map((act) => (
                  <div
                    key={act.label}
                    className={`rounded-[8px] py-1.5 px-1 text-center text-[9px] font-bold ${
                      act.dark
                        ? 'bg-[#162660] text-white'
                        : 'bg-[#EEF5FE] text-[#162660]'
                    }`}
                  >
                    {act.label}
                  </div>
                ))}
              </div>
              {/* Mini KPI strip */}
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                <div className="bg-white rounded-[10px] border border-[#E9E1D5] p-2">
                  <p className="text-[8px] text-[#5B6585] font-semibold">Customers owe</p>
                  <p className="text-[11px] font-bold tabular-num mt-0.5">Rs 24,100</p>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E9E1D5] p-2">
                  <p className="text-[8px] text-[#5B6585] font-semibold">In drawer</p>
                  <p className="text-[11px] font-bold tabular-num text-[#14532D] mt-0.5">Rs 21,500</p>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E9E1D5] p-2">
                  <p className="text-[8px] text-[#5B6585] font-semibold">Low stock</p>
                  <p className="text-[11px] font-bold tabular-num text-[#B42318] mt-0.5">3 items</p>
                </div>
              </div>
            </div>
            <figcaption className="text-[13px] text-[#A9BCE0]">{copy.caption}</figcaption>
          </figure>
        </aside>

        {/* Right Warm Sand Stage (NO outer white card box — matches CreateAccount.jsx!) */}
        <main className="flex-1 min-w-0 flex flex-col justify-between p-5 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="flex justify-end">{langSwitcher}</div>

          <div className="w-full max-w-[500px] mx-auto my-auto py-8 flex flex-col gap-6 anim-zup">
            <div>
              <h1 className="text-[28px] sm:text-[34px] font-bold text-[#162660] tracking-[-0.02em] leading-[1.15]">
                {copy.welcomeTitle}
              </h1>
              <p className="text-[16px] text-[#454F70] mt-2">{copy.welcomeSub}</p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Primary Card: Create my shop's account */}
              <button
                type="button"
                onClick={() => {
                  setRegStep(1);
                  switchMode('register');
                }}
                className="zyro-bp w-full min-h-[84px] rounded-[16px] bg-[#162660] text-white px-5 py-4 flex items-center gap-4 text-start shadow-[0_10px_24px_rgba(22,38,96,0.2)]"
              >
                <span className="w-12 h-12 rounded-full bg-[#D0E6FD] text-[#162660] flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[17px] font-bold leading-snug">
                    {copy.createTitle}
                  </span>
                  <span className="block text-[13px] text-[#BFD0EE] mt-0.5">
                    {copy.createSub}
                  </span>
                </span>
                <ChevronRight className="w-5 h-5 text-[#D0E6FD] shrink-0" />
              </button>

              {/* Option 2: Sign in */}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="zyro-opt w-full min-h-[84px] rounded-[16px] bg-white border border-[#E9E1D5] text-[#162660] px-5 py-4 flex items-center gap-4 text-start shadow-[0_2px_8px_rgba(12,20,50,0.04)]"
              >
                <span className="w-12 h-12 rounded-full bg-[#EEF5FE] text-[#162660] flex items-center justify-center shrink-0">
                  <LogIn className="w-6 h-6" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[17px] font-bold leading-snug">
                    {copy.signInTitle}
                  </span>
                  <span className="block text-[13px] text-[#5B6585] mt-0.5">
                    {copy.signInSub}
                  </span>
                </span>
                <ChevronRight className="w-5 h-5 text-[#5B6585] shrink-0" />
              </button>

              {/* Option 3: Join my shop as staff */}
              <button
                type="button"
                onClick={() => {
                  setJoinStep(1);
                  switchMode('join');
                }}
                className="zyro-opt w-full min-h-[84px] rounded-[16px] bg-white border border-[#E9E1D5] text-[#162660] px-5 py-4 flex items-center gap-4 text-start shadow-[0_2px_8px_rgba(12,20,50,0.04)]"
              >
                <span className="w-12 h-12 rounded-full bg-[#F6F0E7] text-[#162660] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[17px] font-bold leading-snug">
                    {copy.joinTitle}
                  </span>
                  <span className="block text-[13px] text-[#5B6585] mt-0.5">
                    {copy.joinSub}
                  </span>
                </span>
                <ChevronRight className="w-5 h-5 text-[#5B6585] shrink-0" />
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[14px] text-[#454F70] border-t border-[#E9E1D5]">
              <span>{copy.counterPrompt}</span>
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="font-bold text-[#2E46A0] hover:text-[#162660] hover:underline inline-flex items-center gap-1"
              >
                <KeyRound className="w-4 h-4" />
                {copy.counterLink}
              </button>
            </div>
          </div>

          <p className="text-[12px] text-[#5B6585] text-center lg:text-start">
            ZYRO Retail POS · Complete retail billing, stock, Khata & shift control
          </p>
        </main>
      </div>
    );
  }

  // =========================================================================
  // 2. CREATE SHOP ACCOUNT — 6-STEP WIZARD (CreateAccount.jsx)
  // =========================================================================
  if (mode === 'register') {
    const progressPct = Math.round((regStep / 6) * 100);

    return (
      <div className="min-h-screen w-full bg-[#F1E4D1] text-[#162660] flex flex-col lg:flex-row">
        {/* Desktop 360px Navy Step Rail */}
        <aside className="hidden lg:flex w-[320px] xl:w-[360px] shrink-0 bg-[#162660] text-white p-8 flex-col justify-between">
          <div>
            <button
              type="button"
              onClick={() => switchMode('welcome')}
              className="flex items-center gap-3 text-left group"
            >
              <ZyroLogo size={42} />
              <div>
                <span className="text-[18px] font-bold block leading-tight">ZYRO Retail POS</span>
                <span className="text-[12px] text-[#A9BCE0]">Create your shop</span>
              </div>
            </button>

            <ol className="mt-9 flex flex-col gap-4">
              {REGISTER_STEPS.map((st) => {
                const done = regStep > st.n;
                const current = regStep === st.n;
                return (
                  <li key={st.n} className="flex items-center gap-3.5">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 transition-colors ${
                        done
                          ? 'bg-[#2F9E63] text-white'
                          : current
                            ? 'bg-[#D0E6FD] text-[#162660]'
                            : 'bg-white/10 text-[#A9BCE0]'
                      }`}
                    >
                      {done ? <Check className="w-4 h-4 stroke-[3]" /> : st.n}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-[15px] leading-tight ${
                          current ? 'font-bold text-white' : done ? 'font-semibold text-[#BFD0EE]' : 'font-medium text-[#A9BCE0]'
                        }`}
                      >
                        {st.label}
                      </p>
                      <p className="text-[12px] text-[#A9BCE0]/80 mt-0.5">{st.sub}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="pt-6 border-t border-white/10 text-[13px] text-[#BFD0EE]">
            Already have a ZYRO account?{' '}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="font-bold text-[#D0E6FD] hover:underline"
            >
              Sign in
            </button>
          </div>
        </aside>

        {/* Mobile Top Progress Bar */}
        <header className="lg:hidden bg-white border-b border-[#E9E1D5] px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => (regStep === 1 ? switchMode('welcome') : setRegStep((s) => s - 1))}
              className="w-9 h-9 rounded-full bg-[#F6F0E7] flex items-center justify-center text-[#162660]"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <p className="text-[14px] font-bold text-[#162660]">
                {REGISTER_STEPS[regStep - 1]?.label}
              </p>
              <p className="text-[12px] text-[#5B6585]">Step {regStep} of 6</p>
            </div>
            <ZyroLogo size={34} />
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#ECE4D8] overflow-hidden">
            <div
              className="h-full bg-[#162660] rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </header>

        {/* Right Warm Sand Content + Footer */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-12">
            <div
              className={`mx-auto w-full anim-zup ${
                regStep === 4 || regStep === 5 ? 'max-w-[820px]' : 'max-w-[520px]'
              }`}
            >
              <div className="mb-6">
                <p className="text-[13px] font-semibold text-[#5B6585]">
                  Step {regStep} of 6 · {REGISTER_STEPS[regStep - 1]?.label}
                </p>
                <h1 className="text-[26px] sm:text-[32px] font-bold text-[#162660] tracking-[-0.02em] mt-1">
                  {regStep === 1 && 'Start with your mobile number'}
                  {regStep === 2 && 'Enter the 6-digit SMS code'}
                  {regStep === 3 && 'Tell us about yourself'}
                  {regStep === 4 && 'Set up your shop details'}
                  {regStep === 5 && 'What does your shop sell?'}
                  {regStep === 6 && `${regShopName || 'Your shop'} is ready!`}
                </h1>
                <p className="text-[15px] text-[#454F70] mt-1.5">
                  {regStep === 1 && 'We use your number for security alerts and fast password recovery.'}
                  {regStep === 2 && 'Check the verification code issued for your mobile number.'}
                  {regStep === 3 && 'You will be the shop owner with full access to all counters and settings.'}
                  {regStep === 4 && 'These details print at the top of every 80mm thermal bill.'}
                  {regStep === 5 && 'Pick your main retail category — we will pre-build your starter categories.'}
                  {regStep === 6 && 'Your owner account, shop profile and starter categories are saved.'}
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-[14px] bg-[#FDF0EF] border border-[#F2C4BE] px-4 py-3 text-[14px] font-semibold text-[#B42318] flex flex-wrap items-center justify-between gap-2">
                  <span>{error}</span>
                  {regPhoneTaken && (
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier(`+92 ${regPhone.trim()}`);
                        switchMode('login');
                      }}
                      className="underline font-bold text-[#162660]"
                    >
                      Sign in instead
                    </button>
                  )}
                </div>
              )}

              {notice && (
                <div className="mb-5 rounded-[14px] bg-[#E8F6EE] border border-[#B7E4C7] px-4 py-3 text-[14px] font-semibold text-[#14532D]">
                  {notice}
                </div>
              )}

              {/* STEP 1: MOBILE NUMBER */}
              {regStep === 1 && (
                <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 space-y-5">
                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-2">
                      Mobile number
                    </label>
                    <div className="zyro-field flex items-center h-[54px] rounded-[12px] border bg-white overflow-hidden">
                      <span className="h-full px-4 bg-[#F8F2E9] border-r border-[#E9E1D5] flex items-center gap-1.5 text-[15px] font-bold text-[#162660] select-none">
                        <Phone className="w-4 h-4 text-[#5B6585]" />
                        +92
                      </span>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => {
                          setRegPhone(e.target.value);
                          setRegPhoneTaken(false);
                        }}
                        placeholder="300 4829105"
                        className="flex-1 h-full px-3.5 text-[16px] font-medium bg-transparent focus:outline-none tabular-num"
                      />
                    </div>
                    <p className="text-[12px] text-[#5B6585] mt-1.5">
                      Pakistan mobile number without the leading 0.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-[12px] bg-[#F8F2E9]">
                    <input
                      type="checkbox"
                      checked={regTerms}
                      onChange={(e) => setRegTerms(e.target.checked)}
                      className="mt-0.5 w-5 h-5 accent-[#162660] rounded"
                    />
                    <span className="text-[14px] text-[#454F70] leading-snug">
                      I agree to the <strong className="text-[#162660]">ZYRO Retail POS</strong> terms of service and understand my sales and stock data are stored securely for my shop.
                    </span>
                  </label>
                </div>
              )}

              {/* STEP 2: SMS CODE */}
              {regStep === 2 && (
                <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-[12px] bg-[#F8F2E9]">
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#2E46A0]" />
                      <span className="text-[15px] font-bold tabular-num">+92 {regPhone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="text-[13px] font-bold text-[#2E46A0] hover:underline"
                    >
                      Change number
                    </button>
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-2">
                      6-digit verification code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={regOtp}
                      onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="zyro-field w-full h-[60px] rounded-[12px] border bg-white text-center font-mono text-[26px] font-bold tracking-[0.35em] focus:outline-none"
                    />
                  </div>

                  {regDemoOtp && (
                    <div className="rounded-[12px] bg-[#EAF2FD] border border-[#B5D3F5] px-4 py-2.5 text-[13px] text-[#24398A] flex items-center justify-between gap-2">
                      <span>
                        Instant code (no SMS provider needed):{' '}
                        <strong className="font-mono text-[15px]">{regDemoOtp}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleResendRegOtp}
                        disabled={loading}
                        className="font-bold underline shrink-0"
                      >
                        Resend
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: ABOUT YOU */}
              {regStep === 3 && (
                <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 space-y-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Hamza Siddiqui"
                      className="zyro-field w-full h-[50px] rounded-[12px] border px-3.5 text-[15px] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                      Email address <span className="font-normal text-[#5B6585]">(optional — mobile login works directly)</span>
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="hamza@myshop.pk"
                      className="zyro-field w-full h-[50px] rounded-[12px] border px-3.5 text-[15px] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                      Password
                    </label>
                    <div className="zyro-field flex items-center h-[50px] rounded-[12px] border bg-white overflow-hidden">
                      <input
                        type={regShowPwd ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="flex-1 h-full px-3.5 text-[15px] bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPwd((s) => !s)}
                        className="h-full px-3.5 bg-[#F6F0E7] hover:bg-[#ECE4D8] text-[#162660] text-[13px] font-semibold flex items-center gap-1.5"
                      >
                        {regShowPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {regShowPwd ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { ok: pwdHasLen, text: '6+ characters' },
                        { ok: pwdHasLetter, text: 'Includes a letter' },
                        { ok: pwdHasNum, text: 'Includes a number' },
                      ].map((rule) => (
                        <div
                          key={rule.text}
                          className={`flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-[8px] ${
                            rule.ok
                              ? 'bg-[#E8F6EE] text-[#14532D]'
                              : 'bg-[#F8F2E9] text-[#5B6585]'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${rule.ok ? 'opacity-100' : 'opacity-30'}`} />
                          {rule.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: YOUR SHOP + LIVE 80MM RECEIPT PREVIEW */}
              {regStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  <div className="md:col-span-7 bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 space-y-4">
                    <div>
                      <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                        Shop name
                      </label>
                      <input
                        type="text"
                        value={regShopName}
                        onChange={(e) => setRegShopName(e.target.value)}
                        placeholder="e.g. Hamza Fashion"
                        className="zyro-field w-full h-[50px] rounded-[12px] border px-3.5 text-[15px] font-medium focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                          City
                        </label>
                        <select
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          className="zyro-field w-full h-[50px] rounded-[12px] border px-3 text-[15px] bg-white focus:outline-none"
                        >
                          {CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                          Market / Area
                        </label>
                        <input
                          type="text"
                          value={regArea}
                          onChange={(e) => setRegArea(e.target.value)}
                          placeholder="Liberty Market, Gulberg"
                          className="zyro-field w-full h-[50px] rounded-[12px] border px-3.5 text-[15px] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[14px] font-semibold text-[#162660] mb-2">
                        How many branches?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['1', '2-3', '4+'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setRegBranches(b)}
                            className={`h-11 rounded-[12px] border text-[14px] font-bold transition-colors ${
                              regBranches === b
                                ? 'bg-[#162660] text-white border-[#162660]'
                                : 'bg-[#F8F2E9] text-[#162660] border-[#D9CFC0] hover:bg-[#ECE4D8]'
                            }`}
                          >
                            {b === '1' ? '1 branch' : `${b} branches`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center justify-between gap-3 p-3.5 rounded-[12px] bg-[#F8F2E9] cursor-pointer">
                      <div>
                        <p className="text-[14px] font-semibold text-[#162660]">
                          Show shop mark on receipts
                        </p>
                        <p className="text-[12px] text-[#5B6585]">
                          Prints cleanly on 80mm thermal paper
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={regShowLogo}
                        onChange={(e) => setRegShowLogo(e.target.checked)}
                        className="w-5 h-5 accent-[#162660]"
                      />
                    </label>
                  </div>

                  {/* Live 80mm Receipt Preview */}
                  <div className="md:col-span-5 bg-[#F8F2E9] border border-[#E9E1D5] rounded-[20px] p-4 flex flex-col items-center">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B6585] mb-3">
                      Live 80mm receipt preview
                    </p>
                    <div className="w-full max-w-[270px] bg-white border border-dashed border-[#C8BCAA] rounded-[12px] p-4 font-mono text-[11px] text-[#111] shadow-sm">
                      <div className="text-center border-b border-dashed border-[#C8BCAA] pb-2.5 mb-2.5">
                        {regShowLogo && (
                          <div className="flex justify-center mb-1.5">
                            <ZyroLogo size={28} />
                          </div>
                        )}
                        <p className="text-[14px] font-bold uppercase">
                          {regShopName.trim() || 'YOUR SHOP NAME'}
                        </p>
                        <p className="text-[#555]">{regArea || 'Main Market'}, {regCity}</p>
                        <p className="text-[#555]">Tel: +92 {regPhone}</p>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Bill #B-1049</span>
                        <span>Cash</span>
                      </div>
                      <div className="border-y border-dashed border-[#C8BCAA] py-2 my-2 space-y-1">
                        <div className="flex justify-between">
                          <span>1 x Cotton Kurta</span>
                          <span>Rs 3,450</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1 x Leather Wallet</span>
                          <span>Rs 1,750</span>
                        </div>
                      </div>
                      <div className="flex justify-between font-bold text-[13px]">
                        <span>TOTAL</span>
                        <span>Rs 5,200</span>
                      </div>
                      <p className="text-center text-[10px] text-[#666] mt-3 pt-2 border-t border-dashed border-[#C8BCAA]">
                        Thank you! · ZYRO Retail POS
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: WHAT YOU SELL */}
              {regStep === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SHOP_KINDS.map((kind) => {
                    const selected = regShopKind === kind.id;
                    return (
                      <button
                        key={kind.id}
                        type="button"
                        onClick={() => setRegShopKind(kind.id)}
                        className={`zyro-opt rounded-[16px] p-4 text-left border-2 transition-all flex flex-col gap-2 ${
                          selected
                            ? 'bg-[#EEF5FE] border-[#162660] shadow-[0_6px_18px_rgba(22,38,96,0.12)]'
                            : 'bg-white border-[#E9E1D5]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[14px] font-bold"
                            style={{ backgroundColor: kind.tintBg, color: kind.tintFg }}
                          >
                            {kind.label.slice(0, 2).toUpperCase()}
                          </span>
                          {selected && (
                            <span className="w-6 h-6 rounded-full bg-[#162660] text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-[15px] font-bold text-[#162660] leading-tight">
                          {kind.label}
                        </p>
                        <p className="text-[12px] text-[#5B6585] leading-snug">{kind.desc}</p>
                        <div className="mt-auto pt-2 flex flex-wrap gap-1">
                          {kind.cats.slice(0, 3).map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-full bg-[#F8F2E9] text-[#454F70] text-[11px] font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 6: READY */}
              {regStep === 6 && (
                <div className="space-y-5">
                  <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 flex items-center gap-4">
                    <span className="w-14 h-14 rounded-full bg-[#E8F6EE] text-[#14532D] flex items-center justify-center shrink-0">
                      <Sparkles className="w-7 h-7" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[18px] font-bold text-[#162660] truncate">
                        {regShopName}
                      </p>
                      <p className="text-[14px] text-[#454F70] truncate">
                        {regArea ? `${regArea}, ` : ''}
                        {regCity} · Owner: {createdUser?.name || regName} ({createdUser?.email || regEmail})
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { n: '1', t: 'Add or scan your stock', d: 'Use barcode scan-in or add items with prices.' },
                      { n: '2', t: 'Open today’s cash shift', d: 'Enter your opening float so cash stays balanced.' },
                      { n: '3', t: 'Ring up bills at counter', d: 'Cash, card, JazzCash, EasyPaisa & Khata ready.' },
                      { n: '4', t: 'Invite your counter team', d: 'Give cashiers a 4-digit PIN in Settings.' },
                    ].map((card) => (
                      <div
                        key={card.n}
                        className="bg-white border border-[#E9E1D5] rounded-[16px] p-4 flex items-start gap-3"
                      >
                        <span className="w-7 h-7 rounded-full bg-[#EEF5FE] text-[#162660] text-[13px] font-bold flex items-center justify-center shrink-0">
                          {card.n}
                        </span>
                        <div>
                          <p className="text-[15px] font-bold text-[#162660]">{card.t}</p>
                          <p className="text-[13px] text-[#5B6585] mt-0.5">{card.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Sticky Wizard Footer */}
          <footer className="bg-white border-t border-[#E9E1D5] px-5 sm:px-8 py-4 flex items-center justify-between gap-3 shrink-0">
            {regStep < 6 ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    if (regStep === 1) switchMode('welcome');
                    else setRegStep((s) => s - 1);
                  }}
                  className="zyro-bs h-12 px-5 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[15px] font-semibold inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRegisterNext}
                  className="zyro-bp h-12 px-6 rounded-[12px] bg-[#162660] text-white text-[15px] font-bold inline-flex items-center gap-2"
                >
                  {loading
                    ? 'Please wait...'
                    : regStep === 5
                      ? 'Create shop account'
                      : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (createdUser) onSuccess(createdUser);
                }}
                className="zyro-bp ml-auto h-12 px-7 rounded-[12px] bg-[#162660] text-white text-[15px] font-bold inline-flex items-center gap-2"
              >
                Go to Home
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </footer>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. STAFF JOIN — 4-STEP WIZARD (CreateAccount.jsx staff join flow)
  // =========================================================================
  if (mode === 'join') {
    return (
      <div className="min-h-screen w-full bg-[#F1E4D1] text-[#162660] flex flex-col lg:flex-row">
        <aside className="hidden lg:flex w-[320px] xl:w-[360px] shrink-0 bg-[#162660] text-white p-8 flex-col justify-between">
          <div>
            <button
              type="button"
              onClick={() => switchMode('welcome')}
              className="flex items-center gap-3 text-left"
            >
              <ZyroLogo size={42} />
              <div>
                <span className="text-[18px] font-bold block leading-tight">ZYRO Retail POS</span>
                <span className="text-[12px] text-[#A9BCE0]">Join my shop as staff</span>
              </div>
            </button>

            <ol className="mt-9 flex flex-col gap-4">
              {JOIN_STEPS.map((st) => {
                const done = joinStep > st.n;
                const current = joinStep === st.n;
                return (
                  <li key={st.n} className="flex items-center gap-3.5">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                        done
                          ? 'bg-[#2F9E63] text-white'
                          : current
                            ? 'bg-[#D0E6FD] text-[#162660]'
                            : 'bg-white/10 text-[#A9BCE0]'
                      }`}
                    >
                      {done ? <Check className="w-4 h-4 stroke-[3]" /> : st.n}
                    </span>
                    <div>
                      <p className={`text-[15px] ${current ? 'font-bold text-white' : 'text-[#BFD0EE]'}`}>
                        {st.label}
                      </p>
                      <p className="text-[12px] text-[#A9BCE0]/80">{st.sub}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="text-[13px] text-[#A9BCE0]">
            Need to sign in as owner?{' '}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="font-bold text-[#D0E6FD] hover:underline"
            >
              Owner sign in
            </button>
          </p>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-12">
            <div className="max-w-[500px] mx-auto anim-zup">
              <p className="text-[13px] font-semibold text-[#5B6585]">
                Staff setup · Step {joinStep} of 4
              </p>
              <h1 className="text-[28px] font-bold text-[#162660] mt-1">
                {joinStep === 1 && 'Enter your mobile number'}
                {joinStep === 2 && 'Verify SMS code'}
                {joinStep === 3 && 'Choose your 4-digit counter PIN'}
                {joinStep === 4 && 'You are ready at the counter!'}
              </h1>
              <p className="text-[15px] text-[#454F70] mt-1.5 mb-6">
                {joinStep === 1 && 'Enter the mobile number your shop owner added for you.'}
                {joinStep === 2 && `Joining ${joinLookupInfo?.shopName || 'ZYRO Flagship Store'} (${joinLookupInfo?.branchName || 'Main Branch'}).`}
                {joinStep === 3 && 'Use this 4-digit PIN whenever you switch onto a shop counter.'}
                {joinStep === 4 && 'Your PIN is saved and active for quick counter sign-in.'}
              </p>

              {error && (
                <div className="mb-4 rounded-[14px] bg-[#FDF0EF] border border-[#F2C4BE] px-4 py-3 text-[14px] font-semibold text-[#B42318]">
                  {error}
                </div>
              )}

              {joinStep === 1 && (
                <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 space-y-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                      Mobile number
                    </label>
                    <div className="zyro-field flex items-center h-[52px] rounded-[12px] border bg-white overflow-hidden">
                      <span className="h-full px-4 bg-[#F8F2E9] border-r border-[#E9E1D5] flex items-center font-bold">
                        +92
                      </span>
                      <input
                        type="tel"
                        value={joinPhone}
                        onChange={(e) => setJoinPhone(e.target.value)}
                        placeholder="321 7710293"
                        className="flex-1 h-full px-3.5 text-[16px] tabular-num bg-transparent focus:outline-none"
                      />
                    </div>
                    <p className="text-[12px] text-[#5B6585] mt-1.5">
                      Tip: Demo cashier number is <strong className="font-mono">321 7710293</strong> (Sana Tariq) or enter your own.
                    </p>
                  </div>
                </div>
              )}

              {joinStep === 2 && (
                <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 space-y-4">
                  {joinLookupInfo && (
                    <div className="rounded-[12px] bg-[#E8F6EE] border border-[#B7E4C7] px-4 py-3 text-[14px] text-[#14532D]">
                      <p className="font-bold">
                        {joinLookupInfo.found ? `Invite found for ${joinLookupInfo.staffName}` : `Joining ${joinLookupInfo.shopName}`}
                      </p>
                      <p className="text-[12px] mt-0.5">
                        {joinLookupInfo.shopName} · {joinLookupInfo.branchName} · Role: {joinLookupInfo.role}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                      6-digit SMS code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={joinOtp}
                      onChange={(e) => setJoinOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="zyro-field w-full h-[58px] rounded-[12px] border text-center font-mono text-[24px] font-bold tracking-[0.35em] focus:outline-none"
                    />
                  </div>
                  {joinDemoOtp && (
                    <p className="text-[13px] text-[#24398A] bg-[#EAF2FD] px-3.5 py-2 rounded-[10px]">
                      Verification code: <strong className="font-mono">{joinDemoOtp}</strong>
                    </p>
                  )}
                </div>
              )}

              {joinStep === 3 && (
                <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 space-y-4">
                  {!joinLookupInfo?.found && (
                    <div>
                      <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                        Your full name
                      </label>
                      <input
                        type="text"
                        value={joinName}
                        onChange={(e) => setJoinName(e.target.value)}
                        placeholder="e.g. Ali Hassan"
                        className="zyro-field w-full h-[50px] rounded-[12px] border px-3.5 text-[15px] focus:outline-none"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                      4-digit counter PIN
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={joinPin}
                      onChange={(e) => setJoinPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="••••"
                      className="zyro-field w-full h-[58px] rounded-[12px] border text-center font-mono text-[28px] font-bold tracking-[0.5em] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {joinStep === 4 && (
                <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#E8F6EE] text-[#14532D] flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h2 className="text-[20px] font-bold text-[#162660]">
                    Welcome, {joinedUser?.name}!
                  </h2>
                  <p className="text-[14px] text-[#454F70]">
                    Your 4-digit counter PIN is active. You can open the register now.
                  </p>
                </div>
              )}
            </div>
          </main>

          <footer className="bg-white border-t border-[#E9E1D5] px-5 sm:px-8 py-4 flex items-center justify-between gap-3">
            {joinStep < 4 ? (
              <>
                <button
                  type="button"
                  onClick={() => (joinStep === 1 ? switchMode('welcome') : setJoinStep((s) => s - 1))}
                  className="zyro-bs h-12 px-5 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[15px] font-semibold inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleJoinNext}
                  className="zyro-bp h-12 px-6 rounded-[12px] bg-[#162660] text-white text-[15px] font-bold inline-flex items-center gap-2"
                >
                  {loading ? 'Working...' : joinStep === 3 ? 'Save PIN & Join' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => joinedUser && onSuccess(joinedUser)}
                className="zyro-bp ml-auto h-12 px-7 rounded-[12px] bg-[#162660] text-white text-[15px] font-bold inline-flex items-center gap-2"
              >
                Open Counter
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </footer>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. COUNTER SIGN-IN SCREEN (SignIn.jsx — live clock + branch + 4-digit PIN)
  // =========================================================================
  if (mode === 'signin') {
    const timeStr = nowTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const dateStr = nowTime.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    return (
      <div className="min-h-screen w-full bg-[#F1E4D1] text-[#162660] flex flex-col lg:flex-row">
        {/* Left 440px Navy Clock & Shift Panel (SignIn.jsx) */}
        <aside className="w-full lg:w-[400px] xl:w-[440px] shrink-0 bg-[#162660] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
          <div className="flex items-center gap-3">
            <ZyroLogo size={48} />
            <div>
              <span className="text-[18px] font-bold block leading-tight">ZYRO Flagship Store</span>
              <span className="text-[13px] text-[#A9BCE0]">Counter 1 · ZYRO Retail POS</span>
            </div>
          </div>

          <div className="flex lg:flex-col items-baseline lg:items-start justify-between gap-2 my-1 lg:my-6">
            <span className="num text-[44px] sm:text-[56px] lg:text-[64px] font-bold tracking-[-0.03em] leading-none">
              {timeStr}
            </span>
            <span className="text-[15px] sm:text-[17px] text-[#BFD0EE]">{dateStr}</span>
          </div>

          <div className="space-y-4">
            <div className="rounded-[16px] bg-[#F1E4D1]/10 p-4 flex items-start gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F1E4D1]/15 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </span>
              <div>
                <p className="text-[15px] font-bold">Counter 1 shift is open</p>
                <p className="text-[13px] text-[#BFD0EE] leading-relaxed mt-0.5">
                  Signing in switches the active operator without closing or changing the cash drawer.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[13px] text-[#A9BCE0]">
              <Cloud className="w-4 h-4 text-[#7FD6A4]" />
              <span>Online · signed-in sessions stay synced</span>
            </div>
          </div>
        </aside>

        {/* Right Counter Form & PIN Pad */}
        <main className="flex-1 min-w-0 flex flex-col justify-center p-5 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-[440px] mx-auto space-y-5 anim-zup">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-[26px] font-bold text-[#162660]">Counter sign-in</h1>
                <p className="text-[14px] text-[#5B6585] mt-0.5">
                  Pick your branch and enter your PIN or credentials
                </p>
              </div>
              <button
                type="button"
                onClick={() => switchMode('welcome')}
                className="text-[13px] font-bold text-[#2E46A0] hover:underline"
              >
                Welcome
              </button>
            </div>

            {/* Branch Radio Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {['Main Branch', 'DHA Branch'].map((br) => {
                const active = counterBranch === br;
                return (
                  <button
                    key={br}
                    type="button"
                    onClick={() => setCounterBranch(br)}
                    className={`zyro-opt h-12 px-3.5 rounded-[12px] border flex items-center gap-2.5 text-[14px] font-bold ${
                      active
                        ? 'bg-[#EEF5FE] border-[#162660] text-[#162660]'
                        : 'bg-white border-[#E9E1D5] text-[#454F70]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">{br}</span>
                  </button>
                );
              })}
            </div>

            {/* Segmented Mode Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-[12px] bg-[#ECE4D8] gap-1">
              <button
                type="button"
                onClick={() => {
                  setCounterTab('pin');
                  setError('');
                }}
                className={`h-10 rounded-[10px] text-[14px] font-bold transition-all ${
                  counterTab === 'pin'
                    ? 'bg-white text-[#162660] shadow-xs'
                    : 'text-[#5B6585] hover:text-[#162660]'
                }`}
              >
                4-digit PIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setCounterTab('email');
                  setError('');
                }}
                className={`h-10 rounded-[10px] text-[14px] font-bold transition-all ${
                  counterTab === 'email'
                    ? 'bg-white text-[#162660] shadow-xs'
                    : 'text-[#5B6585] hover:text-[#162660]'
                }`}
              >
                Email & Password
              </button>
            </div>

            {error && (
              <div className="rounded-[12px] bg-[#FDF0EF] border border-[#F2C4BE] px-4 py-3 text-[13px] font-semibold text-[#B42318]">
                {error}
              </div>
            )}

            {counterTab === 'pin' ? (
              <div className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 space-y-5">
                <div className="flex items-center justify-center gap-4 py-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <span
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        idx < counterPin.length
                          ? 'bg-[#162660] border-[#162660] scale-110'
                          : 'bg-[#F8F2E9] border-[#C8BCAA]'
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      disabled={loading}
                      onClick={() => pressPinDigit(k)}
                      className={`h-14 rounded-[14px] border border-[#E9E1D5] font-bold text-[20px] tabular-num flex items-center justify-center transition-colors ${
                        k === 'clear' || k === 'back'
                          ? 'bg-[#F8F2E9] text-[#454F70] text-[14px] hover:bg-[#ECE4D8]'
                          : 'bg-white text-[#162660] hover:bg-[#F6F0E7] active:bg-[#ECE4D8]'
                      }`}
                    >
                      {k === 'back' ? (
                        <Delete className="w-5 h-5" />
                      ) : k === 'clear' ? (
                        'Clear'
                      ) : (
                        k
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#F6F0E7] flex flex-wrap items-center justify-center gap-2 text-[12px] text-[#5B6585]">
                  <span>Quick counter PINs:</span>
                  {[
                    { label: 'Owner · 1234', pin: '1234' },
                    { label: 'Cashier · 2222', pin: '2222' },
                    { label: 'Stock · 3333', pin: '3333' },
                  ].map((q) => (
                    <button
                      key={q.pin}
                      type="button"
                      onClick={() => void submitCounterPin(q.pin)}
                      className="px-2.5 py-1 rounded-full bg-[#F8F2E9] hover:bg-[#EEF5FE] text-[#162660] font-semibold"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleOwnerLogin}
                className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 space-y-4"
              >
                <div>
                  <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                    Email or mobile number
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="zyro-field w-full h-12 rounded-[12px] border px-3.5 text-[15px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                    Password
                  </label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="zyro-field w-full h-12 rounded-[12px] border px-3.5 text-[15px] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="zyro-bp w-full h-12 rounded-[12px] bg-[#162660] text-white text-[15px] font-bold"
                >
                  {loading ? 'Signing in...' : `Sign in to ${counterBranch}`}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // 5. OWNER SIGN IN (/login — CreateAccount.jsx sign-in rail + warm stage)
  // =========================================================================
  return (
    <div className="min-h-screen w-full bg-[#F1E4D1] text-[#162660] flex flex-col lg:flex-row">
      {/* Left 360px Navy Rail */}
      <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 bg-[#162660] text-white p-6 sm:p-8 flex flex-col justify-between gap-6">
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => switchMode('welcome')}
            className="flex items-center gap-3 text-left"
          >
            <ZyroLogo size={44} />
            <div>
              <span className="text-[19px] font-bold block leading-tight">ZYRO Retail POS</span>
              <span className="text-[12px] text-[#A9BCE0]">Owners and managers</span>
            </div>
          </button>

          <div className="hidden lg:block space-y-2 pt-2">
            <h2 className="text-[22px] font-bold leading-snug">
              Sign in to manage your shop
            </h2>
            <p className="text-[14px] text-[#BFD0EE] leading-relaxed">
              Access today’s live sales, stock levels, supplier orders, Khata balances and cash drawer shifts.
            </p>
          </div>

          <div className="hidden lg:flex rounded-[16px] bg-white/10 p-4 flex-col gap-2">
            <p className="text-[13px] font-bold text-[#D0E6FD]">
              Working on a counter?
            </p>
            <p className="text-[13px] text-[#BFD0EE] leading-snug">
              Cashiers and stockkeepers can sign in faster using their 4-digit counter PIN.
            </p>
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="mt-1 text-left text-[13px] font-bold text-white underline"
            >
              Open counter sign-in →
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-[13px] text-[#BFD0EE] flex items-center justify-between lg:block">
          <span>New to ZYRO? </span>
          <button
            type="button"
            onClick={() => {
              setRegStep(1);
              switchMode('register');
            }}
            className="font-bold text-[#D0E6FD] hover:underline"
          >
            Create your shop&apos;s account
          </button>
        </div>
      </aside>

      {/* Right Warm Sand Stage */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-[480px] mx-auto anim-zup">
            {forgotStage === 'none' ? (
              <>
                <div className="mb-6">
                  <p className="text-[13px] font-semibold text-[#5B6585]">Owner & Manager Sign In</p>
                  <h1 className="text-[28px] sm:text-[32px] font-bold text-[#162660] tracking-[-0.02em] mt-1">
                    Sign in to ZYRO
                  </h1>
                  <p className="text-[15px] text-[#454F70] mt-1">
                    Use your email address or registered mobile number.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-[14px] bg-[#FDF0EF] border border-[#F2C4BE] px-4 py-3 text-[14px] font-semibold text-[#B42318]">
                    {error}
                  </div>
                )}
                {notice && (
                  <div className="mb-4 rounded-[14px] bg-[#E8F6EE] border border-[#B7E4C7] px-4 py-3 text-[14px] font-semibold text-[#14532D]">
                    {notice}
                  </div>
                )}

                <form
                  id="owner-login-form"
                  onSubmit={handleOwnerLogin}
                  className="bg-white border border-[#E9E1D5] rounded-[20px] p-5 sm:p-6 space-y-4"
                >
                  <div>
                    <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                      Email or mobile number
                    </label>
                    <div className="zyro-field flex items-center h-[52px] rounded-[12px] border bg-white px-3.5 gap-2.5">
                      <Mail className="w-4 h-4 text-[#5B6585] shrink-0" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="03465629140 or owner@zyropos.app"
                        className="flex-1 h-full text-[15px] bg-transparent focus:outline-none"
                      />
                    </div>
                    <p className="text-[12px] text-[#5B6585] mt-1.5">
                      Sign in directly with mobile number + password — no SMS OTP or Twilio needed.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[14px] font-semibold text-[#162660]">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetIdentifier(identifier);
                          setForgotStage('request');
                          setError('');
                          setNotice('');
                        }}
                        className="text-[13px] font-bold text-[#2E46A0] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="zyro-field flex items-center h-[52px] rounded-[12px] border bg-white overflow-hidden">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="flex-1 h-full px-3.5 text-[15px] bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="h-full px-3.5 bg-[#F6F0E7] hover:bg-[#ECE4D8] text-[#162660] text-[13px] font-semibold inline-flex items-center gap-1.5"
                      >
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPwd ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="w-4 h-4 accent-[#162660] rounded"
                    />
                    <span className="text-[14px] text-[#454F70]">Keep me signed in on this browser</span>
                  </label>
                </form>

                {/* Quick demo role access */}
                <div className="mt-5">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B6585] mb-2">
                    Quick sign-in by role (password: zyro1234)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Owner', sub: '03465629140', email: '03465629140' },
                      { label: 'Cashier', sub: 'Sana Tariq', email: 'cashier@zyropos.app' },
                      { label: 'Stock', sub: 'Usman Raza', email: 'stock@zyropos.app' },
                    ].map((r) => (
                      <button
                        key={r.email}
                        type="button"
                        disabled={loading}
                        onClick={() => handleQuickRoleLogin(r.email)}
                        className="zyro-opt bg-white border border-[#E9E1D5] rounded-[12px] px-3 py-2.5 text-left"
                      >
                        <p className="text-[13px] font-bold text-[#162660]">{r.label}</p>
                        <p className="text-[11px] text-[#5B6585] truncate">{r.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : forgotStage === 'request' ? (
              <form
                onSubmit={handleForgotRequest}
                className="bg-white border border-[#E9E1D5] rounded-[20px] p-6 space-y-4"
              >
                <div>
                  <h1 className="text-[24px] font-bold text-[#162660]">Reset your password</h1>
                  <p className="text-[14px] text-[#5B6585] mt-1">
                    Enter your email or mobile number and we will issue a 6-digit verification code.
                  </p>
                </div>
                {error && (
                  <div className="rounded-[12px] bg-[#FDF0EF] border border-[#F2C4BE] px-4 py-2.5 text-[13px] font-semibold text-[#B42318]">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                    Email or mobile number
                  </label>
                  <input
                    type="text"
                    required
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder="owner@zyropos.app"
                    className="zyro-field w-full h-12 rounded-[12px] border px-3.5 text-[15px] focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStage('none')}
                    className="zyro-bs h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
                  >
                    {loading ? 'Sending...' : 'Send reset code'}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleForgotComplete}
                className="bg-white border border-[#E9E1D5] rounded-[20px] p-6 space-y-4"
              >
                <div>
                  <h1 className="text-[24px] font-bold text-[#162660]">Set a new password</h1>
                  <p className="text-[14px] text-[#5B6585] mt-1">
                    For <strong>{resetIdentifier}</strong>
                  </p>
                </div>
                {error && (
                  <div className="rounded-[12px] bg-[#FDF0EF] border border-[#F2C4BE] px-4 py-2.5 text-[13px] font-semibold text-[#B42318]">
                    {error}
                  </div>
                )}
                {resetDemoCode && (
                  <div className="rounded-[12px] bg-[#EAF2FD] border border-[#B5D3F5] px-4 py-2.5 text-[13px] text-[#24398A]">
                    Reset code: <strong className="font-mono">{resetDemoCode}</strong>
                  </div>
                )}
                <div>
                  <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                    6-digit code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="zyro-field w-full h-12 rounded-[12px] border px-3.5 font-mono text-[18px] tracking-widest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-[#162660] mb-1.5">
                    New password (6+ chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={resetNewPwd}
                    onChange={(e) => setResetNewPwd(e.target.value)}
                    className="zyro-field w-full h-12 rounded-[12px] border px-3.5 text-[15px] focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStage('none')}
                    className="zyro-bs h-11 px-4 rounded-[12px] border border-[#D9CFC0] bg-white text-[14px] font-semibold"
                  >
                    Back to sign in
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="zyro-bp h-11 px-5 rounded-[12px] bg-[#162660] text-white text-[14px] font-bold"
                  >
                    {loading ? 'Updating...' : 'Save new password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>

        {forgotStage === 'none' && (
          <footer className="bg-white border-t border-[#E9E1D5] px-5 sm:px-8 py-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => switchMode('welcome')}
              className="zyro-bs h-12 px-5 rounded-[12px] border border-[#D9CFC0] bg-white text-[#162660] text-[15px] font-semibold inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="submit"
              form="owner-login-form"
              disabled={loading}
              className="zyro-bp h-12 px-7 rounded-[12px] bg-[#162660] text-white text-[15px] font-bold inline-flex items-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
