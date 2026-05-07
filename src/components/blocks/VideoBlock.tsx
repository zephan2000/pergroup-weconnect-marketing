/**
 * VideoBlock — renders a YouTube video embed inside a responsive aspect-ratio
 * container. Server component — no client JS needed; the iframe handles itself.
 *
 * Uses youtube-nocookie.com (privacy-enhanced mode) which only sets cookies
 * once the user interacts with the player.
 */
import React from 'react'

type AspectRatio = '16:9' | '9:16' | '4:3' | '1:1'

type VideoBlockProps = {
  youtubeUrl?: string
  caption?: string
  aspectRatio?: AspectRatio
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
  autoplay = false,
  loop = false,
  startSeconds,
}: VideoBlockProps) {
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
  if (autoplay) {
    params.set('autoplay', '1')
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
