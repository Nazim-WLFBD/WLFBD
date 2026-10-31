import 'server-only';
import nodemailer from 'nodemailer';
import { BRAND_CONTACT, BRAND_NAME, BRAND_TAGLINE_BANGLA } from './brand';

const configured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const transport = configured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const from = `"${process.env.SMTP_FROM_NAME || `${BRAND_NAME} Admissions`}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;
export const ADMISSIONS_EMAIL = process.env.ADMISSIONS_EMAIL || BRAND_CONTACT.email;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Branded HTML email with a table of details. */
export function layout(title: string, intro: string, rows: [string, string][]) {
  return `<!doctype html><html><body style="margin:0;background:#f6f7f9;font-family:Arial,sans-serif;color:#0b1433">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0e1a2f;color:#fff;padding:24px">
<div style="height:4px;background:linear-gradient(90deg,#1d3f8f 33%,#fff 33% 66%,#d52b1e 66%);margin:-24px -24px 20px"></div>
<div style="font-size:20px;font-weight:bold">${BRAND_NAME}</div><div style="opacity:.7;font-size:13px">${BRAND_TAGLINE_BANGLA}</div></td></tr>
<tr><td style="padding:24px"><h2 style="margin:0 0 8px">${esc(title)}</h2><p style="color:#59607a;line-height:1.5">${esc(intro)}</p>
<table width="100%" cellpadding="8" style="border-collapse:collapse;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="border-bottom:1px dashed #ddd;color:#59607a">${esc(k)}</td><td style="border-bottom:1px dashed #ddd;font-weight:bold;text-align:right">${esc(v)}</td></tr>`).join('')}
</table>
<p style="margin-top:20px;font-size:13px;color:#59607a">Helpline / WhatsApp: ${BRAND_CONTACT.phone} · ${BRAND_CONTACT.email}</p>
</td></tr></table></td></tr></table></body></html>`;
}

/** Sends an email; returns false (and logs) when SMTP isn't configured. */
export async function sendMail(to: string, subject: string, html: string) {
  if (!transport) {
    console.info(`[email skipped: SMTP not configured] to=${to} subject=${subject}`);
    return false;
  }
  await transport.sendMail({ from, to, subject, html });
  return true;
}
