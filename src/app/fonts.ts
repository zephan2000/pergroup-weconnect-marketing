/**
 * Font definitions — shared between marketing and root layouts.
 * Extracted from layout.tsx because Next.js disallows non-standard exports from layouts.
 *
 * Redesign: Syne → Sora, Noto Serif SC → Noto Sans SC.
 * Syne Mono dropped (unused in new design).
 */
import { Sora, Noto_Sans_SC, Inter } from 'next/font/google'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const fontVariables = `${sora.variable} ${notoSansSC.variable} ${inter.variable}`
