import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

// Next.js 16 renamed "middleware" to "proxy" — this file is the direct
// successor to middleware.ts and always runs on the Node.js runtime (not
// Edge), which is required here since admin-session signing uses Node's
// built-in `crypto` module.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
