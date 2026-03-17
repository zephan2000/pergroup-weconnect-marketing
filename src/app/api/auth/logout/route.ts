import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * GET /api/auth/logout
 *
 * Dedicated logout endpoint that reliably clears the payload-token cookie.
 *
 * Why this exists: Payload's built-in logout flow calls the REST API via
 * fetch(), which doesn't clear the httpOnly cookie from the browser.
 * Payload's RootPage may also refresh the cookie during rendering,
 * overriding any Set-Cookie deletion set by middleware.
 *
 * This route handler runs in isolation — no Payload page component executes,
 * so nothing can re-set the cookie. Next.js cookies().delete() sets the
 * proper Set-Cookie header on the redirect response.
 *
 * SECURITY: Logged in SECURITY.md.
 */
export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')

  const url = new URL('/admin/login', request.url)
  return NextResponse.redirect(url)
}
