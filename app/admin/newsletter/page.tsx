import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { getSubscribers } from '@/lib/newsletter'
import { formatDate } from '@/lib/utils'
import ExportCsvButton from '@/components/admin/ExportCsvButton'
import SubscriberRowActions from '@/components/admin/SubscriberRowActions'

// Always reads the live Blob store — never cached. The admin must show the
// real, current subscriber list, even seconds after a subscribe/remove lands.
export const dynamic = 'force-dynamic'

export default async function NewsletterAdminPage() {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  const subscribers = await getSubscribers()

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p>
            <h1 className="font-display text-[28px] font-semibold text-deep">Newsletter Subscribers</h1>
            <p className="font-sans text-[13.5px] text-muted mt-1">
              {subscribers.length} {subscribers.length === 1 ? 'subscriber' : 'subscribers'}
            </p>
          </div>
          <ExportCsvButton subscribers={subscribers} />
        </div>

        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Email</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 whitespace-nowrap">Subscribed Date</th>
                <th className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-5 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center font-sans text-[14px] text-muted">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr
                    key={sub.email}
                    className="border-b border-border last:border-b-0 hover:bg-cream/60 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-sans text-[14px] text-ink max-w-[420px] break-all">{sub.email}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-muted whitespace-nowrap">
                      {formatDate(sub.subscribedAt)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <SubscriberRowActions email={sub.email} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
