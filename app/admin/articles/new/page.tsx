import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import NewArticleForm from '@/components/admin/NewArticleForm'

// No caching — this page only renders a form, but every admin route stays
// dynamic on principle so nothing under /admin is ever served stale.
export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  return <NewArticleForm />
}
