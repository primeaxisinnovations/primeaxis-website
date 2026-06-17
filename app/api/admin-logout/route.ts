import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-session'

export async function POST(request: NextRequest) {
  // 303 so the browser follows up with a GET (not a re-POST) to the login page.
  const response = NextResponse.redirect(new URL('/admin/login', request.url), 303)
  response.cookies.delete({ name: ADMIN_SESSION_COOKIE, path: '/' })
  return response
}
