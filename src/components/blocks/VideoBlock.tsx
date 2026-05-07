'use client'

/**
 * VideoBlock — renders a YouTube video embed inside a responsive aspect-ratio
 * container.
 *
 * Three autoplay modes (CMS-controlled):
 *   - 'off'      — viewer presses play; iframe has no autoplay flag
 *   - 'onLoad'   — autoplay starts immediately on page load (forced muted)
 *   - 'onScroll' — autoplay only when the iframe scrolls into view; pauses
 *                  when scrolled back out. Implemented via IntersectionObserver
 *                  + postMessage to YouTube's IFrame API. Iframe URL includes
 *                  `enablejsapi=1` so postMessage commands are accepted.
 *
 * Uses youtube-nocookie.com (privacy-enhanced mode) — no cookies until
 * user interacts with the player.
 */
import { useEffect, useRef } from 'react'

type AspectRatio = '16:9' | '9:16' | '4:3' | '1:1'
type AutoplayMode = 'off' | 'onLoad' | 'onScroll'

type VideoBlockProps = {
  youtubeUrl?: string
  caption?: string
  aspectRatio?: AspectRatio
  /** New: 3-way mode. If absent, falls back to legacy `autoplay` boolean. */
  autoplayMode?: AutoplayMode
  /** Legacy boolean — kept for back-compat with rows pre-migration. */
  autoplay?: boolean
  loop?: boolean
  startSeconds?: number
}

const ASPECT_CLASS: Record<AspectRatio, string> = {
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16] max-w-[400px] mx-auto',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url.trim())
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      return /^[\w-]{11}$/.test(id) ? id : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname === '/watch') {
        const id = u.searchParams.get('v')
        return id && /^[\w-]{11}$/.test(id) ? id : null
      }
      const shortsMatch = u.pathname.match(/^\/shorts\/([\w-]{11})/)
      if (shortsMatch) return shortsMatch[1]
      const embedMatch = u.pathname.match(/^\/embed\/([\w-]{11})/)
      if (embedMatch) return embedMatch[1]
    }
    return null
  } catch {
    return null
  }
}

export default function VideoBlock({
  youtubeUrl,
  caption,
  aspectRatio = '16:9',
  autoplayMode,
  autoplay = false,
  loop = false,
  startSeconds,
}: VideoBlockProps) {
  // Resolve mode: prefer the new field, fall back to legacy boolean.
  const mode: AutoplayMode = autoplayMode ?? (autoplay ? 'onLoad' : 'off')

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (mode !== 'onScroll') return
    const iframe = iframeRef.current
    if (!iframe) return

    const post = (func: 'playVideo' | 'pauseVideo') => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args: [] }),
        '*',
      )
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            post('playVideo')
          } else {
            post('pauseVideo')
          }
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(iframe)
    return () => observer.disconnect()
  }, [mode])

  if (!youtubeUrl) return null
  const videoId = extractYouTubeId(youtubeUrl)
  if (!videoId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[VideoBlock] Unrecognised YouTube URL: "${youtubeUrl}"`)
    }
    return null
  }

  const params = new URLSearchParams()
  params.set('rel', '0')
  params.set('modestbranding', '1')

  if (mode === 'onLoad') {
    params.set('autoplay', '1')
    params.set('mute', '1')
    params.set('playsinline', '1')
  } else if (mode === 'onScroll') {
    // IFrame API requires enablejsapi=1 to accept postMessage commands.
    // Mute is required so that programmatic playVideo() actually starts in
    // browsers that block unmuted autoplay.
    params.set('enablejsapi', '1')
    params.set('mute', '1')
    params.set('playsinline', '1')
  }

  if (loop) {
    params.set('loop', '1')
    params.set('playlist', videoId)
  }
  if (typeof startSeconds === 'number' && startSeconds > 0) {
    params.set('start', String(Math.floor(startSeconds)))
  }

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        <div className={`${ASPECT_CLASS[aspectRatio]} w-full overflow-hidden rounded-xl glass-card`}>
          <iframe
            ref={iframeRef}
            src={src}
            title={caption || 'Video'}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full border-0"
          />
        </div>
        {caption && (
          <p className="text-muted text-sm md:text-base text-center mt-4">{caption}</p>
        )}
      </div>
    </section>
  )
}
