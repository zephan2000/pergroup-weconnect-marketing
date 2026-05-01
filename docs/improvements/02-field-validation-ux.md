# Phase 2 — Form Field Validation UX

**Status:** ⏳ Pending
**Estimated effort:** 1.5 hours
**Files touched:** 4 (1 new + 3 modified)

## Problem

Current forms (`PostRequirementModal`, `SpaceDetailModal`) use `*` suffix on labels with no visual emphasis. Errors only show as a single line at the form bottom on submit. No per-field error state. No "Required *" key.

## Goal

- Required fields visibly marked with a red asterisk
- "Required fields are marked with *" hint at the top of the form
- Errors appear **on submit attempt for first time**, then **live-validate** as the user edits each field
- Per-field error state: red border + inline error message below the field
- Once a field is valid, error clears on next keystroke

## Implementation

### New file: `src/components/weconnect/FormField.tsx`

A shared wrapper component with this signature:

```tsx
interface FormFieldProps {
  label: string             // English label e.g. "Subject"
  labelZh?: string          // Chinese label e.g. "主题" (renders as "Subject · 主题" — i18n in Phase 5)
  required?: boolean
  error?: string            // Error message; if present, field is in error state
  children: React.ReactNode // The actual <input>/<select>/<textarea>
  htmlFor?: string          // For label association
}
```

Layout:
- `<label>` row: text + red asterisk if `required`
- Wraps children in a div that gets `border-alert-red` if `error` present
- Below children: `<div className="text-alert-red text-xs mt-1">{error}</div>` if error present

The component does NOT own state; it's a pure render. State + validation lives in the parent modal.

### File: `src/components/weconnect/PostRequirementModal.tsx`

**State additions:**
```tsx
const [submitted, setSubmitted] = useState(false)  // tracks if first submit happened
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
```

**Validation helper:**
```tsx
function validate(): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!description.trim()) errors.description = 'Required'
  if (!contactName.trim()) errors.contactName = 'Required'
  if (!companyName.trim()) errors.companyName = 'Required'
  if (!contactEmail.trim()) errors.contactEmail = 'Required'
  else if (!contactEmail.includes('@')) errors.contactEmail = 'Invalid email'
  return errors
}
```

**Live-validation effect:**
```tsx
useEffect(() => {
  if (!submitted) return
  setFieldErrors(validate())
}, [description, contactName, companyName, contactEmail, submitted])
```

**Submit handler change:**
```tsx
const handleSubmit = async () => {
  const errors = validate()
  setFieldErrors(errors)
  setSubmitted(true)
  if (Object.keys(errors).length > 0) {
    setErrorMsg('Please fill in the required fields.')
    setFormState('error')
    return
  }
  // ...rest unchanged
}
```

**JSX:** wrap each input in `<FormField>`. Move the existing labels inside FormField's `label`/`labelZh` props. Use `error={fieldErrors.description}` etc.

**Top of form:** add a hint
```tsx
<p className="text-xs text-muted mb-3">
  Required fields are marked with <span className="text-alert-red">*</span>
</p>
```

### File: `src/components/weconnect/SpaceDetailModal.tsx`

Same pattern as above but for the contact form (5 fields: name + title + company + email + phone + message).

Required fields: `name`, `company`, `email`. Optional: `title`, `phone`, `message`.

### File: `tailwind.config.ts`

No changes — `alert-red` token already exists (`hsl(7 72% 48%)`).

## Validation

### Harness
```bash
bash scripts/validate.sh
```

### Manual checklist
- [ ] Open WeConnect overlay → Needs tab → click "Post a Need"
- [ ] Modal opens with hint at top: "Required fields are marked with *"
- [ ] Required field labels show red asterisk
- [ ] Click "Submit Requirement" with empty form → all required fields show red border + "Required" text
- [ ] Type in Description field → its error clears immediately
- [ ] Type invalid email (e.g. "abc") → email field shows "Invalid email" red text
- [ ] Type valid email → error clears
- [ ] Submit with all required fields filled → form submits successfully
- [ ] Repeat for SpaceDetailModal contact form

## Risks & rollback

- Risk: Re-render performance on every keystroke (live validation runs `validate()` per change). Mitigation: validation is O(field count) — trivial. No memoization needed.
- Risk: A11y — error message must be associated with the input via `aria-describedby`. Add this in FormField.
- Rollback: `git revert <commit>` — FormField is new, two modals reverted to previous form structure.

## Done when

- [ ] Validation harness green
- [ ] Manual checklist all pass
- [ ] CHANGELOG entries for the new file + 2 modified
- [ ] This file's Status flipped to ✅ Done
- [ ] README status table updated
- [ ] Committed and pushed
