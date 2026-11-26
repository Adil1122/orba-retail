// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  ICONS,
  MANAGER_PIN,
  TINT,
  artFor,
  avail,
  chip,
  digits,
  findItem,
  mkLine,
  n,
  openBoard,
  rs,
  toInt
} from '@/lib/common';


const DEFAULT_PROPS: Record<string, any> = {
  "staffRole": "Cashier"
};

var LINE_LIMIT = 200;
function sampleLine() { var l = mkLine('tee', 0, 1, 2); var it = findItem('tee'); return Object.assign(l, { art: artFor(it, 0), bg: TINT.men.bg, avail: avail(it, 0, 1) }); }
class LineEditBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

constructor(props) {
super(props);
var l = (props && props.line) || sampleLine();
this.state = { qty: String(l.qty), fresh: true, disc: l.disc ? String(l.disc) : '', note: l.note || '', pin: '', removing: false };
}
renderVals() {
var self = this, s = this.state, p = this.props || {};
var l = p.line || sampleLine();
var q = toInt(s.qty), max = Math.max(l.avail || 0, l.qty);
var d = toInt(s.disc), gross = l.price * q;
var isMgr = p.staffRole === 'Manager';
var needPin = d > LINE_LIMIT && !isMgr, pinOk = s.pin === MANAGER_PIN;
var discTooBig = d > gross && q > 0;
var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'del'].map(function (k) {
return { label: k, isIcon: k === 'del', isText: k !== 'del', aria: k === 'del' ? 'Delete digit' : (k === 'C' ? 'Clear quantity' : k), size: k === 'C' ? 17 : 22, fg: k === 'C' ? '#2E46A0' : '#162660',
press: function () {
var st = self.state, cur = st.fresh ? '' : st.qty;
if (k === 'del') self.setState({ qty: cur.slice(0, -1) || '0', fresh: false });
else if (k === 'C') self.setState({ qty: '0', fresh: false });
else self.setState({ qty: String(toInt(cur + k)).slice(0, 3), fresh: false });
} };
});
var overStock = q > max;
var why = overStock ? 'Only ' + max + ' available here' : (discTooBig ? 'Discount is more than the line' : (needPin && !pinOk ? 'Manager PIN needed above Rs ' + LINE_LIMIT : (q === 0 ? 'Quantity is 0 · use Remove' : '')));
return {
ic: ICONS, name: l.name, variant: l.variant, sku: l.sku, eachN: n(l.price), art: l.art, bg: l.bg,
qty: q, qtyFg: overStock ? '#B42318' : '#162660', atZero: q <= 0, atMax: q >= max,
inc: function () { self.setState({ qty: String(Math.min(max, toInt(self.state.qty) + 1)), fresh: false }); },
dec: function () { self.setState({ qty: String(Math.max(0, toInt(self.state.qty) - 1)), fresh: false }); },
keys: keys,
stockChip: overStock ? chip('err', 'Only ' + max + ' available') : (max - q <= 2 ? chip('warn', (max - q) + ' left after this') : chip('ok', max + ' available')),
disc: s.disc, onDisc: function (e) { self.setState({ disc: digits(e.target.value, 6), pin: '' }); },
discBd: discTooBig ? '#B42318' : '#D9CFC0', needPin: needPin, pin: s.pin, pinBd: pinOk ? '#2F9E63' : (s.pin.length === 4 ? '#B42318' : '#D9CFC0'),
onPin: function (e) { self.setState({ pin: digits(e.target.value, 4) }); },
discHint: isMgr ? 'Managers can discount any line.' : (needPin ? (pinOk ? 'Approved by Imran' : 'Above Rs ' + LINE_LIMIT + ' · manager PIN (test 1234)') : 'Up to Rs ' + LINE_LIMIT + ' per line without a manager.'),
discHintFg: needPin && pinOk ? '#14532D' : '#5B6585',
note: s.note, onNote: function (e) { self.setState({ note: e.target.value.slice(0, 80) }); },
totalN: n(Math.max(0, gross - (discTooBig ? 0 : d))),
removing: s.removing || q === 0, notRemoving: !(s.removing || q === 0),
cantSave: !!why, showWhy: !!why && !(s.removing || q === 0), why: why,
askRemove: function () { self.setState({ removing: true }); },
keep: function () { self.setState({ removing: false, qty: q === 0 ? String(l.qty) : self.state.qty }); },
remove: function () { if (p.onRemove) p.onRemove(); else self.setState({ removing: false }); },
save: function () { if (why) return; if (p.onSave) p.onSave({ qty: q, disc: d, note: s.note.trim() }); else openBoard('Main'); },
close: function () { if (p.onClose) p.onClose(); else openBoard('Main'); }
};
}
}

export default class LineEdit extends LineEditBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div role="dialog" aria-modal="true" aria-labelledby="le-title" style={dcStyle("width:560px;height:640px;max-width:100%;max-height:100%;background:#ffffff;border-radius:22px;box-shadow:0 24px 64px rgba(12,20,50,.3);display:flex;flex-direction:column;overflow:hidden;color:#162660;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:15px;animation:zsheet .25s ease-out")}><div style={dcStyle("display:flex;align-items:center;gap:14px;padding:20px 24px 16px;border-bottom:1px solid #F6F0E7")}><span style={dcStyle(("width:60px;height:60px;flex:none;border-radius:16px;background:" + dcStr(v?.bg) + ";display:flex;align-items:center;justify-content:center"))}><svg width="52" height="52" viewBox="0 0 120 120" aria-hidden="true"><path d={(v?.art?.body) == null || (v?.art?.body) === false ? undefined : (v?.art?.body) === true ? '' : String(v?.art?.body)} fill={(v?.art?.fill) == null || (v?.art?.fill) === false ? undefined : (v?.art?.fill) === true ? '' : String(v?.art?.fill)} stroke="rgba(22,38,96,.22)" strokeWidth="2" /><path d={(v?.art?.shade) == null || (v?.art?.shade) === false ? undefined : (v?.art?.shade) === true ? '' : String(v?.art?.shade)} fill={(v?.art?.shadeCol) == null || (v?.art?.shadeCol) === false ? undefined : (v?.art?.shadeCol) === true ? '' : String(v?.art?.shadeCol)} /><path d={(v?.art?.line) == null || (v?.art?.line) === false ? undefined : (v?.art?.line) === true ? '' : String(v?.art?.line)} fill="none" stroke={(v?.art?.lineCol) == null || (v?.art?.lineCol) === false ? undefined : (v?.art?.lineCol) === true ? '' : String(v?.art?.lineCol)} strokeWidth="2.2" strokeLinecap="round" /></svg></span><div style={dcStyle("flex:1;min-width:0")}><h2 id="le-title" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{dcStr(v?.name)}</h2><div style={dcStyle("margin-top:4px;display:flex;gap:8px;align-items:center;font-size:13px;color:#5B6585")}><span>{dcStr(v?.variant)}</span><span className="mono">{dcStr(v?.sku)}</span><span className="num">{("· Rs " + dcStr(v?.eachN) + " each")}</span></div></div><button onClick={(typeof (v?.close) === 'function' ? (v?.close) : undefined) as any} aria-label="Close" style={dcStyle("width:44px;height:44px;flex:none;border:0;border-radius:999px;background:#F6F0E7;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.x) == null || (v?.ic?.x) === false ? undefined : (v?.ic?.x) === true ? '' : String(v?.ic?.x)} /></svg></button></div><div style={dcStyle("flex:1;min-height:0;overflow:auto;padding:14px 24px;display:flex;flex-direction:column;gap:14px")}><div style={dcStyle("display:flex;gap:20px;align-items:stretch")}><div style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:10px")}><span style={dcStyle("font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#5B6585")}>{"Quantity"}</span><div style={dcStyle("display:flex;align-items:center;gap:10px")}><button className="key" onClick={(typeof (v?.dec) === 'function' ? (v?.dec) : undefined) as any} aria-label="One fewer" disabled={Boolean(v?.atZero)} style={dcStyle("width:56px;height:56px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;display:flex;align-items:center;justify-content:center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.minus) == null || (v?.ic?.minus) === false ? undefined : (v?.ic?.minus) === true ? '' : String(v?.ic?.minus)} /></svg></button><output className="num" aria-live="polite" style={dcStyle(("flex:1;text-align:center;font-family:Outfit,sans-serif;font-size:52px;font-weight:700;letter-spacing:-.03em;line-height:1;color:" + dcStr(v?.qtyFg)))}>{dcStr(v?.qty)}</output><button className="key" onClick={(typeof (v?.inc) === 'function' ? (v?.inc) : undefined) as any} aria-label="One more" disabled={Boolean(v?.atMax)} style={dcStyle("width:56px;height:56px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;display:flex;align-items:center;justify-content:center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.plus) == null || (v?.ic?.plus) === false ? undefined : (v?.ic?.plus) === true ? '' : String(v?.ic?.plus)} /></svg></button></div><span style={dcStyle(("align-self:flex-start;height:26px;padding:0 9px;border-radius:999px;background:" + dcStr(v?.stockChip?.bg) + ";color:" + dcStr(v?.stockChip?.fg) + ";font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:5px"))}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.stockChip?.d) == null || (v?.stockChip?.d) === false ? undefined : (v?.stockChip?.d) === true ? '' : String(v?.stockChip?.d)} /></svg><span className="num">{dcStr(v?.stockChip?.text)}</span></span><span style={dcStyle("font-size:13px;line-height:1.5;color:#5B6585")}>{"Set to 0 to take it off the bill."}</span></div><div role="group" aria-label="Quantity keypad" style={dcStyle("width:220px;flex:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px")}>{(v?.keys || []).map((k: any, $index: number) => (<React.Fragment key={$index}><button className="key" onClick={(typeof (k?.press) === 'function' ? (k?.press) : undefined) as any} aria-label={(k?.aria) == null || (k?.aria) === false ? undefined : (k?.aria) === true ? '' : String(k?.aria)} style={dcStyle(("height:46px;border:1px solid #E9E1D5;border-radius:12px;background:#F8F2E9;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:" + dcStr(k?.size) + "px;font-weight:700;color:" + dcStr(k?.fg)))}>{Boolean(k?.isIcon) ? (<><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.backspace) == null || (v?.ic?.backspace) === false ? undefined : (v?.ic?.backspace) === true ? '' : String(v?.ic?.backspace)} /></svg></>) : null}{Boolean(k?.isText) ? (<><span className="num">{dcStr(k?.label)}</span></>) : null}</button></React.Fragment>))}</div></div><div style={dcStyle("display:flex;flex-direction:column;gap:6px")}><label htmlFor="le-disc" style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Line discount"}</label><div style={dcStyle("display:flex;gap:10px")}><div className="field" style={dcStyle(("width:180px;height:52px;display:flex;align-items:center;gap:8px;border:1px solid " + dcStr(v?.discBd) + ";border-radius:14px;padding:0 14px"))}><span style={dcStyle("font-size:15px;font-weight:500;color:#5B6585")}>{"Rs"}</span><input id="le-disc" className="num" inputMode="numeric" autoComplete="off" value={dcStr(v?.disc)} onChange={(typeof (v?.onDisc) === 'function' ? (v?.onDisc) : undefined) as any} placeholder="0" style={dcStyle("flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:17px;font-weight:600")} /></div>{Boolean(v?.needPin) ? (<><div className="field" style={dcStyle(("flex:1;height:52px;display:flex;align-items:center;gap:8px;border:1px solid " + dcStr(v?.pinBd) + ";border-radius:14px;padding:0 14px"))}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6585" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.key) == null || (v?.ic?.key) === false ? undefined : (v?.ic?.key) === true ? '' : String(v?.ic?.key)} /></svg><label htmlFor="le-pin" className="sr">{"Manager PIN"}</label><input id="le-pin" type="password" inputMode="numeric" maxLength={4} autoComplete="off" value={dcStr(v?.pin)} onChange={(typeof (v?.onPin) === 'function' ? (v?.onPin) : undefined) as any} placeholder="Manager PIN" style={dcStyle("flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:17px;letter-spacing:.2em")} /></div></>) : null}</div><span style={dcStyle(("font-size:13px;color:" + dcStr(v?.discHintFg)))}>{dcStr(v?.discHint)}</span></div><div style={dcStyle("display:flex;flex-direction:column;gap:6px")}><label htmlFor="le-note" style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Note on this line"}</label><div className="field" style={dcStyle("height:52px;display:flex;align-items:center;border:1px solid #D9CFC0;border-radius:14px;padding:0 14px")}><input id="le-note" autoComplete="off" value={dcStr(v?.note)} onChange={(typeof (v?.onNote) === 'function' ? (v?.onNote) : undefined) as any} placeholder="e.g. alteration on Friday, gift wrap" style={dcStyle("flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:15px")} /></div></div></div><div style={dcStyle("padding:14px 24px 20px;border-top:1px solid #F6F0E7;display:flex;flex-direction:column;gap:8px")}><div style={dcStyle("display:flex;justify-content:space-between;font-size:15px;color:#454F70")}><span>{"Line total"}</span><span className="num" style={dcStyle("font-weight:700;color:#162660")}><span className="rs">{"Rs"}</span>{dcStr(v?.totalN)}</span></div><div style={dcStyle("display:flex;gap:10px")}>{Boolean(v?.notRemoving) ? (<><button className="bs" onClick={(typeof (v?.askRemove) === 'function' ? (v?.askRemove) : undefined) as any} style={dcStyle("height:56px;padding:0 18px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;color:#B42318;font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.clear) == null || (v?.ic?.clear) === false ? undefined : (v?.ic?.clear) === true ? '' : String(v?.ic?.clear)} /></svg>{"Remove"}</button><button className="bp" onClick={(typeof (v?.save) === 'function' ? (v?.save) : undefined) as any} disabled={Boolean(v?.cantSave)} style={dcStyle("flex:1;height:56px;border:0;border-radius:14px;background:#162660;color:#FFFFFF;font-size:17px;font-weight:700;box-shadow:inset 0 -1px 0 #2E46A0")}><span className="num">{"Save line · "}<span className="rs">{"Rs"}</span>{dcStr(v?.totalN)}</span></button></>) : null}{Boolean(v?.removing) ? (<><button className="bs" onClick={(typeof (v?.keep) === 'function' ? (v?.keep) : undefined) as any} style={dcStyle("flex:1;height:56px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;font-size:16px;font-weight:600")}>{"Keep it"}</button><button className="bd" onClick={(typeof (v?.remove) === 'function' ? (v?.remove) : undefined) as any} style={dcStyle("flex:1;height:56px;border:0;border-radius:14px;background:#B42318;color:#ffffff;font-size:16px;font-weight:700")}>{"Remove from bill"}</button></>) : null}</div>{Boolean(v?.showWhy) ? (<><span style={dcStyle("font-size:13px;color:#5B6585;text-align:right")}>{dcStr(v?.why)}</span></>) : null}</div></div>
      </>
    );
  }
}
