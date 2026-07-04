'use client'

import type { ReactNode } from 'react'

interface ProtectedContentProps {
  /** Soft copy-deterrent class — `article-body` or `conversation-body`
   *  (see globals.css) which disables text selection on the prose body. */
  className: string
  children: ReactNode
}

/**
 * Soft copy-deterrent wrapper for prose body content ONLY.
 *
 * This is a deterrent, not real security — the markup is still in the DOM.
 * It suppresses the right-click context menu over the wrapped prose, but
 * deliberately lets right-click through on images so admins can still
 * save them. Text selection is disabled via the CSS class, not here.
 *
 * Do not wrap headers, nav, buttons, forms, share links, or the newsletter
 * signup with this — those must stay fully selectable and functional.
 */
export default function ProtectedContent({ className, children }: ProtectedContentProps) {
  return (
    <div
      className={className}
      onContextMenu={(e) => {
        // Allow the native context menu on images (right-click → save).
        if ((e.target as HTMLElement).tagName === 'IMG') return
        e.preventDefault()
      }}
    >
      {children}
    </div>
  )
}
