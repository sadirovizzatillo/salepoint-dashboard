import { Order } from '@/types/order.types'

const escapeHtml = (s: string): string =>
  String(s ?? '').replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      default:  return '&#39;'
    }
  })

const fmtMoney = (n: number | string): string => {
  const v = typeof n === 'string' ? Number(n) : n
  return new Intl.NumberFormat('uz-UZ').format(Math.round((v || 0) * 100) / 100)
}

const fmtDateTime = (iso: string): string => {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function printReceipt(order: Order, shopName: string): void {
  const w = window.open('', '_blank', 'width=320,height=640')
  if (!w) return

  const itemsHtml = order.items
    .map((i) => {
      const qty = i.quantity
      const unit = Number(i.price)
      const line = Number(i.lineTotal ?? unit * qty)
      return `
        <tr class="item-name">
          <td colspan="2">${escapeHtml(i.name)}</td>
        </tr>
        <tr class="item-meta">
          <td>${qty} × ${fmtMoney(unit)}</td>
          <td class="right">${fmtMoney(line)}</td>
        </tr>
      `
    })
    .join('')

  const receiptNo = `#${order.id.slice(-8).toUpperCase()}`
  const customerLine = order.customerName
    ? `<div class="row"><span>Mijoz:</span><span>${escapeHtml(order.customerName)}</span></div>`
    : ''

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Chek ${receiptNo}</title>
  <style>
    @page { size: 80mm auto; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      width: 72mm;
      padding: 4mm 3mm;
      font-family: 'Courier New', ui-monospace, monospace;
      font-size: 12px;
      color: #000;
      line-height: 1.35;
    }
    .center { text-align: center; }
    .right  { text-align: right; }
    .bold   { font-weight: 700; }
    .shop   { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; }
    .muted  { color: #333; font-size: 11px; }
    .sep    { border-top: 1px dashed #000; margin: 6px 0; }
    .double { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 0; margin: 6px 0; }
    table   { width: 100%; border-collapse: collapse; }
    td      { padding: 1px 0; vertical-align: top; word-wrap: break-word; }
    .item-name td { padding-top: 4px; font-weight: 600; }
    .item-meta td { padding-bottom: 2px; color: #222; }
    .row    { display: flex; justify-content: space-between; gap: 8px; }
    .total  { font-size: 14px; font-weight: 700; }
    .thanks { margin-top: 10px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="center shop">${escapeHtml(shopName)}</div>
  <div class="center muted">Kassa cheki</div>

  <div class="sep"></div>

  <div class="row"><span>Chek:</span><span>${receiptNo}</span></div>
  <div class="row"><span>Sana:</span><span>${escapeHtml(fmtDateTime(order.createdAt))}</span></div>
  ${order.cashierName ? `<div class="row"><span>Kassir:</span><span>${escapeHtml(order.cashierName)}</span></div>` : ''}
  ${customerLine}

  <div class="sep"></div>

  <table>
    ${itemsHtml}
  </table>

  <div class="sep"></div>

  <div class="row"><span>Oraliq jami:</span><span>${fmtMoney(order.subtotal)} so'm</span></div>
  ${Number(order.tax) > 0 ? `<div class="row"><span>Soliq:</span><span>${fmtMoney(order.tax)} so'm</span></div>` : ''}

  <div class="double row total">
    <span>JAMI:</span><span>${fmtMoney(order.total)} so'm</span>
  </div>

  <div class="center thanks">Xaridingiz uchun rahmat!</div>
  <div class="center muted">Qaytib keling :)</div>
</body>
</html>`

  w.document.open()
  w.document.write(html)
  w.document.close()

  const triggerPrint = () => {
    w.focus()
    w.print()
    setTimeout(() => w.close(), 500)
  }

  if (w.document.readyState === 'complete') triggerPrint()
  else w.addEventListener('load', triggerPrint)
}
