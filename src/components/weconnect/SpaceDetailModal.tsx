'use client'

import { useEffect, useState } from 'react'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import type { SpaceWithSimilarity } from '@/hooks/useSpacesSearch'
import ModalBackdrop from './ModalBackdrop'

// ── Type color map (mirrors SpaceCard in WeConnectOverlay) ────────────────
const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  office:     { color: '#F5A623', bg: 'rgba(245,166,35,.12)' },
  lab:        { color: '#22C55E', bg: 'rgba(34,197,94,.12)' },
  coworking:  { color: '#60A5FA', bg: 'rgba(96,165,250,.12)' },
  industrial: { color: '#A78BFA', bg: 'rgba(167,139,250,.12)' },
  factory:    { color: '#F87171', bg: 'rgba(248,113,113,.12)' },
  retail:     { color: '#FBBF24', bg: 'rgba(251,191,36,.12)' },
  studio:     { color: '#34D399', bg: 'rgba(52,211,153,.12)' },
}

// ── Shared input style ────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,.3)',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#E8EAF0',
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
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormState('idle')
      setErrorMsg('')
      setName('')
      setCompany('')
      setEmail('')
      setMessage('')
    }
  }, [isOpen])

  if (!space) return null

  const { color: typeColor, bg: typeBg } = TYPE_COLORS[space.type] ?? TYPE_COLORS.office
  const matchPct = similarity != null ? Math.round(similarity * 100) : null
  const matchColor =
    matchPct != null && matchPct >= 80 ? '#22C55E' : matchPct != null && matchPct >= 60 ? '#F5A623' : '#9CA3AF'

  // Location string
  const location = [space.district, space.address].filter(Boolean).join(' · ')

  // Format size
  const sizeMin = space.area_sqft_min != null ? Number(space.area_sqft_min).toLocaleString() : null
  const sizeMax = space.area_sqft_max != null ? Number(space.area_sqft_max).toLocaleString() : null
  const sizeStr =
    sizeMin && sizeMax && sizeMin !== sizeMax
      ? `${sizeMin}–${sizeMax} sqft`
      : sizeMin
        ? `${sizeMin} sqft`
        : null

  // Format price
  const priceMin = space.price_sgd_min != null ? `SGD ${Number(space.price_sgd_min).toLocaleString()}` : null
  const priceMax = space.price_sgd_max != null ? `SGD ${Number(space.price_sgd_max).toLocaleString()}` : null
  const priceStr =
    priceMin && priceMax && priceMin !== priceMax
      ? `${priceMin} – ${priceMax} /month`
      : priceMin
        ? `${priceMin} /month`
        : null

  // Detail rows
  const detailRows: { label: string; value: string | null }[] = [
    { label: settings.detailLabelSize, value: sizeStr },
    { label: settings.detailLabelZone, value: space.district },
    { label: settings.detailLabelSetup, value: space.amenities?.length > 0 ? space.amenities.join(', ') : null },
    { label: settings.detailLabelLease, value: space.lease_type },
    { label: settings.detailLabelPrice, value: priceStr },
  ]

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please fill in your name and email.')
      setFormState('error')
      return
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
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
          company: company.trim(),
          email: email.trim(),
          message: message.trim() || undefined,
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
          borderRadius: 3,
          background: typeBg,
          color: typeColor,
        }}
      >
        {space.type}
      </span>

      {/* Title + location */}
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#E8EAF0', marginTop: 12, lineHeight: 1.3 }}>
        {space.name}
      </h2>
      {location && (
        <div style={{ fontSize: 12, color: 'rgba(232,234,240,0.45)', marginTop: 4 }}>📍 {location}</div>
      )}

      {/* AI Match Score bar */}
      {matchPct != null && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: 'rgba(232,234,240,0.45)' }}>AI Match Score · 匹配度</span>
            <span style={{ color: matchColor, fontWeight: 600 }}>{matchPct}%</span>
          </div>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
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
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: 13,
              }}
            >
              <span style={{ color: 'rgba(232,234,240,0.45)' }}>{r.label}</span>
              <span style={{ color: '#E8EAF0', fontWeight: 500, textAlign: 'right', maxWidth: '65%' }}>
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
                borderRadius: 4,
                background: 'rgba(255,255,255,.06)',
                color: 'rgba(232,234,240,0.45)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Contact form / Success state ──────────────────────────────── */}
      {formState === 'success' ? (
        <div style={{ textAlign: 'center', padding: '32px 0 8px' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#E8EAF0', marginBottom: 8 }}>
            {settings.contactModalSuccessTitle}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(232,234,240,0.45)', lineHeight: 1.6 }}>
            {settings.contactModalSuccessMessage}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#E8EAF0', marginBottom: 14 }}>
            {settings.contactModalHeading}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text"
              placeholder="Your name · 姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={formState === 'loading'}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Company · 公司"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={formState === 'loading'}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email · 邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={formState === 'loading'}
              style={inputStyle}
            />
            <textarea
              placeholder="Message (optional)"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={formState === 'loading'}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          {formState === 'error' && errorMsg && (
            <div style={{ fontSize: 12, color: '#EF4444', marginTop: 8 }}>{errorMsg}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={formState === 'loading'}
            style={{
              width: '100%',
              marginTop: 14,
              padding: '11px 0',
              borderRadius: 8,
              border: 'none',
              background: formState === 'loading' ? 'rgba(245,166,35,.5)' : '#F5A623',
              color: 'white',
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

/** Three pulsing dots for the loading state. */
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
            background: 'white',
            animation: `wcPulse 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes wcPulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }`}</style>
    </span>
  )
}
