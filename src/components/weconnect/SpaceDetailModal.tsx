'use client'

import { useEffect, useState } from 'react'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import type { SpaceWithSimilarity } from '@/hooks/useSpacesSearch'
import ModalBackdrop from './ModalBackdrop'
import FormField from './FormField'
import { useLocale, useStrings } from '@/lib/i18n/context'

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
  settings: PlatformSettingsData
}

export default function SpaceDetailModal({
  space,
  similarity,
  isOpen,
  onClose,
  settings,
}: SpaceDetailModalProps) {
  const { locale } = useLocale()
  const t = useStrings()
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
    if (!name.trim()) errs.name = t.forms.errorRequired
    if (!company.trim()) errs.company = t.forms.errorRequired
    if (!email.trim()) errs.email = t.forms.errorRequired
    else if (!email.includes('@')) errs.email = t.forms.errorInvalidEmail
    return errs
  }

  // Live-validate after first submit attempt
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
    { label: settings.detailLabelSize, value: sizeStr },
    { label: settings.detailLabelZone, value: space.district },
    { label: settings.detailLabelSetup, value: space.amenities?.length > 0 ? space.amenities.join(', ') : null },
    { label: settings.detailLabelLease, value: space.lease_type },
    { label: settings.detailLabelPrice, value: priceStr },
  ]

  const handleSubmit = async () => {
    const errs = validate()
    setFieldErrors(errs)
    setSubmitted(true)
    if (Object.keys(errs).length > 0) {
      setErrorMsg(t.forms.errorGeneric)
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
          lang: locale,  // server uses this to override Accept-Language for ack email
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setFormState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setFormState('error')
    }
  }

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose}>
      {/* Type badge */}
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

      {/* AI Match Score bar */}
      {matchPct != null && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: 'var(--muted)' }}>AI Match Score · 匹配度</span>
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

      {/* Detail rows */}
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
              <span style={{ color: 'var(--muted)' }}>{r.label}</span>
              <span style={{ color: 'var(--text)', fontWeight: 500, textAlign: 'right', maxWidth: '65%' }}>
                {r.value}
              </span>
            </div>
          ))}
      </div>

      {/* Tags */}
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

      {/* Contact form / Success */}
      {formState === 'success' ? (
        <div style={{ textAlign: 'center', padding: '32px 0 8px' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
          <h3 className="font-sora" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
            {settings.contactModalSuccessTitle}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            {settings.contactModalSuccessMessage}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          <h4 className="font-sora" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            {settings.contactModalHeading}
          </h4>
          <p className="text-xs text-muted mb-3">
            Required fields are marked with <span className="text-alert-red">*</span>
            <span className="font-noto-sans-sc"> · 必填项标记为 <span className="text-alert-red">*</span></span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Your Name" labelZh="姓名" required error={fieldErrors.name} htmlFor="contact-name">
                <input id="contact-name" type="text" placeholder="Your name · 姓名" value={name} onChange={(e) => setName(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
              </FormField>
              <FormField label="Job Title" labelZh="职位" htmlFor="contact-title">
                <input id="contact-title" type="text" placeholder="e.g. Director · 职位" value={title} onChange={(e) => setTitle(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
              </FormField>
            </div>
            <FormField label="Company" labelZh="公司" required error={fieldErrors.company} htmlFor="contact-company">
              <input id="contact-company" type="text" placeholder="Company name · 公司名称" value={company} onChange={(e) => setCompany(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Email" labelZh="邮箱" required error={fieldErrors.email} htmlFor="contact-email">
                <input id="contact-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
              </FormField>
              <FormField label="Phone" labelZh="电话" htmlFor="contact-phone">
                <input id="contact-phone" type="tel" placeholder="+65 xxxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
              </FormField>
            </div>
            <FormField label="Message" labelZh="留言" htmlFor="contact-message">
              <textarea id="contact-message" placeholder="Tell us a bit about what you're looking for · 简述需求" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} disabled={formState === 'loading'} style={{ ...inputStyle, resize: 'none' }} />
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
                Sending…
              </>
            ) : (
              'Send Introduction · 发送介绍'
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
