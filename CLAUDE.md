# CLAUDE.md — PER GROUP × WeConnect

## Project Overview
Marketing website for PER GROUP (global tech innovation consultancy)
with WeConnect proactive relationship intelligence platform embedded as a full-screen overlay.

## Stack — LOCKED. Do not deviate without explicit instruction.
- Framework: Next.js 14 (App Router)
- CMS: Payload v3 (headless, Postgres adapter via Drizzle ORM)
- Database: Supabase (Postgres) — single DB for BOTH Payload CMS tables and WeConnect data
- Analytics: Firebase Analytics (GA4 web SDK only — NOT Firebase Admin, NOT Firestore)
- Deployment: Vercel
- Package manager: npm (never suggest pnpm or yarn)
- Styling: Tailwind CSS
- Fonts: Sora (display), Inter (body), Noto Sans SC (Chinese)
- Icons: lucide-react
- Email: Resend (transactional emails)

## Design System
- **Light mode is the default.** Warm white background `hsl(40 33% 97%)`, dark text.
- Dark mode is an additional feature toggled via `.dark` class on the root element.
- Brand colour: warm amber `hsl(36 90% 47%)`
- Glass morphism utilities: `.glass`, `.glass-dark`, `.glass-card`, `.glass-light` (defined in globals.css)
- Bilingual: English + Simplified Chinese throughout all sections

## Database Schema Separation — CRITICAL
Supabase has two logical schemas:
- `cms` schema → Payload v3 auto-generated tables (do not manually edit these)
- `weconnect` schema → WeConnect operational tables (listings, requirements, matches)
Never mix data between schemas. Never store WeConnect data in Payload collections.

## Authentication — CURRENT SCOPE
- Payload built-in auth ONLY for CMS editors (admin panel access)
- WeConnect user auth: NOT in scope for v1 — architecture should be stubbed and documented but NOT implemented
- Do NOT introduce Clerk, Auth0, or any third-party auth provider yet
- Leave a clearly commented placeholder in /src/lib/auth/weconnect-auth.stub.ts

## WeConnect v1 Scope
The WeConnect overlay has three tabs: **Needs**, **Alerts**, **Profile**.
- Needs tab: Contains "Post a Need" and "Share an Offering" cards, plus the Spaces browser
  (fully implemented with live Supabase data, hybrid vector/BM25 search)
- Alerts tab: Advisory alerts in preview/coming-soon state (hardcoded sample data for v1)
- Profile tab: Stub user profile (no auth in v1)
- Do not build data models or UI beyond what is specified for v1

## Email Infrastructure
All form submissions route through Resend to PER GROUP's inbox. Pattern:
1. Client form component → POST to API route
2. API route validates → calls email function in `src/lib/weconnect/email.ts`
3. Email function sends via Resend SDK

Existing email functions: `sendContactEmail()`, `sendRequirementEmail()`
New Need/Offering modals follow the same pattern.

## Reference Files
- `/per-group-connect-main/` — React/Vite reference app for the new visual aesthetic.
  All page sections, component patterns, colour tokens, and glass morphism effects
  should be derived from this reference.
- `/per-group-connect-main/WeConnect_PRD.docx` — Product Requirements Document for WeConnect.

## Changelog
Every time you make a meaningful change (new file, schema change, new component,
config change), append an entry to CHANGELOG.md using the format defined there.
Do not skip this step.

## Security Log
SECURITY.md is a running log of security-relevant decisions.
You MUST append an entry to SECURITY.md whenever you:
- Create or modify a Supabase client (client.ts or server.ts)
- Define or alter RLS policies or schema permissions
- Add, modify, or expose any environment variable
- Configure Payload admin access or collection-level access control
- Add any API route that reads or writes to Supabase
- Make any decision where you are uncertain of the security implication

Do not batch entries — write one entry per decision, immediately after the decision is made.
If you are deferring a security concern because it is out of v1 scope, mark it DEFERRED 
and state when it should be revisited.

## Hallucination Guards
- Never assume Supabase table names — always check /src/lib/supabase/schema.ts first
- Never assume Payload collection slugs — always check /src/payload/collections/
- Never install a new package without stating why and confirming the package name exactly
- If unsure about a Payload v3 API — say so, do not guess
