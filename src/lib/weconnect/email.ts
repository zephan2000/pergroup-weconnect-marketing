/**
 * Email utilities for WeConnect contact and requirement forms.
 *
 * Uses Resend to deliver emails to the PER GROUP team.
 * Server-only — never import in client components.
 */

import { Resend } from 'resend'

// Lazy-init: Resend throws if RESEND_API_KEY is missing at construction time.
// Deferring to first use avoids build-time crashes when the env var isn't set.
let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const TO_EMAIL = 'pergroup.sg@gmail.com'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'WeConnect <onboarding@resend.dev>'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ContactPayload {
  spaceId: string
  spaceName: string
  name: string
  company: string
  email: string
  message?: string
}

export interface RequirementPayload {
  type: string
  companyName: string
  targetLocation: string
  budget?: string
  description: string
  contactEmail: string
}

// ── Senders ──────────────────────────────────────────────────────────────────

export async function sendContactEmail(data: ContactPayload): Promise<void> {
  // TODO: Append row to Google Sheets (contact submissions)

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `[WeConnect] Introduction Request: ${data.spaceName}`,
    html: buildContactHtml(data),
  })
}

export async function sendRequirementEmail(data: RequirementPayload): Promise<void> {
  // TODO: Append row to Google Sheets (requirement submissions)

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `[WeConnect] New Requirement: ${data.type} — ${data.companyName}`,
    html: buildRequirementHtml(data),
  })
}

// ── Need / Offering types ───────────────────────────────────────────────────

export interface NeedPayload {
  category: string
  description: string
  urgency: string
  budget?: string
  contactEmail: string
  companyName?: string
}

export interface OfferingPayload {
  category: string
  capability: string
  idealClient?: string
  availability: string
  trackRecord?: string
  contactEmail: string
  companyName?: string
}

export async function sendNeedEmail(data: NeedPayload): Promise<void> {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `[WeConnect] New Need: ${data.category}${data.companyName ? ` — ${data.companyName}` : ''}`,
    html: buildNeedHtml(data),
  })
}

export async function sendOfferingEmail(data: OfferingPayload): Promise<void> {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `[WeConnect] Supplier Offering: ${data.category}${data.companyName ? ` — ${data.companyName}` : ''}`,
    html: buildOfferingHtml(data),
  })
}

// ── HTML templates ───────────────────────────────────────────────────────────

function buildContactHtml(d: ContactPayload): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#E8EAF0;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #F5A623;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:20px;margin:0;color:#F5A623;">WeConnect — Introduction Request</h1>
      </div>
      <h2 style="font-size:16px;color:#E8EAF0;margin:0 0 4px;">${esc(d.spaceName)}</h2>
      <p style="font-size:12px;color:rgba(232,234,240,0.45);margin:0 0 24px;">Space ID: ${esc(d.spaceId)}</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Name', d.name)}
        ${row('Company', d.company)}
        ${row('Email', d.email)}
        ${d.message ? row('Message', d.message) : ''}
      </table>
      <p style="font-size:11px;color:rgba(232,234,240,0.3);margin-top:32px;">Sent via WeConnect by PER GROUP</p>
    </div>
  `
}

function buildRequirementHtml(d: RequirementPayload): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#E8EAF0;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #F5A623;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:20px;margin:0;color:#F5A623;">WeConnect — New Requirement</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Type', d.type)}
        ${row('Company', d.companyName)}
        ${row('Target Location', d.targetLocation)}
        ${d.budget ? row('Budget', d.budget) : ''}
        ${row('Description', d.description)}
        ${row('Contact Email', d.contactEmail)}
      </table>
      <p style="font-size:11px;color:rgba(232,234,240,0.3);margin-top:32px;">Sent via WeConnect by PER GROUP</p>
    </div>
  `
}

function buildNeedHtml(d: NeedPayload): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#E8EAF0;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #F5A623;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:20px;margin:0;color:#F5A623;">WeConnect — New Need</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Category', d.category)}
        ${d.companyName ? row('Company', d.companyName) : ''}
        ${row('Description', d.description)}
        ${row('Urgency', d.urgency)}
        ${d.budget ? row('Budget', d.budget) : ''}
        ${row('Contact Email', d.contactEmail)}
      </table>
      <p style="font-size:11px;color:rgba(232,234,240,0.3);margin-top:32px;">Sent via WeConnect by PER GROUP</p>
    </div>
  `
}

function buildOfferingHtml(d: OfferingPayload): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#E8EAF0;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #22C55E;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:20px;margin:0;color:#22C55E;">WeConnect — Supplier Offering</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Category', d.category)}
        ${d.companyName ? row('Company', d.companyName) : ''}
        ${row('Capability', d.capability)}
        ${d.idealClient ? row('Ideal Client', d.idealClient) : ''}
        ${row('Availability', d.availability)}
        ${d.trackRecord ? row('Track Record', d.trackRecord) : ''}
        ${row('Contact Email', d.contactEmail)}
      </table>
      <p style="font-size:11px;color:rgba(232,234,240,0.3);margin-top:32px;">Sent via WeConnect by PER GROUP</p>
    </div>
  `
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 12px 8px 0;font-size:12px;color:rgba(232,234,240,0.45);vertical-align:top;white-space:nowrap;">${esc(label)}</td>
      <td style="padding:8px 0;font-size:14px;color:#E8EAF0;">${esc(value)}</td>
    </tr>
  `
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}