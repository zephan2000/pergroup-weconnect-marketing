'use client'

/**
 * PostOfferingModal — supplier-facing form for sharing capabilities.
 *
 * Counterpart to PostRequirementModal (the "Post a Need" form). Posts to
 * /api/offering, which sends an internal email to PER GROUP and an
 * acknowledgement to the submitter via Resend.
 *
 * 4 sections: Basic Information, Capability, Availability & Coverage,
 * Contact Information. Per-field validation: errors appear after first submit
 * attempt; live-validates on every keystroke after that.
 *
 * Every visible label, placeholder, button, dropdown option, success/error
 * message comes from the OfferingFormSettings global. Dropdown option
 * `value` codes (e.g. `'office-brokerage'`, `'immediate'`) stay frozen because
 * the API references them.
 */

import { useEffect, useMemo, useState } from 'react'
import type { OfferingFormSettingsData } from '@/lib/cms/site-text'
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

interface PostOfferingModalProps {
  isOpen: boolean
  onClose: () => void
  offeringForm: OfferingFormSettingsData
  locale: Locale
}

interface FieldErrors {
  capability?: string
  companyName?: string
  contactEmail?: string
}

export default function PostOfferingModal({
  isOpen,
  onClose,
  offeringForm: of,
  locale,
}: PostOfferingModalProps) {
  // Build option arrays from CMS labels. Values are frozen codes the API uses.
  const CATEGORY_OPTIONS = useMemo(
    () => [
      { value: 'office-brokerage', label: of.categoryOfficeBrokerage },
      { value: 'lab-brokerage', label: of.categoryLabBrokerage },
      { value: 'factory-brokerage', label: of.categoryFactoryBrokerage },
      { value: 'advisory', label: of.categoryAdvisory },
      { value: 'market-entry', label: of.categoryMarketEntry },
      { value: 'funding', label: of.categoryFunding },
      { value: 'other', label: of.categoryOther },
    ],
    [
      of.categoryOfficeBrokerage,
      of.categoryLabBrokerage,
      of.categoryFactoryBrokerage,
      of.categoryAdvisory,
      of.categoryMarketEntry,
      of.categoryFunding,
      of.categoryOther,
    ],
  )
  const AVAILABILITY_OPTIONS = useMemo(
    () => [
      { value: '', label: of.availabilitySelect },
      { value: 'immediate', label: of.availabilityImmediate },
      { value: 'this-quarter', label: of.availabilityThisQuarter },
      { value: 'next-quarter', label: of.availabilityNextQuarter },
      { value: 'custom', label: of.availabilityCustom },
    ],
    [
      of.availabilitySelect,
      of.availabilityImmediate,
      of.availabilityThisQuarter,
      of.availabilityNextQuarter,
      of.availabilityCustom,
    ],
  )

  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value)
  const [capability, setCapability] = useState('')
  const [trackRecord, setTrackRecord] = useState('')
  const [idealClient, setIdealClient] = useState('')
  const [availability, setAvailability] = useState('')
  const [coverage, setCoverage] = useState('')
  const [capacity, setCapacity] = useState('')
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
      setCategory(CATEGORY_OPTIONS[0].value)
      setCapability('')
      setTrackRecord('')
      setIdealClient('')
      setAvailability('')
      setCoverage('')
      setCapacity('')
      setContactName('')
      setContactTitle('')
      setCompanyName('')
      setContactPhone('')
      setContactEmail('')
    }
  }, [isOpen, CATEGORY_OPTIONS])

  function validate(): FieldErrors {
    const errs: FieldErrors = {}
    if (!capability.trim()) errs.capability = of.errorRequired
    if (!companyName.trim()) errs.companyName = of.errorRequired
    if (!contactEmail.trim()) errs.contactEmail = of.errorRequired
    else if (!contactEmail.includes('@')) errs.contactEmail = of.errorInvalidEmail
    return errs
  }

  // Live readiness check — toggles the submit button between dim/inactive and
  // active. Mirrors validate() without writing error state, so the user never
  // sees errors before they've tried to submit.
  const isFormComplete =
    capability.trim().length > 0 &&
    companyName.trim().length > 0 &&
    contactEmail.trim().length > 0 &&
    contactEmail.includes('@')

  useEffect(() => {
    if (!submitted) return
    setFieldErrors(validate())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capability, companyName, contactEmail, submitted])

  const handleSubmit = async () => {
    const errs = validate()
    setFieldErrors(errs)
    setSubmitted(true)
    if (Object.keys(errs).length > 0) {
      setErrorMsg(of.errorGeneric)
      setFormState('error')
      return
    }

    setFormState('loading')
    setErrorMsg('')

    try {
      const categoryLabel =
        CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label ?? category
      const availabilityLabel =
        AVAILABILITY_OPTIONS.find((opt) => opt.value === availability)?.label ?? availability

      // /api/offering currently expects: category, capability, availability,
      // contactEmail (required). idealClient/trackRecord/companyName/contact*
      // are optional. Subject/coverage/capacity aren't in the API contract —
      // we fold them into idealClient/trackRecord notes for now.
      const trackRecordWithExtras = [
        trackRecord.trim(),
        coverage.trim() ? `Coverage: ${coverage.trim()}` : '',
        capacity.trim() ? `Capacity: ${capacity.trim()}` : '',
        subject.trim() ? `Subject: ${subject.trim()}` : '',
      ].filter(Boolean).join(' · ')

      const res = await fetch('/api/offering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryLabel,
          capability: capability.trim(),
          idealClient: idealClient.trim() || undefined,
          availability: availabilityLabel || 'Not specified',
          trackRecord: trackRecordWithExtras || undefined,
          contactName: contactName.trim() || undefined,
          contactTitle: contactTitle.trim() || undefined,
          companyName: companyName.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim() || undefined,
          lang: locale,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || of.errorGeneric)
      }

      setFormState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : of.errorGeneric)
      setFormState('error')
    }
  }

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose}>
      {formState === 'success' ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-3">✅</div>
          <h3 className={`text-base font-semibold text-pg-text mb-2`}>
            {of.successTitle}
          </h3>
          <p className={`text-sm text-muted leading-relaxed`}>{of.successMessage}</p>
        </div>
      ) : (
        <>
          <h2 className={`text-lg font-bold text-pg-text mb-1`}>
            {of.heading}
          </h2>
          <p className={`text-xs text-muted mb-2`}>{of.description}</p>
          <p className={`text-xs text-muted mb-5`}>
            {of.requiredHint} <span className="text-alert-red">*</span>
          </p>

          <div className="space-y-5">
            {/* ── Section 1 ── */}
            <div>
              <div className={`text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2`}>
                <span className="w-4 h-px bg-amber" />
                {of.sectionBasic}
              </div>
              <div className="space-y-2.5">
                <FormField label={of.labelSubject} htmlFor="off-subject">
                  <input
                    id="off-subject"
                    type="text"
                    placeholder={of.placeholderSubject}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <FormField label={of.labelCategory} required htmlFor="off-category">
                  <select
                    id="off-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                    style={selectInline}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {/* ── Section 2 ── */}
            <div>
              <div className={`text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2`}>
                <span className="w-4 h-px bg-amber" />
                {of.sectionCapability}
              </div>
              <div className="space-y-2.5">
                <FormField label={of.labelCapability} required error={fieldErrors.capability} htmlFor="off-capability">
                  <textarea
                    id="off-capability"
                    placeholder={of.placeholderCapability}
                    rows={3}
                    value={capability}
                    onChange={(e) => setCapability(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                    style={{ resize: 'none' }}
                  />
                </FormField>
                <FormField label={of.labelTrackRecord} htmlFor="off-track">
                  <input
                    id="off-track"
                    type="text"
                    placeholder={of.placeholderTrackRecord}
                    value={trackRecord}
                    onChange={(e) => setTrackRecord(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <FormField label={of.labelIdealClient} htmlFor="off-ideal">
                  <input
                    id="off-ideal"
                    type="text"
                    placeholder={of.placeholderIdealClient}
                    value={idealClient}
                    onChange={(e) => setIdealClient(e.target.value)}
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
                {of.sectionAvailability}
              </div>
              <div className="space-y-2.5">
                <FormField label={of.labelAvailability} htmlFor="off-availability">
                  <select
                    id="off-availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                    style={selectInline}
                  >
                    {AVAILABILITY_OPTIONS.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </FormField>
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField label={of.labelCoverage} htmlFor="off-coverage">
                    <input
                      id="off-coverage"
                      type="text"
                      placeholder={of.placeholderCoverage}
                      value={coverage}
                      onChange={(e) => setCoverage(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label={of.labelCapacity} htmlFor="off-capacity">
                    <input
                      id="off-capacity"
                      type="text"
                      placeholder={of.placeholderCapacity}
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* ── Section 4 ── */}
            <div>
              <div className={`text-[10px] uppercase tracking-[2px] text-amber font-semibold mb-3 flex items-center gap-2`}>
                <span className="w-4 h-px bg-amber" />
                {of.sectionContact}
              </div>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField label={of.labelFullName} htmlFor="off-name">
                    <input
                      id="off-name"
                      type="text"
                      placeholder={of.placeholderName}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label={of.labelJobTitle} htmlFor="off-title">
                    <input
                      id="off-title"
                      type="text"
                      placeholder={of.placeholderTitle}
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                </div>
                <FormField label={of.labelCompany} required error={fieldErrors.companyName} htmlFor="off-company">
                  <input
                    id="off-company"
                    type="text"
                    placeholder={of.placeholderCompany}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={formState === 'loading'}
                    className={inputClass}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField label={of.labelEmail} required error={fieldErrors.contactEmail} htmlFor="off-email">
                    <input
                      id="off-email"
                      type="email"
                      placeholder={of.placeholderEmail}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      disabled={formState === 'loading'}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label={of.labelPhone} htmlFor="off-phone">
                    <input
                      id="off-phone"
                      type="tel"
                      placeholder={of.placeholderPhone}
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
                {of.buttonSubmitting}
              </>
            ) : (
              of.buttonSubmit
            )}
          </button>

          <p className={`text-[10px] text-muted text-center mt-2`}>{of.responseSla}</p>
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
