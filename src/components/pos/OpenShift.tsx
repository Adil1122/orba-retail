// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  ICONS,
  NOTES,
  STATUS,
  digits,
  n,
  rz,
  staffById,
  toInt
} from '@/lib/common';

var __G: any = typeof window !== 'undefined' ? window : globalThis;

const DEFAULT_PROPS: Record<string, any> = {
  "w": 1280,
  "h": 800,
  "staffId": "ali"
};

var START_COUNTS = [1, 3, 2, 7, 4, 5, 0];
class OpenShiftBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

  constructor(props) {
    super(props);
    this.state = { counts: START_COUNTS.slice(), coins: '', mode: 'notes', typed: '', counter: 1, saving: false };
    this.timers = {};
  }
  componentWillUnmount() { var t = this.timers; Object.keys(t).forEach(function (k) { clearTimeout(t[k]); }); }
  setCount(i, v) { var a = this.state.counts.slice(); a[i] = Math.max(0, Math.min(999, v)); this.setState({ counts: a }); }
  renderVals() {
    var self = this, s = this.state, p = this.props || {};
    var W = p.w || 1280, H = p.h || 800;
    var me = staffById(p.staffId || 'ali');
    var noteSum = 0;
    var rows = NOTES.map(function (nt, i) {
      var c = s.counts[i]; noteSum += c * nt.v;
      return { v: nt.v, label: nt.label, short: nt.v >= 1000 ? (nt.v / 1000) + 'K' : nt.v, tone: nt.tone, count: String(c), amount: n(c * nt.v), amtFg: c ? '#162660' : '#5B6585',
        inc: function () { self.setCount(i, self.state.counts[i] + 1); },
        dec: function () { self.setCount(i, self.state.counts[i] - 1); },
        set: function (e) { self.setCount(i, toInt(e.target.value)); } };
    });
    var byNote = s.mode === 'notes';
    var fl = byNote ? noteSum + toInt(s.coins) : toInt(s.typed);
    var d = fl - 10000;
    var cmp = d === 0 ? { bg: STATUS.ok.bg, fg: STATUS.ok.fg, d: ICONS.checkCircle, text: 'Matches the suggested float' }
      : { bg: STATUS.warn.bg, fg: STATUS.warn.fg, d: ICONS.warn, text: 'Rs ' + n(d) + (d < 0 ? ' below' : ' above') + ' the suggested float' };
    var emptyTyped = !byNote && s.typed === '';
    var counters = [1, 2].map(function (k) { var on = s.counter === k; return { label: 'Counter ' + k, checked: on ? 'true' : 'false', border: on ? '2px solid #2E46A0' : '1px solid #D9CFC0', bg: on ? '#EEF5FE' : '#ffffff', pick: function () { self.setState({ counter: k }); } }; });
    var seg = function (on) { return { bg: on ? '#ffffff' : 'transparent', fg: on ? '#162660' : '#454F70', sh: on ? '0 1px 2px rgba(22,30,60,.08)' : 'none' }; };
    var a = seg(byNote), b = seg(!byNote);
    return {
      ic: ICONS, W: W, H: H, me: me, sideW: W < 1200 ? 340 : 400, rowH: H < 700 ? 50 : 56,
      counterName: 'Counter ' + s.counter,
      byNote: byNote, byTotal: !byNote, byNoteStr: byNote ? 'true' : 'false', byTotalStr: byNote ? 'false' : 'true',
      noteTabBg: a.bg, noteTabFg: a.fg, noteTabSh: a.sh, totalTabBg: b.bg, totalTabFg: b.fg, totalTabSh: b.sh,
      useNotes: function () { self.setState({ mode: 'notes' }); },
      useTotal: function () { self.setState({ mode: 'total', typed: self.state.typed || String(noteSum + toInt(self.state.coins)) }); },
      rows: rows, coins: s.coins, setCoins: function (e) { self.setState({ coins: digits(e.target.value, 6) }); },
      typed: s.typed, setTyped: function (e) { self.setState({ typed: digits(e.target.value, 7) }); },
      floatN: n(fl), cmp: cmp, counters: counters, saving: s.saving,
      cantStart: emptyTyped || s.saving,
      startLabel: s.saving ? 'Opening shift…' : 'Start selling · Rs ' + n(fl) + ' float',
      why: emptyTyped ? 'Type the cash in the drawer. Enter 0 if it’s empty.' : 'Your PIN is on this shift until you close it.',
      start: function () {
        if (self.state.saving) return;
        self.setState({ saving: true });
        self.timers.go = setTimeout(function () {
          if (self.props && self.props.onStart) self.props.onStart(fl);
          else self.setState({ saving: false });
        }, 600);
      },
      back: function () { if (self.props && self.props.onBack) self.props.onBack(); }
    };
  }
}

rz(OpenShiftBase, 1280, 800);

export default class OpenShift extends OpenShiftBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div data-nar={(v?.nar) == null || (v?.nar) === false ? undefined : (v?.nar) === true ? '' : String(v?.nar)} data-mid={(v?.mid) == null || (v?.mid) === false ? undefined : (v?.mid) === true ? '' : String(v?.mid)} data-cmp={(v?.cmp) == null || (v?.cmp) === false ? undefined : (v?.cmp) === true ? '' : String(v?.cmp)} style={dcStyle(("width:" + dcStr(v?.W) + "px;height:" + dcStr(v?.H) + "px;position:relative;overflow:hidden;display:flex;flex-direction:column;background:#F1E4D1;color:#162660;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:15px"))}><header className="rz-head" style={dcStyle("height:72px;flex:none;display:flex;align-items:center;gap:14px;padding:0 24px;border-bottom:1px solid #E9E1D5;background:#ffffff")}><button className="bt" onClick={(typeof (v?.back) === 'function' ? (v?.back) : undefined) as any} style={dcStyle("height:44px;display:flex;align-items:center;gap:6px;padding:0 8px 0 4px;border:0;background:transparent;color:#2E46A0;font-size:15px;font-weight:600")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.left) == null || (v?.ic?.left) === false ? undefined : (v?.ic?.left) === true ? '' : String(v?.ic?.left)}></path></svg>{"Switch staff"}</button><h1 className="rz-h1" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:26px;font-weight:700")}>{"Open shift"}</h1><span style={dcStyle("height:28px;padding:0 10px;border-radius:999px;background:#F6F0E7;color:#454F70;font-size:13px;font-weight:600;display:inline-flex;align-items:center")}>{dcStr(v?.counterName)}</span><span className="rz-hide" style={dcStyle("margin-left:auto;display:flex;align-items:center;gap:10px")}><span style={dcStyle(("width:40px;height:40px;border-radius:999px;background:" + dcStr(v?.me?.bg) + ";color:" + dcStr(v?.me?.fg) + ";display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700"))}>{dcStr(v?.me?.ini)}</span><span style={dcStyle("display:flex;flex-direction:column")}><span style={dcStyle("font-size:15px;font-weight:600")}>{dcStr(v?.me?.name)}</span><span style={dcStyle("font-size:13px;color:#5B6585")}>{(dcStr(v?.me?.role) + " · Sat 14 Nov, 10:02 am")}</span></span></span></header><div className="rz-stack rz-pad" style={dcStyle("flex:1;min-height:0;display:flex;gap:20px;padding:20px 24px 24px")}><section className="rz-col rz-free" aria-labelledby="count-title" style={dcStyle("flex:1;min-width:0;background:#ffffff;border:1px solid #E9E1D5;border-radius:20px;display:flex;flex-direction:column;overflow:hidden")}><div className="rz-wrap rz-wrapm" style={dcStyle("display:flex;align-items:center;gap:12px;padding:18px 20px 14px")}><div className="rz-w100 rz-w100m" style={dcStyle("flex:1;min-width:0")}><h2 id="count-title" style={dcStyle("margin:0;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{"Count the opening float"}</h2><p style={dcStyle("margin:4px 0 0;font-size:13px;color:#5B6585")}>{"Count the cash in the drawer before the first sale."}</p></div><div role="group" aria-label="Counting mode" style={dcStyle("display:flex;gap:2px;padding:3px;border-radius:12px;background:#ECE4D8")}><button aria-pressed={(v?.byNoteStr) == null || (v?.byNoteStr) === false ? undefined : (v?.byNoteStr) === true ? '' : String(v?.byNoteStr)} onClick={(typeof (v?.useNotes) === 'function' ? (v?.useNotes) : undefined) as any} style={dcStyle(("height:40px;padding:0 14px;border:0;border-radius:9px;background:" + dcStr(v?.noteTabBg) + ";color:" + dcStr(v?.noteTabFg) + ";font-size:15px;font-weight:600;box-shadow:" + dcStr(v?.noteTabSh)))}>{"Note by note"}</button><button aria-pressed={(v?.byTotalStr) == null || (v?.byTotalStr) === false ? undefined : (v?.byTotalStr) === true ? '' : String(v?.byTotalStr)} onClick={(typeof (v?.useTotal) === 'function' ? (v?.useTotal) : undefined) as any} style={dcStyle(("height:40px;padding:0 14px;border:0;border-radius:9px;background:" + dcStr(v?.totalTabBg) + ";color:" + dcStr(v?.totalTabFg) + ";font-size:15px;font-weight:600;box-shadow:" + dcStr(v?.totalTabSh)))}>{"Enter total"}</button></div></div><div style={dcStyle("height:1px;background:#F6F0E7")}></div>{Boolean(v?.byNote) ? (<><div className="rz-free" style={dcStyle("flex:1;min-height:0;overflow:auto;padding:6px 20px 12px")}>{(v?.rows || []).map((r: any, $index: number) => (<React.Fragment key={$index}><div style={dcStyle(("height:" + dcStr(v?.rowH) + "px;display:flex;align-items:center;gap:14px;border-bottom:1px solid #F1E4D1"))}><span className="rz-hide" aria-hidden="true" style={dcStyle(("width:54px;height:30px;flex:none;border-radius:4px;background:" + dcStr(r?.tone) + ";position:relative;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35)"))}><span className="num" style={dcStyle("position:absolute;right:5px;bottom:2px;font-size:12px;font-weight:700;color:#ffffff")}>{dcStr(r?.short)}</span></span><span className="rz-lab num" style={dcStyle("width:110px;font-size:15px;font-weight:600")}><span className="rs">{"Rs"}</span>{dcStr(r?.label)}</span><div style={dcStyle("display:flex;align-items:center;border:1px solid #D9CFC0;border-radius:12px;overflow:hidden")}><button className="key" onClick={(typeof (r?.dec) === 'function' ? (r?.dec) : undefined) as any} aria-label={("One fewer Rs " + dcStr(r?.label) + " note")} style={dcStyle("width:48px;height:44px;border:0;background:#ffffff;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.minus) == null || (v?.ic?.minus) === false ? undefined : (v?.ic?.minus) === true ? '' : String(v?.ic?.minus)}></path></svg></button><label className="sr" htmlFor={("n-" + dcStr(r?.v))}>{("Rs " + dcStr(r?.label) + " notes")}</label><input id={("n-" + dcStr(r?.v))} className="num" inputMode="numeric" value={dcStr(r?.count)} onChange={(typeof (r?.set) === 'function' ? (r?.set) : undefined) as any} style={dcStyle("width:56px;height:44px;border:0;border-left:1px solid #ECE4D8;border-right:1px solid #ECE4D8;outline:0;text-align:center;font-size:17px;font-weight:600;background:#F8F2E9")} /><button className="key" onClick={(typeof (r?.inc) === 'function' ? (r?.inc) : undefined) as any} aria-label={("One more Rs " + dcStr(r?.label) + " note")} style={dcStyle("width:48px;height:44px;border:0;background:#ffffff;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.plus) == null || (v?.ic?.plus) === false ? undefined : (v?.ic?.plus) === true ? '' : String(v?.ic?.plus)}></path></svg></button></div><span className="num" style={dcStyle(("margin-left:auto;font-size:15px;font-weight:600;color:" + dcStr(r?.amtFg)))}><span className="rs">{"Rs"}</span>{dcStr(r?.amount)}</span></div></React.Fragment>))}<div className="rz-wrap" style={dcStyle(("height:" + dcStr(v?.rowH) + "px;display:flex;align-items:center;gap:14px"))}><span className="rz-hide" aria-hidden="true" style={dcStyle("width:54px;height:30px;flex:none;display:flex;align-items:center;justify-content:center;gap:3px")}><span style={dcStyle("width:22px;height:22px;border-radius:999px;background:#C9A24A;box-shadow:inset 0 0 0 2px rgba(255,255,255,.4)")}></span><span style={dcStyle("width:18px;height:18px;border-radius:999px;background:#A9A9A0;box-shadow:inset 0 0 0 2px rgba(255,255,255,.4)")}></span></span><label className="rz-lab" htmlFor="coins" style={dcStyle("width:110px;font-size:15px;font-weight:600")}>{"Coins"}</label><div className="field" style={dcStyle("height:44px;width:152px;display:flex;align-items:center;gap:6px;border:1px solid #D9CFC0;border-radius:12px;padding:0 12px;background:#ffffff")}><span style={dcStyle("font-size:13px;font-weight:500;color:#5B6585")}>{"Rs"}</span><input id="coins" className="num" inputMode="numeric" value={dcStr(v?.coins)} onChange={(typeof (v?.setCoins) === 'function' ? (v?.setCoins) : undefined) as any} placeholder="0" style={dcStyle("flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:17px;font-weight:600")} /></div><span className="rz-w100" style={dcStyle("font-size:13px;color:#5B6585")}>{"Total value, not count"}</span></div></div></>) : null}{Boolean(v?.byTotal) ? (<><div style={dcStyle("flex:1;padding:28px 20px;display:flex;flex-direction:column;gap:10px;max-width:460px")}><label htmlFor="total-in" style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Cash in the drawer"}</label><div className="field" style={dcStyle("height:64px;display:flex;align-items:center;gap:10px;border:1px solid #D9CFC0;border-radius:16px;padding:0 18px;background:#ffffff")}><span style={dcStyle("font-size:20px;font-weight:500;color:#5B6585")}>{"Rs"}</span><input id="total-in" className="num" inputMode="numeric" value={dcStr(v?.typed)} onChange={(typeof (v?.setTyped) === 'function' ? (v?.setTyped) : undefined) as any} placeholder="0" style={dcStyle("flex:1;min-width:0;border:0;outline:0;background:transparent;font-family:Outfit,sans-serif;font-size:34px;font-weight:700")} /></div><p style={dcStyle("margin:0;font-size:13px;line-height:1.5;color:#5B6585")}>{"Fast, but the shift report won’t show the note mix. Counting note by note makes the close easier to check."}</p></div></>) : null}</section><aside className="rz-col rz-free rz-side" style={dcStyle(("width:" + dcStr(v?.sideW) + "px;flex:none;display:flex;flex-direction:column;gap:14px"))}><div style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:12px")}><span style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Opening float"}</span><span className="num" style={dcStyle("font-family:Outfit,sans-serif;font-size:52px;font-weight:700;letter-spacing:-.03em;line-height:1")}><span className="rs">{"Rs"}</span>{dcStr(v?.floatN)}</span><span style={dcStyle(("align-self:flex-start;min-height:28px;padding:4px 10px;border-radius:999px;background:" + dcStr(v?.cmp?.bg) + ";color:" + dcStr(v?.cmp?.fg) + ";font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px"))}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.cmp?.d) == null || (v?.cmp?.d) === false ? undefined : (v?.cmp?.d) === true ? '' : String(v?.cmp?.d)}></path></svg><span className="num">{dcStr(v?.cmp?.text)}</span></span><div style={dcStyle("height:1px;background:#F6F0E7")}></div><div style={dcStyle("display:flex;justify-content:space-between;font-size:13px;color:#5B6585")}><span>{"Suggested by owner"}</span><span className="num" style={dcStyle("color:#162660;font-weight:600")}>{"Rs 10,000"}</span></div><div style={dcStyle("display:flex;justify-content:space-between;font-size:13px;color:#5B6585")}><span>{"Left at last close · Sana, 9:41 pm"}</span><span className="num" style={dcStyle("color:#162660;font-weight:600")}>{"Rs 10,000"}</span></div></div><div style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:20px;padding:16px 20px;display:flex;flex-direction:column;gap:10px")}><span style={dcStyle("font-size:13px;font-weight:600;color:#454F70")}>{"Counter"}</span><div role="radiogroup" aria-label="Counter" style={dcStyle("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px")}>{(v?.counters || []).map((c: any, $index: number) => (<React.Fragment key={$index}><button className="opt" role="radio" aria-checked={(c?.checked) == null || (c?.checked) === false ? undefined : (c?.checked) === true ? '' : String(c?.checked)} onClick={(typeof (c?.pick) === 'function' ? (c?.pick) : undefined) as any} style={dcStyle(("height:48px;border:" + dcStr(c?.border) + ";border-radius:12px;background:" + dcStr(c?.bg) + ";font-size:15px;font-weight:600"))}>{dcStr(c?.label)}</button></React.Fragment>))}</div></div><div style={dcStyle("margin-top:auto;display:flex;flex-direction:column;gap:8px")}><button className="bp" onClick={(typeof (v?.start) === 'function' ? (v?.start) : undefined) as any} disabled={Boolean(v?.cantStart)} style={dcStyle("height:64px;border:0;border-radius:16px;background:#162660;color:#FFFFFF;font-size:20px;font-weight:700;box-shadow:inset 0 -1px 0 #2E46A0;display:flex;align-items:center;justify-content:center;gap:10px")}>{Boolean(v?.saving) ? (<><span aria-hidden="true" style={dcStyle("width:20px;height:20px;border-radius:999px;border:2.5px solid rgba(22,38,96,.25);border-top-color:#162660;animation:zspin .8s linear infinite")}></span></>) : null}<span className="num">{dcStr(v?.startLabel)}</span></button><span style={dcStyle("min-height:20px;font-size:13px;color:#5B6585;text-align:center")}>{dcStr(v?.why)}</span></div></aside></div></div>
      </>
    );
  }
}
