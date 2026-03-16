# CHANGELOG

Format: [DATE] [TYPE] [FILE/MODULE] — Description
Types: INIT | ADD | MODIFY | SCHEMA | FIX | STUB | CONFIG

---

[2026-03-16] INIT [package.json] — Declared dependencies: Next.js 14, Payload v3, @payloadcms/db-postgres, @payloadcms/richtext-lexical, @supabase/supabase-js, firebase
[2026-03-16] CONFIG [tsconfig.json] — TypeScript config with @/* src alias and @payload-config path alias
[2026-03-16] CONFIG [next.config.ts] — Next.js config wrapped with withPayload from @payloadcms/next
[2026-03-16] CONFIG [tailwind.config.ts] — Tailwind config with PER GROUP and WeConnect colour tokens from reference HTML
[2026-03-16] CONFIG [postcss.config.js] — PostCSS config for Tailwind + autoprefixer
[2026-03-16] CONFIG [payload.config.ts] — Payload v3 config: Postgres adapter (cms schema), Lexical editor, Users/Pages collections
[2026-03-16] ADD [src/app/globals.css] — Global CSS with Tailwind directives and CSS custom properties from reference
[2026-03-16] ADD [.env.local.example] — All required environment variables with comments
[2026-03-16] ADD [public/robots.txt] — Disallows /admin from indexing
[2026-03-16] ADD [SECURITY.md] — Security decisions log initialised
[2026-03-16] ADD [src/lib/supabase/client.ts] — Supabase browser client (anon key singleton)
[2026-03-16] ADD [src/lib/supabase/server.ts] — Supabase server client factory (service-role, server-only)
[2026-03-16] SCHEMA [src/lib/supabase/schema.ts] — TypeScript types for weconnect.listings; includes pgvector embedding stub; SQL CREATE TABLE comment included
[2026-03-16] ADD [src/lib/weconnect/listings.ts] — getSpacesListings and getListingById query functions; semantic search stubbed
[2026-03-16] ADD [src/payload/collections/Users.ts] — Payload Users collection with auth: true for CMS editor login
[2026-03-16] ADD [src/payload/collections/Pages.ts] — Payload Pages collection with blocks field; public read, auth-gated writes
[2026-03-16] ADD [src/payload/blocks/HeroBlock.ts] — Payload block definition: eyebrow, headline parts, Chinese subtitle, CTA buttons
[2026-03-16] ADD [src/payload/blocks/StatsBlock.ts] — Payload block definition: array of stat items
[2026-03-16] ADD [src/payload/blocks/ValuesBlock.ts] — Payload block definition: Four Harmonies, Five Unities, mottos
[2026-03-16] ADD [src/payload/blocks/AboutBlock.ts] — Payload block definition: headline, body, advantages, globe stat
[2026-03-16] ADD [src/payload/blocks/ServicesBlock.ts] — Payload block definition: array of service items
[2026-03-16] ADD [src/payload/blocks/PlatformTeaserBlock.ts] — Payload block definition: headline, body, features, CTA
[2026-03-16] ADD [src/payload/blocks/ClientsBlock.ts] — Payload block definition: marquee client names
[2026-03-16] STUB [src/components/blocks/HeroBlock.tsx] — Placeholder React component
[2026-03-16] STUB [src/components/blocks/StatsBlock.tsx] — Placeholder React component
[2026-03-16] STUB [src/components/blocks/ValuesBlock.tsx] — Placeholder React component
[2026-03-16] STUB [src/components/blocks/AboutBlock.tsx] — Placeholder React component
[2026-03-16] STUB [src/components/blocks/ServicesBlock.tsx] — Placeholder React component
[2026-03-16] STUB [src/components/blocks/PlatformTeaserBlock.tsx] — Placeholder React component
[2026-03-16] STUB [src/components/blocks/ClientsBlock.tsx] — Placeholder React component
[2026-03-16] ADD [src/components/BlockRenderer.tsx] — Maps blockType slugs to React components
[2026-03-16] ADD [src/app/layout.tsx] — Root layout: Google Fonts (Syne, Syne Mono, Noto Serif SC, Inter), CSS vars, metadata
[2026-03-16] ADD [src/app/page.tsx] — Home page: fetches Payload "home" slug, renders BlockRenderer
[2026-03-16] ADD [src/app/(payload)/api/[...slug]/route.ts] — Payload REST API handler (GET/POST/PATCH/DELETE)
[2026-03-16] ADD [src/app/(payload)/admin/[[...segments]]/page.tsx] — Payload admin panel route
[2026-03-16] ADD [src/app/(payload)/admin/[[...segments]]/not-found.tsx] — Admin 404 handler
[2026-03-16] ADD [src/app/platform/page.tsx] — Redirects /platform → /platform/spaces
[2026-03-16] STUB [src/app/platform/spaces/page.tsx] — WeConnect Spaces stub (v1 live data integration pending)
[2026-03-16] ADD [src/components/ComingSoon.tsx] — Shared coming-soon placeholder component
[2026-03-16] STUB [src/app/platform/funding/page.tsx] — Funding placeholder (v1 scope)
[2026-03-16] STUB [src/app/platform/markets/page.tsx] — Markets placeholder (v1 scope)