'use client'

import { formatDate } from '@/lib/utils'

interface Subscriber {
  email: string
  subscribedAt: string
}

// RFC-4180 style escaping: wrap the field in double quotes and double any
// embedded quotes when it contains a comma, quote, or line break. formatDate
// currently emits no commas, but email is user-supplied, so escape defensively.
function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export default function ExportCsvButton({ subscribers }: { subscribers: Subscriber[] }) {
  function handleExport() {
    const header = 'Email,Subscribed Date'
    const rows = subscribers.map(
      (s) => `${csvEscape(s.email)},${csvEscape(formatDate(s.subscribedAt))}`
    )
    const csv = [header, ...rows].join('\r\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={subscribers.length === 0}
      className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-3 hover:bg-gold-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Export CSV
    </button>
  )
}
