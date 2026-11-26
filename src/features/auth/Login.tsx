// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  ICONS,
  POS,
  SET,
  STAFF,
  beep,
  pinOf,
  staffById
} from '@/lib/common';


const DEFAULT_PROPS: Record<string, any> = {
  "w": 1280,
  "h": 800,
  "shiftOpen": false,
  "demo": "none"
};

class LoginBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

constructor(props) {
super(props);
var p = props || {}, demo = p.demo || 'none';
this.timers = {};
this.state = { staffId: 'ali', pin: demo === 'typing' ? '11' : '', err: demo === 'error', tries: demo === 'error' ? 1 : 0, ok: demo === 'success', done: demo === 'success', shakeN: 0 };
}
componentDidMount() {
var self = this;
if (typeof window === 'undefined' || (this.props && this.props.preview)) return;
this._onKey = function (e) {
if (e.metaKey || e.ctrlKey || e.altKey) return;
var tag = e.target && e.target.tagName;
if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
if (e.key >= '0' && e.key <= '9') { e.preventDefault(); self.press(e.key); }
else if (e.key === 'Backspace') { e.preventDefault(); self.press('del'); }
else if (e.key === 'Escape') { e.preventDefault(); self.press('clr'); }
};
window.addEventListener('keydown', this._onKey);
}
componentWillUnmount() {
var t = this.timers; Object.keys(t).forEach(function (k) { clearTimeout(t[k]); });
if (typeof window !== 'undefined' && this._onKey) window.removeEventListener('keydown', this._onKey);
}
press(d) {
var self = this, s = this.state;
if (s.ok || s.tries >= 5) return;
if (d === 'del') { this.setState({ pin: s.pin.slice(0, -1), err: false }); return; }
if (d === 'clr') { this.setState({ pin: '', err: false }); return; }
var PL = +SET.sec.pin || 4, pin = (s.pin + d).slice(0, PL);
this.setState({ pin: pin, err: false });
if (pin.length === PL) {
if (pin === pinOf(s.staffId)) {
this.setState({ ok: true });
if (self.state.sound !== false) beep('ok');
this.timers.ok = setTimeout(function () {
if (self.props && self.props.onDone) self.props.onDone(self.state.staffId);
else self.setState({ done: true });
}, 450);
} else {
beep('err');
this.timers.err = setTimeout(function () { self.setState({ pin: '', err: true, tries: self.state.tries + 1, shakeN: self.state.shakeN + 1 }); }, 120);
}
}
}
renderVals() {
var self = this, s = this.state, p = this.props || {};
var W = p.w || 1280, H = p.h || 800;
var narrow = W < 1200, compact = W < 1000, stack = W < 740;
var me = staffById(s.staffId);
var staff = STAFF.map(function (st) {
var on = st.id === s.staffId;
return { name: st.name, role: st.role, ini: st.ini, avBg: st.bg, avFg: st.fg, last: st.id === 'ali' ? 'Last in' : '', checked: on ? 'true' : 'false',
border: on ? '2px solid #2E46A0' : '1px solid #E9E1D5', bg: on ? '#EEF5FE' : '#ffffff',
pick: function () { self.setState({ staffId: st.id, pin: '', err: false, tries: 0 }); } };
});
var dots = (+SET.sec.pin === 6 ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3]).map(function (i) {
var filled = i < s.pin.length || s.ok;
return { bg: s.ok ? '#2F9E63' : (filled ? '#162660' : '#ffffff'), ring: s.ok ? '#2F9E63' : (s.err ? '#B42318' : (filled ? '#162660' : '#C8BCAA')) };
});
var locked = s.tries >= 5;
var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clr', '0', 'del'].map(function (k) {
var isIcon = k === 'del', isClr = k === 'clr';
return { label: isClr ? 'Clear' : k, isIcon: isIcon, isText: !isIcon, aria: isIcon ? 'Delete last digit' : (isClr ? 'Clear PIN' : k), size: isClr ? 15 : 26, weight: isClr ? 600 : 700, fg: isClr ? '#2E46A0' : '#162660', off: locked || s.ok,
press: function () { self.press(isIcon ? 'del' : (isClr ? 'clr' : k)); } };
});
var left = 5 - s.tries;
var msg = s.ok ? 'PIN correct' : (locked ? 'Too many tries · locked for 5 minutes' : (s.err ? 'Wrong PIN · ' + left + (left === 1 ? ' try' : ' tries') + ' left' : 'Enter your ' + (+SET.sec.pin || 4) + '-digit PIN'));
return {
pinHint: 'Ali ' + pinOf('ali') + ' · Sana ' + pinOf('sana') + ' · Imran ' + pinOf('imran'),
ic: ICONS, W: W, H: H, rootH: compact ? 'auto' : '100dvh', rootOv: compact ? 'visible' : 'hidden', sideW: narrow ? 340 : 440, padX: compact ? (W < 520 ? 16 : 24) : (narrow ? 40 : 64), gap: stack ? 16 : (narrow ? 24 : 40), listWcss: stack ? '100%' : (narrow ? 300 : 340) + 'px',
compact: compact, wideSide: !compact, flow: compact ? 'column' : 'row', mainJustify: compact ? 'flex-start' : 'center', padY: compact ? 20 : 32, rowTop: compact ? 18 : 28,
rowDir: stack ? 'column' : 'row', rowAlign: stack ? 'stretch' : 'flex-start', pinW: stack ? '100%' : '348px',
shiftTitle: p.shiftOpen ? 'Shift open since 10:02 am' : 'No shift open yet',
shiftText: p.shiftOpen ? 'Opened by Ali · float Rs 10,000. Signing in switches the cashier; the bill on screen stays.' : 'The first person to sign in counts the opening float before selling.',
staff: staff, dots: dots, keys: keys,
pinTitle: me.short + ', enter your PIN', msg: msg, msgFg: s.ok ? '#14532D' : ((s.err || locked) ? '#B42318' : '#5B6585'),
shake: s.err ? (s.shakeN % 2 ? 'zshake .35s ease-out' : 'zshake .36s ease-out') : 'none',
done: !!s.done, who: me.short, standalone: !p.onDone,
nextText: p.shiftOpen ? 'Back to the register' : 'Next: count the opening float',
reset: function () { self.setState({ pin: '', ok: false, done: false, err: false, tries: 0 }); }
};
}
}

export default class Login extends LoginBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div style={dcStyle(("width:100%;max-width:100vw;min-height:100dvh;height:" + dcStr(v?.rootH) + ";position:relative;overflow-x:hidden;overflow-y:" + dcStr(v?.rootOv) + ";display:flex;flex-direction:" + dcStr(v?.flow) + ";background:#F1E4D1;color:#162660;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:15px"))}>{Boolean(v?.compact) ? (<><header style={dcStyle("height:64px;flex:none;background:#162660;color:#ffffff;display:flex;align-items:center;gap:12px;padding:0 16px")}><svg role="img" aria-label="ZYRO Retail POS" width="40" height="40" viewBox="0 0 64 64" style={dcStyle("flex:none;display:block;")}><rect width="64" height="64" rx="15" fill="#162660" /><circle cx="30" cy="35" r="16" fill="none" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" strokeDasharray="76 24.5" transform="rotate(8 30 35)" /><circle cx="44.5" cy="21" r="6.6" fill="#D0E6FD" stroke="#162660" strokeWidth="1.6" /></svg><span style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.3")}><span style={dcStyle("font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{"Hamza Fashion · Counter 1"}</span><span style={dcStyle("font-size:13px;color:#A9BCE0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{dcStr(v?.shiftTitle)}</span></span><span className="num" style={dcStyle("font-family:Outfit,sans-serif;font-size:22px;font-weight:700")}>{"10:02"}</span></header></>) : null}{Boolean(v?.wideSide) ? (<><aside style={dcStyle(("width:" + dcStr(v?.sideW) + "px;flex:none;background:#162660;color:#ffffff;display:flex;flex-direction:column;padding:40px 40px 32px"))}><div style={dcStyle("display:flex;align-items:center;gap:12px")}><svg role="img" aria-label="ZYRO Retail POS" width="48" height="48" viewBox="0 0 64 64" style={dcStyle("flex:none;display:block;")}><rect width="64" height="64" rx="15" fill="#162660" /><circle cx="30" cy="35" r="16" fill="none" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" strokeDasharray="76 24.5" transform="rotate(8 30 35)" /><circle cx="44.5" cy="21" r="6.6" fill="#D0E6FD" stroke="#162660" strokeWidth="1.6" /></svg><div style={dcStyle("display:flex;flex-direction:column;gap:2px")}><span style={dcStyle("font-size:17px;font-weight:700")}>{"Hamza Fashion"}</span><span style={dcStyle("font-size:13px;color:#A9BCE0")}>{"Counter 1 · ZYRO Retail POS"}</span></div></div><div style={dcStyle("margin-top:auto;display:flex;flex-direction:column;gap:6px")}><span className="num" style={dcStyle("font-family:Outfit,sans-serif;font-size:64px;font-weight:700;letter-spacing:-.03em;line-height:1")}>{"10:02"}</span><span style={dcStyle("font-size:17px;color:#BFD0EE")}>{"Saturday, 14 November"}</span></div><div style={dcStyle("margin-top:28px;border-radius:16px;background:rgba(241,228,209,.08);padding:16px 18px;display:flex;gap:12px;align-items:flex-start")}><span style={dcStyle("width:40px;height:40px;flex:none;border-radius:999px;background:rgba(241,228,209,.12);display:flex;align-items:center;justify-content:center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D0E6FD" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.cash) == null || (v?.ic?.cash) === false ? undefined : (v?.ic?.cash) === true ? '' : String(v?.ic?.cash)} /></svg></span><span style={dcStyle("display:flex;flex-direction:column;gap:3px")}><span style={dcStyle("font-size:15px;font-weight:700")}>{dcStr(v?.shiftTitle)}</span><span style={dcStyle("font-size:13px;line-height:1.5;color:#BFD0EE")}>{dcStr(v?.shiftText)}</span></span></div><div style={dcStyle("margin-top:14px;display:flex;align-items:center;gap:8px;font-size:13px;color:#A9BCE0")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7FD6A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.cloud) == null || (v?.ic?.cloud) === false ? undefined : (v?.ic?.cloud) === true ? '' : String(v?.ic?.cloud)} /></svg><span>{"Synced 2 min ago"}</span></div></aside></>) : null}<main style={dcStyle(("flex:1;min-width:0;min-height:0;overflow:auto;display:flex;flex-direction:column;justify-content:" + dcStr(v?.mainJustify) + ";padding:" + dcStr(v?.padY) + "px " + dcStr(v?.padX) + "px"))}>{Boolean(v?.standalone) ? (<><a href={dcHref("Account.dc.html")} onClick={dcLinkClick("Account.dc.html", undefined)} className="bt" style={dcStyle("align-self:flex-start;min-height:44px;margin-bottom:4px;display:inline-flex;align-items:center;gap:6px;color:#2E46A0;font-size:14px;font-weight:600;text-decoration:none")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.back) == null || (v?.ic?.back) === false ? undefined : (v?.ic?.back) === true ? '' : String(v?.ic?.back)} /></svg>{"Back to Welcome"}</a></>) : null}<h1 style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:26px;font-weight:700")}>{"Sign in to sell"}</h1><p style={dcStyle("margin:6px 0 0;font-size:15px;line-height:1.5;color:#454F70")}>{"Pick your name, then enter your PIN. Every sale and refund is saved under your name."}</p><div style={dcStyle(("margin-top:" + dcStr(v?.rowTop) + "px;display:flex;flex-direction:" + dcStr(v?.rowDir) + ";gap:" + dcStr(v?.gap) + "px;align-items:" + dcStr(v?.rowAlign)))}><div role="radiogroup" aria-label="Staff" style={dcStyle(("width:" + dcStr(v?.listWcss) + ";flex:none;display:flex;flex-direction:column;gap:10px"))}>{(v?.staff || []).map((s: any, $index: number) => (<React.Fragment key={$index}><button className="opt" role="radio" aria-checked={(s?.checked) == null || (s?.checked) === false ? undefined : (s?.checked) === true ? '' : String(s?.checked)} onClick={(typeof (s?.pick) === 'function' ? (s?.pick) : undefined) as any} style={dcStyle(("height:76px;display:flex;align-items:center;gap:14px;padding:0 16px;border:" + dcStr(s?.border) + ";border-radius:16px;background:" + dcStr(s?.bg) + ";text-align:left"))}><span style={dcStyle(("width:48px;height:48px;flex:none;border-radius:999px;background:" + dcStr(s?.avBg) + ";color:" + dcStr(s?.avFg) + ";display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700"))}>{dcStr(s?.ini)}</span><span style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}><span style={dcStyle("font-size:17px;font-weight:600")}>{dcStr(s?.name)}</span><span style={dcStyle("font-size:13px;color:#5B6585")}>{dcStr(s?.role)}</span></span><span style={dcStyle("font-size:13px;color:#5B6585")}>{dcStr(s?.last)}</span></button></React.Fragment>))}<p style={dcStyle("margin:6px 2px 0;font-size:13px;line-height:1.5;color:#5B6585")}>{"Forgot your PIN? The owner resets it from Staff. PINs are never shared between people."}</p></div><section aria-labelledby="pin-title" style={dcStyle(("width:" + dcStr(v?.pinW) + ";max-width:100%;flex:none;background:#ffffff;border:1px solid #E9E1D5;border-radius:22px;padding:24px 20px 24px;display:flex;flex-direction:column;align-items:center;gap:16px;box-shadow:0 1px 2px rgba(12,20,50,.06)"))}><div style={dcStyle("display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center")}><h2 id="pin-title" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{dcStr(v?.pinTitle)}</h2><span role="status" aria-live="polite" style={dcStyle(("min-height:20px;font-size:13px;font-weight:600;color:" + dcStr(v?.msgFg)))}>{dcStr(v?.msg)}</span></div><div aria-hidden="true" style={dcStyle(("height:24px;display:flex;gap:18px;animation:" + dcStr(v?.shake)))}>{(v?.dots || []).map((d: any, $index: number) => (<React.Fragment key={$index}><span data-pin-dot="1" style={dcStyle(("width:18px;height:18px;border-radius:999px;background:" + dcStr(d?.bg) + ";box-shadow:inset 0 0 0 2px " + dcStr(d?.ring) + ";transition:background-color .1s ease-out"))}></span></React.Fragment>))}</div><div role="group" aria-label="PIN keypad" style={dcStyle("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;width:100%")}>{(v?.keys || []).map((k: any, $index: number) => (<React.Fragment key={$index}><button className="key" onClick={(typeof (k?.press) === 'function' ? (k?.press) : undefined) as any} aria-label={(k?.aria) == null || (k?.aria) === false ? undefined : (k?.aria) === true ? '' : String(k?.aria)} disabled={Boolean(k?.off)} style={dcStyle(("height:68px;border:1px solid #E9E1D5;border-radius:16px;background:#F8F2E9;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:" + dcStr(k?.size) + "px;font-weight:" + dcStr(k?.weight) + ";color:" + dcStr(k?.fg)))}>{Boolean(k?.isIcon) ? (<><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.backspace) == null || (v?.ic?.backspace) === false ? undefined : (v?.ic?.backspace) === true ? '' : String(v?.ic?.backspace)} /></svg></>) : null}{Boolean(k?.isText) ? (<><span className="num">{dcStr(k?.label)}</span></>) : null}</button></React.Fragment>))}</div><span style={dcStyle("font-size:13px;line-height:1.5;color:#5B6585;text-align:center")}>{"Prototype PINs"}<br />{dcStr(v?.pinHint)}</span></section></div></main>{Boolean(v?.done) ? (<><div style={dcStyle("position:fixed;inset:0;z-index:20;background:rgba(241,228,209,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;animation:zfade .2s ease-out")}><span style={dcStyle("width:88px;height:88px;border-radius:999px;background:#E8F6EE;color:#14532D;display:flex;align-items:center;justify-content:center;animation:zpop .35s ease-out")}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.check) == null || (v?.ic?.check) === false ? undefined : (v?.ic?.check) === true ? '' : String(v?.ic?.check)} style={dcStyle("stroke-dasharray:48;animation:zdraw .4s ease-out")} /></svg></span><span style={dcStyle("font-family:Outfit,sans-serif;font-size:26px;font-weight:700")}>{("Welcome, " + dcStr(v?.who))}</span><span style={dcStyle("font-size:15px;color:#454F70")}>{dcStr(v?.nextText)}</span>{Boolean(v?.standalone) ? (<><div style={dcStyle("margin-top:8px;display:flex;flex-wrap:wrap;justify-content:center;gap:10px")}><a href={dcHref("Main.dc.html")} onClick={dcLinkClick("Main.dc.html", undefined)} className="bp" style={dcStyle("height:48px;padding:0 22px;border-radius:14px;background:#162660;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;display:inline-flex;align-items:center;gap:8px")}>{"Open Register"}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.right) == null || (v?.ic?.right) === false ? undefined : (v?.ic?.right) === true ? '' : String(v?.ic?.right)} /></svg></a><button className="bs" onClick={(typeof (v?.reset) === 'function' ? (v?.reset) : undefined) as any} style={dcStyle("height:48px;padding:0 20px;border:1px solid #D9CFC0;border-radius:14px;background:#ffffff;font-size:15px;font-weight:600")}>{"Sign out"}</button></div></>) : null}</div></>) : null}</div>
      </>
    );
  }
}
