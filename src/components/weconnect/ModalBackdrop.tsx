'use client'

import { useCallback, useEffect, useState } from 'react'

interface ModalBackdropProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

/**
 * Shared modal backdrop with glassmorphism, click-outside-to-close,
 * and Escape key handling. Stops propagation so the overlay behind
 * doesn't also close.
 */
export default function ModalBackdrop({ isOpen, onClose, children }: ModalBackdropProps) {
  const [visible, setVisible] = useState(false)

  // Fade-in: defer by one frame so the browser paints opacity:0 first.
  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    } else {
      setVisible(false)
    }
  }, [isOpen])

  // Escape key closes the modal (not the overlay behind it).
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown, true) // capture phase
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2100,
        background: 'rgba(5, 6, 10, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          background: 'rgba(26, 29, 39, 0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: 28,
          position: 'relative',
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: 6,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(232,234,240,0.45)',
            fontSize: 16,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
