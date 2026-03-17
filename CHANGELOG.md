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