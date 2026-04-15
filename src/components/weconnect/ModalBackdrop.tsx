'use client'

import { useCallback, useEffect, useState } from 'react'

interface ModalBackdropProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

/**
 * Shared modal backdrop — warm light aesthetic.
 * Glassmorphism overlay, click-outside-to-close, Escape key handling.
 */
export default function ModalBackdrop({ isOpen, onClose, children }: ModalBackdropProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    } else {
      setVisible(false)
    }
  }, [isOpen])

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
    document.addEventListener('keydown', handleKeyDown, true)
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
        background: 'hsla(20, 10%, 10%, 0.4)',
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
          background: 'hsl(40 33% 97%)',
          border: '1px solid hsla(20, 10%, 10%, 0.08)',
          borderRadius: 16,
          padding: 28,
          position: 'relative',
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'transform 0.25s ease',
          boxShadow: '0 25px 50px -12px hsla(20, 10%, 10%, 0.15)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'hsla(20, 10%, 10%, 0.05)',
            border: '1px solid hsla(20, 10%, 10%, 0.08)',
            borderRadius: 8,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(25 10% 49%)',
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
