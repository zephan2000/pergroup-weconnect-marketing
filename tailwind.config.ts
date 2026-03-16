import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colour tokens derived from /reference/pergroup-website.html :root vars
      colors: {
        // PER GROUP marketing site
        amber: {
          DEFAULT: '#F5A82A',
          glow: 'rgba(245,168,42,0.15)',
        },
        green: {
          DEFAULT: '#39E07A',
        },
        bg: {
          DEFAULT: '#05060A',
          2: '#080B12',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          2: 'rgba(255,255,255,0.03)',
        },
        'pg-text': '#DDE0E8',
        muted: 'rgba(221,224,232,0.4)',
        faint: 'rgba(221,224,232,0.12)',
        // WeConnect platform
        'wc-amber': {
          DEFAULT: '#F5A623',
          2: '#D4880A',
        },
        'wc-green': '#22C55E',
        'wc-bg': '#0F1117',
        'wc-surface': {
          DEFAULT: '#1A1D27',
          2: '#22263A',
        },
        'wc-border': 'rgba(255,255,255,0.08)',
        'wc-text': '#E8EAF0',
        'wc-muted': 'rgba(232,234,240,0.45)',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        'syne-mono': ['var(--font-syne-mono)', 'monospace'],
        'noto-serif-sc': ['var(--font-noto-serif-sc)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
