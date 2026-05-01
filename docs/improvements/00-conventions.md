# 00 — Conventions (Read First)

Shared rules every phase of this plan follows. These supplement the project-wide CLAUDE.md.

## Validation harness

Every phase ends with a green run of:

```bash
bash scripts/validate.sh
```

This runs in order:
1. TypeScript: `npx tsc --noEmit` (must exit 0; errors in `per-group-connect-main/` are excluded)
2. ESLint: `npm run lint` (must exit 0)
3. Next.js build: `npm run build` (must succeed)

If any step fails, **fix before committing**. Do not commit a broken intermediate state.

## Commit conventions

- One commit per phase (or two: "infra" + "feature" if logically separable)
- Commit message format:
  ```
  <imperative summary, ≤72 chars>

  <body explaining why and what>

  Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
  ```
- Push to `main` after each phase

## Documentation requirements

Every phase MUST update:

1. **CHANGELOG.md** — append an entry per file modified (format: `[YYYY-MM-DD] TYPE [path] — Description`)
2. **The phase's `.md` file in `docs/improvements/`** — mark Status as ✅ Done at the top, add a "Completed" timestamp
3. **`docs/improvements/README.md` status table** — flip ⏳ Pending → ✅ Done

When a phase touches security-relevant code (API routes, env vars, RLS, auth), also update **SECURITY.md**.

## Env vars

New env vars must be added to:
- `.env.local.example` — with comment explaining purpose
- `SECURITY.md` — listed under the "Vercel production env vars to set" checklist
- Code reading the var must have a clear fallback or fail-fast

Never commit `.env.local`. Never log env var values.

## TypeScript safety rules

- Run `npx tsc --noEmit` after EVERY edit to a `.ts`/`.tsx` file in this plan
- Never `any` without a comment explaining why
- Reuse existing types from `src/lib/weconnect/email.ts`, `src/lib/supabase/schema.ts`, etc. — do not redefine

## Testing each phase

Every phase file ends with a **Manual Validation Checklist** — concrete steps to verify the change in a browser. Examples:
- "Open `/`, observe cursor on warm white background, dot is visible"
- "Submit empty PostRequirementModal, see red borders on required fields"
- "Toggle language, refresh page, language persists"

Do not mark a phase as ✅ Done until BOTH the validation harness and the manual checklist pass.

## Hallucination guards (re: CLAUDE.md)

- Never assume a Supabase table name — check `src/lib/supabase/schema.ts`
- Never assume a Payload collection slug — check `src/payload/collections/`
- Never install a package without confirming it in the phase doc
- If unsure about a Payload v3 API, say so; do not guess

## When something doesn't fit the plan

If during implementation you discover the plan is wrong:
1. Stop coding
2. Document the discrepancy in `TEAM_REVIEW.md` under "Plan corrections needed"
3. Update the relevant phase doc
4. Resume only after the doc reflects reality

The plan files are the source of truth — keep them accurate.
