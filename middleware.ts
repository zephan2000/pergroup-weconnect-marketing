import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware: Protect /admin routes by requiring the payload-token cookie.
 *
 * Defense-in-depth layer. Payload's RootPage component performs authoritative
 * JWT validation server-side. This middleware checks cookie *presence* to
 * catch cases where Next.js caching might bypass the server component auth check.
 *
 * SECURITY: Logged in SECURITY.md.
 */

// Public admin sub-routes that Payload allows without authentication.
// Sourced from @payloadcms/next/dist/utilities/isPublicAdminRoute.js
const PUBLIC_ADMIN_SEGMENTS = [
  'login',
  'create-first-user',
  'logout',
  'forgot',
  'reset',
  'unauthorized',
  'inactivity',
  'verify',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public admin routes through without cookie check
  const afterAdmin = pathname.replace(/^\/admin\/?/, '')
  const firstSegment = afterAdmin.split('/')[0]

  // Handle logout by returning a complete HTML response that:
  // 1. Deletes the payload-token cookie via Set-Cookie header
  // 2. Redirects to /admin/login via JavaScript
  //
  // Why a full HTML response? Payload's admin uses client-side navigation
  // (<Link>), which means Next.js makes internal fetch() calls for RSC data.
  // Set-Cookie headers on fetch redirect chains are NOT reliably processed
  // by the browser. Returning HTML forces Next.js to do a full page load,
  // which guarantees the browser processes the Set-Cookie header.
  if (firstSegment === 'logout') {
    const html = [
      '<!DOCTYPE html><html><head>',
      '<meta http-equiv="refresh" content="0;url=/admin/login">',
      '<script>window.location.replace("/admin/login")</script>',
      '</head><body></body></html>',
    ].join('')

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': 'payload-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
      },
    })
  }

  if (firstSegment && PUBLIC_ADMIN_SEGMENTS.includes(firstSegment)) {
    return NextResponse.next()
  }

  // Allow static assets (JS/CSS bundles, fonts, images)
  if (/\.(js|css|map|ico|png|jpg|svg|woff2?)$/.test(pathname)) {
    return NextResponse.next()
  }

  // Check for payload-token cookie
  const token = request.cookies.get('payload-token')

  if (!token?.value) {
    const loginUrl = new URL('/admin/login', request.url)
    if (pathname !== '/admin' && pathname !== '/admin/') {
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
