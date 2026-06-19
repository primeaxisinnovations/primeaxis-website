'use client'

import { useState } from 'react'
import RichTextEditor from '@/components/admin/RichTextEditor'

const SAMPLE_HTML = `<h1>Lekki Deep Sea Port: A Turning Point</h1><p>Nigeria's largest deep sea port is reshaping <a href="https://example.com" target="_blank" rel="noopener noreferrer">West African trade flows</a>, with implications for carriers and shippers alike.</p><h2>Capacity and competition</h2><p>The port's draft depth allows it to receive vessels that previously had to call at Tema or Abidjan.</p><blockquote>This is the single biggest shift in West African port infrastructure in a decade.</blockquote><ul><li>Deeper draft for ultra-large container vessels</li><li>Direct rail link under construction</li></ul><hr><p>Operators are watching closely as volumes ramp up through the second quarter.</p>`

export default function EditorTestClient() {
  const [html, setHtml] = useState(SAMPLE_HTML)

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="max-w-[900px] mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin — Temporary</p>
        <h1 className="font-display text-[28px] font-semibold text-deep mb-8">Rich Text Editor Test</h1>

        <RichTextEditor value={html} onChange={setHtml} />

        <div className="mt-8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Live HTML Output</p>
          <pre className="bg-deep text-cream text-[12px] font-mono p-5 overflow-x-auto whitespace-pre-wrap break-words border border-border">
            {html}
          </pre>
        </div>
      </div>
    </div>
  )
}
