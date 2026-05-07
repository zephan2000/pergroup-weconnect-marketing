'use client'

/**
 * PostRequirementModal — structured requirement form.
 *
 * 4 sections: Basic Information, Requirement Details, Commercial Parameters,
 * Contact Information. Per-field validation: errors appear after first submit
 * attempt; live-validates on every keystroke after that.
 *
 * Every visible label, placeholder, button, dropdown option, success/error
 * message comes from the RequirementFormSettings global. Dropdown option
 * `value` codes (`'office'`, `'lab'`, etc.) stay frozen — the API references
 * them.
 */

import { useEffect, useMemo, useState } from 'react'
import type { RequirementFormSettingsData } from '@/lib/cms/site-text'
import type { Locale } from '@/lib/i18n/strings'
import ModalBackdrop from './ModalBackdrop'
import FormField from './FormField'

const inputClass =
  'w-full bg-bg-2 border border-line rounded-[10px] px-3.5 py-2.5 text-pg-text font-inter text-sm outline-none placeholder:text-muted focus:border-amber/50 transition-colors'

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
  requirementForm: RequirementFormSettingsData
  locale: Locale
}

interface FieldErrors {
  description?: string
  contactName?: string
  companyName?: string
  contactEmail?: string
}

export default function PostRequirementModal({
  isOpen,
  onClose,
  requirementForm: rf,
  locale,
}: PostRequirementModalProps) {
  // Build option arrays from CMS labels. Values are frozen codes the API uses.
  const REQUIREMENT_TYPES = useMemo(
    () => [
      { value: 'office', label: rf.typeOffice },
      { value: 'lab', label: rf.typeLab },
      { value: 'factory', label: rf.typeFactory },
      { value: 'funding', label: rf.typeFunding },
      { value: 'market-entry', label: rf.typeMarketEntry },
      { value: 'other', label: rf.typeOther },
    ],
    [rf.typeOffice, rf.typeLab, rf.typeFactory, rf.typeFunding, rf.typeMarketEntry, rf.typeOther],
  )
  const TIMELINE_OPTIONS = useMemo(
    () => [
      { value: '', label: rf.timelineSelect },
      { value: 'urgent', label: rf.timelineUrgent },
      { value: 'this-quarter', label: rf.timelineThisQuarter },
      { value: '3-6-months', label: rf.timeline3to6 },
      { value: 'exploring', label: rf.timelineExploring },
    ],
    [rf.timelineSelect, rf.timelineUrgent, rf.timelineThisQuarter, rf.timeline3to6, rf.timelineExploring],
  )

  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [subject, setSubject] = useState('')
  const [type, setType] = useState(REQUIREMENT_TYPES[0].value)
  const [description, setDescription] = useState('')
  const [goalAlignment, setGoalAlignment] = useState('')
  const [targetLocation, setTargetLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactTitle, setContactTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')

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
  }, [isOpen, REQUIREMENT_TYPES])

  function validate(): FieldErrors {
    const errs: FieldErrors = {}
    if (!description.trim()) errs.description = rf.errorRequired
    if (!contactName.trim()) errs.contactName = rf.errorRequired
    if (!companyName.trim()) errs.companyName = rf.errorRequired
    if (!contactEmail.trim()) errs.contactEmail = rf.errorRequired
    else if (!contactEmail.includes('@')) errs.contactEmail = rf.errorInvalidEmail
    return errs
  }

  // Live readiness check — toggles the submit button between dim/inactive and
  // active. Cheap to recompute every render; mirrors validate() without writing
  // error state, so the user never sees errors before they've tried to submit.
  const isFormComplete =
    description.trim().length > 0 &&
    contactName.trim().length > 0 &&
    companyName.trim().length > 0 &&
    contactEmail.trim().length > 0 &&
    contactEmail.includes('@')

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
      setErrorMsg(rf.errorGeneric)
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
          type: REQUIREMENT_TYPES.find((opt) => opt.value === type)?.label ?? type,
          description: description.trim(),
          goalAlignment: goalAlignment.trim() || undefined,
          targetLocation: targetLocation.trim() || 'Not specified',
          budget: budget.trim() || undefined,
          timeline: (TIMELINE_OPTIONS.find((opt) => opt.value === timeline)?.label ?? timeline) || undefined,
          contactName: contactName.trim(),
          contactTitle: contactTitle.trim() || undefined,
          companyName: companyName.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim() || undefined,
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
      {formState === 'success' ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-3">✅</div>
          <h3 className={`text-base font-semibold text-pg-text mb-2`}>
            {rf.successTitle}
          </h3>
          <p className={`text-sm text-muted leading-relaxed`}>{rf.successMessage}</p>
        </div>
      ) : (
        <>
          <h2 className={`text-lg font-bold text-pg-text mb-1`}>
            {rf.heading}
          </h2>
          <p className={`text-xs text-muted mb-2`}>{rf.description}</p>
          <p className={`text-xs text-muted mb-5`}>
            {rf.requiredHint} <span className="text-alert-red">*</span>
          </p>

          <div className="space-y-5">
            {/* ── Section 1 ── */}
            <div>
              <div className={`text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2`}>
                <span className="w-4 h-px bg-amber" />
                {rf.sectionBasic}
              </div>
              <div className="space-y-2.5">
                <FormField label={rf.labelSubject} htmlFor="req-subject">
                  <input
                    id="req-subject"
                    type="text"
                    placeholder={rf.placeholderSubject}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <FormField label={rf.labelInquiryType} required htmlFor="req-type">
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

            {/* ── Section 2 ── */}
            <div>
              <div className={`text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2`}>
                <span className="w-4 h-px bg-amber" />
                {rf.sectionRequirement}
              </div>
              <div className="space-y-2.5">
                <FormField label={rf.labelDescription} required error={fieldErrors.description} htmlFor="req-description">
                  <textarea
                    id="req-description"
                    placeholder={rf.placeholderDescription}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                    style={{ resize: 'none' }}
                  />
                </FormField>
                <FormField label={rf.labelGoal} htmlFor="req-goal">
                  <input
                    id="req-goal"
                    type="text"
                    placeholder={rf.placeholderGoal}
                    value={goalAlignment}
                    onChange={(e) => setGoalAlignment(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <FormField label={rf.labelTargetLocation} htmlFor="req-location">
                  <input
                    id="req-location"
                    type="text"
                    placeholder={rf.placeholderTargetLocation}
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
              </div>
            </div>

            {/* ── Section 3 ── */}
            <div>
              <div className={`text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2`}>
                <span className="w-4 h-px bg-amber" />
                {rf.sectionCommercial}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <FormField label={rf.labelBudget} htmlFor="req-budget">
                  <input
                    id="req-budget"
                    type="text"
                    placeholder={rf.placeholderBudget}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <FormField label={rf.labelTimeline} htmlFor="req-timeline">
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

            {/* ── Section 4 ── */}
            <div>
              <div className={`text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2`}>
                <span className="w-4 h-px bg-amber" />
                {rf.sectionContact}
              </div>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField label={rf.labelFullName} required error={fieldErrors.contactName} htmlFor="req-name">
                    <input
                      id="req-name"
                      type="text"
                      placeholder={rf.placeholderName}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label={rf.labelJobTitle} htmlFor="req-title">
                    <input
                      id="req-title"
                      type="text"
                      placeholder={rf.placeholderTitle}
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                </div>
                <FormField label={rf.labelCompany} required error={fieldErrors.companyName} htmlFor="req-company">
                  <input
                    id="req-company"
                    type="text"
                    placeholder={rf.placeholderCompany}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField label={rf.labelEmail} required error={fieldErrors.contactEmail} htmlFor="req-email">
                    <input
                      id="req-email"
                      type="email"
                      placeholder={rf.placeholderEmail}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label={rf.labelPhone} htmlFor="req-phone">
                    <input
                      id="req-phone"
                      type="tel"
                      placeholder={rf.placeholderPhone}
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
            <div className={`text-xs text-alert-red mt-2`}>{errorMsg}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={formState === 'loading' || !isFormComplete}
            className={`w-full mt-4 py-3 rounded-[10px] border-none text-sm font-semibold flex items-center justify-center gap-2 text-pg-text transition-opacity`}
            style={{
              background: 'linear-gradient(135deg, hsl(36 90% 47%), hsl(20 75% 48%))',
              opacity: formState === 'loading' ? 0.7 : isFormComplete ? 1 : 0.4,
              cursor: formState === 'loading'
                ? 'wait'
                : isFormComplete
                  ? 'pointer'
                  : 'not-allowed',
            }}
          >
            {formState === 'loading' ? (
              <>
                <LoadingDots />
                {rf.buttonSubmitting}
              </>
            ) : (
              rf.buttonSubmit
            )}
          </button>

          <p className={`text-[10px] text-muted text-center mt-2`}>{rf.responseSla}</p>
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
