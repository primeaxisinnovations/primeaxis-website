'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'

const inputClasses = 'w-full font-sans text-[14px] px-4 py-3 border border-border bg-cream text-ink outline-none focus:border-gold transition-colors duration-200'
const labelClasses = 'block font-mono text-[10px] tracking-[0.15em] uppercase text-muted mb-2'

export default function ProfileForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [role, setRole] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [photo, setPhoto] = useState('')
  const [bio, setBio] = useState('')
  const [expertise, setExpertise] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(null)
    const response = await fetch('/api/admin/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug, role, organisation, photo, bio, expertise: expertise.split(',').map((item) => item.trim()).filter(Boolean), linkedin, status }) })
    if (!response.ok) { const data = await response.json().catch(() => ({})); setError(data.error ?? 'Unable to save profile.'); setSaving(false); return }
    router.push('/admin?profileSaved=1')
  }

  return <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4"><div className="max-w-[760px] mx-auto"><p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-1">PrimeAxis Admin</p><h1 className="font-display text-[28px] font-semibold text-deep mb-8">New Executive Profile</h1><form onSubmit={submit} className="bg-white border border-border p-8 max-sm:p-5 flex flex-col gap-6">
    <div><label htmlFor="name" className={labelClasses}>Full name</label><input id="name" required value={name} onChange={(e) => { setName(e.target.value); if (!slug) setSlug(slugify(e.target.value)) }} className={inputClasses} /></div>
    <div><label htmlFor="slug" className={labelClasses}>Slug</label><input id="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} className={`${inputClasses} font-mono`} /></div>
    <div><label htmlFor="role" className={labelClasses}>Role / title</label><input id="role" required value={role} onChange={(e) => setRole(e.target.value)} className={inputClasses} /></div>
    <div><label htmlFor="organisation" className={labelClasses}>Organisation</label><input id="organisation" required value={organisation} onChange={(e) => setOrganisation(e.target.value)} className={inputClasses} /></div>
    <div><label htmlFor="photo" className={labelClasses}>Photo URL</label><input id="photo" type="url" value={photo} onChange={(e) => setPhoto(e.target.value)} className={inputClasses} /></div>
    <div><label htmlFor="bio" className={labelClasses}>Executive biography</label><textarea id="bio" required rows={7} value={bio} onChange={(e) => setBio(e.target.value)} className={`${inputClasses} resize-y`} /></div>
    <div><label htmlFor="expertise" className={labelClasses}>Areas of expertise</label><input id="expertise" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="Ports, maritime policy, blue economy" className={inputClasses} /></div>
    <div><label htmlFor="linkedin" className={labelClasses}>LinkedIn URL</label><input id="linkedin" type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className={inputClasses} /></div>
    <div><label htmlFor="status" className={labelClasses}>Publishing status</label><select id="status" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} className={inputClasses}><option value="draft">Draft</option><option value="published">Published</option></select></div>
    {error && <p role="alert" className="text-red-700 font-sans text-[13px]">{error}</p>}
    <button disabled={saving} className="bg-gold text-deep px-6 py-3 font-sans text-[13px] font-semibold disabled:opacity-60">{saving ? 'Saving…' : 'Save Profile'}</button>
  </form></div></div>
}
