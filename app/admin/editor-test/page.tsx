import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import EditorTestClient from './EditorTestClient'

// Temporary page for manually verifying RichTextEditor output before it's
// wired into any real form. Safe to delete once that verification is done.
export const dynamic = 'force-dynamic'

export default async function EditorTestPage() {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  return <EditorTestClient />
}
