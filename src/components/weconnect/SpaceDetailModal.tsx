'use client'

/**
 * SpaceDetailModal — single space detail + introduction-request form.
 *
 * Currently not rendered in v1 (the Spaces browser is disabled in NeedsScreen).
 * Preserved for future re-enablement. All visible labels come from the
 * ContactFormSettings global plus a reuse of RequirementFormSettings field
 * labels (Name, Title, Company, Email, Phone, Message) — keeps owner editing
 * those strings in one place.
 */

import { useEffect, useState } from 'react'
import type { SpaceWithSimilarity } from '@/hooks/useSpacesSearch'
import type { ContactFormSettingsData, RequirementFormSettingsData } from '@/lib/cms/site-text'
import type { Locale } from '@/lib/i18n/strings'
import ModalBackdrop from './ModalBackdrop'
import FormField from './FormField'

interface ContactFieldErrors {
  name?: string
  company?: string
  email?: string
}

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  office:     { color: '#F5A623', bg: 'rgba(245,166,35,.12)' },
  lab:        { color: '#22C55E', bg: 'rgba(34,197,94,.12)' },
  coworking:  { color: '#60A5FA', bg: 'rgba(96,165,250,.12)' },
  industrial: { color: '#A78BFA', bg: 'rgba(167,139,250,.12)' },
  factory:    { color: '#F87171', bg: 'rgba(248,113,113,.12)' },
  retail:     { color: '#FBBF24', bg: 'rgba(251,191,36,.12)' },
  studio:     { color: '#34D399', bg: 'rgba(52,211,153,.12)' },
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'hsl(33 100% 95%)',
  border: '1px solid hsla(20, 10%, 10%, 0.08)',
  borderRadius: 10,
  padding: '11px 14px',
  color: 'hsl(20 10% 10%)',
  fontFamily: 'inherit',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface SpaceDetailModalProps {
  space: SpaceWithSimilarity | null
  similarity?: number
  isOpen: boolean
  onClose: () => void
  contactForm: ContactFormSettingsData
  requirementForm: RequirementFormSettingsData
  locale: Locale
}

const aiMatchScoreByLocale: Record<Locale, string> = {
  en: 'AI Match Score',
  zh: 'AI 匹配度',
}

export default function SpaceDetailModal({
  space,
  similarity,
  isOpen,
  onClose,
  contactForm: cf,
  requirementForm: rf,
  locale,
}: SpaceDetailModalProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({})
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setFormState('idle')
      setErrorMsg('')
      setSubmitted(false)
      setFieldErrors({})
      setName('')
      setTitle('')
      setCompany('')
      setEmail('')
      setPhone('')
      setMessage('')
    }
  }, [isOpen])

  function validate(): ContactFieldErrors {
    const errs: ContactFieldErrors = {}
    if (!name.trim()) errs.name = rf.errorRequired
    if (!company.trim()) errs.company = rf.errorRequired
    if (!email.trim()) errs.email = rf.errorRequired
    else if (!email.includes('@')) errs.email = rf.errorInvalidEmail
    return errs
  }

  useEffect(() => {
    if (!submitted) return
    setFieldErrors(validate())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, company, email, submitted])

  if (!space) return null

  const { color: typeColor, bg: typeBg } = TYPE_COLORS[space.type] ?? TYPE_COLORS.office
  const matchPct = similarity != null ? Math.round(similarity * 100) : null
  const matchColor =
    matchPct != null && matchPct >= 80 ? '#22C55E' : matchPct != null && matchPct >= 60 ? '#F5A623' : '#9CA3AF'

  const location = [space.district, space.address].filter(Boolean).join(' · ')

  const sizeMin = space.area_sqft_min != null ? Number(space.area_sqft_min).toLocaleString() : null
  const sizeMax = space.area_sqft_max != null ? Number(space.area_sqft_max).toLocaleString() : null
  const sizeStr = sizeMin && sizeMax && sizeMin !== sizeMax ? `${sizeMin}–${sizeMax} sqft` : sizeMin ? `${sizeMin} sqft` : null

  const priceMin = space.price_sgd_min != null ? `SGD ${Number(space.price_sgd_min).toLocaleString()}` : null
  const priceMax = space.price_sgd_max != null ? `SGD ${Number(space.price_sgd_max).toLocaleString()}` : null
  const priceStr = priceMin && priceMax && priceMin !== priceMax ? `${priceMin} – ${priceMax} /month` : priceMin ? `${priceMin} /month` : null

  const detailRows: { label: string; value: string | null }[] = [
    { label: cf.detailLabelSize, value: sizeStr },
    { label: cf.detailLabelZone, value: space.district },
    { label: cf.detailLabelSetup, value: space.amenities?.length > 0 ? space.amenities.join(', ') : null },
    { label: cf.detailLabelLease, value: space.lease_type },
    { label: cf.detailLabelPrice, value: priceStr },
  ]

  const handleSubmit = async () => {
    const errs = validate()
    setFieldErrors(errs)
    setSubmitted(true)
    if (Object.keys(errs).length > 0) {
      setErrorMsg(rf.errorGeneric)
      setFormState('error')
      return
    }

    setFormState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId: space.id,
          spaceName: space.name,
          name: name.trim(),
          title: title.trim() || undefined,
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: message.trim() || undefined,
          lang: locale,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || rf.errorGeneric)
      }

      setFormState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : rf.errorGeneric)
      setFormState('error')
    }
  }

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 5,
          background: typeBg,
          color: typeColor,
        }}
      >
        {space.type}
      </span>

      <h2 className="font-sora" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginTop: 12, lineHeight: 1.3 }}>
        {space.name}
      </h2>
      {location && (
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>📍 {location}</div>
      )}

      {matchPct != null && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: 'var(--muted)' }} >{aiMatchScoreByLocale[locale]}</span>
            <span style={{ color: matchColor, fontWeight: 600 }}>{matchPct}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--faint)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${matchPct}%`,
                background: `linear-gradient(90deg, ${matchColor}, ${matchColor}cc)`,
                borderRadius: 2,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {detailRows
          .filter((r) => r.value)
          .map((r) => (
            <div
              key={r.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--line)',
                fontSize: 13,
              }}
            >
              <span style={{ color: 'var(--muted)' }} >{r.label}</span>
              <span style={{ color: 'var(--text)', fontWeight: 500, textAlign: 'right', maxWidth: '65%' }}>
                {r.value}
              </span>
            </div>
          ))}
      </div>

      {space.amenities && space.amenities.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
          {space.amenities.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                padding: '3px 8px',
                borderRadius: 5,
                background: 'var(--faint)',
                color: 'var(--muted)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {formState === 'success' ? (
        <div style={{ textAlign: 'center', padding: '32px 0 8px' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
          <h3 className="font-sora" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
            {cf.successTitle}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            {cf.successMessage}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          <h4 className="font-sora" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            {cf.heading}
          </h4>
          <p className={`text-xs text-muted mb-3`}>
            {rf.requiredHint} <span className="text-alert-red">*</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label={rf.labelFullName} required error={fieldErrors.name} htmlFor="contact-name">
                <input id="contact-name" type="text" placeholder={rf.placeholderName} value={name} onChange={(e) => setName(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
              </FormField>
              <FormField label={rf.labelJobTitle} htmlFor="contact-title">
                <input id="contact-title" type="text" placeholder={rf.placeholderTitle} value={title} onChange={(e) => setTitle(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
              </FormField>
            </div>
            <FormField label={rf.labelCompany} required error={fieldErrors.company} htmlFor="contact-company">
              <input id="contact-company" type="text" placeholder={rf.placeholderCompany} value={company} onChange={(e) => setCompany(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label={rf.labelEmail} required error={fieldErrors.email} htmlFor="contact-email">
                <input id="contact-email" type="email" placeholder={rf.placeholderEmail} value={email} onChange={(e) => setEmail(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
              </FormField>
              <FormField label={rf.labelPhone} htmlFor="contact-phone">
                <input id="contact-phone" type="tel" placeholder={rf.placeholderPhone} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
              </FormField>
            </div>
            <FormField label={rf.labelMessage} htmlFor="contact-message">
              <textarea id="contact-message" placeholder={rf.placeholderMessage} rows={2} value={message} onChange={(e) => setMessage(e.target.value)} disabled={formState === 'loading'} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
          </div>

          {formState === 'error' && errorMsg && (
            <div style={{ fontSize: 12, color: 'hsl(7 72% 48%)', marginTop: 8 }}>{errorMsg}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={formState === 'loading'}
            className="font-sora"
            style={{
              width: '100%',
              marginTop: 14,
              padding: '11px 0',
              borderRadius: 10,
              border: 'none',
              background: formState === 'loading'
                ? 'hsla(36, 90%, 47%, 0.5)'
                : 'linear-gradient(135deg, hsl(36 90% 47%), hsl(20 75% 48%))',
              color: 'hsl(20 10% 10%)',
              fontSize: 13,
              fontWeight: 600,
              cursor: formState === 'loading' ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {formState === 'loading' ? (
              <>
                <LoadingDots />
                {cf.buttonSending}
              </>
            ) : (
              cf.buttonSendIntro
            )}
          </button>
        </div>
      )}
    </ModalBackdrop>
  )
}

function LoadingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'hsl(20 10% 10%)',
            animation: `wcPulse 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes wcPulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }`}</style>
    </span>
  )
}
