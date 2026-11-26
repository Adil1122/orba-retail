// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  ICONS,
  n,
  openBoard,
  rs
} from '@/lib/common';


const DEFAULT_PROPS: Record<string, any> = {
  "h": 800,
  "empty": false
};

var SAMPLE_HELD = [
{ billNo: 1041, customer: 'Bilal Ahmed', items: 'Cotton Kurta, Cotton Socks 3-pack ×2', count: 3, total: 4791, time: '11:42 am' },
{ billNo: 1042, customer: 'Walk-in', items: 'Leather Belt', count: 1, total: 1201, time: '12:05 pm' }
];
var AGO = { '11:42 am': '38 min ago', '12:05 pm': '15 min ago', now: 'just now' };
class HeldBillsBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

renderVals() {
var p = this.props || {};
var held = p.held || (p.empty ? [] : SAMPLE_HELD);
var cur = p.current || { billNo: 1043, count: 4, total: 7851, empty: false };
var rows = held.map(function (h, ix) {
var walk = h.customer === 'Walk-in';
return { billNo: h.billNo, customer: h.customer, items: h.items, countText: h.count + (h.count === 1 ? ' item' : ' items'), totalN: n(h.total),
when: (h.time === 'now' ? 'Held just now' : 'Held ' + h.time + ' · ' + (AGO[h.time] || '')),
custBg: walk ? '#F6F0E7' : '#EAF2FD', custFg: walk ? '#454F70' : '#24398A',
aria: 'Recall Bill ' + h.billNo + ', ' + h.customer + ', Rs ' + n(h.total),
recall: function () { if (p.onRecall) p.onRecall(ix); else openBoard('Main'); } };
});
return {
ic: ICONS, H: p.h || 800, rows: rows, hasHeld: rows.length > 0, noHeld: rows.length === 0,
countText: rows.length + ' waiting', cur: cur, curTotalN: n(cur.total), canHold: !cur.empty,
helpText: cur.empty ? 'Tap a bill to bring it back to the register.' : 'Recalling a bill holds the one on screen first.',
hold: function () { if (p.onHold) p.onHold(); else openBoard('Main'); },
close: function () { if (p.onClose) p.onClose(); else openBoard('Main'); }
};
}
}

export default class HeldBills extends HeldBillsBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <aside role="dialog" aria-modal="true" aria-labelledby="held-title" style={dcStyle(("width:440px;height:" + dcStr(v?.H) + "px;background:#F1E4D1;box-shadow:-18px 0 48px rgba(12,20,50,.22);display:flex;flex-direction:column;color:#162660;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:15px"))}><div style={dcStyle("height:76px;flex:none;display:flex;align-items:center;gap:12px;padding:0 16px 0 24px;background:#ffffff;border-bottom:1px solid #E9E1D5")}><h2 id="held-title" style={dcStyle("margin:0;flex:1;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{"Held bills"}</h2><span className="num" style={dcStyle("height:28px;padding:0 10px;border-radius:999px;background:#F6F0E7;color:#454F70;font-size:13px;font-weight:600;display:inline-flex;align-items:center")}>{dcStr(v?.countText)}</span><button onClick={(typeof (v?.close) === 'function' ? (v?.close) : undefined) as any} aria-label="Close held bills" style={dcStyle("width:44px;height:44px;flex:none;border:0;border-radius:999px;background:#F6F0E7;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={(v?.ic?.x) == null || (v?.ic?.x) === false ? undefined : (v?.ic?.x) === true ? '' : String(v?.ic?.x)} /></svg></button></div>{Boolean(v?.canHold) ? (<><div style={dcStyle("margin:16px 16px 4px;padding:14px 16px;border-radius:16px;background:#ffffff;border:1px solid #E9E1D5;display:flex;align-items:center;gap:12px")}><span style={dcStyle("width:44px;height:44px;flex:none;border-radius:999px;background:#F6F0E7;color:#162660;display:flex;align-items:center;justify-content:center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.receipt) == null || (v?.ic?.receipt) === false ? undefined : (v?.ic?.receipt) === true ? '' : String(v?.ic?.receipt)} /></svg></span><span style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}><span className="num" style={dcStyle("font-size:15px;font-weight:600")}>{("Bill " + dcStr(v?.cur?.billNo) + " · on screen")}</span><span className="num" style={dcStyle("font-size:13px;color:#5B6585")}>{(dcStr(v?.cur?.count) + " items · Rs " + dcStr(v?.curTotalN))}</span></span><button className="bs" onClick={(typeof (v?.hold) === 'function' ? (v?.hold) : undefined) as any} style={dcStyle("height:48px;padding:0 14px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;font-size:15px;font-weight:600;display:flex;align-items:center;gap:6px")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.hold) == null || (v?.ic?.hold) === false ? undefined : (v?.ic?.hold) === true ? '' : String(v?.ic?.hold)} /></svg>{"Hold it"}</button></div></>) : null}<div style={dcStyle("flex:1;min-height:0;overflow:auto;padding:12px 16px 16px;display:flex;flex-direction:column;gap:10px")}>{Boolean(v?.hasHeld) ? (<><span style={dcStyle("padding:4px 4px 0;font-size:13px;color:#5B6585")}>{dcStr(v?.helpText)}</span>{(v?.rows || []).map((h: any, $index: number) => (<React.Fragment key={$index}><button className="tile" onClick={(typeof (h?.recall) === 'function' ? (h?.recall) : undefined) as any} aria-label={(h?.aria) == null || (h?.aria) === false ? undefined : (h?.aria) === true ? '' : String(h?.aria)} style={dcStyle("width:100%;padding:16px;border:1px solid #E9E1D5;border-radius:16px;background:#ffffff;display:flex;flex-direction:column;gap:10px;text-align:left")}><span style={dcStyle("width:100%;display:flex;align-items:center;gap:10px")}><span className="num" style={dcStyle("font-size:17px;font-weight:700")}>{("Bill " + dcStr(h?.billNo))}</span><span style={dcStyle(("height:24px;padding:0 9px;border-radius:999px;background:" + dcStr(h?.custBg) + ";color:" + dcStr(h?.custFg) + ";font-size:13px;font-weight:600;display:inline-flex;align-items:center"))}>{dcStr(h?.customer)}</span><span className="num" style={dcStyle("margin-left:auto;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}><span className="rs">{"Rs"}</span>{dcStr(h?.totalN)}</span></span><span style={dcStyle("font-size:15px;line-height:1.45;color:#454F70;max-height:44px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical")}>{dcStr(h?.items)}</span><span style={dcStyle("width:100%;display:flex;align-items:center;gap:6px;font-size:13px;color:#5B6585")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.clock) == null || (v?.ic?.clock) === false ? undefined : (v?.ic?.clock) === true ? '' : String(v?.ic?.clock)} /></svg><span className="num">{(dcStr(h?.when) + " · " + dcStr(h?.countText))}</span><span style={dcStyle("margin-left:auto;display:flex;align-items:center;gap:4px;color:#2E46A0;font-size:15px;font-weight:600")}>{"Recall"}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.right) == null || (v?.ic?.right) === false ? undefined : (v?.ic?.right) === true ? '' : String(v?.ic?.right)} /></svg></span></span></button></React.Fragment>))}</>) : null}{Boolean(v?.noHeld) ? (<><div style={dcStyle("flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:24px")}><span style={dcStyle("width:88px;height:88px;border-radius:999px;background:#ECE4D8;color:#5B6585;display:flex;align-items:center;justify-content:center")}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={(v?.ic?.hold) == null || (v?.ic?.hold) === false ? undefined : (v?.ic?.hold) === true ? '' : String(v?.ic?.hold)} /></svg></span><span style={dcStyle("font-size:17px;font-weight:600")}>{"No held bills"}</span><span style={dcStyle("max-width:300px;font-size:15px;line-height:1.5;color:#454F70")}>{"Hold parks a bill when a customer steps away, so you can serve the next one."}</span></div></>) : null}</div><div style={dcStyle("flex:none;padding:12px 24px 16px;border-top:1px solid #E9E1D5;font-size:13px;line-height:1.5;color:#5B6585")}>{"Held bills stay on this counter until recalled or the shift closes. They don’t reserve stock."}</div></aside>
      </>
    );
  }
}
