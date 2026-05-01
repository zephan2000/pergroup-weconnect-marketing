#!/usr/bin/env bash
# Full validation harness. Run at the end of every improvement phase.
# Exits non-zero if any check fails.

set -e
set -o pipefail

# Move to repo root regardless of where the script is called from
cd "$(dirname "$0")/.."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " PER GROUP — Validation Harness"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. TypeScript ────────────────────────────────────────────
echo "▸ [1/3] TypeScript: npx tsc --noEmit"
TS_OUTPUT=$(npx tsc --noEmit 2>&1 | grep -v "per-group-connect-main" || true)
if [ -n "$TS_OUTPUT" ]; then
  echo "  ✗ TypeScript errors found:"
  echo "$TS_OUTPUT" | head -30
  exit 1
fi
echo "  ✓ TypeScript clean"
echo ""

# ── 2. ESLint ────────────────────────────────────────────────
echo "▸ [2/3] ESLint: npm run lint"
if ! npm run lint --silent 2>&1 | tee /tmp/pergroup-lint.log; then
  echo "  ✗ ESLint errors"
  exit 1
fi
echo "  ✓ ESLint clean"
echo ""

# ── 3. Next.js build ─────────────────────────────────────────
echo "▸ [3/3] Build: npm run build"
if ! npm run build --silent 2>&1 | tail -20; then
  echo "  ✗ Build failed"
  exit 1
fi
echo "  ✓ Build succeeded"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ✓ All validation checks passed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
