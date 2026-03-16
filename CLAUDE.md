# CLAUDE.md — PER GROUP × WeConnect

## Project Overview
Marketing website for PER GROUP (global tech innovation consultancy)
with WeConnect AI matchmaking platform embedded as a route group.

## Stack — LOCKED. Do not deviate without explicit instruction.
- Framework: Next.js 14 (App Router)
- CMS: Payload v3 (headless, Postgres adapter via Drizzle ORM)
- Database: Supabase (Postgres) — single DB for BOTH Payload CMS tables and WeConnect data
- Analytics: Firebase Analytics (GA4 web SDK only — NOT Firebase Admin, NOT Firestore)
- Deployment: Vercel
- Package manager: npm (never suggest pnpm or yarn)
- Styling: Tailwind CSS

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
- Spaces tab: FULLY implemented with live Supabase data
- Funding tab: Placeholder page only ("We're still building this out")
- Markets tab: Placeholder page only ("We're still building this out")
- Do not build data models or UI for Funding or Markets beyond the placeholder

## Reference File
The file at /reference/pergroup-website.html is the visual and structural
reference for the entire site. All page sections, copy, colour tokens,
and layout decisions should be derived from this file.
Do not invent sections, copy, or components not present in the reference.

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

