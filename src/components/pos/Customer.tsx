// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  CUSTOMERS,
  ICONS,
  STAFF,
  chip,
  digits,
  initials,
  n,
  openBoard,
  phoneFmt
} from '@/lib/common';

var __G: any = typeof window !== 'undefined' ? window : globalThis;

const DEFAULT_PROPS: Record<string, any> = {
  "demo": "recent"
};

function normPhone(v) { var d = digits(v, 13); if (d.indexOf('92') === 0) d = d.slice(2); if (d.indexOf('0') === 0) d = d.slice(1); return d.slice(0, 10); }
class CustomerBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

  constructor(props) {
    super(props);
    var demo = (props && props.demo) || 'recent';
    this.state = { mode: demo === 'new' ? 'new' : 'find', q: demo === 'search' ? '321' : (demo === 'noMatch' ? '0300 7654321' : ''), nPhone: demo === 'new' ? '300 7654321' : '', nName: demo === 'new' ? 'Faisal Iqbal' : '', consent: true };
  }
  renderVals() {
    var self = this, s = this.state, p = this.props || {};
    var q = s.q.trim(), qd = normPhone(q), isPhoneQ = /^[\d\s+\-]+$/.test(q) && qd.length > 0;
    var list = CUSTOMERS.filter(function (c) {
      if (!q) return true;
      if (isPhoneQ) return normPhone(c.phone).indexOf(qd) >= 0;
      return c.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
    });
    var rows = list.map(function (c, i) {
      var st = STAFF[i % 3];
      return { name: c.name, ini: initials(c.name), phone: phoneFmt(c.phone), last: c.last, current: c.id === p.currentId, owes: c.khata > 0,
        avBg: ['#EAF2FD', '#F1E4D1', '#F1E6D6', '#E5EDE3', '#ECE6EF'][i % 5], avFg: ['#24398A', '#7A5320', '#6B4A1E', '#2F4A2E', '#4A3A5A'][i % 5],
        chip: c.khata > 0 ? chip('warn', 'Owes Rs ' + n(c.khata)) : chip('neutral', 'Khata clear'),
        pick: function () { if (p.onPick) p.onPick(c); else openBoard('Main'); } };
    });
    var phoneDigits = normPhone(s.nPhone), phoneGood = /^3\d{9}$/.test(phoneDigits);
    var exists = phoneGood && CUSTOMERS.some(function (c) { return normPhone(c.phone) === phoneDigits; });
    var nameGood = s.nName.trim().length >= 2;
    var cantSave = !phoneGood || !nameGood || exists;
    return {
      ic: ICONS, isFind: s.mode === 'find', isNew: s.mode === 'new',
      title: s.mode === 'new' ? 'New customer' : 'Add customer to bill',
      subtitle: s.mode === 'new' ? 'Two fields. Everything else can wait.' : 'Search by mobile number first, then name.',
      q: s.q, hasQ: !!q, inputMode: isPhoneQ || !q ? 'tel' : 'text',
      onQ: function (e) { self.setState({ q: e.target.value }); }, clearQ: function () { self.setState({ q: '' }); },
      listLabel: q ? (rows.length ? rows.length + (rows.length === 1 ? ' match' : ' matches') : 'No matches') : 'Recent customers',
      rows: rows, noMatch: !!q && rows.length === 0,
      noMatchTitle: isPhoneQ ? 'No customer with 0' + qd.slice(0, 3) + ' ' + qd.slice(3) : 'No customer named “' + q + '”',
      toNew: function () { self.setState({ mode: 'new', nPhone: isPhoneQ ? qd.slice(0, 3) + ' ' + qd.slice(3) : '', nName: isPhoneQ ? '' : q }); },
      toFind: function () { self.setState({ mode: 'find' }); },
      nPhone: s.nPhone, nName: s.nName,
      onPhone: function (e) { self.setState({ nPhone: e.target.value.replace(/[^\d\s]/g, '').slice(0, 13) }); },
      onName: function (e) { self.setState({ nName: e.target.value.slice(0, 40) }); },
      phoneBd: s.nPhone && !phoneGood ? '#B42318' : '#D9CFC0',
      phoneHint: exists ? 'This number already belongs to a customer. Go back and search it.' : (s.nPhone && !phoneGood ? 'Pakistani mobile numbers have 10 digits after +92, starting with 3.' : 'WhatsApp receipts go to this number.'),
      phoneHintFg: exists || (s.nPhone && !phoneGood) ? '#B42318' : '#5B6585',
      consent: s.consent, consentStr: s.consent ? 'true' : 'false', boxBg: s.consent ? '#2E46A0' : '#ffffff', boxBd: s.consent ? '#2E46A0' : '#8A8276',
      toggleConsent: function () { self.setState({ consent: !self.state.consent }); },
      cantSave: cantSave, why: !phoneGood ? 'Enter a mobile number to save' : (exists ? 'Number already saved' : 'Add the customer’s name to save'),
      save: function () {
        if (cantSave) return;
        var cu = { id: 'n' + phoneDigits, name: s.nName.trim(), phone: '0' + phoneDigits, khata: 0, last: 'Today', whatsapp: s.consent };
        if (p.onPick) p.onPick(cu); else self.setState({ mode: 'find', q: '' });
      },
      close: function () { if (p.onClose) p.onClose(); else openBoard('Main'); }
    };
  }
}

export default class Customer extends CustomerBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div role="dialog" aria-modal="true" aria-labelledby="cust-title" style={dcStyle("width:560px;height:660px;max-width:100%;max-height:100%;background:#ffffff;border-radius:22px;box-shadow:0 24px 64px rgba(12,20,50,.3);display:flex;flex-direction:column;overflow:hidden;color:#162660;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:15px;animation:zsheet .25s ease-out")}><div style={dcStyle("display:flex;align-items:center;gap:14px;padding:22px 24px 16px")}><span style={dcStyle("width:48px;height:48px;flex:none;border-radius:999px;background:#F6F0E7;color:#162660;display:flex;align-items:center;justify-content:center")}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.userPlus) == null || (v?.ic?.userPlus) === false ? undefined : (v?.ic?.userPlus) === true ? '' : String(v?.ic?.userPlus)}></path></svg></span><div style={dcStyle("flex:1;min-width:0")}><h2 id="cust-title" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{dcStr(v?.title)}</h2><p style={dcStyle("margin:3px 0 0;font-size:13px;color:#5B6585")}>{dcStr(v?.subtitle)}</p></div><button onClick={(typeof (v?.close) === 'function' ? (v?.close) : undefined) as any} aria-label="Close" style={dcStyle("width:44px;height:44px;flex:none;border:0;border-radius:999px;background:#F6F0E7;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.x) == null || (v?.ic?.x) === false ? undefined : (v?.ic?.x) === true ? '' : String(v?.ic?.x)}></path></svg></button></div>{Boolean(v?.isFind) ? (<><div style={dcStyle("padding:0 24px 12px")}><label htmlFor="cust-q" className="sr">{"Customer phone or name"}</label><div className="field" style={dcStyle("height:56px;display:flex;align-items:center;gap:10px;border:1px solid #D9CFC0;border-radius:14px;padding:0 8px 0 8px")}><span style={dcStyle("height:40px;flex:none;padding:0 10px;border-radius:10px;background:#F6F0E7;color:#454F70;font-size:15px;font-weight:600;display:flex;align-items:center;gap:6px")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.phone) == null || (v?.ic?.phone) === false ? undefined : (v?.ic?.phone) === true ? '' : String(v?.ic?.phone)}></path></svg>{"+92"}</span><input id="cust-q" type="search" inputMode={(v?.inputMode) == null || (v?.inputMode) === false ? undefined : (v?.inputMode) === true ? '' : String(v?.inputMode)} autoComplete="off" value={dcStr(v?.q)} onChange={(typeof (v?.onQ) === 'function' ? (v?.onQ) : undefined) as any} placeholder="3XX XXXXXXX, or a name" style={dcStyle("flex:1;min-width:0;height:44px;border:0;outline:0;background:transparent;font-size:17px")} />{Boolean(v?.hasQ) ? (<><button onClick={(typeof (v?.clearQ) === 'function' ? (v?.clearQ) : undefined) as any} aria-label="Clear search" style={dcStyle("width:40px;height:40px;flex:none;border:0;border-radius:999px;background:transparent;color:#5B6585;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.x) == null || (v?.ic?.x) === false ? undefined : (v?.ic?.x) === true ? '' : String(v?.ic?.x)}></path></svg></button></>) : null}</div><p style={dcStyle("margin:6px 2px 0;font-size:13px;color:#5B6585")}>{"Type 0300… or 300…; both work."}</p></div><div style={dcStyle("flex:1;min-height:0;overflow:auto;padding:4px 16px 12px")}><div style={dcStyle("padding:6px 8px 8px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#5B6585")}>{dcStr(v?.listLabel)}</div>{(v?.rows || []).map((r: any, $index: number) => (<React.Fragment key={$index}><button className="row" onClick={(typeof (r?.pick) === 'function' ? (r?.pick) : undefined) as any} style={dcStyle("width:100%;min-height:72px;display:flex;align-items:center;gap:14px;padding:10px 8px;border:0;border-radius:14px;background:transparent;text-align:left")}><span style={dcStyle(("width:44px;height:44px;flex:none;border-radius:999px;background:" + dcStr(r?.avBg) + ";color:" + dcStr(r?.avFg) + ";display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700"))}>{dcStr(r?.ini)}</span><span style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:3px")}><span style={dcStyle("display:flex;align-items:center;gap:8px")}><span style={dcStyle("font-size:15px;font-weight:600")}>{dcStr(r?.name)}</span>{Boolean(r?.current) ? (<><span style={dcStyle("height:22px;padding:0 8px;border-radius:999px;background:#EEF5FE;color:#7A5320;font-size:13px;font-weight:600;display:inline-flex;align-items:center")}>{"On this bill"}</span></>) : null}</span><span className="num" style={dcStyle("font-size:13px;color:#5B6585")}>{(dcStr(r?.phone) + " · Last visit " + dcStr(r?.last))}</span></span><span style={dcStyle(("height:26px;flex:none;padding:0 9px;border-radius:999px;background:" + dcStr(r?.chip?.bg) + ";color:" + dcStr(r?.chip?.fg) + ";font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:5px"))}>{Boolean(r?.owes) ? (<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.warn) == null || (v?.ic?.warn) === false ? undefined : (v?.ic?.warn) === true ? '' : String(v?.ic?.warn)}></path></svg></>) : null}<span className="num">{dcStr(r?.chip?.text)}</span></span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8276" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle("flex:none")}><path d={(v?.ic?.right) == null || (v?.ic?.right) === false ? undefined : (v?.ic?.right) === true ? '' : String(v?.ic?.right)}></path></svg></button></React.Fragment>))}{Boolean(v?.noMatch) ? (<><div style={dcStyle("margin:8px 8px 0;padding:22px 20px;border:1px dashed #D9CFC0;border-radius:16px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center")}><span style={dcStyle("width:56px;height:56px;border-radius:999px;background:#F6F0E7;color:#5B6585;display:flex;align-items:center;justify-content:center")}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.user) == null || (v?.ic?.user) === false ? undefined : (v?.ic?.user) === true ? '' : String(v?.ic?.user)}></path></svg></span><span className="num" style={dcStyle("font-size:17px;font-weight:600")}>{dcStr(v?.noMatchTitle)}</span><span style={dcStyle("font-size:13px;color:#5B6585")}>{"New customers need only a name and a mobile number."}</span></div></>) : null}</div><div style={dcStyle("padding:14px 24px 20px;border-top:1px solid #F6F0E7;display:flex;gap:10px")}><button className="bs" onClick={(typeof (v?.toNew) === 'function' ? (v?.toNew) : undefined) as any} style={dcStyle("flex:1;height:56px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;font-size:16px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.plus) == null || (v?.ic?.plus) === false ? undefined : (v?.ic?.plus) === true ? '' : String(v?.ic?.plus)}></path></svg>{"New customer"}</button></div></>) : null}{Boolean(v?.isNew) ? (<><div style={dcStyle("flex:1;min-height:0;overflow:auto;padding:4px 24px 12px;display:flex;flex-direction:column;gap:16px")}><div style={dcStyle("display:flex;flex-direction:column;gap:6px")}><label htmlFor="nc-phone" style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Mobile number"}</label><div className="field" style={dcStyle(("height:56px;display:flex;align-items:center;gap:10px;border:1px solid " + dcStr(v?.phoneBd) + ";border-radius:14px;padding:0 8px"))}><span style={dcStyle("height:40px;flex:none;padding:0 10px;border-radius:10px;background:#F6F0E7;color:#454F70;font-size:15px;font-weight:600;display:flex;align-items:center")}>{"+92"}</span><input id="nc-phone" className="num" type="tel" inputMode="tel" autoComplete="off" value={dcStr(v?.nPhone)} onChange={(typeof (v?.onPhone) === 'function' ? (v?.onPhone) : undefined) as any} placeholder="300 1234567" style={dcStyle("flex:1;min-width:0;height:44px;border:0;outline:0;background:transparent;font-size:17px")} /></div><span style={dcStyle(("font-size:13px;color:" + dcStr(v?.phoneHintFg)))}>{dcStr(v?.phoneHint)}</span></div><div style={dcStyle("display:flex;flex-direction:column;gap:6px")}><label htmlFor="nc-name" style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Name"}</label><div className="field" style={dcStyle("height:56px;display:flex;align-items:center;border:1px solid #D9CFC0;border-radius:14px;padding:0 14px")}><input id="nc-name" autoComplete="off" value={dcStr(v?.nName)} onChange={(typeof (v?.onName) === 'function' ? (v?.onName) : undefined) as any} placeholder="As the customer says it" style={dcStyle("flex:1;min-width:0;height:44px;border:0;outline:0;background:transparent;font-size:17px")} /></div></div><button role="checkbox" aria-checked={(v?.consentStr) == null || (v?.consentStr) === false ? undefined : (v?.consentStr) === true ? '' : String(v?.consentStr)} onClick={(typeof (v?.toggleConsent) === 'function' ? (v?.toggleConsent) : undefined) as any} style={dcStyle("display:flex;align-items:flex-start;gap:12px;padding:14px;border:1px solid #E9E1D5;border-radius:14px;background:#F8F2E9;text-align:left")}><span style={dcStyle(("width:24px;height:24px;flex:none;border-radius:6px;border:2px solid " + dcStr(v?.boxBd) + ";background:" + dcStr(v?.boxBg) + ";display:flex;align-items:center;justify-content:center;color:#ffffff"))}>{Boolean(v?.consent) ? (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.check) == null || (v?.ic?.check) === false ? undefined : (v?.ic?.check) === true ? '' : String(v?.ic?.check)}></path></svg></>) : null}</span><span style={dcStyle("display:flex;flex-direction:column;gap:3px")}><span style={dcStyle("font-size:15px;font-weight:600")}>{"Send receipts on WhatsApp"}</span><span style={dcStyle("font-size:13px;line-height:1.5;color:#5B6585")}>{"Tick only if the customer agreed. They can say stop at any time."}</span></span></button><div style={dcStyle("display:flex;gap:10px;align-items:center;padding:12px 14px;border-radius:14px;background:#EAF2FD;color:#24398A;font-size:13px;line-height:1.5")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle("flex:none")}><path d={(v?.ic?.info) == null || (v?.ic?.info) === false ? undefined : (v?.ic?.info) === true ? '' : String(v?.ic?.info)}></path></svg><span>{"Khata starts at Rs 0. A credit limit can be set later in Khata."}</span></div></div><div style={dcStyle("padding:14px 24px 20px;border-top:1px solid #F6F0E7;display:flex;flex-direction:column;gap:6px")}><div style={dcStyle("display:flex;gap:10px")}><button className="bs" onClick={(typeof (v?.toFind) === 'function' ? (v?.toFind) : undefined) as any} style={dcStyle("height:56px;padding:0 20px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;font-size:16px;font-weight:600")}>{"Back"}</button><button className="bs" onClick={(typeof (v?.save) === 'function' ? (v?.save) : undefined) as any} disabled={Boolean(v?.cantSave)} style={dcStyle("flex:1;height:56px;border:1px solid #162660;border-radius:14px;background:#ffffff;color:#162660;font-size:16px;font-weight:700")}>{"Save and add to bill"}</button></div>{Boolean(v?.cantSave) ? (<><span style={dcStyle("font-size:13px;color:#5B6585;text-align:right")}>{dcStr(v?.why)}</span></>) : null}</div></>) : null}</div>
      </>
    );
  }
}
