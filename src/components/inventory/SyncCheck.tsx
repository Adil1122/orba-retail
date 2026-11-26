// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  ICONS,
  n,
  rs,
  rz
} from '@/lib/common';


const DEFAULT_PROPS: Record<string, any> = {
  "w": 0,
  "h": 0,
  "demo": "online"
};

var PENDING = [
{ no: 1044, time: '12:31 pm', items: 2, total: 4841, pay: 'Cash', serverHas: true },
{ no: 1045, time: '12:33 pm', items: 1, total: 3491, pay: 'Cash', serverHas: false },
{ no: 1046, time: '12:36 pm', items: 3, total: 9081, pay: 'Khata · Bilal Ahmed', serverHas: true }
];
var ST = {
waiting: { bg: '#F6F0E7', fg: '#454F70', text: '#454F70', d: ICONS.clock },
checking: { bg: '#EAF2FD', fg: '#24398A', text: '#24398A', d: ICONS.refresh },
confirmed: { bg: '#E8F6EE', fg: '#14532D', text: '#14532D', d: ICONS.checkCircle },
missing: { bg: '#FFF3C4', fg: '#6B4E00', text: '#6B4E00', d: ICONS.warn },
sending: { bg: '#EAF2FD', fg: '#24398A', text: '#24398A', d: ICONS.send }
};
class SyncCheckBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

constructor(props) {
super(props);
var st = {}; PENDING.forEach(function (x) { st[x.no] = 'waiting'; });
this.state = { st: st, offline: (props && props.demo) === 'offline', toast: null };
this.timers = {};
}
componentWillUnmount() { var t = this.timers; Object.keys(t).forEach(function (k) { clearTimeout(t[k]); }); }
toast(t) { var self = this; this.setState({ toast: t }); if (this.timers.t) clearTimeout(this.timers.t); this.timers.t = setTimeout(function () { self.setState({ toast: null }); }, 2400); }
setSt(no, v) { var m = Object.assign({}, this.state.st); m[no] = v; this.setState({ st: m }); }
check(x) {
var self = this; this.setSt(x.no, 'checking');
this.timers['c' + x.no] = setTimeout(function () { self.setSt(x.no, x.serverHas ? 'confirmed' : 'missing'); }, 700 + (x.no % 3) * 250);
}
renderVals() {
var self = this, s = this.state;
var MSG = { waiting: 'Not checked yet', checking: 'Asking the server…', confirmed: 'Server has it. Recorded once.', missing: 'Server didn’t get it. Send the same bill again.', sending: 'Sending the same bill…' };
var rows = PENDING.map(function (x) {
var k = s.st[x.no];
return { no: x.no, meta: x.time + ' · ' + x.items + (x.items === 1 ? ' item' : ' items') + ' · ' + x.pay, total: n(x.total), st: ST[k], msg: s.offline && (k === 'waiting' || k === 'missing') ? 'Waiting for the internet' : MSG[k],
spin: k === 'checking' || k === 'sending', icon: !(k === 'checking' || k === 'sending'), bg: k === 'missing' ? '#F8F2E9' : '#ffffff',
canCheck: k === 'waiting', canResend: k === 'missing', done: k === 'confirmed',
check: function () { self.check(x); },
resend: function () { self.setSt(x.no, 'sending'); self.timers['r' + x.no] = setTimeout(function () { self.setSt(x.no, 'confirmed'); self.toast('Bill ' + x.no + ' recorded'); }, 900); } };
});
var left = PENDING.filter(function (x) { return s.st[x.no] !== 'confirmed'; }).length;
return {
ic: ICONS, rows: rows, offline: s.offline, allDone: left === 0,
listTitle: left ? left + (left === 1 ? ' sale to check' : ' sales to check') : 'All checked',
cantCheckAll: s.offline || !PENDING.some(function (x) { return s.st[x.no] === 'waiting'; }),
checkAll: function () { PENDING.forEach(function (x) { if (self.state.st[x.no] === 'waiting') self.check(x); }); },
net: s.offline ? { bg: '#FFF3C4', fg: '#6B4E00', d: ICONS.wifiOff, text: 'Offline' } : { bg: '#E8F6EE', fg: '#14532D', d: ICONS.cloud, text: 'Back online' },
legend: [
{ t: 'Recorded', b: 'The server has the sale. Print or hand over the receipt.', bg: '#E8F6EE', fg: '#14532D', d: ICONS.checkCircle },
{ t: 'Server didn’t get it', b: 'Send the same bill again. It can’t be recorded twice.', bg: '#FFF3C4', fg: '#6B4E00', d: ICONS.warn },
{ t: 'Waiting for the internet', b: 'Keep the customer’s receipt marked “not final” until it’s checked.', bg: '#F6F0E7', fg: '#454F70', d: ICONS.clock }
],
toastOn: !!s.toast, toastText: s.toast || ''
};
}
}

rz(SyncCheckBase, 1280, 800);

export default class SyncCheck extends SyncCheckBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div data-nar={(v?.nar) == null || (v?.nar) === false ? undefined : (v?.nar) === true ? '' : String(v?.nar)} data-mid={(v?.mid) == null || (v?.mid) === false ? undefined : (v?.mid) === true ? '' : String(v?.mid)} data-cmp={(v?.cmp) == null || (v?.cmp) === false ? undefined : (v?.cmp) === true ? '' : String(v?.cmp)} style={dcStyle(("width:" + dcStr(v?.W) + "px;height:" + dcStr(v?.H) + "px;position:relative;overflow:hidden;display:flex;flex-direction:column;background:#F1E4D1;color:#162660;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:15px"))}><header className="rz-head" style={dcStyle("height:72px;flex:none;display:flex;align-items:center;gap:14px;padding:0 24px;background:#ffffff;border-bottom:1px solid #E9E1D5")}><a className="bt" href={dcHref(dcStr("Main.dc.html"))} style={dcStyle("height:44px;display:flex;align-items:center;gap:6px;color:#2E46A0;text-decoration:none;font-size:15px;font-weight:600")} onClick={dcLinkClick(dcStr("Main.dc.html"), undefined)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.left) == null || (v?.ic?.left) === false ? undefined : (v?.ic?.left) === true ? '' : String(v?.ic?.left)} /></svg>{"Register"}</a><h1 className="rz-h1" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:24px;font-weight:700")}>{"Check unconfirmed sales"}</h1><div style={dcStyle("flex:1")}></div><span role="status" style={dcStyle(("height:32px;padding:0 12px;border-radius:999px;background:" + dcStr(v?.net?.bg) + ";color:" + dcStr(v?.net?.fg) + ";font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px"))}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.net?.d) == null || (v?.net?.d) === false ? undefined : (v?.net?.d) === true ? '' : String(v?.net?.d)} /></svg>{dcStr(v?.net?.text)}</span></header><div className="rz-stack rz-pad" style={dcStyle("flex:1;min-height:0;display:flex;gap:24px;padding:24px")}><div className="rz-col rz-free" style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:16px")}><div style={dcStyle("display:flex;gap:14px;border-radius:18px;background:#FFF3C4;color:#6B4E00;padding:16px 18px")}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle("flex:none;margin-top:1px")}><path d={(v?.ic?.warn) == null || (v?.ic?.warn) === false ? undefined : (v?.ic?.warn) === true ? '' : String(v?.ic?.warn)} /></svg><span style={dcStyle("display:flex;flex-direction:column;gap:4px")}><span style={dcStyle("font-size:17px;font-weight:700")}>{"Don’t ring these bills again"}</span><span style={dcStyle("font-size:15px;line-height:1.5")}>{"The internet dropped while they were being saved, so we don’t know yet if the server got them. Check first. Ringing a bill again could record the sale twice."}</span></span></div><section aria-labelledby="uc-t" style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:20px;overflow:hidden")}><div style={dcStyle("display:flex;align-items:center;gap:10px;padding:16px 18px 12px")}><h2 id="uc-t" style={dcStyle("margin:0;flex:1;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{dcStr(v?.listTitle)}</h2><button className="bk" onClick={(typeof (v?.checkAll) === 'function' ? (v?.checkAll) : undefined) as any} disabled={Boolean(v?.cantCheckAll)} style={dcStyle("height:44px;padding:0 16px;border:0;border-radius:12px;background:#162660;color:#ffffff;font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.refresh) == null || (v?.ic?.refresh) === false ? undefined : (v?.ic?.refresh) === true ? '' : String(v?.ic?.refresh)} /></svg>{"Check all"}</button></div>{(v?.rows || []).map((r: any, $index: number) => (<React.Fragment key={$index}><div className="rz-wrap rz-wrapm rz-padx" style={dcStyle(("display:flex;align-items:center;gap:14px;min-height:84px;padding:12px 18px;border-top:1px solid #F6F0E7;background:" + dcStr(r?.bg)))}><span style={dcStyle(("width:44px;height:44px;flex:none;border-radius:999px;background:" + dcStr(r?.st?.bg) + ";color:" + dcStr(r?.st?.fg) + ";display:flex;align-items:center;justify-content:center"))}>{Boolean(r?.spin) ? (<><span aria-hidden="true" style={dcStyle("width:20px;height:20px;border-radius:999px;border:2.5px solid rgba(30,64,175,.25);border-top-color:#24398A;animation:zspin .8s linear infinite")}></span></>) : null}{Boolean(r?.icon) ? (<><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(r?.st?.d) == null || (r?.st?.d) === false ? undefined : (r?.st?.d) === true ? '' : String(r?.st?.d)} /></svg></>) : null}</span><span className="rz-basis rz-basism" style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:3px")}><span className="rz-wrap" style={dcStyle("display:flex;align-items:baseline;gap:10px")}><span className="num" style={dcStyle("font-size:17px;font-weight:700")}>{("Bill " + dcStr(r?.no))}</span><span style={dcStyle("font-size:13px;color:#5B6585")}>{dcStr(r?.meta)}</span></span><span role="status" style={dcStyle(("font-size:15px;color:" + dcStr(r?.st?.text) + ";line-height:1.4"))}>{dcStr(r?.msg)}</span></span><span className="rz-push num" style={dcStyle("font-size:17px;font-weight:700;white-space:nowrap")}><span className="rs">{"Rs"}</span>{dcStr(r?.total)}</span><span className="rz-auto" style={dcStyle("width:170px;flex:none;display:flex;justify-content:flex-end")}>{Boolean(r?.canCheck) ? (<><button className="bs" onClick={(typeof (r?.check) === 'function' ? (r?.check) : undefined) as any} disabled={Boolean(v?.offline)} style={dcStyle("height:44px;padding:0 14px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;font-size:15px;font-weight:600")}>{"Check now"}</button></>) : null}{Boolean(r?.canResend) ? (<><button className="bk" onClick={(typeof (r?.resend) === 'function' ? (r?.resend) : undefined) as any} disabled={Boolean(v?.offline)} style={dcStyle("height:44px;padding:0 14px;border:0;border-radius:12px;background:#162660;color:#ffffff;font-size:15px;font-weight:700")}>{"Send same bill"}</button></>) : null}{Boolean(r?.done) ? (<><span style={dcStyle("font-size:15px;font-weight:600;color:#14532D")}>{"Recorded"}</span></>) : null}</span></div></React.Fragment>))}{Boolean(v?.allDone) ? (<><div style={dcStyle("padding:16px 18px;border-top:1px solid #F6F0E7;display:flex;align-items:center;gap:12px;background:#E8F6EE;color:#14532D")}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.checkCircle) == null || (v?.ic?.checkCircle) === false ? undefined : (v?.ic?.checkCircle) === true ? '' : String(v?.ic?.checkCircle)} /></svg><span style={dcStyle("flex:1;font-size:15px;font-weight:600")}>{"All sales are recorded. Receipts can print now."}</span><a className="bk" href={dcHref(dcStr("Main.dc.html"))} style={dcStyle("height:44px;padding:0 16px;border-radius:12px;background:#162660;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;display:flex;align-items:center")} onClick={dcLinkClick(dcStr("Main.dc.html"), undefined)}>{"Back to register"}</a></div></>) : null}</section></div><aside className="rz-col rz-free rz-side" aria-labelledby="hw-t" style={dcStyle("width:340px;flex:none;display:flex;flex-direction:column;gap:16px")}><section style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:12px")}><h2 id="hw-t" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:17px;font-weight:700")}>{"What each answer means"}</h2>{(v?.legend || []).map((l: any, $index: number) => (<React.Fragment key={$index}><div style={dcStyle("display:flex;gap:10px")}><span style={dcStyle(("width:28px;height:28px;flex:none;border-radius:999px;background:" + dcStr(l?.bg) + ";color:" + dcStr(l?.fg) + ";display:flex;align-items:center;justify-content:center"))}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(l?.d) == null || (l?.d) === false ? undefined : (l?.d) === true ? '' : String(l?.d)} /></svg></span><span style={dcStyle("display:flex;flex-direction:column;gap:2px")}><span style={dcStyle("font-size:15px;font-weight:600")}>{dcStr(l?.t)}</span><span style={dcStyle("font-size:13px;line-height:1.5;color:#5B6585")}>{dcStr(l?.b)}</span></span></div></React.Fragment>))}</section><section style={dcStyle("border-radius:20px;background:#F8F2E9;border:1px solid #E9E1D5;padding:16px 18px;font-size:13px;line-height:1.6;color:#454F70")}><b style={dcStyle("color:#162660")}>{"Why “Send same bill”?"}</b>{" It resends the exact bill with its original code, so the server records it once even if the first try did get through. Editing the bill would start a new sale.\n"}</section></aside></div>{Boolean(v?.toastOn) ? (<><div role="status" style={dcStyle("position:absolute;left:0;right:0;bottom:24px;z-index:30;display:flex;justify-content:center;pointer-events:none")}><span style={dcStyle("min-height:48px;display:flex;align-items:center;gap:10px;padding:0 16px;border-radius:14px;background:#162660;color:#ffffff;font-size:15px;box-shadow:0 12px 28px rgba(12,20,50,.28);animation:zup .2s ease-out")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7FD6A4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.checkCircle) == null || (v?.ic?.checkCircle) === false ? undefined : (v?.ic?.checkCircle) === true ? '' : String(v?.ic?.checkCircle)} /></svg>{dcStr(v?.toastText)}</span></div></>) : null}</div>
      </>
    );
  }
}
