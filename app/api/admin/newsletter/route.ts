import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getSubscribers, removeSubscriber } from '@/lib/newsletter'

// Always reads the live Blob store — never cached.
export const dynamic = 'force-dynamic'

// Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
// Matches the cookie + verifySessionToken() pattern used by the articles,
// conversations, and events admin routes (there is no verifyAdminSession helper).
async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  return verifySessionToken(token)
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const subscribers = await getSubscribers()
  return NextResponse.json({ subscribers })
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const json = await request.json().catch(() => null)
  const email = json?.email
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  const result = await removeSubscriber(email)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
