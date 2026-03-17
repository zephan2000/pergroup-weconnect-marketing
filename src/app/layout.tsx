import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PER GROUP — Global Innovation Ecosystem',
  description:
    'PER GROUP is a global tech innovation consultancy connecting Chinese enterprises with world markets across 53+ countries. Powered by WeConnect AI matchmaking.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No <html> or <body> here — Payload's (payload)/layout.tsx renders its own
  // <html>, and our (marketing)/layout.tsx renders ours. A root-level <html>
  // would nest inside Payload's, causing a hydration error.
  return children
}
