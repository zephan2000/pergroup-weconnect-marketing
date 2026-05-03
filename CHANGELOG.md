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
[2026-03-16] ADD [src/lib/analytics/firebase.ts] — Firebase Analytics init; SSR-guarded; dynamic import of firebase/analytics; isSupported() check
[2026-03-16] ADD [src/components/AnalyticsProvider.tsx] — Client component wrapping root layout; calls initFirebase() on mount
[2026-03-16] MODIFY [src/app/layout.tsx] — Wired AnalyticsProvider into root layout body
[2026-03-16] STUB [src/lib/auth/weconnect-auth.stub.ts] — IWeConnectAuth interface + stub implementation; all methods throw NotImplementedError
[2026-03-16] MODIFY [package.json] — STACK DEVIATION: next ^14.2.0 → ^15.0.0, react/react-dom ^18.3.0 → ^19.0.0, @types/react* ^18 → ^19, eslint-config-next ^14 → ^15. Forced by @payloadcms/next@3.79.0 dropping Next.js 14 peer dependency.
[2026-03-16] ADD [src/app/(marketing)/layout.tsx] — Route group layout; scopes bg-bg/text-pg-text/font-syne to marketing routes only, preventing bleed into Payload admin
[2026-03-16] MODIFY [src/app/layout.tsx] — Removed marketing body classes; admin /create-first-user was inheriting our dark bg and breaking Payload's CSS
[2026-03-16] MODIFY [src/app/globals.css] — Removed body background/color; moved to (marketing) layout
[2026-03-16] MODIFY [src/app/(marketing)/] — Migrated home page and all platform routes into (marketing) route group
[2026-03-16] MODIFY [src/app/(marketing)/layout.tsx] — Moved globals.css import here from root layout; Tailwind preflight now scoped to marketing routes only
[2026-03-16] MODIFY [src/app/layout.tsx] — Removed globals.css import; Tailwind/preflight must not apply to Payload admin routes
[2026-03-16] MODIFY [package.json] — Security pin: react/react-dom → exact 19.2.4. next/eslint-config-next corrected to 15.4.11 (15.3.6 was below @payloadcms/next@3.79.0 peer dep minimum of 15.3.9; 15.4.11 is highest minor in allowed range and fully patched against all known 15.x CVEs).
[2026-03-17] MODIFY [src/app/globals.css] — Added CSS @keyframes for marketing animations (pulse, shimmer, marquee, spinSlow, scrollLine, gdotGlow). Scoped to marketing routes only via (marketing)/layout.tsx import.
[2026-03-17] MODIFY [src/payload/blocks/HeroBlock.ts] — Added stats array field (number, label, chineseLabel) to support right-column stat cards in the hero section.
[2026-03-17] ADD [src/components/Nav.tsx] — Fixed top navigation bar: PER GROUP logo, section anchor links, WeConnect CTA. Server component.
[2026-03-17] ADD [src/components/Footer.tsx] — Site footer: 4-column grid with brand, platform links, services, philosophy. Server component.
[2026-03-17] MODIFY [src/app/(marketing)/layout.tsx] — Wired Nav and Footer into marketing layout so they appear on all marketing routes.
[2026-03-17] MODIFY [src/app/(marketing)/page.tsx] — Removed redundant <main> wrapper (now in marketing layout).
[2026-03-17] MODIFY [src/components/blocks/HeroBlock.tsx] — Full implementation: hero grid, animated eyebrow, shimmer headline, Chinese subtitle, CTA buttons, stat cards (auto-splits last two into side-by-side card), scroll hint.
[2026-03-17] MODIFY [src/components/blocks/StatsBlock.tsx] — Full implementation: standalone stat card row with amber gradient numbers.
[2026-03-17] MODIFY [src/components/blocks/ValuesBlock.tsx] — Full implementation: Four Harmonies panel (concentric rings + spokes), Five Unities panel (CSS spinning petals), motto row.
[2026-03-17] MODIFY [src/components/blocks/AboutBlock.tsx] — Full implementation: two-column layout, body paragraphs, 2×2 advantages grid, animated globe visualisation with meridians, parallels, and glowing dots.
[2026-03-17] MODIFY [src/components/blocks/ServicesBlock.tsx] — Full implementation: 3-column bordered grid of service cards with number, icon, title, Chinese title, description, and arrow.
[2026-03-17] MODIFY [src/components/blocks/PlatformTeaserBlock.tsx] — Full implementation: feature list with coloured dots, mini mockup UI, click-through overlay to /platform/spaces.
[2026-03-17] MODIFY [src/components/blocks/ClientsBlock.tsx] — Full implementation: CSS marquee with mask fade edges; client list duplicated for seamless infinite loop.
[2026-03-17] ADD [src/scripts/seed.ts] — Payload local API seed script; creates "home" page with all 6 blocks pre-populated from reference content. Guards against duplicate runs.
[2026-03-17] ADD [src/scripts/fix-next-env.cjs] — CJS patch loaded via tsx --require; fixes Payload loadEnv.js crash on Node 24 + tsx due to CJS/ESM interop: @next/env.default is undefined in CJS mode but Payload's esbuild output incorrectly accesses .default.
[2026-03-17] ADD [src/app/@weconnect/default.tsx] — Parallel route slot default; returns null so non-platform routes don't 404 on the @weconnect slot.
[2026-03-17] ADD [src/app/@weconnect/(.)platform/spaces/page.tsx] — Intercepting route: activates on client-side nav to /platform/spaces; renders WeConnectOverlay with activeTab="spaces".
[2026-03-17] ADD [src/app/@weconnect/(.)platform/funding/page.tsx] — Intercepting route for /platform/funding → overlay with Funding tab.
[2026-03-17] ADD [src/app/@weconnect/(.)platform/markets/page.tsx] — Intercepting route for /platform/markets → overlay with Markets tab.
[2026-03-17] ADD [src/components/WeConnectOverlay.tsx] — Full-screen slide-up overlay client component. Apple liquid-glass effect: backdrop-filter blur(32px) saturate(180%) on semi-transparent background so marketing page blurs behind. Tabs switch via router.replace(); close via router.back(). Contains SpacesContent with mock listings, PlaceholderContent for Funding/Markets.
[2026-03-17] MODIFY [src/app/layout.tsx] — Added weconnect: React.ReactNode parallel slot prop; renders {weconnect} after {children} inside AnalyticsProvider.
[2026-03-17] MODIFY [src/components/blocks/HeroBlock.tsx] — Replaced <a> with next/link <Link> for all CTA buttons so client-side navigation triggers the @weconnect intercepting route.
[2026-03-17] MODIFY [package.json] — seed script: tsx --require src/scripts/fix-next-env.cjs src/scripts/seed.ts
[2026-03-17] FIX [src/components/blocks/ValuesBlock.tsx] — Changed shorthand <> to <React.Fragment key={motto.label}> in motto map to resolve "Each child in a list should have a unique key prop" warning.
[2026-03-17] MODIFY [src/app/layout.tsx] — Removed @weconnect parallel slot prop; WeConnect overlay is now state-driven (not route-driven). Fixes "initialTree is not iterable" Next.js 15 router bug.
[2026-03-17] ADD [src/lib/weconnect/context.tsx] — WeConnectContext: open/close/activeTab state shared between trigger buttons and WeConnectOverlay via React context.
[2026-03-17] ADD [src/lib/weconnect/platform-settings.ts] — PlatformSettingsData interface and DEFAULT_PLATFORM_SETTINGS; shared between Payload global and WeConnectOverlay.
[2026-03-17] ADD [src/payload/globals/PlatformSettings.ts] — Payload global for WeConnect overlay copy (AI matching headline/description/placeholder, Funding/Markets placeholder texts). CMS editors can update without a code deploy.
[2026-03-17] MODIFY [payload.config.ts] — Registered PlatformSettings global.
[2026-03-17] ADD [src/app/actions/weconnect.ts] — Server action wrapping getSpacesListings(); keeps Supabase queries server-side when called from the client overlay.
[2026-03-17] ADD [src/components/WeConnectTrigger.tsx] — Client button component that calls open() from WeConnectContext; replaces /platform/* <Link> elements in Nav and HeroBlock.
[2026-03-17] ADD [src/components/HeroCTAButtons.tsx] — Client component for HeroBlock CTA buttons; /platform/* hrefs and variant=weconnect open the overlay, all others render as <a>.
[2026-03-17] MODIFY [src/components/WeConnectOverlay.tsx] — Full rewrite: context-driven (no router); settings prop from Payload global; real Supabase listings via fetchSpacesListings server action with loading/error/empty states; SpaceCard accepts Listing type.
[2026-03-17] MODIFY [src/app/(marketing)/layout.tsx] — Added WeConnectProvider, async fetchPlatformSettings() from Payload (falls back to defaults), WeConnectOverlay rendered outside page div.
[2026-03-17] MODIFY [src/components/Nav.tsx] — Replaced /platform/* <Link> elements with WeConnectTrigger client components.
[2026-03-17] MODIFY [src/components/blocks/HeroBlock.tsx] — Replaced inline <Link> CTA buttons with HeroCTAButtons client component.
[2026-03-17] ADD [src/components/CursorEffect.tsx] — Custom cursor effect: amber dot + trailing ring + canvas particle background with grid, proximity glow, and connection lines. Disabled on touch devices.
[2026-03-17] CONFIG [payload.config.ts] — Added i18n with zh (Simplified Chinese) support; registered SiteSettings global; added admin.livePreview config with responsive breakpoints.
[2026-03-17] MODIFY [src/payload/collections/Pages.ts, Users.ts] — Added bilingual { en, zh } labels for all collection and field labels.
[2026-03-17] MODIFY [src/payload/blocks/*.ts] — Added bilingual { en, zh } labels for all 7 block definitions (field labels, descriptions, select options).
[2026-03-17] MODIFY [src/payload/globals/PlatformSettings.ts] — Added bilingual labels; converted fundingPlaceholderBody and marketsPlaceholderBody from textarea to richText.
[2026-03-17] ADD [src/payload/globals/SiteSettings.ts] — Payload global for CMS-driven color palette (amber, green, bg, bg2, text, muted, line). Empty fields fall back to globals.css defaults.
[2026-03-17] MODIFY [src/app/(marketing)/layout.tsx] — Fetches SiteSettings colors and injects as CSS custom property overrides on root div; added CursorEffect component.
[2026-03-17] MODIFY [src/payload/blocks/AboutBlock.ts] — Replaced bodyParagraphs array with single body richText field.
[2026-03-17] MODIFY [src/payload/blocks/PlatformTeaserBlock.ts] — Converted body from textarea to richText.
[2026-03-17] MODIFY [src/components/blocks/AboutBlock.tsx] — Renders body via RichText component instead of paragraph map.
[2026-03-17] MODIFY [src/components/blocks/PlatformTeaserBlock.tsx] — Renders body via RichText component instead of plain text.
[2026-03-17] MODIFY [src/components/WeConnectOverlay.tsx] — PlaceholderContent handles richText or string description via RichText component.
[2026-03-17] ADD [src/components/RefreshRouteOnSave.tsx] — Client wrapper for Payload Live Preview; triggers router.refresh() on document save.
[2026-03-17] MODIFY [src/app/(marketing)/page.tsx] — Added RefreshRouteOnSave for live preview support.
[2026-03-17] MODIFY [src/lib/weconnect/platform-settings.ts] — Updated PlatformSettingsData type: fundingPlaceholderBody and marketsPlaceholderBody now accept richText or string.
[2026-03-17] MODIFY [src/payload/collections/Pages.ts] — Enabled drafts (Save Draft / Publish workflow) with autosave (1.5s interval). No maxPerDoc limit — all versions kept indefinitely. Updated read access: public sees published only, authenticated editors see all.
[2026-03-17] ADD [src/app/api/draft/route.ts] — Draft mode API: validates PAYLOAD_SECRET, enables Next.js draftMode, redirects to page. Used by Payload Live Preview iframe.
[2026-03-17] ADD [src/app/api/exit-draft/route.ts] — Exit draft mode API: disables draftMode, redirects to /.
[2026-03-17] MODIFY [payload.config.ts] — Live Preview URL now routes through /api/draft to enable draftMode in the preview iframe.
[2026-03-17] MODIFY [src/app/(marketing)/page.tsx] — Fetches draft content when draftMode is enabled; renders RefreshRouteOnSave only in draft mode.
[2026-03-17] MODIFY [src/components/RefreshRouteOnSave.tsx] — Removed iframe guard; uses window.location.origin fallback for serverURL.
[2026-03-17] RISK — Unbounded page versions: maxPerDoc is not set on the Pages collection. All draft versions are kept indefinitely in cms.pages_v. Monitor with: SELECT count(*) FROM cms.pages_v; To cap: add maxPerDoc to versions config in src/payload/collections/Pages.ts.
[2026-03-17] MODIFY [src/payload/collections/Pages.ts] — Disabled autosave (changed from autosave interval to drafts: true). Changes only save on explicit Save Draft / Publish click.
[2026-03-17] ADD [src/payload/components/PreviewButton.tsx] — Custom preview button replacing Payload's default eye icon. Shows "Open Preview" with external-link icon. Opens draft in new tab via /api/draft.
[2026-03-17] ADD [src/payload/components/LanguageToggle.tsx] — Admin header button (🌐) to toggle between English and Chinese. Uses Payload's switchLanguage API.
[2026-03-17] MODIFY [src/app/api/draft/route.ts] — Draft route now accepts PAYLOAD_SECRET (server-side) or validates payload-token cookie (client-side preview button). No DB connection used for auth.
[2026-03-17] MODIFY [src/app/layout.tsx] — Root layout returns children directly (no html/body). Prevents nested html hydration error with Payload admin.
[2026-03-17] ADD [src/app/fonts.ts] — Font definitions extracted from root layout (Next.js disallows non-standard exports from layouts).
[2026-03-17] DELETE [src/app/@weconnect/] — Removed dead parallel route directory. WeConnect overlay is now state-driven via context.
[2026-03-17] CONFIG [payload.config.ts] — Switched to Supabase transaction mode pooler (port 6543). Added prepare: false for compatibility. Bumped pool max to 5.
[2026-03-17] FIX [src/components/CursorEffect.tsx] — Added instanceof Element guard for el.matches() to handle non-Element event targets.
[2026-03-17] FIX [src/components/RefreshRouteOnSave.tsx] — Fixed postMessage error: only renders when NEXT_PUBLIC_PAYLOAD_URL is set. Removed iframe guard for draft mode compatibility.
[2026-03-18] FIX [src/app/(payload)/admin/[[...segments]]/page.tsx] — Added `export const dynamic = 'force-dynamic'` to prevent Next.js 15 from caching the admin page, which was bypassing Payload's server-side auth check.
[2026-03-18] ADD [middleware.ts] — Next.js middleware protecting /admin routes. Checks for payload-token cookie; redirects unauthenticated requests to /admin/login. Defense-in-depth layer alongside Payload's RootPage JWT validation.
[2026-03-18] ADD [src/app/api/auth/logout/route.ts] — Dedicated logout route handler. Clears the payload-token cookie via cookies().delete() and redirects to /admin/login. Runs in isolation from Payload's page components so nothing can re-set the cookie.
[2026-03-18] FIX [middleware.ts] — Logout now returns a full HTML response with Set-Cookie and JS redirect. All previous approaches (redirect with cookie delete, pass-through with cookie expire, API route handler redirect) failed because Payload's client-side navigation uses fetch() internally, and Set-Cookie headers in fetch redirect chains aren't reliably processed. Full HTML response forces a hard page load.
[2026-03-18] FIX [payload.config.ts] — Added `import type { PoolConfig } from 'pg'` and `as PoolConfig` type assertion on the pool config to fix build error. The `prepare: false` option is accepted at runtime by pg but not in the PoolConfig type definition.
[2026-03-18] FIX [src/middleware.ts] — Moved middleware from project root to src/. Next.js requires middleware at the same level as the app directory. The file at root was silently ignored — none of the auth/logout fixes were executing.
[2026-03-26] ADD [weconnect/] — Data ingestion pipeline: Firecrawl scraping, Claude Haiku extraction, OpenAI embeddings, Supabase upsert for 4 sources (JTC, JustCo, WeWork, CommercialGuru).
[2026-03-26] MODIFY [weconnect/ → src/] — Integrated pipeline into main app. Moved API routes to src/app/api/ingest and src/app/api/search. Moved lib files to src/lib/weconnect/. Deleted standalone weconnect/ directory.
[2026-03-26] FIX [src/lib/weconnect/extract.ts] — Strip markdown fences from LLM JSON responses. Added multi-extract mode (extractSpaces) for search result pages with multiple listings.
[2026-03-26] FIX [src/lib/weconnect/sources/jtc.ts, commercialguru.ts] — JTC: use extractSpaces for multi-listing pages. CommercialGuru: fixed URL, switched from crawlSite to scrapePage, added content length check.
[2026-03-26] SCHEMA [weconnect.spaces] — Added search_text tsvector column with trigger-based population. GIN index for full-text search. Combines name, operator, district, description, amenities, industries into searchable tokens.
[2026-03-26] SCHEMA [weconnect.hybrid_search_spaces] — New RPC function implementing hybrid search: vector cosine similarity + BM25-style full-text search fused with Reciprocal Rank Fusion (RRF). Replaces pure vector match_spaces for AI search mode.
[2026-03-26] ADD [src/hooks/useSpacesSearch.ts] — Client-side search hook with two modes: filter (chip-based facet filtering + text matching) and AI (semantic search via /api/search). Auto-resets to filter mode when query cleared.
[2026-03-26] MODIFY [src/components/WeConnectOverlay.tsx] — Two-mode search UI: filter chips (default) with dynamic facet counts + AI semantic search toggle via Tab key. Pulsing dots animation for AI loading. Bilingual NL detection banner.
[2026-03-27] ADD [src/lib/weconnect/email.ts] — Resend email utility: sendContactEmail() and sendRequirementEmail() with HTML templates. Server-only.
[2026-03-27] ADD [src/app/api/contact/route.ts] — POST endpoint for space introduction requests. Validates fields, sends email via Resend. TODO: Google Sheets integration.
[2026-03-27] ADD [src/app/api/requirement/route.ts] — POST endpoint for requirement submissions. Validates fields, sends email via Resend. TODO: Google Sheets integration.
[2026-03-27] MODIFY [src/payload/globals/PlatformSettings.ts] — Added two collapsible field groups: Contact Modal (heading, success messages, detail row labels) and Requirement Modal (heading, description, success messages). CMS-editable modal copy.
[2026-03-27] MODIFY [src/lib/weconnect/platform-settings.ts] — Extended PlatformSettingsData with 11 new fields for modal copy + defaults.
[2026-03-27] MODIFY [src/app/(marketing)/layout.tsx] — Maps new PlatformSettings modal fields into the settings object passed to WeConnectOverlay.
[2026-03-27] ADD [src/components/weconnect/ModalBackdrop.tsx] — Shared modal backdrop: glassmorphism blur, click-outside-to-close, Escape key (capture phase, stops propagation so overlay stays open), fade-in transition. z-index 2100.
[2026-03-27] ADD [src/components/weconnect/SpaceDetailModal.tsx] — Space detail view + contact form. Shows type badge, name, location, AI match bar, detail rows (Size/Zone/Setup/Lease/Price from schema), amenity tags, contact form. State machine: idle → loading → success | error.
[2026-03-27] ADD [src/components/weconnect/PostRequirementModal.tsx] — Requirement submission form. Type dropdown (5 options), company, location, budget, description, email. Same state machine. Bilingual placeholders.
[2026-03-27] MODIFY [src/components/WeConnectOverlay.tsx] — Wired modal state (selectedSpace, showRequirementModal). "Connect" button on SpaceCard opens SpaceDetailModal. "+ Post Requirement" topbar button opens PostRequirementModal. Both modals rendered at end of JSX tree.

[2026-04-14] MODIFY [src/app/fonts.ts] — Font swap: Syne→Sora, Noto Serif SC→Noto Sans SC, dropped Syne Mono
[2026-04-14] MODIFY [tailwind.config.ts] — Updated color palette to warm amber light-mode default, added dark mode support via 'class', added slide-up/fade-in/dot-pulse animations, new font families (sora, noto-sans-sc)
[2026-04-14] MODIFY [src/app/globals.css] — Light-mode default CSS variables, .dark overrides, glass morphism utilities (.glass, .glass-dark, .glass-card, .glass-light, .glass-light-scrolled), new keyframes
[2026-04-14] MODIFY [src/app/(marketing)/layout.tsx] — font-syne→font-sora class
[2026-04-14] CONFIG [package.json] — Added lucide-react dependency for icons
[2026-04-14] ADD [src/components/DotMotif.tsx] — Decorative SVG sunburst dot motif component
[2026-04-14] MODIFY [src/components/Nav.tsx] — Converted to client component with glass navbar, scroll detection, mobile hamburger menu, Tailwind classes
[2026-04-14] MODIFY [src/components/blocks/HeroBlock.tsx] — Restyled with DotMotif, glass stat cards, Tailwind classes, light-mode default
[2026-04-14] MODIFY [src/components/blocks/ValuesBlock.tsx] — Glass cards for Four Harmonies + Five Unities, hover effects, Tailwind classes
[2026-04-14] MODIFY [src/components/blocks/AboutBlock.tsx] — Timeline with gradient lines, brand pillars as glass cards, DotMotif
[2026-04-14] MODIFY [src/components/blocks/ServicesBlock.tsx] — 6-service grid with Lucide icons, glass card hover effects
[2026-04-14] MODIFY [src/components/blocks/ClientsBlock.tsx] — Partner types + regional presence grids with Lucide icons, glass cards
[2026-04-14] MODIFY [src/components/blocks/StatsBlock.tsx] — Stats bar with warm gradient background
[2026-04-14] MODIFY [src/components/blocks/PlatformTeaserBlock.tsx] — WeConnect teaser CTA with DotMotif, WeConnectTrigger
[2026-04-14] MODIFY [src/components/Footer.tsx] — Dark bg footer with bilingual content, Tailwind classes
[2026-04-14] MODIFY [src/components/HeroCTAButtons.tsx] — Converted from inline styles to Tailwind classes
[2026-04-14] MODIFY [src/lib/weconnect/context.tsx] — WeConnectTab changed from 'spaces'|'funding'|'markets' to 'needs'|'alerts'|'profile'
[2026-04-14] MODIFY [src/components/WeConnectTrigger.tsx] — Default tab changed to 'needs'
[2026-04-14] MODIFY [src/components/WeConnectOverlay.tsx] — Decomposed into thin shell with sidebar (Lucide icons), mobile bottom nav, composing NeedsScreen/AlertsScreen/ProfileScreen
[2026-04-14] ADD [src/components/weconnect/SpacesContent.tsx] — Extracted Spaces browser (search bar, facets, cards) from WeConnectOverlay
[2026-04-14] ADD [src/components/weconnect/NeedsScreen.tsx] — Post a Need + Share an Offering cards + embedded SpacesContent
[2026-04-14] ADD [src/components/weconnect/AlertsScreen.tsx] — Advisory alerts with severity levels (preview/coming-soon)
[2026-04-14] ADD [src/components/weconnect/ProfileScreen.tsx] — Stub user profile, company info, settings
[2026-04-14] MODIFY [src/lib/weconnect/email.ts] — Added sendNeedEmail() + sendOfferingEmail() with HTML templates
[2026-04-14] ADD [src/app/api/need/route.ts] — POST handler for need submissions via Resend
[2026-04-14] ADD [src/app/api/offering/route.ts] — POST handler for offering submissions via Resend
[2026-04-14] MODIFY [CLAUDE.md] — Updated for new design system, tab structure, email patterns, reference files
[2026-04-14] MODIFY [src/app/CLAUDE.md] — Updated route docs, WeConnect overlay tab names, new API routes
[2026-04-14] MODIFY [src/payload/CLAUDE.md] — Updated PlatformSettings docs
[2026-04-14] MODIFY [src/lib/CLAUDE.md] — Updated context.tsx tab types, email.ts docs
[2026-04-26] FIX [src/components/blocks/ClientsBlock.tsx] — ESLint: prefix unused headline prop with _
[2026-04-26] FIX [src/components/blocks/ValuesBlock.tsx] — ESLint: prefix unused headline prop with _
[2026-04-26] FIX [src/components/weconnect/ProfileScreen.tsx] — ESLint: remove unused User import
[2026-04-26] FIX [src/components/Nav.tsx] — CTA button text-white→text-pg-text for light-mode contrast
[2026-04-26] FIX [src/components/HeroCTAButtons.tsx] — Same text-white→text-pg-text fix
[2026-04-26] FIX [src/components/blocks/PlatformTeaserBlock.tsx] — Same text-white→text-pg-text fix
[2026-04-26] ADD [src/components/blocks/ValuesBlockClassic.tsx] — Original dark concentric-ring/spinning-petal design preserved for A/B testing
[2026-04-26] MODIFY [src/components/WeConnectOverlay.tsx] — Restyled from dark --wc-* palette to warm light aesthetic (bg-bg, glass-card, glass-light)
[2026-04-26] MODIFY [src/components/weconnect/NeedsScreen.tsx] — Premium gradient CTA cards with DotMotif watermark, warm light palette
[2026-04-26] MODIFY [src/components/weconnect/AlertsScreen.tsx] — Warm light aesthetic (glass-card, text-pg-text, amber accents)
[2026-04-26] MODIFY [src/components/weconnect/ProfileScreen.tsx] — Warm light aesthetic with DotMotif
[2026-04-26] MODIFY [src/components/weconnect/SpacesContent.tsx] — Swapped --wc-* dark vars to --text/--muted/--line/--faint
[2026-04-26] MODIFY [src/components/weconnect/ModalBackdrop.tsx] — Warm white modal bg, subtle shadow, light border
[2026-04-26] MODIFY [src/components/weconnect/PostRequirementModal.tsx] — Cream inputs, gradient submit button, light text
[2026-04-26] MODIFY [src/components/weconnect/SpaceDetailModal.tsx] — Warm light treatment, gradient CTA, --text/--muted vars
[2026-04-26] ADD [public/e-harbour-logo.png] — E-Harbor logo for navbar and WeConnect topbar
[2026-04-26] MODIFY [src/components/Nav.tsx] — Replaced polygon "P" with E-Harbor logo via next/image; added button bg to WeConnect nav link; solid amber CTA
[2026-04-26] MODIFY [src/components/WeConnectOverlay.tsx] — E-Harbor logo in topbar; added next/image import
[2026-04-26] MODIFY [src/components/weconnect/NeedsScreen.tsx] — Removed SpacesContent rendering (component preserved for future use)
[2026-04-26] MODIFY [src/components/blocks/ValuesBlock.tsx] — Restored concentric-ring + spinning-petal visualizations adapted to warm light palette
[2026-04-26] ADD [src/components/ScrollReveal.tsx] — IntersectionObserver-based scroll reveal for .reveal elements
[2026-04-26] MODIFY [src/app/globals.css] — Added .reveal/.visible CSS, stagger delays (d1-d4), hero fadeUp keyframes
[2026-04-26] MODIFY [src/app/(marketing)/layout.tsx] — Added ScrollReveal component
[2026-04-26] MODIFY [src/components/blocks/HeroBlock.tsx] — Hero staggered fadeUp entrance animations
[2026-04-26] MODIFY [src/components/blocks/AboutBlock.tsx] — Added reveal classes (left/right staggered)
[2026-04-26] MODIFY [src/components/blocks/ServicesBlock.tsx] — Added reveal classes (heading + cards)
[2026-04-26] MODIFY [src/components/blocks/ClientsBlock.tsx] — Added reveal classes (heading, partner grid, regions)
[2026-04-26] MODIFY [src/components/blocks/StatsBlock.tsx] — Added reveal class
[2026-04-26] MODIFY [src/components/blocks/PlatformTeaserBlock.tsx] — Added reveal class
[2026-04-26] FIX [src/components/WeConnectTrigger.tsx] — Removed inline style overrides (background:'none') that clobbered Tailwind bg-amber class
[2026-04-26] MODIFY [src/lib/weconnect/email.ts] — RequirementPayload expanded: added subject, goalAlignment, timeline, contactName, contactTitle, contactPhone. ContactPayload expanded: added title, phone, inquiryType, budget, timeline. Email templates restyled to warm light palette with section headers.
[2026-04-26] MODIFY [src/app/api/requirement/route.ts] — Updated validation for new fields (contactName required, subject/goalAlignment/timeline/contactTitle/contactPhone optional)
[2026-04-26] MODIFY [src/app/api/contact/route.ts] — Added optional title, phone, inquiryType, budget, timeline fields
[2026-04-26] MODIFY [src/components/weconnect/PostRequirementModal.tsx] — Restructured into 4 sections: Basic Info (subject, inquiry type), Requirement Details (description, goal, location), Commercial Parameters (budget, timeline), Contact Card (name, title, company, email, phone)
[2026-04-26] MODIFY [src/components/weconnect/SpaceDetailModal.tsx] — Added job title and phone fields to contact form

[2026-04-29] ADD [docs/improvements/] — Persistent agent-friendly plan for 5 improvements (cursor, validation UX, Sheets, user ack, i18n toggle). Master README + 5 phase files + TEAM_REVIEW + 3 infrastructure design docs.
[2026-04-29] ADD [src/lib/i18n/context.tsx] — I18nProvider, useLocale, useStrings hooks. localStorage-persisted EN/CN locale state with navigator.language detection on first visit.
[2026-04-29] ADD [src/lib/i18n/strings.ts] — UI string dictionary for EN and ZH (nav, forms, weconnect, footer keys).
[2026-04-29] ADD [src/components/LanguageToggle.tsx] — EN | 中文 toggle button component. Active lang in amber.
[2026-04-29] ADD [scripts/validate.sh] — Validation harness running TypeScript + ESLint + Next.js build. Phase-end gate.
[2026-04-29] ADD [scripts/setup-sheets.ts] — Idempotent Google Sheets setup script. Creates 4 tabs (Contact, Requirement, Need, Offering) with header rows.
[2026-04-29] ADD [scripts/README.md] — Documentation for the scripts folder.
[2026-04-29] CONFIG [package.json] — Added googleapis dependency, dotenv devDep, npm scripts: sheets:setup, validate.
[2026-04-29] MODIFY [.env.local.example] — Documented RESEND_FROM_EMAIL_INTERNAL, RESEND_FROM_EMAIL_USER, GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_KEY.
[2026-04-29] MODIFY [SECURITY.md] — Logged new env vars; added Vercel production env vars checklist for the improvements plan.
[2026-04-29] CONFIG [tsconfig.json] — Excluded per-group-connect-main (reference Vite app) and scripts/ from type-check scope.

[2026-05-03] MODIFY [src/components/CursorEffect.tsx] — Phase 1: Light-mode redesign. Removed mix-blend-mode, added border + shadow to dot, deep-orange canvas particles, dim warm grid lines.
[2026-05-03] FIX [scripts/validate.sh] — TypeScript error grep now matches `error TSnnnn:` pattern only, ignoring npm notices.
[2026-05-03] ADD [src/components/weconnect/FormField.tsx] — Phase 2: Shared label + input wrapper. Renders bilingual label, red asterisk for required, inline error below.
[2026-05-03] MODIFY [src/components/weconnect/PostRequirementModal.tsx] — Phase 2: Per-field validation (errors on submit then live-validate), required hint at top, all inputs wrapped in FormField.
[2026-05-03] MODIFY [src/components/weconnect/SpaceDetailModal.tsx] — Phase 2: Same per-field validation pattern for the contact form.
[2026-05-03] PIVOT [docs/improvements/03-google-sheets.md] — Switched from Service Account to OAuth refresh-token auth. Owner's Google Workspace org policy blocks service accounts.
[2026-05-03] ADD [src/lib/weconnect/sheets.ts] — Phase 3: OAuth-based Google Sheets client with appendSubmission(). Graceful degradation if env vars missing.
[2026-05-03] ADD [src/app/api/admin/sheets-oauth/init/route.ts] — Phase 3: OAuth consent redirect endpoint.
[2026-05-03] ADD [src/app/api/admin/sheets-oauth/callback/route.ts] — Phase 3: OAuth callback that displays refresh token for manual env paste.
[2026-05-03] MODIFY [scripts/setup-sheets.ts] — Phase 3: Use OAuth client + refresh token instead of service account.
[2026-05-03] MODIFY [src/app/api/contact/route.ts] — Phase 3: Wired appendSubmission after email send.
[2026-05-03] MODIFY [src/app/api/requirement/route.ts] — Phase 3: Wired appendSubmission after email send.
[2026-05-03] MODIFY [src/app/api/need/route.ts] — Phase 3: Wired appendSubmission after email send.
[2026-05-03] MODIFY [src/app/api/offering/route.ts] — Phase 3: Wired appendSubmission after email send.
[2026-05-03] MODIFY [.env.local.example] — Phase 3: New OAuth env vars (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN), removed obsolete SERVICE_ACCOUNT_KEY.
[2026-05-03] MODIFY [SECURITY.md] — Phase 3: Logged OAuth pivot, public OAuth endpoints risk note (deferred), updated Vercel env checklist.