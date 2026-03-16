import type { Metadata } from 'next'
import { Syne, Syne_Mono, Noto_Serif_SC, Inter } from 'next/font/google'
// globals.css is intentionally NOT imported here.
// It lives in (marketing)/layout.tsx so Tailwind preflight only applies
// to marketing routes and never disrupts Payload's /admin CSS.
import AnalyticsProvider from '@/components/AnalyticsProvider'

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

export const metadata: Metadata = {
  title: 'PER GROUP — Global Innovation Ecosystem',
  description:
    'PER GROUP is a global tech innovation consultancy connecting Chinese enterprises with world markets across 53+ countries. Powered by WeConnect AI matchmaking.',
  robots: {
    index: true,
    follow: true,
    // /admin is also disallowed in public/robots.txt
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${syneMono.variable} ${notoSerifSC.variable} ${inter.variable}`}
    >
      <body>
        {/*
          AnalyticsProvider is a client component that initialises Firebase Analytics
          once on first mount. It renders no DOM of its own — just wraps children.
        */}
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
