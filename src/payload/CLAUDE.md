# CLAUDE.md — /src/payload (Payload v3 CMS)

## Collections (Page Block Architecture)
Each marketing page section maps to a Payload block type.
Blocks defined here, rendered in Next.js via a BlockRenderer component.

## Block List (rendering restyled for warm amber/glass aesthetic — schemas unchanged)
- HeroBlock: eyebrow text, headline, subheadline, Chinese subtitle, CTA buttons
- StatsBlock: array of stat items (number, label, Chinese label)
- ValuesBlock: four harmonies items, five unities items, motto fields
- AboutBlock: headline, body copy, advantages array, globe stat
- ServicesBlock: array of service items (number, icon, title, Chinese title, description)
- PlatformTeaserBlock: headline, body, features array, launch CTA label
- ClientsBlock: array of client name strings (marquee)

## Globals
- SiteSettings: Color palette overrides (amber, green, bg, bg2, text, muted, line)
- PlatformSettings: WeConnect overlay copy (Needs/Alerts/Profile tab headings,
  modal labels, placeholders). Fetched server-side in (marketing)/layout.tsx.

## Rules
- Payload v3 uses Drizzle ORM — never write raw SQL for CMS tables, use collections API
- All Payload tables live in the `cms` Supabase schema
- Do not add fields to collections without updating this file
- Block fields should use Payload's built-in field types — no custom plugins unless specified
- The admin panel is for PER GROUP non-technical staff — keep field labels human-readable

## Security Rules
- The Payload /admin route must never be publicly indexed — confirm 
  robots.txt disallows /admin and log this to SECURITY.md.
- Collection-level access control: by default all collections should be 
  read-only for public access. Log any collection that deviates from this.
- If you add a Payload API route or REST endpoint, log it to SECURITY.md 
  with the access level it requires.
