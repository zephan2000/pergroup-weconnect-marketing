/**
 * Email utilities for WeConnect contact and requirement forms.
 *
 * Uses Resend to deliver emails to the PER GROUP team.
 * Server-only — never import in client components.
 */

import { Resend } from 'resend'

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
  // Contact card
  name: string
  title?: string
  company: string
  email: string
  phone?: string
  // Inquiry
  inquiryType?: string
  message?: string
  budget?: string
  timeline?: string
}

export interface RequirementPayload {
  // Basic information
  subject?: string
  type: string
  // Requirement confirmation
  description: string
  goalAlignment?: string
  targetLocation: string
  // Commercial parameters
  budget?: string
  timeline?: string
  // Contact card
  contactName: string
  contactTitle?: string
  companyName: string
  contactEmail: string
  contactPhone?: string
}

// ── Senders ──────────────────────────────────────────────────────────────────

export async function sendContactEmail(data: ContactPayload): Promise<void> {
  const subjectLine = data.inquiryType
    ? `[WeConnect] ${data.inquiryType}: ${data.spaceName}`
    : `[WeConnect] Introduction Request: ${data.spaceName}`

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: subjectLine,
    html: buildContactHtml(data),
  })
}

export async function sendRequirementEmail(data: RequirementPayload): Promise<void> {
  const subjectLine = data.subject
    ? `[WeConnect] ${data.subject}`
    : `[WeConnect] New Requirement: ${data.type} — ${data.companyName}`

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: subjectLine,
    html: buildRequirementHtml(data),
  })
}

// ── Need / Offering types ───────────────────────────────────────────────────

export interface NeedPayload {
  category: string
  description: string
  urgency: string
  budget?: string
  timeline?: string
  goalAlignment?: string
  contactName?: string
  contactTitle?: string
  contactEmail: string
  contactPhone?: string
  companyName?: string
}

export interface OfferingPayload {
  category: string
  capability: string
  idealClient?: string
  availability: string
  trackRecord?: string
  contactName?: string
  contactTitle?: string
  contactEmail: string
  contactPhone?: string
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
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf7f2;color:#1a1714;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #c17f1a;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:20px;margin:0;color:#c17f1a;">WeConnect — Introduction Request</h1>
      </div>
      <h2 style="font-size:16px;color:#1a1714;margin:0 0 4px;">${esc(d.spaceName)}</h2>
      <p style="font-size:12px;color:#7a7067;margin:0 0 24px;">Space ID: ${esc(d.spaceId)}</p>
      ${d.inquiryType ? sectionHeader('Inquiry') : ''}
      ${d.inquiryType ? tableWrap(row('Type', d.inquiryType)) : ''}
      ${sectionHeader('Contact Information')}
      <table style="width:100%;border-collapse:collapse;">
        ${row('Name', d.name)}
        ${d.title ? row('Title', d.title) : ''}
        ${row('Company', d.company)}
        ${row('Email', d.email)}
        ${d.phone ? row('Phone', d.phone) : ''}
      </table>
      ${(d.message || d.budget || d.timeline) ? sectionHeader('Details') : ''}
      ${(d.message || d.budget || d.timeline) ? tableWrap(
        (d.message ? row('Message', d.message) : '') +
        (d.budget ? row('Budget', d.budget) : '') +
        (d.timeline ? row('Timeline', d.timeline) : '')
      ) : ''}
      <p style="font-size:11px;color:#b0a89e;margin-top:32px;">Sent via WeConnect by PER GROUP</p>
    </div>
  `
}

function buildRequirementHtml(d: RequirementPayload): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf7f2;color:#1a1714;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #c17f1a;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:20px;margin:0;color:#c17f1a;">WeConnect — New Requirement</h1>
        ${d.subject ? `<p style="font-size:14px;color:#1a1714;margin:8px 0 0;font-weight:600;">${esc(d.subject)}</p>` : ''}
      </div>
      ${sectionHeader('Basic Information')}
      <table style="width:100%;border-collapse:collapse;">
        ${row('Inquiry Type', d.type)}
        ${row('Target Location', d.targetLocation)}
      </table>
      ${sectionHeader('Requirement Details')}
      <table style="width:100%;border-collapse:collapse;">
        ${row('Description', d.description)}
        ${d.goalAlignment ? row('Goal / Objective', d.goalAlignment) : ''}
      </table>
      ${sectionHeader('Commercial Parameters')}
      <table style="width:100%;border-collapse:collapse;">
        ${d.budget ? row('Budget', d.budget) : row('Budget', 'Not specified')}
        ${d.timeline ? row('Timeline', d.timeline) : row('Timeline', 'Not specified')}
      </table>
      ${sectionHeader('Contact Information')}
      <table style="width:100%;border-collapse:collapse;">
        ${row('Name', d.contactName)}
        ${d.contactTitle ? row('Title', d.contactTitle) : ''}
        ${row('Company', d.companyName)}
        ${row('Email', d.contactEmail)}
        ${d.contactPhone ? row('Phone', d.contactPhone) : ''}
      </table>
      <p style="font-size:11px;color:#b0a89e;margin-top:32px;">Sent via WeConnect by PER GROUP</p>
    </div>
  `
}

function buildNeedHtml(d: NeedPayload): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf7f2;color:#1a1714;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #c17f1a;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:20px;margin:0;color:#c17f1a;">WeConnect — New Need</h1>
      </div>
      ${sectionHeader('Need Details')}
      <table style="width:100%;border-collapse:collapse;">
        ${row('Category', d.category)}
        ${d.companyName ? row('Company', d.companyName) : ''}
        ${row('Description', d.description)}
        ${d.goalAlignment ? row('Goal / Objective', d.goalAlignment) : ''}
        ${row('Urgency', d.urgency)}
        ${d.budget ? row('Budget', d.budget) : ''}
        ${d.timeline ? row('Timeline', d.timeline) : ''}
      </table>
      ${sectionHeader('Contact Information')}
      <table style="width:100%;border-collapse:collapse;">
        ${d.contactName ? row('Name', d.contactName) : ''}
        ${d.contactTitle ? row('Title', d.contactTitle) : ''}
        ${row('Email', d.contactEmail)}
        ${d.contactPhone ? row('Phone', d.contactPhone) : ''}
      </table>
      <p style="font-size:11px;color:#b0a89e;margin-top:32px;">Sent via WeConnect by PER GROUP</p>
    </div>
  `
}

function buildOfferingHtml(d: OfferingPayload): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf7f2;color:#1a1714;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #22C55E;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:20px;margin:0;color:#22C55E;">WeConnect — Supplier Offering</h1>
      </div>
      ${sectionHeader('Offering Details')}
      <table style="width:100%;border-collapse:collapse;">
        ${row('Category', d.category)}
        ${d.companyName ? row('Company', d.companyName) : ''}
        ${row('Capability', d.capability)}
        ${d.idealClient ? row('Ideal Client', d.idealClient) : ''}
        ${row('Availability', d.availability)}
        ${d.trackRecord ? row('Track Record', d.trackRecord) : ''}
      </table>
      ${sectionHeader('Contact Information')}
      <table style="width:100%;border-collapse:collapse;">
        ${d.contactName ? row('Name', d.contactName) : ''}
        ${d.contactTitle ? row('Title', d.contactTitle) : ''}
        ${row('Email', d.contactEmail)}
        ${d.contactPhone ? row('Phone', d.contactPhone) : ''}
      </table>
      <p style="font-size:11px;color:#b0a89e;margin-top:32px;">Sent via WeConnect by PER GROUP</p>
    </div>
  `
}

// ── Template helpers ────────────────────────────────────────────────────────

function sectionHeader(title: string): string {
  return `<h3 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#c17f1a;margin:20px 0 8px;border-bottom:1px solid #e8e2d9;padding-bottom:6px;">${esc(title)}</h3>`
}

function tableWrap(rows: string): string {
  return `<table style="width:100%;border-collapse:collapse;">${rows}</table>`
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 12px 8px 0;font-size:12px;color:#7a7067;vertical-align:top;white-space:nowrap;">${esc(label)}</td>
      <td style="padding:8px 0;font-size:14px;color:#1a1714;">${esc(value)}</td>
    </tr>
  `
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
