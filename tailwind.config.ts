import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── PER GROUP marketing site (light mode default) ──
        amber: {
          DEFAULT: 'hsl(36 90% 47%)',       // warm golden orange
          glow: 'hsla(36, 90%, 47%, 0.15)',
        },
        green: {
          DEFAULT: 'hsl(140 35% 44%)',      // match green
        },
        bg: {
          DEFAULT: 'hsl(40 33% 97%)',       // warm white
          2: 'hsl(33 100% 95%)',            // pale cream (card surfaces)
        },
        line: {
          DEFAULT: 'hsla(20, 10%, 10%, 0.08)',
          2: 'hsla(20, 10%, 10%, 0.04)',
        },
        'pg-text': 'hsl(20 10% 10%)',       // near-black warm text
        muted: 'hsl(25 10% 49%)',           // warm grey
        faint: 'hsla(20, 10%, 10%, 0.06)',

        // ── Accent colours ──
        'deep-orange': 'hsl(20 75% 48%)',
        'alert-red': 'hsl(7 72% 48%)',
        'intro-blue': 'hsl(210 40% 50%)',

        // ── WeConnect platform (dark overlay) ──
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
        sora: ['var(--font-sora)', 'sans-serif'],
        'noto-sans-sc': ['var(--font-noto-sans-sc)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'dot-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'dot-pulse': 'dot-pulse 2s ease-in-out infinite',
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
    },
  },
  plugins: [],
}

export default config
