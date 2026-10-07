import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

interface AdminSection {
  label: string
  description: string
  href: string
}

// Add a section here to add a card to the dashboard — Conversations and
// Images belong here once those CMS sections exist.
const ADMIN_SECTIONS: AdminSection[] = [
  {
    label: 'Manage Articles',
    description: 'Create, edit, and review maritime intelligence articles.',
    href: '/admin/articles',
  },
  {
    label: 'Manage News',
    description: 'File, edit, and review dated industry reporting.',
    href: '/admin/news',
  },
  {
    label: 'Manage Conversations',
    description: 'Create, edit, and review executive conversations.',
    href: '/admin/conversations',
  },
  {
    label: 'Manage Profiles',
    description: 'Create, edit, and publish people profiles with social links.',
    href: '/admin/profiles',
  },
  {
    label: 'Manage Events',
    description: 'Create, edit, and review conferences, summits, and press briefings.',
    href: '/admin/events',
  },
  {
    label: 'Newsletter Subscribers',
    description: 'View, export, and manage newsletter subscribers.',
    href: '/admin/newsletter',
  },
]

export default async function AdminDashboardPage() {
  // Defense in depth — verify independently of proxy.ts, see lib/admin-session.ts.
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p>
            <h1 className="font-display text-[28px] font-semibold text-deep">Dashboard</h1>
          </div>
          <form action="/admin/" method="POST">
            <button
              type="submit"
              className="font-sans text-[13px] font-semibold tracking-[.04em] text-gold border border-gold px-6 py-3 hover:bg-black hover:text-deep transition-all duration-200"
            >
            Dashboard
            </button>
          </form>
          <form action="/api/admin-logout" method="POST">
            <button
              type="submit"
              className="font-sans text-[13px] font-semibold tracking-[.04em] text-gold border border-gold px-6 py-3 hover:bg-gold hover:text-deep transition-all duration-200"
            >
              Log Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white border border-border p-6 flex flex-col gap-2 hover:border-gold transition-colors duration-200"
            >
              <span className="font-display text-[17px] font-semibold text-deep group-hover:text-gold transition-colors duration-200">
                {section.label}
              </span>
              <span className="font-sans text-[13px] text-muted leading-relaxed">
                {section.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
