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
[2026-05-03] MODIFY [src/lib/weconnect/email.ts] — Phase 4: Added detectLocale(), FROM_EMAIL_INTERNAL/USER constants, sendContactAck/sendRequirementAck/sendNeedAck/sendOfferingAck. Bilingual ack templates with thank-you + echo of submitted fields. Falls back to legacy RESEND_FROM_EMAIL.
[2026-05-03] MODIFY [src/app/api/contact/route.ts] — Phase 4: Wired user ack send after internal email. Tracks email_status='partial' if internal succeeds but ack fails.
[2026-05-03] MODIFY [src/app/api/requirement/route.ts] — Phase 4: Same ack wiring.
[2026-05-03] MODIFY [src/app/api/need/route.ts] — Phase 4: Same ack wiring.
[2026-05-03] MODIFY [src/app/api/offering/route.ts] — Phase 4: Same ack wiring.

[2026-05-04] MODIFY [src/app/api/admin/sheets-oauth/callback/route.ts] — Added inline reminder banner on token capture page warning about ~7-day refresh token expiry in OAuth Testing mode.
[2026-05-04] MODIFY [docs/improvements/03-google-sheets.md] — New "Operational note: refresh token expiry" section with detection signals, regeneration steps, and verification publishing trade-off.
[2026-05-04] MODIFY [docs/improvements/TEAM_REVIEW.md] — Added recurring maintenance entry for Sheets OAuth refresh token.

# ─────────────────────────────────────────────────────────────────────────────
# Phase 5 (commit 8c553b8) was REVERTED on 2026-05-04 due to a Drizzle schema
# push conflict in production. The historical entries below describe what was
# attempted; they are preserved here for traceability. See revert commit and
# docs/improvements/TEAM_REVIEW.md for the proper-migration plan.
# ─────────────────────────────────────────────────────────────────────────────
[2026-05-04] MODIFY [src/lib/i18n/context.tsx] — Phase 5 (REVERTED): Cookie-aware I18nProvider.
[2026-05-04] ADD [src/lib/i18n/server.ts] — Phase 5 (REVERTED): getServerLocale().
[2026-05-04] MODIFY [src/lib/i18n/strings.ts] — Phase 5 (REVERTED): Expanded dictionary.
[2026-05-04] MODIFY [payload.config.ts] — Phase 5 (REVERTED): Added localization config — destructive against existing CMS columns.
[2026-05-04] MODIFY [src/payload/blocks/HeroBlock.ts] — Phase 5 (REVERTED): localized:true on text fields.
[2026-05-04] MODIFY [src/payload/blocks/StatsBlock.ts] — Phase 5 (REVERTED): localized:true on label.
[2026-05-04] MODIFY [src/payload/blocks/ValuesBlock.ts] — Phase 5 (REVERTED): localized:true on text fields.
[2026-05-04] MODIFY [src/payload/blocks/AboutBlock.ts] — Phase 5 (REVERTED): localized:true on text + body richText.
[2026-05-04] MODIFY [src/payload/blocks/ServicesBlock.ts] — Phase 5 (REVERTED): localized:true on title/description/sectionLabel.
[2026-05-04] MODIFY [src/payload/blocks/PlatformTeaserBlock.ts] — Phase 5 (REVERTED): localized:true on text + body.
[2026-05-04] MODIFY [src/app/(marketing)/layout.tsx] — Phase 5 (REVERTED): Server cookie read, locale into Payload queries.
[2026-05-04] MODIFY [src/app/(marketing)/page.tsx] — Phase 5 (REVERTED): locale to payload.find().
[2026-05-04] MODIFY [src/components/Nav.tsx] — Phase 5 (REVERTED): LanguageToggle, dictionary nav links.
[2026-05-04] MODIFY [src/components/Footer.tsx] — Phase 5 (REVERTED): Dictionary footer copy.
[2026-05-04] MODIFY [src/components/blocks/HeroBlock.tsx] — Phase 5 (REVERTED): Locale-aware subtitle resolution.
[2026-05-04] MODIFY [src/components/WeConnectOverlay.tsx] — Phase 5 (REVERTED): Localized topbar/sidebar.
[2026-05-04] MODIFY [src/components/weconnect/NeedsScreen.tsx] — Phase 5 (REVERTED): Localized.
[2026-05-04] MODIFY [src/components/weconnect/AlertsScreen.tsx] — Phase 5 (REVERTED): Localized.
[2026-05-04] MODIFY [src/components/weconnect/ProfileScreen.tsx] — Phase 5 (REVERTED): Localized.
[2026-05-04] MODIFY [src/components/weconnect/PostRequirementModal.tsx] — Phase 5 (REVERTED): Localized errors, body.lang.
[2026-05-04] MODIFY [src/components/weconnect/SpaceDetailModal.tsx] — Phase 5 (REVERTED): Same.

[2026-05-04] REVERT [Phase 5 commit 8c553b8] — Reverted Phase 5 in full. Cause: enabling Payload localization triggered Drizzle schema push that wanted to drop ~30 existing columns (with CMS data) on production. Vercel cannot answer the interactive y/N prompt → all page renders 500'd. Production DB was NOT modified (push aborted before any DDL ran). Repository now back to Phase 4 state. Proper Phase 5 retry requires writing a data-preserving Payload migration; tracked in TEAM_REVIEW.md.

[2026-05-04] ADD [docs/improvements/infrastructure/cms-backup-runbook.md] — SOP for CMS backups before Payload migrations. In-DB schema clone (Option A), pg_dump (Option B), Supabase dashboard (Option C). Verification SQL. Restore commands. Cleanup cadence.
[2026-05-04] BACKUP [Supabase cms schema → cms_backup_20260504] — Pre-Phase-5 backup. 46 tables, 1,254 rows verified ✓ via in-DB clone. Drop after Phase 5 stable in prod 48h+.
[2026-05-04] MODIFY [docs/improvements/README.md] — Linked the cms-backup-runbook from the operational runbooks section + folder map.
[2026-05-04] MODIFY [docs/improvements/TEAM_REVIEW.md] — Added "CMS backup runbook" reference for migration workflows.

[2026-05-04] MODIFY [payload.config.ts] — Phase 5 retry: Set `push: process.env.NODE_ENV !== 'production'` on postgres adapter. Auto-push enabled in local dev (fast iteration), disabled in production (Vercel) where migrations + hand-edits are the only path. Prevents the recurrence of the Drizzle auto-push crash that revert 465450f addressed.

[2026-05-04] MODIFY [payload.config.ts, src/payload/blocks/*.ts] — Phase 5 retry: re-enabled localization config; marked text fields as localized:true on Hero/Stats/Values/About/Services/PlatformTeaser blocks. Legacy chinese* companion fields kept as fallback.
[2026-05-04] ADD [src/lib/i18n/{context.tsx,server.ts,strings.ts}] — Phase 5 retry: Cookie-aware I18nProvider, getServerLocale() for SSR, expanded EN/ZH dictionary.
[2026-05-04] MODIFY [src/components/{Nav,Footer,WeConnectOverlay,LanguageToggle}.tsx] — Phase 5 retry: localized via dictionary; LanguageToggle in nav (desktop + mobile).
[2026-05-04] MODIFY [src/components/blocks/HeroBlock.tsx] — Phase 5 retry: locale-aware subtitle (new localized → legacy chineseSubtitle fallback).
[2026-05-04] MODIFY [src/components/weconnect/{NeedsScreen,AlertsScreen,ProfileScreen,PostRequirementModal,SpaceDetailModal}.tsx] — Phase 5 retry: localized labels, validation errors, body.lang in form submissions.
[2026-05-04] MODIFY [src/app/(marketing)/{layout,page}.tsx] — Phase 5 retry: server reads cookie via getServerLocale, passes locale into Payload findGlobal/find queries.
[2026-05-04] ADD [src/migrations/20260504_161402_localize_blocks.{ts,json}] — Phase 5 retry: Payload migration with HAND-WRITTEN data preservation. Creates 28 _locales tables, copies existing English column values into _locale='en' rows, copies legacy chinese_* companion data into _locale='zh' rows, then drops the old columns. Reversible via down() function.
[2026-05-04] MODIFY [src/migrations/index.ts] — Registered the new migration.

[2026-05-05] ADD [docs/improvements/zh-translation-worklist.md] — Phase 5b.1: Full inventory of every text rendered on the site. 53 ZH-MISSING CMS fields + ~12 mixed-locale strings + ~80 dictionary keys + 3 hardcoded arrays catalogued, with proposed CMS field path for each.
[2026-05-05] ADD [docs/improvements/05b-cms-everything.md] — Phase 5b plan doc: move EVERY rendered string into CMS, with phased rollout (5b.2 schema → 5b.3 component refactor in 4 sub-commits → 5b.4 SQL-driven translation fill → 5b.5 drop legacy chinese* companions). Locked decisions captured.
[2026-05-05] MODIFY [docs/improvements/README.md] — Added Phase 5b row + sub-phase status table. Updated locked decisions: EN+CN side-by-side banned, dictionary becomes thin fallback, lite dropdown control, hero ZH 3-line constraint, SQL-driven translation workflow.

[2026-05-06] ADD [src/payload/globals/{NavSettings,FooterSettings,WeConnectSettings,RequirementFormSettings,ContactFormSettings}.ts] — Phase 5b.2: 5 new globals, every text field localized:true. Pattern: rendering UI strings live in CMS so admin can edit without code deploy.
[2026-05-06] MODIFY [src/payload/blocks/{AboutBlock,ClientsBlock,ServicesBlock,HeroBlock}.ts] — Phase 5b.2: added milestones array (AboutBlock), partnerTypes/regions arrays + networkSubtitle/regionsHeading (ClientsBlock), subtitle (ServicesBlock), scrollHintLabel (HeroBlock). Replaces hardcoded JS arrays in component files (deletion deferred to 5b.3c).
[2026-05-06] MODIFY [payload.config.ts] — Phase 5b.2: registered 5 new globals + added them to livePreview.globals.
[2026-05-06] SCHEMA [src/migrations/20260506_010000_phase5b2_globals_arrays.ts] — Phase 5b.2: hand-written additive migration. 17 new tables (5 global parents + 5 global locales + 6 block array tables + 1 new clients_locales) plus matching _pages_v_* version tables; 4 ALTER ADD COLUMN; 2 enum types; pre-population INSERT statements seed all globals (en+zh) plus milestones/partnerTypes/regions/clients_locales/hero scrollHint/services subtitle. Applied via scripts/apply-migration.mjs since Payload CLI is broken on Node v24 + tsx 4.21.
[2026-05-06] ADD [scripts/apply-migration.mjs] — Manual migration runner. Reads SQL from a migration's up() template literal, applies via raw pg client inside BEGIN/COMMIT, records name in cms.payload_migrations. Skips if already recorded. Workaround for the Payload CLI ESM resolution failure on Node v24.
[2026-05-06] ADD [scripts/dry-run-migration.mjs] — Dry-run migrations inside BEGIN/ROLLBACK to validate SQL before commit.
[2026-05-06] ADD [scripts/check-cms-state.mjs, scripts/verify-5b2.mjs, scripts/patch-services-zh.mjs] — Phase 5b.2 verification + post-migration patch (insert missing ZH parent row for ServicesBlock locales since the previous Phase 5 migration only seeded EN).
[2026-05-06] MODIFY [docs/improvements/infrastructure/cms-backup-runbook.md] — Documented "Known blocker: Payload CLI broken on Node v24 + tsx 4.21" — workaround, root cause, fix options. Required reading before any future migration.
[2026-05-06] MODIFY [docs/improvements/{05b-cms-everything,README}.md] — Marked Phase 5b.2 done; 5b.3a is next.

[2026-05-06] ADD [src/lib/cms/site-text.ts] — Phase 5b.3a: NavSettingsData + FooterSettingsData types + DEFAULT_* fallbacks. Mirrors src/lib/weconnect/platform-settings.ts pattern.
[2026-05-06] MODIFY [src/app/(marketing)/layout.tsx] — Phase 5b.3a: fetch nav-settings + footer-settings globals (locale-aware) via Payload, pass typed objects as props to Nav and Footer.
[2026-05-06] MODIFY [src/components/Nav.tsx] — Phase 5b.3a: takes `settings: NavSettingsData` prop, no longer reads from i18n strings dictionary. Removed `useStrings()` import.
[2026-05-06] MODIFY [src/components/Footer.tsx] — Phase 5b.3a: takes `settings: FooterSettingsData` + `nav: NavSettingsData` + `locale` props. Removed EN+CN side-by-side rendering of `eHarborTag` (was `{eHarborTag} · {eHarborTagCn}`) — now renders the locale-correct value only. pillarLine reads from CMS (translated per locale).
[2026-05-06] MODIFY [src/components/LanguageToggle.tsx] — Phase 5b.3a: accepts `ariaLabel` prop sourced from NavSettings.languageToggleAria so admin can edit the screen-reader label.
[2026-05-06] MODIFY [src/lib/i18n/strings.ts] — Phase 5b.3a: removed entire `nav.*` namespace from EN + ZH dicts. Removed `footer.{tagline,mission,missionCn,copyright,pillarLine,eHarborTagCn}` from both locales. Kept `footer.eHarborTag` only — last consumer is WeConnectOverlay.tsx, refactored in 5b.3b. Dict shrinks from ~80 keys to ~70.

[2026-05-07] MODIFY [src/lib/cms/site-text.ts] — Phase 5b.3b: WeConnectSettingsData type + DEFAULT_WECONNECT_SETTINGS (24 fields covering tabs, Needs/Alerts/Profile screens, settings menu).
[2026-05-07] MODIFY [src/app/(marketing)/layout.tsx] — Phase 5b.3b: fetch weconnect-settings global locale-aware, pass `weconnect`, `eHarborTag`, and `locale` through to WeConnectOverlay.
[2026-05-07] MODIFY [src/components/WeConnectOverlay.tsx] — Phase 5b.3b: takes `weconnect: WeConnectSettingsData`, `eHarborTag: string`, `locale: Locale` props. Removed useStrings(). Tab labels and enterpriseUser now CMS-sourced; eHarborTag passed in from FooterSettings.
[2026-05-07] MODIFY [src/components/weconnect/NeedsScreen.tsx] — Phase 5b.3b: takes `weconnect` + `locale` props. CTA cards (postNeed, shareOffering), preview/coming-soon badges, recentNeeds heading all CMS-sourced. Sample preview content (alerts, recent need cards) stays hardcoded as mock content.
[2026-05-07] MODIFY [src/components/weconnect/AlertsScreen.tsx] — Phase 5b.3b: takes `weconnect` + `locale` props. Heading + preview/coming-soon badges CMS-sourced. Sample alerts hardcoded mock content.
[2026-05-07] MODIFY [src/components/weconnect/ProfileScreen.tsx] — Phase 5b.3b: takes `weconnect` + `locale` props. All section headings, settings menu labels, member info CMS-sourced. Sample posts/company fields/update-profile CTA stay locale-aware in code (mock content + minor CTA — flagged for 5b.4 if owner wants further CMS control).
[2026-05-07] MODIFY [src/lib/i18n/strings.ts] — Phase 5b.3b: removed entire `weconnect.*` namespace from EN + ZH. Removed remaining `footer.eHarborTag` from both. Dict now contains only `languageToggle`, `forms`, and `hero` (the latter two pending 5b.3c/5b.3d). Dict shrinks from ~70 keys to ~50.

[2026-05-07] MODIFY [src/components/blocks/HeroBlock.tsx] — Phase 5b.3c: reads `scrollHintLabel` from CMS (replaces `t.hero.scrollHint`). Removed `useStrings()` and `chineseSubtitle` fallback logic — Payload's locale fallback handles empty ZH automatically. Locale-aware font class applied per element.
[2026-05-07] MODIFY [src/components/blocks/AboutBlock.tsx] — Phase 5b.3c: now async server component. Reads `milestones[]` from CMS instead of a 4-item hardcoded `milestones` array. Uses getServerLocale() for the per-locale font class. Dropped the hardcoded ZH "连接东西方的桥梁" subtitle paragraph.
[2026-05-07] MODIFY [src/components/blocks/ClientsBlock.tsx] — Phase 5b.3c: now async server component. Reads `partnerTypes[]`, `regions[]`, `networkSubtitle`, `regionsHeading` from CMS. Dropped the hardcoded `partnerTypes` (4 items) and `regions` (6 items) JS consts and the hardcoded ZH `遍布全球的合作伙伴网络` / `区域覆盖` strings. Icon enum mapped via `ICON_MAP` to Lucide components (Globe / Building2 / Handshake / Award).
[2026-05-07] MODIFY [src/components/blocks/ServicesBlock.tsx] — Phase 5b.3c: now async server component. Reads `subtitle` from CMS (replaces hardcoded `<p>全方位全球化服务</p>`). Dropped the side-by-side `chineseTitle` rendering on each service item — `title` is now locale-correct via Payload localization. Locale-aware font class applied per element.
[2026-05-07] MODIFY [src/lib/i18n/strings.ts] — Phase 5b.3c: removed `hero.*` namespace from EN + ZH (last consumer was scrollHint, now CMS-sourced). Dict shrinks from ~50 keys to ~45 (now only `languageToggle` + `forms`). `forms.*` cleared in 5b.3d.

[2026-05-07] MODIFY [src/lib/cms/site-text.ts] — Phase 5b.3d: RequirementFormSettingsData (50+ fields) + ContactFormSettingsData (10 fields) types + DEFAULT_* fallbacks for both.
[2026-05-07] MODIFY [src/app/(marketing)/layout.tsx] — Phase 5b.3d: fetch requirement-form-settings + contact-form-settings globals locale-aware, thread `requirementForm` + `contactForm` props through WeConnectOverlay.
[2026-05-07] MODIFY [src/components/weconnect/FormField.tsx] — Phase 5b.3d: dropped `labelZh` prop. Single-locale label only. Optional `labelClassName` prop lets parents apply `font-noto-sans-sc` for ZH locale. Removes the EN+CN side-by-side rendering pattern from every form field on the site.
[2026-05-07] MODIFY [src/components/weconnect/PostRequirementModal.tsx] — Phase 5b.3d: takes `requirementForm: RequirementFormSettingsData` + `locale: Locale` props. Every section heading, label, placeholder, button, dropdown option label, success/error message comes from CMS. Dropdown option `value` codes (`'office'`, `'lab'`, `'factory'`, `'funding'`, `'market-entry'`, `'other'` and timeline values) stay frozen — the API references them. Dropped the `settings: PlatformSettingsData` prop entirely.
[2026-05-07] MODIFY [src/components/weconnect/SpaceDetailModal.tsx] — Phase 5b.3d: takes `contactForm: ContactFormSettingsData` + `requirementForm: RequirementFormSettingsData` + `locale: Locale` props. Heading, success messages, send-introduction button, space-detail row labels (Size/Zone/Setup/Lease/Price), and field labels all CMS-sourced. AI Match Score line is locale-aware in code (not in CMS schema yet — flagged for 5b.4 if owner wants). Currently not rendered in v1 but kept ready for re-enable.
[2026-05-07] MODIFY [src/components/weconnect/NeedsScreen.tsx] — Phase 5b.3d: takes `requirementForm` prop instead of `settings: PlatformSettingsData`. Forwards to PostRequirementModal.
[2026-05-07] MODIFY [src/components/WeConnectOverlay.tsx] — Phase 5b.3d: takes `requirementForm` + `contactForm` props, threads `requirementForm` to NeedsScreen. The `settings: PlatformSettingsData` prop is kept (still consumed by AI matching headlines elsewhere) but no longer used by the form modals.
[2026-05-07] MODIFY [src/lib/i18n/strings.ts] — Phase 5b.3d: removed entire `forms.*` namespace from EN + ZH (~40 keys). Dict shrinks to `languageToggle` only (3 keys × 2 locales = 6 entries). `EN`/`中文` button labels stay as code constants because each button shows the *other* language's name regardless of current locale — they aren't locale-dependent values.

[2026-05-07] MODIFY [tailwind.config.ts] — Font fix: `font-sora` and `font-inter` stacks now fall back to Noto Sans SC for Chinese glyphs (`['var(--font-sora)', 'var(--font-noto-sans-sc)', 'sans-serif']`). Means a single span containing both Latin and Chinese text renders correctly without a className change. Decorative Chinese characters (Values/Stats blocks) keep their explicit `font-noto-sans-sc` class — they're brand iconography per the locked design decision.
[2026-05-07] MODIFY [src/components/blocks/{HeroBlock,AboutBlock,ClientsBlock,ServicesBlock}.tsx] — Stripped all `locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'` conditionals. Each component uses `font-sora` only — the Sora stack handles both EN and ZH. HeroBlock dropped `'use client'` and `useLocale` (no remaining client-side state). AboutBlock, ClientsBlock, ServicesBlock dropped `getServerLocale()` and the `async` modifier (no longer need locale for rendering decisions). Components are now pure render-from-props.
[2026-05-07] MODIFY [src/components/Footer.tsx] — Stripped locale conditional + `locale` prop. Wrapper has `font-sora`. Single font for both locales.
[2026-05-07] MODIFY [src/components/weconnect/{NeedsScreen,AlertsScreen,ProfileScreen,PostRequirementModal,SpaceDetailModal}.tsx] — Stripped all `labelFont` / `headingFont` / `cnFont` / `${locale === 'zh' ? ...}` patterns. Each screen wraps content in `font-sora`. Form modals inherit Sora from body. SpaceDetailModal uses `className="font-sora"` on h2/h3/h4/button.
[2026-05-07] MODIFY [src/components/weconnect/FormField.tsx] — Dropped `labelClassName` prop. Label always renders in `font-inter` (which falls back to Noto Sans SC for Chinese glyphs).
[2026-05-07] MODIFY [src/components/LanguageToggle.tsx] — Calls `router.refresh()` after `setLocale()` so server components re-fetch CMS data in the new locale on the same URL — no full page reload, no manual refresh required by user. Removed the explicit `font-noto-sans-sc` class on the `中文` button (the Sora stack now handles it).
[2026-05-07] MODIFY [src/app/(marketing)/layout.tsx] — Footer no longer takes `locale` prop (it doesn't need one anymore).
[2026-05-07] ADD [src/components/LivePreviewWidthWarning.tsx] — Banner shown only inside the Payload Live Preview iframe when viewport < 768px (md breakpoint where the desktop nav collapses to a hamburger). Prompts editors to switch to the Desktop breakpoint or open the preview in a new tab so the full navbar is visible.
[2026-05-07] MODIFY [src/app/(marketing)/layout.tsx] — Reads draftMode() and renders <LivePreviewWidthWarning isDraft={isDraft} /> above <Nav /> so the warning only appears in CMS preview, never on the public site.
[2026-05-07] MODIFY [src/components/Nav.tsx] — Moved EN | 中文 toggle out of the mobile hamburger dropdown into the always-visible mobile nav bar (next to the hamburger button) so users can switch language without opening the menu. Removed the duplicate toggle row from the dropdown.
[2026-05-07] ADD [src/payload/blocks/VideoBlock.ts] — New page block: single YouTube video embed. Fields: youtubeUrl (required), caption (localized), aspectRatio (16:9/9:16/4:3/1:1), autoplay, loop, startSeconds. YouTube-only by design — Supabase Storage free tier (50MB/file, 5GB egress/mo) doesn't fit marketing-video usage; YouTube provides free CDN + adaptive bitrate. Google Drive sources rejected (no clean `<video>` streaming). Admin description instructs editors to upload to YouTube as Unlisted.
[2026-05-07] ADD [src/components/blocks/VideoBlock.tsx] — Renderer: parses YouTube URL (watch / youtu.be / shorts / embed) → iframe to youtube-nocookie.com (privacy-enhanced; no cookies until interaction). Responsive aspect-ratio container, lazy-loaded, autoplay forces mute (browser policy), loop uses single-video playlist trick.
[2026-05-07] MODIFY [src/payload/collections/Pages.ts] — Registered VideoBlock in the Pages blocks array.
[2026-05-07] MODIFY [src/components/BlockRenderer.tsx] — Added 'video' → VideoBlock dispatch.
[2026-05-07] MODIFY [src/payload/CLAUDE.md] — Documented VideoBlock in the block list.
[2026-05-07] MODIFY [src/components/Footer.tsx] — Footer brand mark now matches the navbar. Replaced the hexagon "P" placeholder with the e-harbour logo image, wrapped in a warm-white circular background (bg-bg) so the multicolor dot pattern reads cleanly against the dark footer instead of clashing.
[2026-05-07] ADD [src/payload/globals/OfferingFormSettings.ts] — New Payload global for the supplier-side "Share an Offering" form. Sections: Basic, Capability, Availability & Coverage, Contact. Frozen option codes (category, availability) keep API contract stable.
[2026-05-07] ADD [src/components/weconnect/PostOfferingModal.tsx] — Dedicated supplier offering modal posting to /api/offering. Distinct from PostRequirementModal (the Need form); separate state in NeedsScreen so the two cards open different modals.
[2026-05-07] ADD [src/lib/cms/site-text.ts] — OfferingFormSettingsData type + DEFAULT_OFFERING_FORM_SETTINGS fallback values.
[2026-05-07] MODIFY [payload.config.ts] — Registered OfferingFormSettings global. livePreview.url now branches per global slug to append ?preview=<form-tag> so editors auto-land in the right modal.
[2026-05-07] MODIFY [src/app/api/draft/route.ts] — Forwards optional ?preview=<tag> query to redirect target so client components can detect preview intent.
[2026-05-07] MODIFY [src/components/WeConnectOverlay.tsx] — Reads ?preview=need-form|offering-form, opens overlay + activates Needs tab + signals NeedsScreen which modal to auto-open.
[2026-05-07] MODIFY [src/components/weconnect/NeedsScreen.tsx] — Split into separate state for Need vs Offering modals (previously both buttons opened the requirement modal). Added `autoOpen` prop driven by the preview hook.
[2026-05-07] MODIFY [src/app/(marketing)/layout.tsx] — Fetches offering-form-settings global and threads OfferingFormSettingsData through to WeConnectOverlay.
[2026-05-07] MODIFY [src/payload/globals/RequirementFormSettings.ts, src/lib/cms/site-text.ts] — UX rename Requirement → Need. Admin label "Need Form Settings", "Need Details" section title, EN defaults "Post a Need" / "Submit Need" / "Need Details". Slug, file path, types, API contract, and DB tables unchanged.

[2026-05-07] ADD [scripts/{survey-cms-i18n,dump-en-rows,dry-run-sql,apply-sql,zh-translations-fill.sql}] — Phase 5b.4: SQL-driven ZH translation fill. Survey + per-row dump audited which fields were ZH-empty or contained mixed-locale strings. The SQL splits 7 mixed-locale EN strings (UPDATE on the EN row to drop the Chinese half) and inserts/upserts 30+ ZH rows across Hero (eyebrow + 3-line headline + 2 CTA labels), About (parent + 4 advantages), Services (parent + 6 service items with ZH descriptions), Values (parent + 4 four-harmonies items + 5 five-unities items + 3 mottos with split labels), and PlatformTeaser (parent + 3 features with split titles). Idempotent via `ON CONFLICT (_locale, _parent_id) DO UPDATE` and exact-match WHERE on EN UPDATEs. Dry-run + apply via `scripts/{dry-run-sql,apply-sql}.mjs`.
[2026-05-07] DATA [cms.* locales] — Phase 5b.4 applied on prod. Post-survey verification: only 3 fields show "ZH = EN" and all 3 are intentional (`WeConnect ✦` brand mark in NavSettings, `WeConnect —` headline in PlatformTeaser, `your@email.com` + `+65 xxxx xxxx` form placeholders).
[2026-05-07] MODIFY [docs/improvements/README.md] — Marked 5b.4 done; 5b.5 (drop legacy `chinese*` columns) is next, gated on 48h prod stability.

[2026-05-07] ADD [scripts/rename-requirement-to-need.sql] — One-shot UX rename for the live `requirement-form-settings` EN locale row. Updates `heading` ("Post a Requirement" → "Post a Need"), `button_submit` ("Submit Requirement" → "Submit Need"), `section_requirement` ("Requirement Details" → "Need Details"). Idempotent — only rewrites if the cell still holds the verbatim old string, preserving any editor customisations. Slug, file path, types, API contract, and DB schema unchanged.

[2026-05-07] FIX [src/components/CursorEffect.tsx] — Cursor canvas was hidden behind every positioned section (Hero, PlatformTeaser, About, Clients) because the canvas at `z-index:0` and those sections (`position:relative` + `bg-bg`) shared the same painting layer, with the sections later in tree order. Promoted canvas to `z-index:1` so it paints in the positive-z-index layer above section backgrounds (Nav z-500, inner content z-10, and cursor dot/ring z-9998/9999 still render above it). Also added the reference's sunburst bubble trail — bubbles spawn on mouse move and fade — alongside the existing ambient particle network, so there is now a real cursor trail effect site-wide.

[2026-05-07] MODIFY [src/components/weconnect/PostRequirementModal.tsx, src/components/weconnect/PostOfferingModal.tsx] — Unified the submit-CTA design across both forms: same amber→deep-orange gradient (was green→amber on the Offering form). Added an `isFormComplete` live readiness check that mirrors `validate()` without writing error state — the button is `disabled`, dimmed to `opacity:0.4`, and shows `cursor:not-allowed` until every required field is filled (and the email contains "@"). Loading state keeps the existing wait-cursor + dots indicator at `opacity:0.7`. No API or copy changes.

[2026-05-07] MODIFY [src/components/CursorEffect.tsx] — Reworked into fairy-dust trail. Removed the ambient particle network + grid + connection lines (felt too "strong"/structured). The remaining trail uses tiny soft-glow specks (radius 0.6–2.2, alpha 0.25–0.50) with biased-upward `vy` (−0.18 base + ±0.225 jitter) and randomised `vx` (±0.4) so the cloud floats up but no two specks trace the same path. Spawn radius widened from 8 → 32 px to break the "line behind the cursor" feel; spawn rate eased from 30 → 55 ms; cap lowered from 120 → 80. Each speck draws an outer halo at 18% of its alpha for soft glow without per-particle `shadowBlur`. Bumped canvas `z-index: 1 → 9000` so the trail paints above ModalBackdrop (2100) and WeConnectOverlay (2000) — the cursor dot/ring (9999/9998) still render above the canvas.

[2026-05-07] SCHEMA [src/payload/globals/*.ts, src/app/(marketing)/layout.tsx] — Enabled draft/published versioning on all 8 globals (Nav, Footer, Platform, Site, WeConnect, RequirementForm, OfferingForm, ContactForm). Previously every save hit the live record so editing a global immediately changed production. Now editors get the standard "Save Draft" + "Publish" buttons; production renders the published version, the Live Preview iframe (which is opened via /api/draft and so has draftMode enabled) renders the in-progress draft. Implementation: added `versions: { drafts: true }` to each global, threaded `isDraft` from Next.js `draftMode()` through `fetchPayloadData()` so each `findGlobal()` call passes `draft: isDraft`. Pages collection already had this wiring (see (marketing)/page.tsx); this brings globals to parity. Migration: in dev Drizzle auto-push will create the `cms.<global>_versions` tables on next server start; on prod, run `npx payload migrate:create` then `npx payload migrate`. Existing global rows stay as-is and continue to render as "published"; the first edit after deploy will create a draft that requires explicit Publish to go live.

[2026-05-07] SCHEMA [src/payload/blocks/VideoBlock.ts + Supabase prod cms.*] — Applied the draft-versioning schema push to prod via `next dev` (Drizzle push: NODE_ENV !== 'production'). Drizzle's pull/diff initially flagged a DATA LOSS warning unrelated to the drafts work: the prior autoplayMode rename (eb2b305) had removed the legacy `autoplay` checkbox from the Payload schema while leaving the column on disk by design (Phase 5b.5 stability pattern, see commit body). Re-declared `autoplay` as a hidden ghost field (`admin: { hidden: true }`) so Drizzle keeps the column. Verified post-push: `pages_blocks_video.autoplay`, `pages_blocks_video.autoplay_mode`, and the matching `_pages_v_blocks_video` columns all intact; new tables created in `cms` schema → `_<slug>_v` for all 8 globals plus `_<slug>_v_locales` for the 6 with localized fields (none for site_settings, platform_settings).

[2026-05-07] STYLE [src/components/Nav.tsx, src/components/Footer.tsx] — Tightened the "PER GROUP" wordmark letter-spacing from `tracking-[2px]` → `tracking-[0.5px]` on both nav and footer. Same value in both spots so the wordmark looks identical above and below the page.
