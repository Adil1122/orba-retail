// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  ICONS,
  SET,
  n,
  swv,
  trackDirty
} from '@/lib/common';


const DEFAULT_PROPS: Record<string, any> = {
  "size": "wide"
};

class SetPaymentsBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

constructor(props) { super(props); var p = props || {}; this.state = { open: null, draft: '', limit: 50000, round: 1, toast: null, m: { cash: { on: true }, khata: { on: true }, jazz: { on: true, v: '0300 1112223' }, easy: { on: true, v: '0300 1112223' }, raast: { on: true, v: 'PK36 MEZN 0002 4501 0123 4567' }, card: { on: true }, bank: { on: true, v: 'PK36 MEZN 0002 4501 0123 4567' } } }; }
say(t) { var P = this.props || {}; if (P.onToast) P.onToast(t); else { var self = this; this.setState({ toast: t }); clearTimeout(this._t); this._t = setTimeout(function () { self.setState({ toast: null }); }, 2600); } }
componentWillUnmount() { clearTimeout(this._t); }
renderVals() {
trackDirty(this); if (!this._rd) { this._rd = 1; (function (self, s) { if (SET.payV) s.m = JSON.parse(JSON.stringify(SET.payV)); s.limit = SET.khataLimit; s.round = SET.round; })(this, this.state); }
if (this._dirty) (function (self, s) { SET.payV = JSON.parse(JSON.stringify(s.m)); Object.keys(s.m).forEach(function (k) { SET.pay[k] = !!s.m[k].on; }); SET.khataLimit = s.limit; SET.round = s.round; })(this, this.state);

var self = this, P = this.props || {}, s = this.state;
function segOf(items, cur, set) { return items.map(function (x) { var on = x[0] === cur; return { label: x[1], sel: on ? 'true' : 'false', bg: on ? '#ffffff' : 'transparent', fg: on ? '#162660' : '#454F70', sh: on ? '0 1px 2px rgba(22,30,60,.12)' : 'none', pick: function () { set(x[0]); } }; }); }
var M = [
['cash', 'Cash', 'Rs', '#E8F6EE', '#14532D', 'Always on · counted at closing', 'locked'],
['khata', 'Khata (pay later)', 'KH', '#EEF5FE', '#7A5320', 'Customers you know · limit below', ''],
['jazz', 'JazzCash', 'JC', '#FDF0EF', '#B42318', 'Customer pays your JazzCash till', 'Till ID', '0300 1234567 or till number', 'Customers scan or send to this till. ZYRO checks the payment before the bill closes.'],
['easy', 'Easypaisa', 'EP', '#E8F6EE', '#14532D', 'Customer pays your Easypaisa account', 'Easypaisa merchant number', '0345 1234567', 'Payments arrive in your Easypaisa merchant account.'],
['raast', 'Raast QR', 'RA', '#EAF2FD', '#24398A', 'Any bank app scans the QR on the screen', 'Raast ID or IBAN', 'PK36 MEZN 0001 2345 6789 0123', 'The QR shows on Take payment with the bill amount in it.'],
['card', 'Card machine', 'CD', '#F6F0E7', '#454F70', 'Your bank’s machine · ZYRO records the payment', ''],
['bank', 'Bank transfer', 'BK', '#F6F0E7', '#454F70', 'Account details print on the bill', 'Bank account (IBAN)', 'PK36 MEZN 0001 2345 6789 0123', 'Shows on bills and quotes so customers can transfer.']
];
var methods = M.map(function (m) {
var st = s.m[m[0]], on = !!st.on, needs = !!m[6] && m[6] !== 'locked', linked = !!st.v, open = s.open === m[0];
var tag = m[6] === 'locked' ? ['Always on', '#E8F6EE', '#14532D'] : (needs ? (linked ? ['Connected', '#E8F6EE', '#14532D'] : ['Not set up', '#FFF3C4', '#6B4E00']) : (on ? ['On', '#E8F6EE', '#14532D'] : ['Off', '#F6F0E7', '#454F70']));
return { id: m[0], name: m[1], ini: m[2], icBg: m[3], icFg: m[4], sub: linked && m[0] !== 'card' ? m[5] + ' · ' + st.v : m[5], tag: tag[0], tagBg: tag[1], tagFg: tag[2],
canSetup: needs, setupLabel: open ? 'Close' : (linked ? 'Change' : 'Set up'), exp: open ? 'true' : 'false', open: open,
setup: function () { self.setState({ open: open ? null : m[0], draft: st.v || '' }); },
fieldLabel: m[6], ph: m[7], help: m[8], fieldV: open ? s.draft : '', onField: function (e) { self.setState({ draft: e.target.value }); },
connectLabel: linked ? 'Save' : 'Connect',
connect: function () { var v = (s.draft || '').trim(); if (v.length < 6) { self.say('Type the full ' + m[6]); return; } var o = Object.assign({}, s.m); o[m[0]] = { on: true, v: v }; self.setState({ m: o, open: null }); self.say(m[1] + ' connected · it shows on Take payment'); },
sw: swv(on, function () { if (needs && !linked && !on) { self.setState({ open: m[0], draft: '' }); return; } var o = Object.assign({}, s.m); o[m[0]] = Object.assign({}, st, { on: !on }); self.setState({ m: o }); self.say(m[1] + (on ? ' switched off' : ' switched on')); }, m[6] === 'locked')
};
});
var R = { 1: 'Bills keep every rupee. Rs 1,347 stays Rs 1,347.', 5: 'Rs 1,347 becomes Rs 1,345 · the difference shows on the bill as Rounding.', 10: 'Rs 1,347 becomes Rs 1,350 · the difference shows on the bill as Rounding.' };
return {
ic: ICONS, methods: methods,
khataLimit: 'Rs ' + n(s.limit), kDec: function () { self.setState({ limit: Math.max(5000, s.limit - 5000) }); }, kInc: function () { self.setState({ limit: Math.min(500000, s.limit + 5000) }); },
rounds: segOf([[1, 'No rounding'], [5, 'Nearest Rs 5'], [10, 'Nearest Rs 10']], s.round, function (r) { self.setState({ round: r }); }), roundLine: R[s.round],
toastOn: !!s.toast, toastText: s.toast || ''
};
}
}

export default class SetPayments extends SetPaymentsBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div style={dcStyle("display:flex;flex-direction:column;gap:14px;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;color:#162660;font-size:15px")}><section aria-labelledby="pm-h" style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:18px;overflow:hidden")}><div style={dcStyle("display:flex;align-items:center;flex-wrap:wrap;gap:6px 10px;padding:12px 18px;border-bottom:1px solid #F6F0E7")}><h3 id="pm-h" style={dcStyle("margin:0;flex:1;min-width:160px;font-size:15px;font-weight:700")}>{"Ways customers can pay"}</h3><span style={dcStyle("font-size:13px;color:#5B6585")}>{"Switched-on ways show on Take payment"}</span></div>{(v?.methods || []).map((m: any, $index: number) => (<React.Fragment key={$index}><div style={dcStyle("border-bottom:1px solid #F6F0E7")}><div style={dcStyle("display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;min-height:68px;padding:8px 8px 8px 18px")}><span style={dcStyle(("width:40px;height:40px;flex:none;border-radius:12px;background:" + dcStr(m?.icBg) + ";color:" + dcStr(m?.icFg) + ";display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800"))}>{dcStr(m?.ini)}</span><span style={dcStyle("flex:1 1 180px;min-width:0;display:flex;flex-direction:column;gap:2px")}><span style={dcStyle("font-size:15px;font-weight:600")}>{dcStr(m?.name)}</span><span className="num" style={dcStyle("font-size:13px;color:#5B6585")}>{dcStr(m?.sub)}</span></span><span style={dcStyle(("height:24px;padding:0 9px;border-radius:999px;background:" + dcStr(m?.tagBg) + ";color:" + dcStr(m?.tagFg) + ";font-size:12px;font-weight:700;display:inline-flex;align-items:center;white-space:nowrap"))}>{dcStr(m?.tag)}</span>{Boolean(m?.canSetup) ? (<><button className="bs" onClick={(typeof (m?.setup) === 'function' ? (m?.setup) : undefined) as any} aria-expanded={(m?.exp) == null || (m?.exp) === false ? undefined : (m?.exp) === true ? '' : String(m?.exp)} style={dcStyle("height:44px;padding:0 14px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;color:#162660;font-size:15px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap;height:40px")}>{dcStr(m?.setupLabel)}</button></>) : null}<button role="switch" aria-checked={(m?.sw?.on) == null || (m?.sw?.on) === false ? undefined : (m?.sw?.on) === true ? '' : String(m?.sw?.on)} aria-label={("Take " + dcStr(m?.name))} disabled={Boolean(m?.sw?.dis)} onClick={(typeof (m?.sw?.toggle) === 'function' ? (m?.sw?.toggle) : undefined) as any} style={dcStyle("width:56px;height:44px;flex:none;border:0;background:transparent;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer")}><span aria-hidden="true" style={dcStyle(("position:relative;width:48px;height:28px;border-radius:999px;background:" + dcStr(m?.sw?.trk) + ";transition:background-color .15s ease-out"))}><span style={dcStyle(("position:absolute;top:3px;left:" + dcStr(m?.sw?.knob) + "px;width:22px;height:22px;border-radius:999px;background:#ffffff;box-shadow:0 1px 3px rgba(12,20,50,.3);transition:left .15s ease-out"))}></span></span></button></div>{Boolean(m?.open) ? (<><div style={dcStyle("display:flex;flex-direction:column;gap:10px;padding:4px 18px 16px 70px;animation:zfade .15s ease-out")}><label htmlFor={("pm-" + dcStr(m?.id))} style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{dcStr(m?.fieldLabel)}</label><input id={("pm-" + dcStr(m?.id))} className="field num" value={dcStr(m?.fieldV)} onChange={(typeof (m?.onField) === 'function' ? (m?.onField) : undefined) as any} placeholder={(m?.ph) == null || (m?.ph) === false ? undefined : (m?.ph) === true ? '' : String(m?.ph)} style={dcStyle("height:48px;width:100%;box-sizing:border-box;border:1px solid #8A8276;border-radius:12px;padding:0 14px;font:inherit;font-size:16px;color:#162660;background:#ffffff;max-width:360px")} /><span style={dcStyle("font-size:13px;color:#5B6585")}>{dcStr(m?.help)}</span><span style={dcStyle("display:flex;gap:8px;flex-wrap:wrap")}><button className="bk" onClick={(typeof (m?.connect) === 'function' ? (m?.connect) : undefined) as any} style={dcStyle("height:44px;padding:0 16px;border:0;border-radius:12px;background:#162660;color:#ffffff;font-size:15px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap")}>{dcStr(m?.connectLabel)}</button><button className="bs" onClick={(typeof (m?.setup) === 'function' ? (m?.setup) : undefined) as any} style={dcStyle("height:44px;padding:0 14px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;color:#162660;font-size:15px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap")}>{"Cancel"}</button></span></div></>) : null}</div></React.Fragment>))}</section><section aria-labelledby="kl-h" style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:18px;overflow:hidden")}><div style={dcStyle("display:flex;align-items:center;flex-wrap:wrap;gap:6px 10px;padding:12px 18px;border-bottom:1px solid #F6F0E7")}><h3 id="kl-h" style={dcStyle("margin:0;flex:1;min-width:160px;font-size:15px;font-weight:700")}>{"Khata limit"}</h3><span style={dcStyle("font-size:13px;color:#5B6585")}>{"Most a customer can owe before the counter stops a Khata sale"}</span></div><div style={dcStyle("display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:14px 18px")}><span style={dcStyle("display:flex;align-items:center;border:1px solid #D9CFC0;border-radius:12px;overflow:hidden")}><button className="key" onClick={(typeof (v?.kDec) === 'function' ? (v?.kDec) : undefined) as any} aria-label="Lower the Khata limit" style={dcStyle("width:44px;height:44px;border:0;background:#ffffff;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.minus) == null || (v?.ic?.minus) === false ? undefined : (v?.ic?.minus) === true ? '' : String(v?.ic?.minus)} /></svg></button><span className="num" style={dcStyle("min-width:120px;text-align:center;font-size:16px;font-weight:700")}>{dcStr(v?.khataLimit)}</span><button className="key" onClick={(typeof (v?.kInc) === 'function' ? (v?.kInc) : undefined) as any} aria-label="Raise the Khata limit" style={dcStyle("width:44px;height:44px;border:0;background:#ffffff;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.plus) == null || (v?.ic?.plus) === false ? undefined : (v?.ic?.plus) === true ? '' : String(v?.ic?.plus)} /></svg></button></span><span style={dcStyle("font-size:13px;color:#5B6585")}>{"You can set a different limit on any customer."}</span></div></section><section aria-labelledby="rd-h" style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:18px;overflow:hidden")}><div style={dcStyle("display:flex;align-items:center;flex-wrap:wrap;gap:6px 10px;padding:12px 18px;border-bottom:1px solid #F6F0E7")}><h3 id="rd-h" style={dcStyle("margin:0;flex:1;min-width:160px;font-size:15px;font-weight:700")}>{"Round the bill total"}</h3><div role="tablist" aria-label="Round to" style={dcStyle("display:flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:14px;background:#ECE4D8;align-self:flex-start;max-width:100%;box-sizing:border-box")}>{(v?.rounds || []).map((t: any, $index: number) => (<React.Fragment key={$index}><button role="tab" aria-selected={(t?.sel) == null || (t?.sel) === false ? undefined : (t?.sel) === true ? '' : String(t?.sel)} onClick={(typeof (t?.pick) === 'function' ? (t?.pick) : undefined) as any} style={dcStyle(("height:40px;padding:0 16px;border:0;border-radius:11px;background:" + dcStr(t?.bg) + ";color:" + dcStr(t?.fg) + ";box-shadow:" + dcStr(t?.sh) + ";font-size:14px;font-weight:600;white-space:nowrap"))}>{dcStr(t?.label)}</button></React.Fragment>))}</div></div><p style={dcStyle("margin:0;padding:12px 18px 14px;font-size:14px;color:#454F70")}>{dcStr(v?.roundLine)}</p></section>{Boolean(v?.toastOn) ? (<><div role="status" style={dcStyle("position:sticky;bottom:12px;align-self:center;z-index:5;min-height:48px;display:flex;align-items:center;gap:10px;padding:0 16px;border-radius:14px;background:#162660;color:#ffffff;font-size:15px;box-shadow:0 12px 28px rgba(12,20,50,.28);animation:zup .2s ease-out")}>{dcStr(v?.toastText)}</div></>) : null}</div>
      </>
    );
  }
}
