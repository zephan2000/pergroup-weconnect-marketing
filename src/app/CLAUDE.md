# CLAUDE.md — /src/app (Next.js App Router)

## Route Structure
/                        → Marketing site (PER GROUP landing page)
/admin                   → Payload CMS admin panel (built-in, do not customise)

## WeConnect Platform
WeConnect is NOT a separate route — it is a full-screen slide-up overlay
controlled by WeConnectContext (open/close state + active tab).

Overlay tabs:
- **Needs** — "Post a Need" + "Share an Offering" cards, plus embedded Spaces browser
  (live Supabase data, hybrid vector/BM25 search, AI mode)
- **Alerts** — Advisory alerts with severity levels (preview/coming-soon in v1)
- **Profile** — User profile stub (no auth in v1)

The overlay is rendered in `(marketing)/layout.tsx` via `<WeConnectOverlay />`.
Trigger buttons throughout the site use `<WeConnectTrigger tab="needs" />`.

## API Routes
- `/api/contact`      → POST: space introduction request (Resend email)
- `/api/requirement`  → POST: requirement submission (Resend email)
- `/api/search`       → POST: hybrid vector/BM25 search via Supabase RPC
- `/api/need`         → POST: need submission (Resend email) — new
- `/api/offering`     → POST: offering submission (Resend email) — new
- `/api/draft`        → Payload draft preview handler
- `/api/exit-draft`   → Exit draft mode

## Rules
- All marketing pages are server components by default
- Only add 'use client' when strictly necessary (interactivity, hooks)
- /admin is handled entirely by Payload — do not add custom files there
- Firebase Analytics initialised once in the root layout via a client component wrapper
- No page should fetch data directly — all data access goes through /src/lib/
- Light mode is the default visual theme; dark mode via `.dark` class
