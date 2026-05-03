'use client'

/**
 * PostRequirementModal — structured requirement form with 4 sections:
 * 1. Basic Information (subject, inquiry type)
 * 2. Requirement Confirmation (description, goal alignment)
 * 3. Commercial Parameters (budget, timeline)
 * 4. Contact & Card Info (name, title, company, phone, email)
 *
 * Per-field validation: errors appear after first submit attempt; then
 * live-validates on every keystroke until the form is closed/reset.
 */

import { useEffect, useState } from 'react'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import ModalBackdrop from './ModalBackdrop'
import FormField from './FormField'

const inputClass =
  'w-full bg-bg-2 border border-line rounded-[10px] px-3.5 py-2.5 text-pg-text font-inter text-sm outline-none placeholder:text-muted focus:border-amber/50 transition-colors'

const REQUIREMENT_TYPES = [
  { value: 'office', label: '🏢 Office Space · 办公室' },
  { value: 'lab', label: '🔬 Lab / R&D Space · 实验室' },
  { value: 'factory', label: '🏭 Factory / Industrial Land · 厂房/土地' },
  { value: 'funding', label: '💰 Investment / Funding · 融资' },
  { value: 'market-entry', label: '🌏 Market Entry Partner · 市场进入' },
  { value: 'other', label: '📋 Other · 其他' },
]

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select timeline · 选择时间' },
  { value: 'urgent', label: '⚡ Urgent (< 2 weeks) · 紧急' },
  { value: 'this-quarter', label: '📅 This Quarter · 本季度' },
  { value: '3-6-months', label: '📆 3–6 Months · 3-6个月' },
  { value: 'exploring', label: '🔍 Just Exploring · 初步了解' },
]

const selectInline: React.CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  backgroundSize: '10px 6px',
  paddingRight: 36,
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface PostRequirementModalProps {
  isOpen: boolean
  onClose: () => void
  settings: PlatformSettingsData
}

interface FieldErrors {
  description?: string
  contactName?: string
  companyName?: string
  contactEmail?: string
}

export default function PostRequirementModal({ isOpen, onClose, settings }: PostRequirementModalProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Section 1: Basic Information
  const [subject, setSubject] = useState('')
  const [type, setType] = useState(REQUIREMENT_TYPES[0].value)

  // Section 2: Requirement Confirmation
  const [description, setDescription] = useState('')
  const [goalAlignment, setGoalAlignment] = useState('')
  const [targetLocation, setTargetLocation] = useState('')

  // Section 3: Commercial Parameters
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')

  // Section 4: Contact Card
  const [contactName, setContactName] = useState('')
  const [contactTitle, setContactTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  // Reset everything when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormState('idle')
      setErrorMsg('')
      setSubmitted(false)
      setFieldErrors({})
      setSubject('')
      setType(REQUIREMENT_TYPES[0].value)
      setDescription('')
      setGoalAlignment('')
      setTargetLocation('')
      setBudget('')
      setTimeline('')
      setContactName('')
      setContactTitle('')
      setCompanyName('')
      setContactPhone('')
      setContactEmail('')
    }
  }, [isOpen])

  function validate(): FieldErrors {
    const errs: FieldErrors = {}
    if (!description.trim()) errs.description = 'Required'
    if (!contactName.trim()) errs.contactName = 'Required'
    if (!companyName.trim()) errs.companyName = 'Required'
    if (!contactEmail.trim()) errs.contactEmail = 'Required'
    else if (!contactEmail.includes('@')) errs.contactEmail = 'Invalid email'
    return errs
  }

  // Live-validate after first submit attempt
  useEffect(() => {
    if (!submitted) return
    setFieldErrors(validate())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, contactName, companyName, contactEmail, submitted])

  const handleSubmit = async () => {
    const errs = validate()
    setFieldErrors(errs)
    setSubmitted(true)
    if (Object.keys(errs).length > 0) {
      setErrorMsg('Please fill in the required fields.')
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
          subject: subject.trim() || undefined,
          type: REQUIREMENT_TYPES.find((t) => t.value === type)?.label ?? type,
          description: description.trim(),
          goalAlignment: goalAlignment.trim() || undefined,
          targetLocation: targetLocation.trim() || 'Not specified',
          budget: budget.trim() || undefined,
          timeline: (TIMELINE_OPTIONS.find((t) => t.value === timeline)?.label ?? timeline) || undefined,
          contactName: contactName.trim(),
          contactTitle: contactTitle.trim() || undefined,
          companyName: companyName.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim() || undefined,
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
        <div className="text-center py-8">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="font-sora text-base font-semibold text-pg-text mb-2">
            {settings.requirementModalSuccessTitle}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            {settings.requirementModalSuccessMessage}
          </p>
        </div>
      ) : (
        <>
          <h2 className="font-sora text-lg font-bold text-pg-text mb-1">
            {settings.requirementModalHeading}
          </h2>
          <p className="text-xs text-muted mb-2">
            {settings.requirementModalDescription}
          </p>
          <p className="text-xs text-muted mb-5">
            Required fields are marked with <span className="text-alert-red">*</span>
            <span className="font-noto-sans-sc"> · 必填项标记为 <span className="text-alert-red">*</span></span>
          </p>

          <div className="space-y-5">
            {/* ── Section 1: Basic Information ── */}
            <div>
              <div className="text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-amber" />
                Basic Information · 基本信息
              </div>
              <div className="space-y-2.5">
                <FormField label="Subject" labelZh="主题" htmlFor="req-subject">
                  <input
                    id="req-subject"
                    type="text"
                    placeholder="Brief title for your inquiry · 简要描述您的需求"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Inquiry Type" labelZh="需求类型" required htmlFor="req-type">
                  <select
                    id="req-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                    style={selectInline}
                  >
                    {REQUIREMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {/* ── Section 2: Requirement Confirmation ── */}
            <div>
              <div className="text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-amber" />
                Requirement Details · 需求详情
              </div>
              <div className="space-y-2.5">
                <FormField label="Description" labelZh="需求描述" required error={fieldErrors.description} htmlFor="req-description">
                  <textarea
                    id="req-description"
                    placeholder="Describe what you're looking for · 详细描述您的需求..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                    style={{ resize: 'none' }}
                  />
                </FormField>
                <FormField label="Goal / Objective" labelZh="目标" htmlFor="req-goal">
                  <input
                    id="req-goal"
                    type="text"
                    placeholder="What does success look like? · 您希望达成什么目标?"
                    value={goalAlignment}
                    onChange={(e) => setGoalAlignment(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Target Location" labelZh="目标地区" htmlFor="req-location">
                  <input
                    id="req-location"
                    type="text"
                    placeholder="e.g. Singapore, Vietnam, EU · 目标地区"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
              </div>
            </div>

            {/* ── Section 3: Commercial Parameters ── */}
            <div>
              <div className="text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-amber" />
                Commercial Parameters · 商业参数
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <FormField label="Budget" labelZh="预算" htmlFor="req-budget">
                  <input
                    id="req-budget"
                    type="text"
                    placeholder="e.g. SGD 5k–15k/mo"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Timeline" labelZh="时间" htmlFor="req-timeline">
                  <select
                    id="req-timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                    style={selectInline}
                  >
                    {TIMELINE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {/* ── Section 4: Contact & Card Info ── */}
            <div>
              <div className="text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-amber" />
                Contact Information · 联系方式
              </div>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField label="Full Name" labelZh="姓名" required error={fieldErrors.contactName} htmlFor="req-name">
                    <input
                      id="req-name"
                      type="text"
                      placeholder="Your name · 您的姓名"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Job Title" labelZh="职位" htmlFor="req-title">
                    <input
                      id="req-title"
                      type="text"
                      placeholder="e.g. Director · 职位"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                </div>
                <FormField label="Company" labelZh="公司" required error={fieldErrors.companyName} htmlFor="req-company">
                  <input
                    id="req-company"
                    type="text"
                    placeholder="Company name · 公司名称"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField label="Email" labelZh="邮箱" required error={fieldErrors.contactEmail} htmlFor="req-email">
                    <input
                      id="req-email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Phone" labelZh="电话" htmlFor="req-phone">
                    <input
                      id="req-phone"
                      type="tel"
                      placeholder="+65 xxxx xxxx"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </div>

          {formState === 'error' && errorMsg && (
            <div className="text-xs text-alert-red mt-2">{errorMsg}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={formState === 'loading'}
            className="w-full mt-4 py-3 rounded-[10px] border-none text-sm font-semibold font-sora cursor-pointer flex items-center justify-center gap-2 text-pg-text"
            style={{
              background: formState === 'loading'
                ? 'hsla(36, 90%, 47%, 0.5)'
                : 'linear-gradient(135deg, hsl(36 90% 47%), hsl(20 75% 48%))',
              cursor: formState === 'loading' ? 'wait' : 'pointer',
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

          <p className="text-[10px] text-muted text-center mt-2">
            PER GROUP will respond within 1 business day · PER GROUP将在1个工作日内回复
          </p>
        </>
      )}
    </ModalBackdrop>
  )
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[5px] h-[5px] rounded-full bg-pg-text"
          style={{ animation: `wcPulse 1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
      <style>{`@keyframes wcPulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }`}</style>
    </span>
  )
}
