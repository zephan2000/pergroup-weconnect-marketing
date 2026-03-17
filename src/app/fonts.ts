/**
 * Font definitions — shared between marketing and root layouts.
 * Extracted from layout.tsx because Next.js disallows non-standard exports from layouts.
 */
import { Syne, Syne_Mono, Noto_Serif_SC, Inter } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const syneMono = Syne_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-syne-mono',
  display: 'swap',
})

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const fontVariables = `${syne.variable} ${syneMono.variable} ${notoSerifSC.variable} ${inter.variable}`
