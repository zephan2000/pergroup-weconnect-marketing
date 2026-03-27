# SECURITY.md — PER GROUP × WeConnect

Running log of security-relevant decisions.
Format: [DATE] [SEVERITY] [FILE] — Decision + rationale.
Severities: INFO | WARN | DEFERRED

---

[2026-03-16] INFO [public/robots.txt] — Added `Disallow: /admin` to robots.txt.
  Payload CMS admin panel must never be publicly indexed. Satisfies requirement
  in /src/payload/CLAUDE.md security rules.

[2026-03-16] INFO [.env.local.example] — Documented all environment variables.
  SUPABASE_SERVICE_ROLE_KEY is server-only and explicitly labelled as such.
  DATABASE_URL gives direct DB access — must never be exposed to the browser.
  PAYLOAD_SECRET signs Payload JWTs — must be a strong random string in production.
  All NEXT_PUBLIC_FIREBASE_* vars are safe to expose (GA4 web SDK only, no admin SDK).

[2026-03-16] WARN [src/lib/supabase/client.ts] — Browser Supabase client uses anon key.
  The anon key is safe to expose only because RLS policies are in place.
  REQUIRED: enable RLS on weconnect.listings (and all weconnect.* tables) in Supabase
  before any public data access. Without RLS, the anon key allows full table reads/writes.
  Action: run `ALTER TABLE weconnect.listings ENABLE ROW LEVEL SECURITY;` in Supabase SQL
  editor, then define read policies before launch.

[2026-03-16] INFO [src/lib/supabase/server.ts] — Server Supabase client uses service-role key.
  Implemented as a factory function (createServerClient) to make intent explicit.
  This file must never be imported in any client component or any file under
  src/app/ that could be rendered client-side. Enforced by comment and convention.

[2026-03-16] INFO [src/payload/collections/Users.ts] — Payload Users collection has auth: true.
  This provides CMS editor login only. WeConnect user auth is NOT implemented (v1 scope).
  Default Payload access control: only authenticated users can create/update/delete.
  Public read is disabled on Users collection by default.

[2026-03-16] INFO [src/payload/collections/Pages.ts] — Pages collection is read-only for public.
  Access control: read = () => true (public), create/update/delete = authenticated only.
  This allows Next.js server components to fetch page content without credentials.

[2026-03-16] DEFERRED [src/lib/auth/weconnect-auth.stub.ts] — WeConnect user auth not implemented.
  All auth methods throw NotImplementedError. No session tokens are issued or stored.
  REVISIT: when WeConnect user auth is scoped for v2, evaluate Supabase Auth (built-in
  to the existing Supabase project) before introducing any third-party auth provider.
  See CLAUDE.md Authentication section.

[2026-03-16] WARN [weconnect schema] — Schema access granted via GRANT, not RLS.
  The following was run in Supabase:
    GRANT USAGE ON SCHEMA weconnect TO anon, authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA weconnect TO anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA weconnect GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

  GRANT USAGE is required and correct — PostgREST needs it to see the schema.

  RISK: RLS is NOT enabled on weconnect.listings. The anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY,
  which is public and exposed in the browser) currently has INSERT, UPDATE, and DELETE
  privileges on all weconnect.* tables. Any user who reads the page source can call the
  Supabase API and modify or delete listings data.

  This is acceptable for local development only.

  REQUIRED before production deployment:
    -- 1. Enable RLS (blocks all access by default until policies are added)
    ALTER TABLE weconnect.listings ENABLE ROW LEVEL SECURITY;

    -- 2. Add a read-only policy for anonymous users
    CREATE POLICY "Public can read listings"
      ON weconnect.listings FOR SELECT TO anon USING (true);

    -- 3. If only service_role (server-side) should write listings, add no INSERT/UPDATE/DELETE
    --    policies for anon — the server client bypasses RLS anyway.

  REVISIT: before first public/staging deployment.

[2026-03-16] INFO [package.json] — STACK DEVIATION: Next.js upgraded from 14 to 15.3.6 (pinned exact).
  react and react-dom pinned to exact version 19.2.4 (not a range) due to critical CVEs:
    CVE-2025-55182 (CVSS 10.0 — RCE in RSC) — affects 19.0.0, 19.1.0, 19.1.1, 19.2.0; fixed in 19.0.1/19.1.2/19.2.1
    CVE-2025-55183 (CVSS 5.3 — source code exposure) — same affected range
    CVE-2026-23864 (CVSS 7.5 — DoS) — fixed in 19.0.4/19.1.5/19.2.4
  19.2.4 is the fully patched version across all three CVEs.
  next pinned to 15.4.11 exact: highest minor satisfying @payloadcms/next@3.79.0 peer dep
    (>=15.2.9 <15.3.0 || >=15.3.9 <15.4.0 || >=15.4.11 <15.5.0). npm @latest resolves to 16.x.
  CVE-2025-29927 (CVSS 9.1 — middleware auth bypass): fixed in 15.2.3+, 15.4.11 is safe.
  CVE-2025-66478 / CVE-2025-55182 (CVSS 10.0 — RCE): fixed in 15.4.8+, 15.4.11 is safe.
  CVE-2025-55183 / CVE-2025-67779 (RSC DoS + source code exposure): fixed in 15.4.10+, 15.4.11 is safe.
  Node.js engines minimum bumped from 18.17.0 to 18.18.0 (Next.js 15 minimum).
  NOTE: React Server Component APIs do not follow semver between 19.x minors — exact pins are the safe strategy.
  NOTE: third-party libs may still declare peer deps of react ^16||^17||^18 — use --legacy-peer-deps if install fails.

[2026-03-16] INFO [package.json] — STACK DEVIATION: Next.js upgraded from 14 to 15 (initial entry).
  Reason: @payloadcms/next@3.79.0 (current Payload release) requires next@>=15.2.9.
  Next.js 14 peer dependency is no longer satisfied by any current Payload v3 release.
  React also updated from 18 to 19 (Next.js 15 default).
  Impact: App Router API is largely compatible. One notable Next.js 15 change is that
  cookies(), headers(), params, and searchParams are now async — no current project
  files use these synchronously, so no code changes needed.
  CLAUDE.md stack entry should be updated by project owner: Next.js 14 → Next.js 15.

[2026-03-16] INFO [payload.config.ts] — Payload secret configured via PAYLOAD_SECRET env var.
  If PAYLOAD_SECRET is empty or default, Payload will reject logins and warn at startup.
  Ensure a strong secret is set in production (see .env.local.example for generation command).

[2026-03-17] INFO [src/app/api/draft/route.ts] — Draft mode API route added. Validates `secret`
  query param against PAYLOAD_SECRET before enabling Next.js draftMode. Unauthenticated requests
  without the correct secret receive 401. Used by Payload Live Preview iframe URL.

[2026-03-17] INFO [src/payload/collections/Pages.ts] — Pages read access updated for drafts:
  Unauthenticated users only see `_status: 'published'` documents. Authenticated CMS editors
  see all documents including drafts. Prevents draft content from leaking to the public site.

[2026-03-17] WARN [src/payload/collections/Pages.ts] — Unbounded page versions: maxPerDoc is
  not set. All draft versions are kept indefinitely in `cms.pages_v` and related `cms._pages_v_*`
  tables. If editors make thousands of edits, these tables will grow unboundedly. To fix: add
  `maxPerDoc: N` to `versions` config and run a migration. Payload will auto-prune oldest versions
  silently (no user notification). Monitor with: `SELECT count(*) FROM cms.pages_v;`

[2026-03-17] INFO [src/app/api/draft/route.ts] — Draft route auth updated: accepts PAYLOAD_SECRET
  (for server-side livePreview iframe) or validates `payload-token` cookie (for client-side preview
  button). Cookie check avoids opening DB connections. No secret is exposed in client-side URLs.

[2026-03-17] INFO [payload.config.ts] — Switched DATABASE_URL to Supabase transaction mode pooler
  (port 6543). Disabled prepared statements (prepare: false). Transaction mode returns connections
  after each query, fixing MaxClientsInSessionMode errors on Vercel serverless. Pool max set to 5.

[2026-03-17] INFO [src/app/layout.tsx] — Root layout no longer renders <html>/<body>. Each route
  group owns its own document shell. This prevents Payload admin's <html> from nesting inside
  the marketing <html>, which caused hydration errors.

[2026-03-18] INFO [middleware.ts] — Created Next.js middleware to protect /admin routes.
  Defense-in-depth layer: checks for payload-token cookie presence before requests reach the
  Payload admin page component. Payload's RootPage performs authoritative JWT validation
  server-side; middleware only checks cookie existence (not validity).
  Public admin routes allowed without cookie: login, create-first-user, logout, forgot, reset,
  unauthorized, inactivity, verify. Sourced from @payloadcms/next isPublicAdminRoute.js.
  Matcher: ['/admin', '/admin/:path*'] — does not affect /api/*, /platform/*, or marketing routes.

[2026-03-18] INFO [src/app/(payload)/admin/[[...segments]]/page.tsx] — Added
  `export const dynamic = 'force-dynamic'` to prevent Next.js 15 from caching the admin page.
  Without this, static optimization could bypass Payload's server-side auth check in RootPage,
  allowing unauthenticated access to the admin panel.

[2026-03-18] INFO [middleware.ts] — Logout cookie deletion: middleware now returns a complete
  HTML response (not a redirect or pass-through) for /admin/logout. The response includes a
  Set-Cookie header that expires payload-token and a JavaScript redirect to /admin/login.
  Previous approaches all failed due to the same root cause: Payload's admin uses client-side
  navigation (<Link>), which means Next.js makes internal fetch() calls for RSC data.
  Set-Cookie headers within fetch redirect chains are not reliably processed by the browser.
  Returning a full HTML response forces a hard page load, guaranteeing Set-Cookie processing.
  The /api/auth/logout route handler remains as a fallback for direct navigation.

[2026-03-27] INFO [src/app/api/contact/route.ts] — Public POST endpoint (no auth required).
  Accepts contact form data and sends email to pergroup.sg@gmail.com via Resend.
  No database writes. No Supabase client used. Server-only: Resend API key never exposed.
  Rate limiting not implemented (v1 scope) — REVISIT before production to prevent abuse.

[2026-03-27] INFO [src/app/api/requirement/route.ts] — Public POST endpoint (no auth required).
  Accepts requirement form data and sends email to pergroup.sg@gmail.com via Resend.
  No database writes. No Supabase client used. Server-only: Resend API key never exposed.
  Rate limiting not implemented (v1 scope) — REVISIT before production to prevent abuse.

[2026-03-27] INFO [.env.local] — Added RESEND_API_KEY (server-only, not NEXT_PUBLIC_).
  Used by src/lib/weconnect/email.ts to initialise the Resend client.
  Optional RESEND_FROM_EMAIL to override sending address (defaults to onboarding@resend.dev).
  Neither variable is exposed to the browser.
