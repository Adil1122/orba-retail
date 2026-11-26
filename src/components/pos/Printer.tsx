// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  BILLS,
  ICONS,
  billById,
  billTotal,
  chip,
  custById,
  keepSync,
  n
} from '@/lib/common';


const DEFAULT_PROPS: Record<string, any> = {
  "role": "cashier",
  "size": "wide",
  "w": 1032,
  "h": 736
};

var LAY = {
wide: { padX: 28, padY: 22, h1: 26, dir: 'row', leftW: '340px', sheetAlign: 'center', sheetW: '480px', sheetR: '20px' },
medium: { padX: 20, padY: 16, h1: 24, dir: 'row', leftW: '300px', sheetAlign: 'center', sheetW: '460px', sheetR: '20px' },
phone: { padX: 16, padY: 14, h1: 22, dir: 'column', leftW: '100%', sheetAlign: 'flex-end', sheetW: '100%', sheetR: '22px 22px 0 0' }
};
var JST = {
printed: { text: 'Test print OK', bg: '#E8F6EE', fg: '#14532D', d: ICONS.checkCircle },
copy: { text: 'Copy · test OK', bg: '#E8F6EE', fg: '#14532D', d: ICONS.checkCircle },
failed: { text: 'Test failed', bg: '#FDF0EF', fg: '#B42318', d: ICONS.err },
unknown: { text: 'Not confirmed', bg: '#FFF3C4', fg: '#6B4E00', d: ICONS.warn },
queued: { text: 'Queued', bg: '#EAF2FD', fg: '#24398A', d: ICONS.clock },
cancelled: { text: 'Cancelled', bg: '#F6F0E7', fg: '#454F70', d: ICONS.x }
};
class PrinterBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

constructor(props) {
super(props);
var p = props || {};
var printsIn = p.prints || {};
var st = {}; BILLS.forEach(function (b) { st[b.no] = printsIn[b.no] || b.print; });
st.test = null;
this.state = { jobs: st, width: 80, filter: p.job ? 'attention' : 'all', sheet: null, rpReason: '', rpChecked: false, testing: false, toast: null };
this.timers = {};
this.onKey = this.onKey.bind(this);
}
componentDidMount() { if (typeof window !== 'undefined') window.addEventListener('keydown', this.onKey); }
componentWillUnmount() { if (typeof window !== 'undefined') window.removeEventListener('keydown', this.onKey); var t = this.timers; Object.keys(t).forEach(function (k) { clearTimeout(t[k]); }); }
onKey(e) { if (e.key === 'Escape' && this.state.sheet) this.setState({ sheet: null }); }
toast(t) { var self = this; this.setState({ toast: t }); if (this.timers.t) clearTimeout(this.timers.t); this.timers.t = setTimeout(function () { self.setState({ toast: null }); }, 2400); }
renderVals() {
keepSync(this, 'Printer', ['jobs']);
var self = this, p = this.props || {}, s = this.state, L = LAY[p.size] || LAY.wide, role = p.role || 'cashier', owner = role === 'owner';
var set = function (no, v) { var j = Object.assign({}, self.state.jobs); j[no] = v; return j; };
var all = BILLS.map(function (b) {
var c = b.cust ? custById(b.cust) : null, stt = s.jobs[b.no], ch = JST[stt];
return { no: b.no, stt: stt, title: 'Bill ' + b.no + ' · ' + (c ? c.name : 'Walk-in'), sub: b.time + ' · Rs ' + n(billTotal(b)) + ' · 80 mm', chip: ch,
rowBg: b.no === p.job ? '#F8F2E9' : '#ffffff',
canReprint: stt === 'failed' || stt === 'unknown', canCancel: owner && stt === 'queued',
reprint: function () { self.setState({ sheet: b.no, rpReason: '', rpChecked: false }); },
cancel: function () { self.setState({ jobs: set(b.no, 'cancelled') }); if (p.onPrint) p.onPrint(b.no, 'cancelled'); self.toast('Print job cancelled'); } };
});
if (s.jobs.test) all.unshift({ no: 'test', title: 'Test page', sub: 'Just now · ' + s.width + ' mm', chip: JST[s.jobs.test], rowBg: '#ffffff', canReprint: false, canCancel: false, reprint: null, cancel: null });
var attention = all.filter(function (j) { return j.stt === 'failed' || j.stt === 'unknown' || j.stt === 'queued'; });
var jobs = s.filter === 'attention' ? attention : all;
var sjB = typeof s.sheet === 'number' ? billById(s.sheet) : null, sjS = sjB ? s.jobs[sjB.no] : null;
var sj = { no: sjB ? sjB.no : '', state: sjS === 'unknown' ? 'print not confirmed' : 'test print failed', unknown: sjS === 'unknown' };
var rpLen = s.rpReason.trim().length, rpBlocked = rpLen < 12 || (sj.unknown && !s.rpChecked);
var seg = function (on) { return { bg: on ? '#ffffff' : 'transparent', fg: on ? '#162660' : '#454F70', sh: on ? '0 1px 2px rgba(22,30,60,.08)' : 'none' }; };
var issues = attention.length;
return {
ic: ICONS, W: p.w || 1032, H: p.h || 736, L: L, isOwner: owner, isCashier: !owner,
whoLine: owner ? 'Owner view' : 'Your print jobs',
widthLabel: s.width + ' mm', paperH: s.width === 80 ? 22 : 18, ledColor: issues ? '#C99A06' : '#5BD18B',
statusChip: issues ? { bg: '#FFF3C4', fg: '#6B4E00', dot: '#C99A06', text: issues + (issues === 1 ? ' job needs attention' : ' jobs need attention') } : { bg: '#E8F6EE', fg: '#14532D', dot: '#2F9E63', text: 'Ready' },
widths: [80, 58].map(function (w) { var on = s.width === w, sg = seg(on); return { label: w + ' mm', on: on ? 'true' : 'false', locked: !owner, bg: sg.bg, fg: sg.fg, sh: sg.sh, pick: function () { self.setState({ width: w }); self.toast('Paper width set to ' + w + ' mm'); } }; }),
widthNote: owner ? 'Match the roll in the printer. Most counters use 80 mm.' : 'Only the owner can change this.',
testing: s.testing, testLabel: s.testing ? 'Printing test page…' : 'Print test page',
testPrint: function () { self.setState({ testing: true, jobs: set('test', 'queued'), filter: 'all' }); self.timers.x = setTimeout(function () { self.setState({ testing: false, jobs: set('test', 'printed') }); self.toast('Test page sent to the simulator · nothing printed'); }, 1000); },
rules: [{ n: 1, t: 'Every sale prints one receipt.' }, { n: 2, t: 'A reprint needs the owner and a reason, and is marked “Copy”.' }, { n: 3, t: 'If the printer doesn’t confirm, check the paper before you reprint.' }],
filters: [['all', 'All'], ['attention', 'Needs attention · ' + issues]].map(function (f) { var on = s.filter === f[0], sg = seg(on); return { label: f[1], on: on ? 'true' : 'false', bg: sg.bg, fg: sg.fg, sh: sg.sh, pick: function () { self.setState({ filter: f[0] }); } }; }),
jobs: jobs, noJobs: jobs.length === 0,
sheetOpen: !!sjB, sj: sj, closeSheet: function () { self.setState({ sheet: null }); },
rpReason: s.rpReason, onRpReason: function (e) { self.setState({ rpReason: e.target.value.slice(0, 240) }); },
rpHint: rpLen < 12 ? (12 - rpLen) + ' more characters needed' : ((sj.unknown) && !s.rpChecked ? 'Tick the printer check above to continue' : 'Saved with the reprint'), rpHintFg: rpLen < 12 ? '#5B6585' : (((sj.unknown) && !s.rpChecked) ? '#6B4E00' : '#14532D'),
rpCheckedStr: s.rpChecked ? 'true' : 'false', toggleChecked: function () { self.setState({ rpChecked: !self.state.rpChecked }); },
rpBox: s.rpChecked ? { border: '2px solid #2E46A0', bg: '#EEF5FE', tick: '#162660', tickBg: '#162660', d: ICONS.check } : { border: '1px solid #D9CFC0', bg: '#ffffff', tick: '#8A8276', tickBg: '#ffffff', d: '' },
rpBlocked: rpBlocked,
doReprint: function () {
if (rpBlocked) return; var no = sjB.no;
self.setState({ sheet: null, jobs: set(no, 'queued') });
self.timers.r = setTimeout(function () { self.setState({ jobs: set(no, 'copy') }); if (p.onPrint) p.onPrint(no, 'copy'); self.toast('Bill ' + no + ' reprinted · marked “Copy”'); }, 1100);
},
toastOn: !!s.toast, toastText: s.toast || ''
};
}
}

export default class Printer extends PrinterBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div style={dcStyle(("width:" + dcStr(v?.W) + "px;height:" + dcStr(v?.H) + "px;position:relative;overflow:hidden;background:#F1E4D1;color:#162660;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:15px"))}><div style={dcStyle(("position:absolute;inset:0;overflow:auto;padding:" + dcStr(v?.L?.padY) + "px " + dcStr(v?.L?.padX) + "px 28px;display:flex;flex-direction:column;gap:14px"))}><div style={dcStyle("display:flex;flex-direction:column;gap:4px")}><span style={dcStyle("font-size:13px;font-weight:600;color:#5B6585")}>{("Counter 1 · " + dcStr(v?.whoLine))}</span><h1 style={dcStyle(("margin:0;font-family:Outfit,sans-serif;font-size:" + dcStr(v?.L?.h1) + "px;font-weight:700;line-height:1.2"))}>{"Receipt printer"}</h1></div><div role="note" style={dcStyle("display:flex;align-items:flex-start;gap:10px;border-radius:14px;background:#EAF2FD;color:#24398A;padding:10px 14px;font-size:13px;line-height:1.5")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle("flex:none;margin-top:1px")}><path d={(v?.ic?.info) == null || (v?.ic?.info) === false ? undefined : (v?.ic?.info) === true ? '' : String(v?.ic?.info)} /></svg><span><b>{"Simulated in this build."}</b>{" Jobs and their results are real records, but no paper comes out yet. Printer drivers are Planned."}</span></div><div style={dcStyle(("display:flex;gap:16px;align-items:flex-start;flex-direction:" + dcStr(v?.L?.dir)))}><div style={dcStyle(("width:" + dcStr(v?.L?.leftW) + ";flex:none;max-width:100%;display:flex;flex-direction:column;gap:16px"))}><section aria-labelledby="pd-t" style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:20px;padding:16px 18px;display:flex;flex-direction:column;gap:14px")}><div style={dcStyle("display:flex;align-items:center;gap:14px")}><svg width="76" height="64" viewBox="0 0 76 64" aria-hidden="true" style={dcStyle("flex:none")}><rect x="6" y="22" width="64" height="34" rx="9" fill="#162660" /><rect x="6" y="22" width="64" height="10" rx="5" fill="#111E50" /><rect x="20" y="4" width="36" height={(v?.paperH) == null || (v?.paperH) === false ? undefined : (v?.paperH) === true ? '' : String(v?.paperH)} rx="2" fill="#ffffff" stroke="#D9CFC0" /><path d="M25 11h26M25 16h18M25 21h22" stroke="#C8BCAA" strokeWidth="2" strokeLinecap="round" /><circle cx="58" cy="45" r="3.5" fill={(v?.ledColor) == null || (v?.ledColor) === false ? undefined : (v?.ledColor) === true ? '' : String(v?.ledColor)} /><rect x="16" y="42" width="24" height="5" rx="2.5" fill="#1D5A62" /></svg><span style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:3px")}><span id="pd-t" style={dcStyle("font-size:17px;font-weight:700")}>{"Counter 1 printer"}</span><span className="num" style={dcStyle("font-size:13px;color:#5B6585")}>{("Thermal · " + dcStr(v?.widthLabel) + " paper")}</span><span style={dcStyle(("align-self:flex-start;height:24px;margin-top:2px;padding:0 9px;border-radius:999px;background:" + dcStr(v?.statusChip?.bg) + ";color:" + dcStr(v?.statusChip?.fg) + ";font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:5px"))}><span style={dcStyle(("width:7px;height:7px;border-radius:999px;background:" + dcStr(v?.statusChip?.dot)))}></span>{dcStr(v?.statusChip?.text)}</span></span></div><div style={dcStyle("display:flex;flex-direction:column;gap:6px")}><span id="pw-l" style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Paper width"}</span><div role="radiogroup" aria-labelledby="pw-l" style={dcStyle("display:flex;gap:2px;padding:3px;border-radius:12px;background:#ECE4D8")}>{(v?.widths || []).map((x: any, $index: number) => (<React.Fragment key={$index}><button role="radio" aria-checked={(x?.on) == null || (x?.on) === false ? undefined : (x?.on) === true ? '' : String(x?.on)} onClick={(typeof (x?.pick) === 'function' ? (x?.pick) : undefined) as any} disabled={Boolean(x?.locked)} style={dcStyle(("flex:1;height:40px;border:0;border-radius:9px;background:" + dcStr(x?.bg) + ";color:" + dcStr(x?.fg) + ";font-size:15px;font-weight:600;box-shadow:" + dcStr(x?.sh)))}>{dcStr(x?.label)}</button></React.Fragment>))}</div><span style={dcStyle("font-size:13px;color:#5B6585")}>{dcStr(v?.widthNote)}</span></div><button className="bs" onClick={(typeof (v?.testPrint) === 'function' ? (v?.testPrint) : undefined) as any} disabled={Boolean(v?.testing)} style={dcStyle("height:48px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.printer2) == null || (v?.ic?.printer2) === false ? undefined : (v?.ic?.printer2) === true ? '' : String(v?.ic?.printer2)} /></svg>{dcStr(v?.testLabel)}</button></section><section aria-labelledby="ru-t" style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:20px;padding:16px 18px;display:flex;flex-direction:column;gap:10px")}><h2 id="ru-t" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:17px;font-weight:700")}>{"How receipts print"}</h2>{(v?.rules || []).map((r: any, $index: number) => (<React.Fragment key={$index}><div style={dcStyle("display:flex;gap:10px;font-size:15px;line-height:1.45")}><span className="num" style={dcStyle("width:24px;height:24px;flex:none;border-radius:999px;background:#F6F0E7;color:#162660;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center")}>{dcStr(r?.n)}</span><span>{dcStr(r?.t)}</span></div></React.Fragment>))}</section></div><section aria-labelledby="jb-t" style={dcStyle("flex:1;min-width:0;width:100%;background:#ffffff;border:1px solid #E9E1D5;border-radius:20px;overflow:hidden")}><div style={dcStyle("display:flex;align-items:center;gap:10px;padding:14px 18px 10px;flex-wrap:wrap")}><h2 id="jb-t" style={dcStyle("margin:0;flex:1;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{"Today’s print jobs"}</h2><div role="group" aria-label="Show jobs" style={dcStyle("display:flex;gap:2px;padding:3px;border-radius:12px;background:#ECE4D8")}>{(v?.filters || []).map((f: any, $index: number) => (<React.Fragment key={$index}><button aria-pressed={(f?.on) == null || (f?.on) === false ? undefined : (f?.on) === true ? '' : String(f?.on)} onClick={(typeof (f?.pick) === 'function' ? (f?.pick) : undefined) as any} style={dcStyle(("height:36px;padding:0 12px;border:0;border-radius:9px;background:" + dcStr(f?.bg) + ";color:" + dcStr(f?.fg) + ";font-size:15px;font-weight:600;box-shadow:" + dcStr(f?.sh) + ";white-space:nowrap"))}>{dcStr(f?.label)}</button></React.Fragment>))}</div></div>{(v?.jobs || []).map((j: any, $index: number) => (<React.Fragment key={$index}><div className="row" style={dcStyle(("display:flex;align-items:center;gap:12px;min-height:60px;padding:8px 18px;border-top:1px solid #F6F0E7;background:" + dcStr(j?.rowBg)))}><span style={dcStyle(("width:36px;height:36px;flex:none;border-radius:999px;background:" + dcStr(j?.chip?.bg) + ";color:" + dcStr(j?.chip?.fg) + ";display:flex;align-items:center;justify-content:center"))}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(j?.chip?.d) == null || (j?.chip?.d) === false ? undefined : (j?.chip?.d) === true ? '' : String(j?.chip?.d)} /></svg></span><span style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:1px")}><span style={dcStyle("font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{dcStr(j?.title)}</span><span className="num" style={dcStyle("font-size:13px;color:#5B6585;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{dcStr(j?.sub)}</span></span><span className="num" style={dcStyle(("height:26px;padding:0 9px;border-radius:999px;background:" + dcStr(j?.chip?.bg) + ";color:" + dcStr(j?.chip?.fg) + ";font-size:13px;font-weight:600;display:inline-flex;align-items:center;white-space:nowrap"))}>{dcStr(j?.chip?.text)}</span>{Boolean(j?.canReprint) ? (<><button className="bs" onClick={(typeof (j?.reprint) === 'function' ? (j?.reprint) : undefined) as any} style={dcStyle("height:40px;padding:0 12px;border:1px solid #D9CFC0;border-radius:10px;background:#ffffff;font-size:15px;font-weight:600;white-space:nowrap")}>{"Reprint…"}</button></>) : null}{Boolean(j?.canCancel) ? (<><button className="bt" onClick={(typeof (j?.cancel) === 'function' ? (j?.cancel) : undefined) as any} style={dcStyle("height:40px;padding:0 6px;border:0;background:transparent;color:#2E46A0;font-size:15px;font-weight:600")}>{"Cancel"}</button></>) : null}</div></React.Fragment>))}{Boolean(v?.noJobs) ? (<><div style={dcStyle("padding:28px 18px;border-top:1px solid #F6F0E7;display:flex;flex-direction:column;gap:4px")}><span style={dcStyle("font-size:15px;font-weight:600")}>{"Nothing needs attention"}</span><span style={dcStyle("font-size:13px;color:#5B6585")}>{"Every receipt today printed."}</span></div></>) : null}</section></div></div>{Boolean(v?.sheetOpen) ? (<><div style={dcStyle(("position:absolute;inset:0;z-index:20;display:flex;align-items:" + dcStr(v?.L?.sheetAlign) + ";justify-content:center;animation:zfade .15s ease-out"))}><button aria-label="Close" tabIndex={-1} onClick={(typeof (v?.closeSheet) === 'function' ? (v?.closeSheet) : undefined) as any} style={dcStyle("position:absolute;inset:0;border:0;background:rgba(12,20,50,.45)")}></button><div role="dialog" aria-modal="true" aria-labelledby="rp-t" style={dcStyle(("position:relative;width:" + dcStr(v?.L?.sheetW) + ";max-width:100%;background:#ffffff;border-radius:" + dcStr(v?.L?.sheetR) + ";box-shadow:0 18px 48px rgba(12,20,50,.3);padding:20px;display:flex;flex-direction:column;gap:14px;animation:zsheet .2s ease-out"))}><div style={dcStyle("display:flex;align-items:flex-start;gap:12px")}><span style={dcStyle("flex:1;display:flex;flex-direction:column;gap:2px")}><span className="num" style={dcStyle("font-size:13px;font-weight:600;color:#5B6585")}>{("Bill " + dcStr(v?.sj?.no) + " · " + dcStr(v?.sj?.state))}</span><span id="rp-t" style={dcStyle("font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{"Reprint the receipt"}</span></span><button onClick={(typeof (v?.closeSheet) === 'function' ? (v?.closeSheet) : undefined) as any} aria-label="Close" style={dcStyle("width:44px;height:44px;flex:none;border:0;border-radius:999px;background:#F6F0E7;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.x) == null || (v?.ic?.x) === false ? undefined : (v?.ic?.x) === true ? '' : String(v?.ic?.x)} /></svg></button></div>{Boolean(v?.isOwner) ? (<><div style={dcStyle("display:flex;flex-direction:column;gap:14px")}>{Boolean(v?.sj?.unknown) ? (<><button role="checkbox" aria-checked={(v?.rpCheckedStr) == null || (v?.rpCheckedStr) === false ? undefined : (v?.rpCheckedStr) === true ? '' : String(v?.rpCheckedStr)} onClick={(typeof (v?.toggleChecked) === 'function' ? (v?.toggleChecked) : undefined) as any} style={dcStyle(("display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border:" + dcStr(v?.rpBox?.border) + ";border-radius:14px;background:" + dcStr(v?.rpBox?.bg) + ";text-align:left"))}><span style={dcStyle(("width:22px;height:22px;flex:none;margin-top:1px;border-radius:6px;border:1.5px solid " + dcStr(v?.rpBox?.tick) + ";background:" + dcStr(v?.rpBox?.tickBg) + ";color:#ffffff;display:flex;align-items:center;justify-content:center"))}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.rpBox?.d) == null || (v?.rpBox?.d) === false ? undefined : (v?.rpBox?.d) === true ? '' : String(v?.rpBox?.d)} /></svg></span><span style={dcStyle("display:flex;flex-direction:column;gap:2px")}><span style={dcStyle("font-size:15px;font-weight:600")}>{"I checked the printer: no receipt came out"}</span><span style={dcStyle("font-size:13px;color:#5B6585")}>{"If one did print, give the customer that one instead."}</span></span></button></>) : null}<div style={dcStyle("display:flex;flex-direction:column;gap:6px")}><label htmlFor="rp-r" style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Reason"}</label><div className="field" style={dcStyle("border:1px solid #D9CFC0;border-radius:14px;padding:12px 14px")}><textarea id="rp-r" rows={2} value={dcStr(v?.rpReason)} onChange={(typeof (v?.onRpReason) === 'function' ? (v?.onRpReason) : undefined) as any} placeholder="e.g. Paper jammed halfway" style={dcStyle("display:block;width:100%;min-height:48px;border:0;padding:0;font-size:16px;resize:none;outline:0;background:transparent")}></textarea></div><span className="num" style={dcStyle(("font-size:13px;color:" + dcStr(v?.rpHintFg)))}>{dcStr(v?.rpHint)}</span></div><div style={dcStyle("display:flex;gap:10px")}><button className="bs" onClick={(typeof (v?.closeSheet) === 'function' ? (v?.closeSheet) : undefined) as any} style={dcStyle("height:56px;padding:0 18px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;font-size:16px;font-weight:600")}>{"Cancel"}</button><button className="bk" onClick={(typeof (v?.doReprint) === 'function' ? (v?.doReprint) : undefined) as any} disabled={Boolean(v?.rpBlocked)} style={dcStyle("flex:1;height:56px;border:0;border-radius:14px;background:#162660;color:#ffffff;font-size:17px;font-weight:700")}>{"Approve and reprint"}</button></div></div></>) : null}{Boolean(v?.isCashier) ? (<><div style={dcStyle("display:flex;flex-direction:column;gap:14px")}><div style={dcStyle("display:flex;gap:10px;border-radius:14px;background:#EAF2FD;color:#24398A;padding:12px 14px;font-size:15px;line-height:1.5")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle("flex:none;margin-top:2px")}><path d={(v?.ic?.lock) == null || (v?.ic?.lock) === false ? undefined : (v?.ic?.lock) === true ? '' : String(v?.ic?.lock)} /></svg><span>{"Only the owner can approve a reprint, so one sale can’t become two receipts. Ask Hamza to open "}<b>{("Bill " + dcStr(v?.sj?.no))}</b>{" in his Bill book."}</span></div>{Boolean(v?.sj?.unknown) ? (<><span style={dcStyle("font-size:15px;line-height:1.5;color:#454F70")}>{"While you wait, check the printer’s paper slot. If a receipt came out, hand that one over."}</span></>) : null}<button className="bs" onClick={(typeof (v?.closeSheet) === 'function' ? (v?.closeSheet) : undefined) as any} style={dcStyle("height:56px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;font-size:16px;font-weight:600")}>{"OK"}</button></div></>) : null}</div></div></>) : null}{Boolean(v?.toastOn) ? (<><div role="status" style={dcStyle("position:absolute;left:16px;right:16px;bottom:20px;z-index:30;display:flex;justify-content:center;pointer-events:none")}><span style={dcStyle("min-height:48px;display:flex;align-items:center;gap:10px;padding:0 16px;border-radius:14px;background:#162660;color:#ffffff;font-size:15px;box-shadow:0 12px 28px rgba(12,20,50,.28);animation:zup .2s ease-out")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7FD6A4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.checkCircle) == null || (v?.ic?.checkCircle) === false ? undefined : (v?.ic?.checkCircle) === true ? '' : String(v?.ic?.checkCircle)} /></svg>{dcStr(v?.toastText)}</span></div></>) : null}</div>
      </>
    );
  }
}
