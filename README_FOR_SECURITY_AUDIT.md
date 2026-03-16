# SECURITY.md

## Purpose
Running log of security-relevant decisions made during implementation.
Claude Code writes to this file whenever it makes a decision with a security implication.
This file is the input to manual security review prompts at each checkpoint.

---

## Format for new entries
```
[DATE] [SEVERITY: LOW | MEDIUM | HIGH] [MODULE]
Decision: what was built or configured
Implication: what the security concern is
Mitigated: YES (how) | NO (needs review) | DEFERRED (when)
```

---

## Checkpoint Reviews
Run the security review prompt (in this file) at each checkpoint before proceeding.

### Checkpoint 1 — After schema + Supabase setup
### Checkpoint 2 — After Payload CMS + admin is live  
### Checkpoint 3 — Before Vercel deployment

---

## Security Review Prompt (paste into a fresh Claude session at each checkpoint)
```
You are a security engineer specialising in Next.js, Supabase, and Payload v3.

Review the following for security vulnerabilities:
1. SECURITY.md — all entries marked Mitigated: NO or DEFERRED
2. /src/lib/supabase/ — RLS policies, client vs server key usage
3. /src/payload/ — admin route exposure, collection access control
4. .env.local.example — check for any secrets that should not be NEXT_PUBLIC_

Output a prioritised fix list (HIGH → LOW) with specific file and line references.
Do not suggest fixes outside this stack. Do not rewrite working code unprompted.
```

---

## Known Decisions Log
<!-- Claude Code appends entries below this line -->