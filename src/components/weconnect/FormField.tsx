'use client'

/**
 * FormField — shared label + input wrapper for WeConnect forms.
 *
 * Pure render — state, validation, and error logic all live in the parent.
 * Renders:
 *  - Label row with optional bilingual subtext + red asterisk if required
 *  - Children (the actual input)
 *  - Inline error message below if `error` is set
 *
 * Per docs/improvements/02-field-validation-ux.md.
 *
 * NOTE: The `label`/`labelZh` pair will become locale-driven in Phase 5.
 * For now we render both English and Chinese (current pattern).
 */

import { type ReactNode } from 'react'

interface FormFieldProps {
  label: string
  labelZh?: string
  required?: boolean
  error?: string
  htmlFor?: string
  children: ReactNode
}

export default function FormField({
  label,
  labelZh,
  required = false,
  error,
  htmlFor,
  children,
}: FormFieldProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs text-muted mb-1.5 font-inter"
      >
        {label}
        {labelZh && <span className="font-noto-sans-sc"> · {labelZh}</span>}
        {required && (
          <span className="text-alert-red ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div
        className={
          error
            ? 'rounded-[10px] ring-1 ring-alert-red transition-all'
            : 'transition-all'
        }
      >
        {children}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-alert-red text-xs mt-1 font-inter"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}
