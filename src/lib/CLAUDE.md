# CLAUDE.md — /src/lib (Shared Utilities & Data Access)

## Structure
/src/lib/supabase/
  client.ts          → Supabase browser client (anon key)
  server.ts          → Supabase server client (service role, server components only)
  schema.ts          → TypeScript types for all weconnect schema tables — source of truth
  
/src/lib/weconnect/
  listings.ts        → All queries against weconnect.listings table
  
/src/lib/auth/
  weconnect-auth.stub.ts  → Stubbed auth interface with TODO comments — DO NOT implement yet

/src/lib/analytics/
  firebase.ts        → Firebase Analytics init (web SDK only)

## Rules
- All Supabase queries go through /src/lib/ — never query Supabase directly in components
- schema.ts must be updated any time a Supabase table is created or altered
- Server client (service role key) must NEVER be imported in client components
- Firebase Analytics: only initialise if window is defined (SSR guard required)

## Security Rules
- server.ts uses the SERVICE_ROLE key — this must never be imported in any file 
  under /src/app/ that is or could be a client component. Log to SECURITY.md if 
  you create any server action or route handler that uses it.
- client.ts uses the ANON key — log to SECURITY.md if the anon key has access 
  to any table without RLS enabled.
- Any new Supabase query function must have a comment stating which Supabase 
  role executes it (anon or service_role).