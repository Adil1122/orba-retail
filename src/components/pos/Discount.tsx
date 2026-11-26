// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  FBR_FEE,
  ICONS,
  MANAGER_PIN,
  SET,
  digits,
  n,
  openBoard,
  rs,
  toInt
} from '@/lib/common';


const DEFAULT_PROPS: Record<string, any> = {
  "subtotal": 7850,
  "staffRole": "Cashier",
  "demo": "none"
};

var REASONS = [
{ id: 'eid', label: 'Eid offer' },
{ id: 'regular', label: 'Regular customer' },
{ id: 'damaged', label: 'Damaged or display piece' },
{ id: 'match', label: 'Price match' },
{ id: 'other', label: 'Other' }
];
var LIMIT_PCT = 10, LIMIT_RS = 1000;
class DiscountBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

constructor(props) {
super(props);
var p = props || {}, c = p.current, demo = p.demo && p.demo !== 'none' ? p.demo : (p.onApply ? 'none' : 'filled');
if (c) this.state = { mode: c.mode, value: String(c.value), reason: (REASONS.filter(function (r) { return r.label === c.reason; })[0] || { id: 'other' }).id, other: c.reason, pin: '', err: false };
else if (demo === 'overLimit') this.state = { mode: 'pct', value: '20', reason: 'damaged', other: '', pin: '', err: false };
else if (demo === 'filled') this.state = { mode: 'pct', value: '10', reason: 'eid', other: '', pin: '', err: false };
else this.state = { mode: 'pct', value: '', reason: null, other: '', pin: '', err: false };
}
renderVals() {
LIMIT_PCT = SET.ap.disc;
var self = this, s = this.state, p = this.props || {};
var sub = p.subtotal || 7850, isPct = s.mode === 'pct';
var v = toInt(s.value);
var off = isPct ? Math.round(sub * Math.min(v, 100) / 100) : v;
var tooBig = !isPct && v > sub || isPct && v > 100;
var over = isPct ? v > LIMIT_PCT : v > LIMIT_RS;
var isMgr = p.staffRole === 'Manager';
var needPin = over && !isMgr && !tooBig;
var pinOk = s.pin === MANAGER_PIN;
var seg = function (on) { return { bg: on ? '#ffffff' : 'transparent', fg: on ? '#162660' : '#454F70', sh: on ? '0 1px 2px rgba(22,30,60,.08)' : 'none' }; };
var a = seg(isPct), b = seg(!isPct);
var quick = (isPct ? [5, 10, 15, 20] : [100, 250, 500, 1000]).map(function (q) {
var on = v === q;
return { label: isPct ? q + '%' : 'Rs ' + n(q), on: on ? 'true' : 'false', border: on ? '2px solid #2E46A0' : '1px solid #D9CFC0', bg: on ? '#EEF5FE' : '#ffffff', pick: function () { self.setState({ value: String(q), pin: '', err: false }); } };
});
var reasons = REASONS.map(function (r) { var on = s.reason === r.id; return { label: r.label, checked: on ? 'true' : 'false', border: on ? '2px solid #2E46A0' : '1px solid #D9CFC0', bg: on ? '#EEF5FE' : '#ffffff', pick: function () { self.setState({ reason: r.id }); } }; });
var reasonText = s.reason === 'other' ? s.other.trim() : (REASONS.filter(function (r) { return r.id === s.reason; })[0] || {}).label;
var why = !v ? 'Enter a discount' : (tooBig ? 'Lower the discount' : (!reasonText ? 'Pick a reason' : (needPin && !pinOk ? 'Manager PIN needed above ' + (isPct ? LIMIT_PCT + '%' : 'Rs ' + n(LIMIT_RS)) : '')));
var cantApply = !!why;
return {
ic: ICONS, subN: n(sub), limitText: isMgr ? 'Manager · no limit' : 'Your limit ' + LIMIT_PCT + '% or Rs ' + n(LIMIT_RS),
pctStr: isPct ? 'true' : 'false', rsStr: isPct ? 'false' : 'true', pctBg: a.bg, pctFg: a.fg, pctSh: a.sh, rsBg: b.bg, rsFg: b.fg, rsSh: b.sh,
usePct: function () { self.setState({ mode: 'pct', value: '', pin: '' }); }, useRs: function () { self.setState({ mode: 'rs', value: '', pin: '' }); },
isPct: isPct, isRs: !isPct, value: s.value, valBd: tooBig ? '#B42318' : '#D9CFC0',
onValue: function (e) { self.setState({ value: digits(e.target.value, isPct ? 3 : 6), pin: '', err: false }); },
offText: isPct && v && !tooBig ? '−Rs ' + n(off) : '', quick: quick, tooBig: tooBig,
reasons: reasons, isOther: s.reason === 'other', other: s.other, onOther: function (e) { self.setState({ other: e.target.value.slice(0, 60) }); },
needPin: needPin, pin: s.pin, pinBd: s.err ? '#B42318' : (pinOk ? '#2F9E63' : '#D9CFC0'), shake: s.err ? 'zshake .35s ease-out' : 'none',
pinHint: pinOk ? 'Approved · Imran' : (s.err ? 'Wrong PIN' : 'Test PIN 1234'), pinHintFg: pinOk ? '#14532D' : (s.err ? '#B42318' : '#5B6585'),
onPin: function (e) { var pv = digits(e.target.value, 4); self.setState({ pin: pv, err: pv.length === 4 && pv !== MANAGER_PIN }); },
newN: n(Math.max(0, sub - (tooBig ? 0 : off)) + FBR_FEE), offN: n(tooBig ? 0 : off), saves: off > 0 && !tooBig,
hasCurrent: !!p.current, cantApply: cantApply, why: why,
apply: function () { if (cantApply) return; var d = { mode: s.mode, value: v, reason: reasonText, approvedBy: needPin ? 'Imran' : null }; if (p.onApply) p.onApply(d); else openBoard('Main'); },
remove: function () { if (p.onRemove) p.onRemove(); else openBoard('Main'); },
close: function () { if (p.onClose) p.onClose(); else openBoard('Main'); }
};
}
}

export default class Discount extends DiscountBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div role="dialog" aria-modal="true" aria-labelledby="disc-title" style={dcStyle("width:560px;height:680px;max-width:100%;max-height:100%;background:#ffffff;border-radius:22px;box-shadow:0 24px 64px rgba(12,20,50,.3);display:flex;flex-direction:column;overflow:hidden;color:#162660;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:15px;animation:zsheet .25s ease-out")}><div style={dcStyle("display:flex;align-items:center;gap:14px;padding:22px 24px 14px")}><span style={dcStyle("width:48px;height:48px;flex:none;border-radius:999px;background:#F6F0E7;color:#162660;display:flex;align-items:center;justify-content:center")}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.percent) == null || (v?.ic?.percent) === false ? undefined : (v?.ic?.percent) === true ? '' : String(v?.ic?.percent)} /></svg></span><div style={dcStyle("flex:1;min-width:0")}><h2 id="disc-title" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{"Discount on this bill"}</h2><p className="num" style={dcStyle("margin:3px 0 0;font-size:13px;color:#5B6585")}>{("Subtotal Rs " + dcStr(v?.subN) + " · " + dcStr(v?.limitText))}</p></div><button onClick={(typeof (v?.close) === 'function' ? (v?.close) : undefined) as any} aria-label="Close" style={dcStyle("width:44px;height:44px;flex:none;border:0;border-radius:999px;background:#F6F0E7;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.x) == null || (v?.ic?.x) === false ? undefined : (v?.ic?.x) === true ? '' : String(v?.ic?.x)} /></svg></button></div><div style={dcStyle("flex:1;min-height:0;overflow:auto;padding:4px 24px 16px;display:flex;flex-direction:column;gap:16px")}><div role="group" aria-label="Discount type" style={dcStyle("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;padding:3px;border-radius:12px;background:#ECE4D8")}><button aria-pressed={(v?.pctStr) == null || (v?.pctStr) === false ? undefined : (v?.pctStr) === true ? '' : String(v?.pctStr)} onClick={(typeof (v?.usePct) === 'function' ? (v?.usePct) : undefined) as any} style={dcStyle(("height:44px;border:0;border-radius:9px;background:" + dcStr(v?.pctBg) + ";color:" + dcStr(v?.pctFg) + ";font-size:15px;font-weight:600;box-shadow:" + dcStr(v?.pctSh)))}>{"Percent %"}</button><button aria-pressed={(v?.rsStr) == null || (v?.rsStr) === false ? undefined : (v?.rsStr) === true ? '' : String(v?.rsStr)} onClick={(typeof (v?.useRs) === 'function' ? (v?.useRs) : undefined) as any} style={dcStyle(("height:44px;border:0;border-radius:9px;background:" + dcStr(v?.rsBg) + ";color:" + dcStr(v?.rsFg) + ";font-size:15px;font-weight:600;box-shadow:" + dcStr(v?.rsSh)))}>{"Amount Rs"}</button></div><div style={dcStyle("display:flex;flex-direction:column;gap:10px")}><label htmlFor="disc-v" className="sr">{"Discount value"}</label><div className="field" style={dcStyle(("height:64px;display:flex;align-items:center;gap:10px;border:1px solid " + dcStr(v?.valBd) + ";border-radius:16px;padding:0 18px"))}>{Boolean(v?.isRs) ? (<><span style={dcStyle("font-size:20px;font-weight:500;color:#5B6585")}>{"Rs"}</span></>) : null}<input id="disc-v" className="num" inputMode="numeric" autoComplete="off" value={dcStr(v?.value)} onChange={(typeof (v?.onValue) === 'function' ? (v?.onValue) : undefined) as any} placeholder="0" style={dcStyle("flex:1;min-width:0;border:0;outline:0;background:transparent;font-family:Outfit,sans-serif;font-size:34px;font-weight:700")} />{Boolean(v?.isPct) ? (<><span style={dcStyle("font-size:26px;font-weight:600;color:#5B6585")}>{"%"}</span></>) : null}<span className="num" style={dcStyle("font-size:15px;font-weight:600;color:#14532D")}>{dcStr(v?.offText)}</span></div><div style={dcStyle("display:flex;gap:8px")}>{(v?.quick || []).map((k: any, $index: number) => (<React.Fragment key={$index}><button className="opt" aria-pressed={(k?.on) == null || (k?.on) === false ? undefined : (k?.on) === true ? '' : String(k?.on)} onClick={(typeof (k?.pick) === 'function' ? (k?.pick) : undefined) as any} style={dcStyle(("flex:1;height:44px;border:" + dcStr(k?.border) + ";border-radius:12px;background:" + dcStr(k?.bg) + ";font-size:15px;font-weight:600"))}><span className="num">{dcStr(k?.label)}</span></button></React.Fragment>))}</div>{Boolean(v?.tooBig) ? (<><span style={dcStyle("font-size:13px;color:#B42318")}>{"A discount can’t be more than the subtotal."}</span></>) : null}</div><div role="radiogroup" aria-labelledby="reason-l" style={dcStyle("display:flex;flex-direction:column;gap:8px")}><span id="reason-l" style={dcStyle("font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#5B6585")}>{"Reason · required"}</span><div style={dcStyle("display:flex;flex-wrap:wrap;gap:8px")}>{(v?.reasons || []).map((r: any, $index: number) => (<React.Fragment key={$index}><button className="opt" role="radio" aria-checked={(r?.checked) == null || (r?.checked) === false ? undefined : (r?.checked) === true ? '' : String(r?.checked)} onClick={(typeof (r?.pick) === 'function' ? (r?.pick) : undefined) as any} style={dcStyle(("height:44px;padding:0 14px;border:" + dcStr(r?.border) + ";border-radius:999px;background:" + dcStr(r?.bg) + ";font-size:15px;font-weight:600"))}>{dcStr(r?.label)}</button></React.Fragment>))}</div>{Boolean(v?.isOther) ? (<><div className="field" style={dcStyle("height:52px;display:flex;align-items:center;border:1px solid #D9CFC0;border-radius:14px;padding:0 14px")}><label htmlFor="disc-other" className="sr">{"Other reason"}</label><input id="disc-other" autoComplete="off" value={dcStr(v?.other)} onChange={(typeof (v?.onOther) === 'function' ? (v?.onOther) : undefined) as any} placeholder="Say why, in a few words" style={dcStyle("flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:15px")} /></div></>) : null}</div>{Boolean(v?.needPin) ? (<><div style={dcStyle("border-radius:16px;background:#FFF3C4;padding:14px 16px;display:flex;flex-direction:column;gap:10px;animation:zfade .15s ease-out")}><span style={dcStyle("display:flex;align-items:center;gap:8px;color:#6B4E00;font-size:13px;font-weight:600")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.warn) == null || (v?.ic?.warn) === false ? undefined : (v?.ic?.warn) === true ? '' : String(v?.ic?.warn)} /></svg>{"Above your limit · a manager approves with their PIN"}</span><div className="field" style={dcStyle(("height:52px;display:flex;align-items:center;gap:10px;border:1px solid " + dcStr(v?.pinBd) + ";border-radius:14px;padding:0 14px;background:#ffffff;animation:" + dcStr(v?.shake)))}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B6585" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.key) == null || (v?.ic?.key) === false ? undefined : (v?.ic?.key) === true ? '' : String(v?.ic?.key)} /></svg><label htmlFor="disc-pin" className="sr">{"Manager PIN"}</label><input id="disc-pin" type="password" inputMode="numeric" maxLength={4} autoComplete="off" value={dcStr(v?.pin)} onChange={(typeof (v?.onPin) === 'function' ? (v?.onPin) : undefined) as any} placeholder="Manager PIN" style={dcStyle("flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:20px;letter-spacing:.3em")} /><span style={dcStyle(("font-size:13px;color:" + dcStr(v?.pinHintFg)))}>{dcStr(v?.pinHint)}</span></div></div></>) : null}</div><div style={dcStyle("padding:14px 24px 20px;border-top:1px solid #F6F0E7;display:flex;flex-direction:column;gap:12px")}><div style={dcStyle("display:flex;align-items:flex-end;justify-content:space-between;gap:12px")}><div style={dcStyle("display:flex;flex-direction:column;gap:4px")}><span style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"New total · with the Re 1 FBR fee"}</span><span className="num" style={dcStyle("font-family:Outfit,sans-serif;font-size:34px;font-weight:700;letter-spacing:-.02em;line-height:1")}><span className="rs">{"Rs"}</span>{dcStr(v?.newN)}</span></div>{Boolean(v?.saves) ? (<><span className="num" style={dcStyle("height:28px;padding:0 10px;border-radius:999px;background:#E8F6EE;color:#14532D;font-size:13px;font-weight:600;display:inline-flex;align-items:center")}>{("Customer saves Rs " + dcStr(v?.offN))}</span></>) : null}</div><div style={dcStyle("display:flex;gap:10px;align-items:center")}>{Boolean(v?.hasCurrent) ? (<><button className="bt" onClick={(typeof (v?.remove) === 'function' ? (v?.remove) : undefined) as any} style={dcStyle("height:56px;padding:0 10px;border:0;background:transparent;color:#2E46A0;font-size:15px;font-weight:600")}>{"Remove discount"}</button></>) : null}<button className="bp" onClick={(typeof (v?.apply) === 'function' ? (v?.apply) : undefined) as any} disabled={Boolean(v?.cantApply)} style={dcStyle("flex:1;height:56px;border:0;border-radius:14px;background:#162660;color:#FFFFFF;font-size:17px;font-weight:700;box-shadow:inset 0 -1px 0 #2E46A0")}><span className="num">{"Apply discount · "}<span className="rs">{"Rs"}</span>{(dcStr(v?.offN) + " off")}</span></button></div>{Boolean(v?.cantApply) ? (<><span style={dcStyle("margin-top:-6px;font-size:13px;color:#5B6585;text-align:right")}>{dcStr(v?.why)}</span></>) : null}</div></div>
      </>
    );
  }
}
