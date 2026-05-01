# Phase 1 — Cursor Redesign for Light Mode

**Status:** ⏳ Pending
**Estimated effort:** 30 minutes
**Files touched:** `src/components/CursorEffect.tsx` (1 file)

## Problem

The custom cursor uses `mixBlendMode: 'screen'` which was designed for the original dark theme. On the new warm-white background, screen-blend amber becomes nearly invisible. The canvas particle background also uses dark-theme amber/green particles that are barely visible on cream.

## Goal

Keep the dot + ring + canvas particle system (per design decision option C) but rebuild for light mode. The cursor should be **clearly visible** without overpowering the warm aesthetic.

## Implementation

### File: `src/components/CursorEffect.tsx`

**Cursor dot changes:**
- Remove `mixBlendMode: 'screen'`
- Solid `var(--amber)` (`hsl(36 90% 47%)`)
- Add subtle dark border for contrast: `border: 1px solid hsla(20, 10%, 10%, 0.15)`
- Add `box-shadow: 0 1px 4px hsla(20, 10%, 10%, 0.2)` for depth on light bg
- Keep size 8px → 20px on hover

**Cursor ring changes:**
- Border opacity: `0.45` → `0.6` (more visible on cream)
- Ring color: keep amber but slightly darker hex for contrast: `hsl(36 90% 40%)`
- Opacity: `0.7` → `0.85`

**Canvas particle changes:**
- Particle base color: switch from `rgba(245,168,42,...)` (amber on dark) to `hsla(20, 75%, 48%, ...)` (deep-orange on warm-white)
- Inactive particle alpha: `0.06–0.20` → `0.08–0.25` (slightly higher to show on light bg)
- Mouse-proximity glow: `rgba(245,168,42, ...)` → `hsla(36, 90%, 47%, ...)` with shadow opacity reduced
- Connection line color: `rgba(245,168,42, 0.05 * (1-d/90))` → `hsla(20, 75%, 48%, 0.1 * (1-d/90))`
- Grid line color: `rgba(245,168,42, .022)` → `hsla(20, 10%, 10%, 0.025)` (subtle dark grid on cream)

**No structural changes** — only color/opacity values. Animation, particle count, easing all stay identical.

## Validation

### Harness
```bash
bash scripts/validate.sh
```

### Manual checklist
- [ ] `npm run dev` starts without errors
- [ ] Open `http://localhost:3000` on a desktop (pointer: fine)
- [ ] Default browser cursor is hidden, custom amber dot visible
- [ ] Dot color is clearly distinguishable from warm white background (no blending)
- [ ] Hover over a button — dot grows to 20px, semi-transparent
- [ ] Move cursor — ring follows with smooth easing trail
- [ ] Move cursor near canvas particles — they should glow brighter (visible color shift)
- [ ] Refresh on a touch device (or DevTools touch emulation) — no custom cursor, default browser cursor used
- [ ] Footer (dark bg) cursor is still visible — does NOT need re-checking, but confirm

## Risks & rollback

- Risk: CSS variables not loaded yet on first paint → cursor flashes default. Mitigation: use direct hex/hsl values, not `var(--amber)`, in inline style.
- Rollback: `git revert <commit>` — the file is self-contained.

## Done when

- [ ] All validation harness steps green
- [ ] All manual checklist items pass
- [ ] CHANGELOG entry added: `[YYYY-MM-DD] MODIFY [src/components/CursorEffect.tsx] — Light-mode redesign`
- [ ] This file's Status flipped to ✅ Done at top
- [ ] README.md status table updated
- [ ] Committed and pushed
