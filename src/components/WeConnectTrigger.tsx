'use client'

/**
 * WeConnectTrigger — renders a <button> that opens the WeConnect overlay.
 * Used in Nav and HeroCTAButtons wherever a /platform/* link previously existed.
 */

import { useWeConnect, type WeConnectTab } from '@/lib/weconnect/context'

interface WeConnectTriggerProps {
  tab?: WeConnectTab
  style?: React.CSSProperties
  className?: string
  children: React.ReactNode
}

export default function WeConnectTrigger({
  tab = 'spaces',
  style,
  className,
  children,
}: WeConnectTriggerProps) {
  const { open } = useWeConnect()
  return (
    <button
      onClick={() => open(tab)}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...style }}
      className={className}
    >
      {children}
    </button>
  )
}
