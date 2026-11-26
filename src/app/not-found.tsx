'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, ShoppingBag, LayoutGrid } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="min-h-[100dvh] w-full bg-[#F1E4D1] text-[#162660] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[520px] bg-white border border-[#E9E1D5] rounded-[20px] shadow-[0_18px_48px_rgba(12,20,50,0.12)] p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[12px] bg-[#162660] text-white flex items-center justify-center font-bold text-[18px] shrink-0">
            Z
          </div>
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-wider text-[#5B6585]">
              ZYRO Retail POS
            </div>
            <div className="text-[14px] text-[#454F70]">Error 404 · Page not found</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-[26px] sm:text-[30px] font-bold leading-tight text-[#162660]">
            We couldn’t find that page
          </h1>
          <p className="m-0 text-[15px] leading-relaxed text-[#454F70]">
            The link may be outdated or the route does not exist. Choose where you want to continue below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <Link
            href="/"
            className="bk h-12 px-4 rounded-[12px] bg-[#162660] text-white font-semibold text-[15px] no-underline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Welcome page</span>
          </Link>
          <Link
            href="/owner"
            className="bs h-12 px-4 rounded-[12px] bg-white text-[#162660] border border-[#D9CFC0] font-semibold text-[15px] no-underline flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Owner Home</span>
          </Link>
          <Link
            href="/sell"
            className="bs h-12 px-4 rounded-[12px] bg-white text-[#162660] border border-[#D9CFC0] font-semibold text-[15px] no-underline flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>POS Register</span>
          </Link>
          <Link
            href="/modules"
            className="bs h-12 px-4 rounded-[12px] bg-[#EEF5FE] text-[#162660] border border-[#B5D3F5] font-semibold text-[15px] no-underline flex items-center justify-center gap-2"
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>All 57 Modules</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
