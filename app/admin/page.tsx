import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

export default async function AdminDashboardPage() {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-5 gap-8">
      <h1 className="font-display text-[clamp(28px,4vw,44px)] font-semibold text-deep">
        PrimeAxis Admin
      </h1>
      <form action="/api/admin-logout" method="POST">
        <button
          type="submit"
          className="font-sans text-[13px] font-semibold tracking-[.04em] text-gold border border-gold px-6 py-3 hover:bg-gold hover:text-deep transition-all duration-200"
        >
          Log Out
        </button>
      </form>
    </div>
  )
}
