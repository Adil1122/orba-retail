// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  FBR_FEE,
  SET,
  fbrNo,
  findItem,
  initials,
  lineTotal,
  mkLine,
  n,
  qrPath,
  rateOf,
  rs,
  taxIn
} from '@/lib/common';

var __G: any = typeof window !== 'undefined' ? window : globalThis;

const DEFAULT_PROPS: Record<string, any> = {
  "fbr": "auto",
  "offline": false
};

function sampleSale() {
  var lines = [mkLine('tee', 0, 1, 2), mkLine('chappal', 0, 2, 1), mkLine('socks', null, null, 1)];
  var sub = lines.reduce(function (a, l) { return a + lineTotal(l); }, 0);
  return { billNo: 1043, lines: lines, subtotal: sub, discount: 0, goods: sub, fee: 1, tax: taxIn(sub), total: sub + 1, count: 4, staff: 'Ali', customer: null, method: 'Cash', parts: [{ method: 'Cash', amount: sub + 1 }], received: 10000, change: 10000 - sub - 1 };
}
function barsPath(seed) { var d = '', x = 4, s = seed; while (x < 214) { s = (s * 1103515245 + 12345) & 0x7fffffff; var w = 1 + (s >> 9) % 3; d += 'M' + x + ' 0h' + w + 'v38h-' + w + 'z'; x += w + 1 + (s >> 13) % 3; } return d; }
class Receipt80Base extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

  renderVals() {
    var p = this.props || {};
    var sale = p.sale && p.sale.lines && p.sale.lines.length ? p.sale : sampleSale();
    var fbr = p.fbr && p.fbr !== 'auto' ? p.fbr : (SET.fbr.on ? 'connected' : 'notRequired'), offline = !!p.offline, RC = SET.rc, SH = SET.shop;
    var connected = fbr === 'connected' && !offline;
    var pending = fbr === 'queued' || (fbr === 'connected' && offline);
    var isCash = sale.method === 'Cash';
    var fee = fbr !== 'notRequired' ? (sale.fee != null ? sale.fee : FBR_FEE) : 0, goods = sale.goods != null ? sale.goods : (sale.total - fee), taxV = sale.tax != null ? sale.tax : taxIn(goods);
    var lines = sale.lines.map(function (l) { return { name: l.name, variant: l.variant, qty: l.qty, eachN: n(l.price), totalN: n(l.price * l.qty), hasDisc: (l.disc || 0) > 0, discN: n(l.disc || 0) }; });
    return {
      billNo: sale.billNo, time: sale.time || '12:24 pm', paperW: SET.pr.paper === 58 ? 232 : 320, shopName: SH.name, shopIni: initials(SH.name), shopAddr: SH.addr + ', ' + SH.city, shopPhone: SH.phone, ntn: SH.ntn, strn: SH.strn, logoOn: RC.logo, addrOn: RC.addr, ntnOn: RC.ntn, hasTop: !!(RC.top || '').trim(), topLine: RC.top, hasDays: RC.days > 0, days: RC.days, foot: RC.foot, urdu: RC.lang === 'both', poweredOn: RC.powered, custOn: RC.cust && !!sale.customer, taxLbl: (function () { var rs = {}; sale.lines.forEach(function (l) { rs[rateOf(findItem(l.id) || l)] = 1; }); var k = Object.keys(rs); return 'Sales tax ' + (k.length === 1 ? k[0] + '% ' : '') + (sale.taxAdded ? 'added' : 'inside'); })(), staff: sale.staff || 'Ali', hasCust: !!sale.customer, custName: sale.customer ? sale.customer.name : '',
      lines: lines, count: sale.count, subN: n(sale.subtotal), hasDisc: (sale.discount || 0) > 0, discN: n(sale.discount || 0), totalN: n(sale.total),
      parts: (sale.parts || []).map(function (x) { return { label: x.method + (x.ref ? ' · ' + x.ref : ''), n: n(x.amount) }; }),
      isCash: isCash, recvN: n(sale.received || sale.total), changeN: n(sale.change || 0),
      fbrNone: fbr === 'notRequired', fbrOn: connected, fbrPending: pending, offlineNote: offline && fbr === 'notRequired',
      fbrNo: fbrNo(sale.billNo), qr: qrPath(sale.billNo % 50 + 3, 88), taxOn: fbr !== 'notRequired', preTaxN: n(goods - taxV), taxN: n(taxV), feeN: n(fee),
      bars: barsPath(sale.billNo), barText: 'OR-' + sale.billNo, minH: lines.length > 3 ? 900 : 860
    };
  }
}

export default class Receipt80 extends Receipt80Base {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <article aria-label={("Receipt for Bill " + dcStr(v?.billNo))} style={dcStyle(("width:" + dcStr(v?.paperW) + "px;min-height:" + dcStr(v?.minH) + "px;background:#ffffff;color:#111111;font-family:Outfit,'Segoe UI',Roboto,system-ui,sans-serif;font-size:13px;line-height:1.45;padding:22px 20px 26px;box-shadow:0 1px 2px rgba(12,20,50,.08),0 8px 24px rgba(12,20,50,.08);display:flex;flex-direction:column;gap:10px"))}><div style={dcStyle("display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center")}>{Boolean(v?.logoOn) ? (<><span aria-hidden="true" style={dcStyle("width:40px;height:40px;border-radius:10px;background:#111111;color:#ffffff;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:16px;font-weight:700")}>{dcStr(v?.shopIni)}</span></>) : null}<span style={dcStyle("margin-top:4px;font-family:Outfit,sans-serif;font-size:17px;font-weight:700")}>{dcStr(v?.shopName)}</span>{Boolean(v?.addrOn) ? (<><span>{dcStr(v?.shopAddr)}</span><span className="num">{dcStr(v?.shopPhone)}</span></>) : null}{Boolean(v?.ntnOn) ? (<><span className="num">{("NTN " + dcStr(v?.ntn) + " · STRN " + dcStr(v?.strn))}</span></>) : null}{Boolean(v?.hasTop) ? (<><span style={dcStyle("margin-top:4px;font-weight:700")}>{dcStr(v?.topLine)}</span></>) : null}</div><div style={dcStyle("border-top:1px dashed #9A9A9A")}></div><div className="num" style={dcStyle("display:grid;grid-template-columns:auto 1fr;column-gap:10px;row-gap:2px")}><span>{"Bill"}</span><span style={dcStyle("text-align:right;font-weight:600")}>{dcStr(v?.billNo)}</span><span>{"Date"}</span><span style={dcStyle("text-align:right")}>{("14 Nov 2026 · " + dcStr(v?.time))}</span><span>{"Cashier"}</span><span style={dcStyle("text-align:right")}>{(dcStr(v?.staff) + " · Counter 1")}</span>{Boolean(v?.custOn) ? (<><span>{"Customer"}</span><span style={dcStyle("text-align:right")}>{dcStr(v?.custName)}</span></>) : null}</div><div style={dcStyle("border-top:1px dashed #9A9A9A")}></div><div style={dcStyle("display:flex;flex-direction:column;gap:8px")}>{(v?.lines || []).map((l: any, $index: number) => (<React.Fragment key={$index}><div style={dcStyle("display:flex;flex-direction:column")}><span style={dcStyle("font-weight:600")}>{dcStr(l?.name)}</span><span className="num" style={dcStyle("display:flex;justify-content:space-between;gap:8px")}><span>{(dcStr(l?.variant) + " · " + dcStr(l?.qty) + " × " + dcStr(l?.eachN))}</span><span style={dcStyle("font-weight:600")}>{dcStr(l?.totalN)}</span></span>{Boolean(l?.hasDisc) ? (<><span className="num" style={dcStyle("display:flex;justify-content:space-between")}><span>{"Line discount"}</span><span>{("−" + dcStr(l?.discN))}</span></span></>) : null}</div></React.Fragment>))}</div><div style={dcStyle("border-top:1px dashed #9A9A9A")}></div><div className="num" style={dcStyle("display:flex;flex-direction:column;gap:2px")}><span style={dcStyle("display:flex;justify-content:space-between")}><span>{("Subtotal · " + dcStr(v?.count) + " items")}</span><span>{dcStr(v?.subN)}</span></span>{Boolean(v?.hasDisc) ? (<><span style={dcStyle("display:flex;justify-content:space-between")}><span>{"Discount"}</span><span>{("−" + dcStr(v?.discN))}</span></span></>) : null}{Boolean(v?.taxOn) ? (<><span style={dcStyle("display:flex;justify-content:space-between")}><span>{"Value before sales tax"}</span><span>{dcStr(v?.preTaxN)}</span></span><span style={dcStyle("display:flex;justify-content:space-between")}><span>{dcStr(v?.taxLbl)}</span><span>{dcStr(v?.taxN)}</span></span><span style={dcStyle("display:flex;justify-content:space-between")}><span>{"FBR POS fee"}</span><span>{dcStr(v?.feeN)}</span></span></>) : null}<span style={dcStyle("margin-top:4px;display:flex;justify-content:space-between;align-items:baseline;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}><span>{"Total"}</span><span><span className="rs">{"Rs"}</span>{dcStr(v?.totalN)}</span></span></div><div className="num" style={dcStyle("display:flex;flex-direction:column;gap:2px")}>{(v?.parts || []).map((pt: any, $index: number) => (<React.Fragment key={$index}><span style={dcStyle("display:flex;justify-content:space-between")}><span>{("Paid · " + dcStr(pt?.label))}</span><span>{dcStr(pt?.n)}</span></span></React.Fragment>))}{Boolean(v?.isCash) ? (<><span style={dcStyle("display:flex;justify-content:space-between")}><span>{"Cash received"}</span><span>{dcStr(v?.recvN)}</span></span><span style={dcStyle("display:flex;justify-content:space-between;font-weight:600")}><span>{"Change"}</span><span>{dcStr(v?.changeN)}</span></span></>) : null}</div><div style={dcStyle("border-top:1px dashed #9A9A9A")}></div>{Boolean(v?.fbrNone) ? (<><div style={dcStyle("text-align:center;display:flex;flex-direction:column;gap:2px")}><span style={dcStyle("font-weight:700")}>{"Non-tax bill"}</span><span>{"Sales tax not applied. Not an FBR invoice."}</span></div></>) : null}{Boolean(v?.fbrOn) ? (<><div style={dcStyle("display:flex;gap:12px;align-items:center")}><svg role="img" aria-label="FBR verification code (sample)" width="88" height="88" viewBox="0 0 88 88" style={dcStyle("flex:none")}><rect width="88" height="88" fill="#ffffff"></rect><path d={(v?.qr) == null || (v?.qr) === false ? undefined : (v?.qr) === true ? '' : String(v?.qr)} fill="#111111"></path></svg><div className="num" style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}><span style={dcStyle("font-weight:700")}>{"FBR invoice"}</span><span className="mono" style={dcStyle("font-size:13px;word-break:break-all")}>{dcStr(v?.fbrNo)}</span><span>{"POS ID 418203"}</span><span>{"Scan to verify with FBR"}</span></div></div></>) : null}{Boolean(v?.fbrPending) ? (<><div style={dcStyle("border:1px solid #111111;border-radius:6px;padding:8px 10px;display:flex;flex-direction:column;gap:2px;text-align:center")}><span style={dcStyle("font-weight:700")}>{"FBR number pending"}</span><span>{"Saved on this device. The FBR number and QR are added when the till syncs; ask for a reprint."}</span></div></>) : null}{Boolean(v?.offlineNote) ? (<><span style={dcStyle("text-align:center;font-weight:600")}>{"Saved on this device · syncs when online"}</span></>) : null}<div style={dcStyle("text-align:center;display:flex;flex-direction:column;gap:2px")}>{Boolean(v?.hasDays) ? (<><span>{("Exchange or return within " + dcStr(v?.days) + " days with this bill.")}</span></>) : null}<span style={dcStyle("white-space:pre-line")}>{dcStr(v?.foot)}</span>{Boolean(v?.urdu) ? (<><span lang="ur" dir="rtl" style={dcStyle("font-family:'Noto Naskh Arabic',serif")}>{"شکریہ! دوبارہ تشریف لائیں"}</span></>) : null}</div><div style={dcStyle("display:flex;flex-direction:column;align-items:center;gap:4px;margin-top:2px")}><svg aria-hidden="true" width="220" height="38" viewBox="0 0 220 38"><path d={(v?.bars) == null || (v?.bars) === false ? undefined : (v?.bars) === true ? '' : String(v?.bars)} fill="#111111"></path></svg><span className="mono" style={dcStyle("font-size:13px;letter-spacing:.12em")}>{dcStr(v?.barText)}</span></div>{Boolean(v?.poweredOn) ? (<><span style={dcStyle("text-align:center;color:#555555")}>{"Powered by Orba Retail"}</span></>) : null}</article>
      </>
    );
  }
}
