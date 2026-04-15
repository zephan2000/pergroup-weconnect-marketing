'use client'

import { useEffect, useState } from 'react'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import ModalBackdrop from './ModalBackdrop'

// ── Warm light input styles ──
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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  backgroundSize: '10px 6px',
  backgroundColor: 'hsl(33 100% 95%)',
  paddingRight: 36,
}

const REQUIREMENT_TYPES = [
  { value: 'office', label: '🏢 Office Space · 办公室' },
  { value: 'lab', label: '🔬 Lab / R&D Space · 实验室' },
  { value: 'factory', label: '🏭 Factory / Industrial Land · 厂房/土地' },
  { value: 'funding', label: '💰 Investment / Funding · 融资' },
  { value: 'market-entry', label: '🌏 Market Entry Partner · 市场进入' },
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface PostRequirementModalProps {
  isOpen: boolean
  onClose: () => void
  settings: PlatformSettingsData
}

export default function PostRequirementModal({ isOpen, onClose, settings }: PostRequirementModalProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [type, setType] = useState(REQUIREMENT_TYPES[0].value)
  const [companyName, setCompanyName] = useState('')
  const [targetLocation, setTargetLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [description, setDescription] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setFormState('idle')
      setErrorMsg('')
      setType(REQUIREMENT_TYPES[0].value)
      setCompanyName('')
      setTargetLocation('')
      setBudget('')
      setDescription('')
      setContactEmail('')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      setErrorMsg('Company name is required.')
      setFormState('error')
      return
    }
    if (!targetLocation.trim()) {
      setErrorMsg('Target location is required.')
      setFormState('error')
      return
    }
    if (!description.trim()) {
      setErrorMsg('Please describe your requirements.')
      setFormState('error')
      return
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      setFormState('error')
      return
    }

    setFormState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: REQUIREMENT_TYPES.find((t) => t.value === type)?.label ?? type,
          companyName: companyName.trim(),
          targetLocation: targetLocation.trim(),
          budget: budget.trim() || undefined,
          description: description.trim(),
          contactEmail: contactEmail.trim(),
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
      {formState === 'success' ? (
        <div style={{ textAlign: 'center', padding: '32px 0 8px' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
          <h3 className="font-sora" style={{ fontSize: 16, fontWeight: 600, color: 'hsl(20 10% 10%)', marginBottom: 8 }}>
            {settings.requirementModalSuccessTitle}
          </h3>
          <p style={{ fontSize: 13, color: 'hsl(25 10% 49%)', lineHeight: 1.6 }}>
            {settings.requirementModalSuccessMessage}
          </p>
        </div>
      ) : (
        <>
          <h2 className="font-sora" style={{ fontSize: 18, fontWeight: 700, color: 'hsl(20 10% 10%)', marginBottom: 4 }}>
            {settings.requirementModalHeading}
          </h2>
          <p style={{ fontSize: 12, color: 'hsl(25 10% 49%)', marginBottom: 20, marginTop: 0 }}>
            {settings.requirementModalDescription}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={formState === 'loading'}
              style={selectStyle}
            >
              {REQUIREMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <input type="text" placeholder="Company name · 公司名称" value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
            <input type="text" placeholder="Target location · 目标地区 (e.g. Singapore, Vietnam)" value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
            <input type="text" placeholder="Budget · 预算 (e.g. SGD 5,000–15,000/mo)" value={budget} onChange={(e) => setBudget(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
            <textarea placeholder="Describe requirements · 详细描述需求..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={formState === 'loading'} style={{ ...inputStyle, resize: 'none' }} />
            <input type="email" placeholder="Contact email · 联系邮箱" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} disabled={formState === 'loading'} style={inputStyle} />
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
              padding: '12px 0',
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
                Submitting…
              </>
            ) : (
              'Submit Requirement · 提交需求'
            )}
          </button>

          <p style={{ fontSize: 10, color: 'hsl(25 10% 49%)', textAlign: 'center', marginTop: 8 }}>
            PER GROUP will respond within 1 business day · PER GROUP将在1个工作日内回复
          </p>
        </>
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
