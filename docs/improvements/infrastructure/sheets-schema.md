# Sheets Schema

Exact column ordering for each tab in the `WeConnect Submissions` Google Sheet.

## Common columns (all tabs)

The first 4 columns are identical across all tabs:

| # | Column | Type | Notes |
|---|---|---|---|
| 1 | `timestamp` | ISO datetime | `new Date().toISOString()` server-side |
| 2 | `email_status` | enum | `sent` / `failed` / `partial` |
| 3 | `email_error` | text | Error message if email failed (else empty) |
| 4 | `source_page` | text | URL/referer the form was submitted from |

After these, each tab has form-type-specific columns.

---

## Tab: `Contact`

For SpaceDetailModal introductions.

| # | Column | Notes |
|---|---|---|
| 1–4 | (common) | |
| 5 | `space_id` | Supabase weconnect.spaces.id |
| 6 | `space_name` | Display name of the space |
| 7 | `inquiry_type` | If user picked one (Phase 4+) |
| 8 | `name` | Required |
| 9 | `title` | Optional |
| 10 | `company` | Required |
| 11 | `email` | Required |
| 12 | `phone` | Optional |
| 13 | `budget` | Optional |
| 14 | `timeline` | Optional |
| 15 | `message` | Optional free-text |

**Header row:**
```
timestamp,email_status,email_error,source_page,space_id,space_name,inquiry_type,name,title,company,email,phone,budget,timeline,message
```

---

## Tab: `Requirement`

For PostRequirementModal.

| # | Column | Notes |
|---|---|---|
| 1–4 | (common) | |
| 5 | `subject` | Optional |
| 6 | `type` | Inquiry type label |
| 7 | `target_location` | Required |
| 8 | `description` | Required |
| 9 | `goal_alignment` | Optional |
| 10 | `budget` | Optional |
| 11 | `timeline` | Optional |
| 12 | `contact_name` | Required |
| 13 | `contact_title` | Optional |
| 14 | `company_name` | Required |
| 15 | `contact_email` | Required |
| 16 | `contact_phone` | Optional |

**Header row:**
```
timestamp,email_status,email_error,source_page,subject,type,target_location,description,goal_alignment,budget,timeline,contact_name,contact_title,company_name,contact_email,contact_phone
```

---

## Tab: `Need`

For "Post a Need" submissions (currently routes to PostRequirementModal but reserved for future direct Need form).

| # | Column | Notes |
|---|---|---|
| 1–4 | (common) | |
| 5 | `category` | Required |
| 6 | `description` | Required |
| 7 | `urgency` | Required |
| 8 | `budget` | Optional |
| 9 | `timeline` | Optional |
| 10 | `goal_alignment` | Optional |
| 11 | `contact_name` | Optional in API |
| 12 | `contact_title` | Optional |
| 13 | `company_name` | Optional |
| 14 | `contact_email` | Required |
| 15 | `contact_phone` | Optional |

**Header row:**
```
timestamp,email_status,email_error,source_page,category,description,urgency,budget,timeline,goal_alignment,contact_name,contact_title,company_name,contact_email,contact_phone
```

---

## Tab: `Offering`

For supplier "Share What You Offer" submissions.

| # | Column | Notes |
|---|---|---|
| 1–4 | (common) | |
| 5 | `category` | Required |
| 6 | `capability` | Required |
| 7 | `ideal_client` | Optional |
| 8 | `availability` | Required |
| 9 | `track_record` | Optional |
| 10 | `contact_name` | Optional |
| 11 | `contact_title` | Optional |
| 12 | `company_name` | Optional |
| 13 | `contact_email` | Required |
| 14 | `contact_phone` | Optional |

**Header row:**
```
timestamp,email_status,email_error,source_page,category,capability,ideal_client,availability,track_record,contact_name,contact_title,company_name,contact_email,contact_phone
```

---

## Setup script behavior

`scripts/setup-sheets.ts` creates these tabs and writes the header rows once. Subsequent runs:
- Skip tab creation if it exists
- Skip header write if row 1 already has values
- Never delete or overwrite existing data

## How rows are appended

`src/lib/weconnect/sheets.ts` exports `appendSubmission()`. It maps the form payload to the column order above and calls Sheets API `values.append`. Failures are caught and logged; the user-facing API response is not affected.
