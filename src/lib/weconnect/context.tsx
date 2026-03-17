'use client'

/**
 * WeConnect overlay state — open/close and active tab.
 * Provided by WeConnectProvider in (marketing)/layout.tsx.
 * Consumed by WeConnectOverlay and any trigger button.
 */

import { createContext, useCallback, useContext, useState } from 'react'

export type WeConnectTab = 'spaces' | 'funding' | 'markets'

interface WeConnectContextValue {
  isOpen: boolean
  activeTab: WeConnectTab
  open: (tab?: WeConnectTab) => void
  close: () => void
  setActiveTab: (tab: WeConnectTab) => void
}

const WeConnectContext = createContext<WeConnectContextValue | null>(null)

export function WeConnectProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<WeConnectTab>('spaces')

  const open = useCallback((tab: WeConnectTab = 'spaces') => {
    setActiveTab(tab)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  return (
    <WeConnectContext.Provider value={{ isOpen, activeTab, open, close, setActiveTab }}>
      {children}
    </WeConnectContext.Provider>
  )
}

export function useWeConnect() {
  const ctx = useContext(WeConnectContext)
  if (!ctx) throw new Error('useWeConnect must be used within WeConnectProvider')
  return ctx
}
