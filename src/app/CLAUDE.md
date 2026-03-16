# CLAUDE.md — /src/app (Next.js App Router)

## Route Structure
/                        → Marketing site (PER GROUP landing page)
/platform                → WeConnect root (redirects to /platform/spaces)
/platform/spaces         → Spaces listing page (v1 — live data)
/platform/funding        → Funding placeholder ("Coming soon")
/platform/markets        → Markets placeholder ("Coming soon")
/admin                   → Payload CMS admin panel (built-in, do not customise)

## Rules
- All marketing pages are server components by default
- Only add 'use client' when strictly necessary (interactivity, hooks)
- WeConnect platform pages live under /platform route group
- /admin is handled entirely by Payload — do not add custom files there
- Firebase Analytics initialised once in the root layout via a client component wrapper
- No page should fetch data directly — all data access goes through /src/lib/