'use client'

/**
 * HeroCTAButtons — client component for the CTA button row in HeroBlock.
 * Buttons that link to /platform/* open the WeConnect overlay.
 * Other buttons render as plain anchor tags.
 */

import { useWeConnect } from '@/lib/weconnect/context'

type HeroButton = {
  label: string
  href: string
  variant: 'fill' | 'ghost' | 'weconnect'
}

export default function HeroCTAButtons({ buttons }: { buttons: HeroButton[] }) {
  const { open } = useWeConnect()

  return (
    <div className="flex flex-wrap gap-4 pt-2">
      {buttons.map((btn) => {
        const isPlatformLink = btn.href.startsWith('/platform') || btn.variant === 'weconnect'

        const fillClass =
          'inline-flex items-center bg-amber text-white font-semibold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity no-underline border-none cursor-pointer font-sora'
        const ghostClass =
          'inline-flex items-center border-[1.5px] border-amber text-amber font-semibold text-sm px-6 py-3 rounded-lg hover:bg-amber hover:text-white transition-colors no-underline cursor-pointer font-sora bg-transparent'

        const className = btn.variant === 'fill' ? fillClass : ghostClass

        if (isPlatformLink) {
          return (
            <button key={btn.label} onClick={() => open('needs')} className={className}>
              {btn.label}
            </button>
          )
        }

        return (
          <a key={btn.label} href={btn.href} className={className}>
            {btn.label}
          </a>
        )
      })}
    </div>
  )
}
