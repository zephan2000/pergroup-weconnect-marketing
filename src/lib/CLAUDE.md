# CLAUDE.md — /src/lib (Shared Utilities & Data Access)

## Structure
/src/lib/supabase/
  client.ts          → Supabase browser client (anon key)
  server.ts          → Supabase server client (service role, server components only)
  schema.ts          → TypeScript types for all weconnect schema tables — source of truth
  
/src/lib/weconnect/
  context.tsx        → WeConnectProvider + useWeConnect hook
                       Tab type: 'needs' | 'alerts' | 'profile'
                       State: isOpen, activeTab, open(), close(), setActiveTab()
  listings.ts        → Queries against weconnect.spaces table (used in NeedsScreen)
  email.ts           → Resend email functions (server-only):
                       - sendContactEmail(data)   → space introduction request
                       - sendRequirementEmail(data) → requirement submission
                       - sendNeedEmail(data)       → need submission (new)
                       - sendOfferingEmail(data)   → offering submission (new)
  platform-settings.ts → PlatformSettingsData type + defaults for overlay copy
  embed.ts           → Generate embeddings for search
  openrouter.ts      → LLM API client
  extract.ts         → Data extraction logic
  firecrawl.ts       → Web crawling
  ingest-db.ts       → Database ingestion

/src/lib/auth/
  weconnect-auth.stub.ts  → Stubbed auth interface with TODO comments — DO NOT implement yet

/src/lib/analytics/
  firebase.ts        → Firebase Analytics init (web SDK only)

## Rules
- All Supabase queries go through /src/lib/ — never query Supabase directly in components
- schema.ts must be updated any time a Supabase table is created or altered
- Server client (service role key) must NEVER be imported in client components
- Firebase Analytics: only initialise if window is defined (SSR guard required)
- Email functions follow a consistent pattern: validate → build HTML template → send via Resend

## Security Rules
- server.ts uses the SERVICE_ROLE key — this must never be imported in any file 
  under /src/app/ that is or could be a client component. Log to SECURITY.md if 
  you create any server action or route handler that uses it.
- client.ts uses the ANON key — log to SECURITY.md if the anon key has access 
  to any table without RLS enabled.
- Any new Supabase query function must have a comment stating which Supabase 
  role executes it (anon or service_role).
