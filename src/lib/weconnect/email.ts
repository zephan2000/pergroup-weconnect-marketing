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

// Internal email — sent FROM WeConnect TO PER GROUP team inbox
const FROM_EMAIL_INTERNAL =
  process.env.RESEND_FROM_EMAIL_INTERNAL
  ?? process.env.RESEND_FROM_EMAIL  // legacy fallback
  ?? 'WeConnect <onboarding@resend.dev>'

// User acknowledgement — sent FROM PER GROUP TO the form submitter
const FROM_EMAIL_USER =
  process.env.RESEND_FROM_EMAIL_USER
  ?? 'PER GROUP <onboarding@resend.dev>'

// ── Locale detection (server-side) ───────────────────────────────────────────

export type Locale = 'en' | 'zh'

/**
 * Detect locale for outbound user email. Priority:
 *   1. explicit `override` (e.g., body.lang from form payload — Phase 5+)
 *   2. Accept-Language HTTP header — 'zh*' → 'zh', else 'en'
 *   3. Default 'en'
 */
export function detectLocale(acceptLanguage: string | null, override?: string): Locale {
  if (override === 'zh' || override === 'en') return override
  if (acceptLanguage && acceptLanguage.toLowerCase().startsWith('zh')) return 'zh'
  return 'en'
}

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
    from: FROM_EMAIL_INTERNAL,
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
    from: FROM_EMAIL_INTERNAL,
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
    from: FROM_EMAIL_INTERNAL,
    to: TO_EMAIL,
    subject: `[WeConnect] New Need: ${data.category}${data.companyName ? ` — ${data.companyName}` : ''}`,
    html: buildNeedHtml(data),
  })
}

export async function sendOfferingEmail(data: OfferingPayload): Promise<void> {
  await getResend().emails.send({
    from: FROM_EMAIL_INTERNAL,
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

// ─────────────────────────────────────────────────────────────────────────────
// USER ACKNOWLEDGEMENT EMAILS
// ─────────────────────────────────────────────────────────────────────────────
// Sent FROM PER GROUP <noreply@pergroup.sg> TO the form submitter.
// Echoes back what they submitted + thank-you + response SLA.
// Locale picked server-side (Accept-Language header) or via body.lang override.
//
// TEAM_REVIEW: Translation accuracy and exact wording need native Mandarin
// speaker review before public launch. Current ZH text is AI-generated.
// ─────────────────────────────────────────────────────────────────────────────

// ── i18n strings for ack emails ──

const ACK_STRINGS = {
  en: {
    thankYou: 'Thank you',
    weReceived: "We've received your inquiry and a member of our team will respond within 1 business day.",
    yourSubmission: 'Your submission',
    contactUs: 'Questions? Reply to this email or write to',
    footer: 'PER GROUP × WeConnect · Singapore',
    contactSubject: (spaceName: string) => `[PER GROUP] We received your inquiry — ${spaceName}`,
    requirementSubject: (subject?: string) => subject
      ? `[PER GROUP] We received your inquiry — ${subject}`
      : '[PER GROUP] We received your requirement',
    needSubject: (cat: string) => `[PER GROUP] We received your need — ${cat}`,
    offeringSubject: (cat: string) => `[PER GROUP] Thank you for sharing your offering — ${cat}`,
    labels: {
      space: 'Space', inquiryType: 'Inquiry Type', message: 'Message',
      type: 'Type', subject: 'Subject', description: 'Description',
      goal: 'Goal / Objective', targetLocation: 'Target Location',
      budget: 'Budget', timeline: 'Timeline', urgency: 'Urgency',
      category: 'Category', capability: 'Capability', idealClient: 'Ideal Client',
      availability: 'Availability', trackRecord: 'Track Record',
      name: 'Name', title: 'Title', company: 'Company', email: 'Email', phone: 'Phone',
    },
  },
  zh: {
    thankYou: '感谢您的来信',
    weReceived: '我们已收到您的咨询，团队成员将在1个工作日内回复您。',
    yourSubmission: '您提交的内容',
    contactUs: '如有疑问，请回复此邮件或联系',
    footer: 'PER GROUP × WeConnect · 新加坡',
    contactSubject: (spaceName: string) => `[PER GROUP] 已收到您的咨询 — ${spaceName}`,
    requirementSubject: (subject?: string) => subject
      ? `[PER GROUP] 已收到您的咨询 — ${subject}`
      : '[PER GROUP] 已收到您的需求',
    needSubject: (cat: string) => `[PER GROUP] 已收到您的需求 — ${cat}`,
    offeringSubject: (cat: string) => `[PER GROUP] 感谢您分享供应能力 — ${cat}`,
    labels: {
      space: '空间', inquiryType: '咨询类型', message: '留言',
      type: '类型', subject: '主题', description: '需求描述',
      goal: '目标', targetLocation: '目标地区',
      budget: '预算', timeline: '时间', urgency: '紧急度',
      category: '类别', capability: '能力', idealClient: '理想客户',
      availability: '可用性', trackRecord: '过往记录',
      name: '姓名', title: '职位', company: '公司', email: '邮箱', phone: '电话',
    },
  },
} as const

// ── Public senders ──

export async function sendContactAck(data: ContactPayload, locale: Locale): Promise<void> {
  const t = ACK_STRINGS[locale]
  await getResend().emails.send({
    from: FROM_EMAIL_USER,
    to: data.email,
    subject: t.contactSubject(data.spaceName),
    html: buildAckHtml({
      locale,
      recipientName: data.name,
      fields: [
        [t.labels.space, data.spaceName],
        ...(data.inquiryType ? [[t.labels.inquiryType, data.inquiryType] as [string, string]] : []),
        ...(data.message ? [[t.labels.message, data.message] as [string, string]] : []),
        ...(data.budget ? [[t.labels.budget, data.budget] as [string, string]] : []),
        ...(data.timeline ? [[t.labels.timeline, data.timeline] as [string, string]] : []),
      ],
    }),
  })
}

export async function sendRequirementAck(data: RequirementPayload, locale: Locale): Promise<void> {
  const t = ACK_STRINGS[locale]
  await getResend().emails.send({
    from: FROM_EMAIL_USER,
    to: data.contactEmail,
    subject: t.requirementSubject(data.subject),
    html: buildAckHtml({
      locale,
      recipientName: data.contactName,
      fields: [
        ...(data.subject ? [[t.labels.subject, data.subject] as [string, string]] : []),
        [t.labels.type, data.type],
        [t.labels.targetLocation, data.targetLocation],
        [t.labels.description, data.description],
        ...(data.goalAlignment ? [[t.labels.goal, data.goalAlignment] as [string, string]] : []),
        ...(data.budget ? [[t.labels.budget, data.budget] as [string, string]] : []),
        ...(data.timeline ? [[t.labels.timeline, data.timeline] as [string, string]] : []),
      ],
    }),
  })
}

export async function sendNeedAck(data: NeedPayload, locale: Locale): Promise<void> {
  const t = ACK_STRINGS[locale]
  if (!data.contactEmail) return
  await getResend().emails.send({
    from: FROM_EMAIL_USER,
    to: data.contactEmail,
    subject: t.needSubject(data.category),
    html: buildAckHtml({
      locale,
      recipientName: data.contactName ?? '',
      fields: [
        [t.labels.category, data.category],
        [t.labels.description, data.description],
        [t.labels.urgency, data.urgency],
        ...(data.budget ? [[t.labels.budget, data.budget] as [string, string]] : []),
        ...(data.timeline ? [[t.labels.timeline, data.timeline] as [string, string]] : []),
        ...(data.goalAlignment ? [[t.labels.goal, data.goalAlignment] as [string, string]] : []),
      ],
    }),
  })
}

export async function sendOfferingAck(data: OfferingPayload, locale: Locale): Promise<void> {
  const t = ACK_STRINGS[locale]
  if (!data.contactEmail) return
  await getResend().emails.send({
    from: FROM_EMAIL_USER,
    to: data.contactEmail,
    subject: t.offeringSubject(data.category),
    html: buildAckHtml({
      locale,
      recipientName: data.contactName ?? '',
      fields: [
        [t.labels.category, data.category],
        [t.labels.capability, data.capability],
        ...(data.idealClient ? [[t.labels.idealClient, data.idealClient] as [string, string]] : []),
        [t.labels.availability, data.availability],
        ...(data.trackRecord ? [[t.labels.trackRecord, data.trackRecord] as [string, string]] : []),
      ],
    }),
  })
}

// ── Shared ack template ──

function buildAckHtml(opts: {
  locale: Locale
  recipientName: string
  fields: Array<[string, string]>
}): string {
  const { locale, recipientName, fields } = opts
  const t = ACK_STRINGS[locale]
  const greeting = recipientName ? `${t.thankYou}, ${esc(recipientName)}` : t.thankYou

  const rows = fields
    .map(([label, value]) => row(label, value))
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf7f2;color:#1a1714;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #c17f1a;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:22px;margin:0;color:#c17f1a;">${greeting}</h1>
      </div>
      <p style="font-size:14px;line-height:1.6;color:#1a1714;margin:0 0 24px;">${t.weReceived}</p>

      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#c17f1a;margin:24px 0 8px;border-bottom:1px solid #e8e2d9;padding-bottom:6px;">${t.yourSubmission}</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>

      <p style="font-size:13px;line-height:1.6;color:#1a1714;margin:32px 0 8px;">
        ${t.contactUs} <a href="mailto:${TO_EMAIL}" style="color:#c17f1a;">${TO_EMAIL}</a>.
      </p>
      <p style="font-size:11px;color:#b0a89e;margin-top:24px;">${t.footer}</p>
    </div>
  `
}
