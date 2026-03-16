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

[2026-03-16] DEFERRED [weconnect schema] — RLS policies for weconnect.* tables not yet defined.
  The weconnect.listings table will hold commercial listing data. Before any public
  read access via the anon key, define explicit SELECT policies.
  Suggested starter policy (read-only, all rows):
    CREATE POLICY "Public listings are viewable by everyone"
    ON weconnect.listings FOR SELECT USING (true);
  REVISIT: before first public deployment.

[2026-03-16] INFO [payload.config.ts] — Payload secret configured via PAYLOAD_SECRET env var.
  If PAYLOAD_SECRET is empty or default, Payload will reject logins and warn at startup.
  Ensure a strong secret is set in production (see .env.local.example for generation command).
