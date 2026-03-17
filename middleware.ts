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

  // Handle logout: expire the cookie on the pass-through response.
  // Payload's Auth provider calls the REST API via fetch() to logout,
  // but the REST handler doesn't set a Set-Cookie header — only the
  // server action does. Using NextResponse.next() (not redirect) ensures
  // the Set-Cookie header is delivered with the page response, which
  // the browser reliably processes even during client-side navigation.
  if (firstSegment === 'logout') {
    const response = NextResponse.next()
    response.cookies.set('payload-token', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })
    return response
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
