/**
 * fix-next-env.cjs — pre-require patch loaded via tsx --require.
 *
 * Does two things:
 *
 * 1. Loads .env.local into process.env before Payload initialises.
 *    Payload's built-in env loader uses @next/env which doesn't run correctly
 *    outside the Next.js runtime when invoked via tsx.
 *
 * 2. Fixes @next/env CJS/ESM interop so Payload's loadEnv.js doesn't crash.
 *    Payload's compiled code does `require('@next/env').default.loadEnvConfig`
 *    but @next/env exposes loadEnvConfig as a named CJS export, not via .default.
 *    We alias the module as its own .default to satisfy that access pattern.
 *
 * Must be .cjs so Node's --require flag can load it synchronously before tsx
 * starts transforming TypeScript imports.
 */
'use strict'

const fs = require('fs')
const path = require('path')

// ── 1. Load .env.local ───────────────────────────────────────────────────────
const envFile = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    // Value: strip surrounding quotes; don't override vars already in the environment
    const raw = trimmed.slice(eqIdx + 1)
    const val = raw.replace(/^(['"])(.*)\1$/, '$2')
    if (key && !(key in process.env)) process.env[key] = val
  }
}

// ── 2. Fix @next/env interop ─────────────────────────────────────────────────
const mod = require('@next/env')
if (mod && typeof mod === 'object' && !mod.default) {
  Object.defineProperty(mod, 'default', {
    value: mod,
    writable: true,
    enumerable: true,
    configurable: true,
  })
}
