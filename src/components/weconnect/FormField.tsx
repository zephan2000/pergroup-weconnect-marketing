'use client'

/**
 * FormField — shared label + input wrapper for WeConnect forms.
 *
 * Single-locale label: parent passes the already-translated string. Renders:
 *  - Label with red asterisk if required
 *  - Children (the actual input)
 *  - Inline error below if `error` is set
 *
 * Per docs/improvements/02-field-validation-ux.md.
 */

import { type ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  htmlFor?: string
  /** Optional font-family class — `font-noto-sans-sc` for ZH locale, default `font-inter`. */
  labelClassName?: string
  children: ReactNode
}

export default function FormField({
  label,
  required = false,
  error,
  htmlFor,
  labelClassName = 'font-inter',
  children,
}: FormFieldProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={`block text-xs text-muted mb-1.5 ${labelClassName}`}
      >
        {label}
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
