import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import matter from 'gray-matter'
import { getFile } from '@/lib/github'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import ProfileForm from '@/components/admin/ProfileForm'
export default async function EditProfilePage({ params }: { params: Promise<{ slug: string }> }) { const store = await cookies(); if (!verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)) redirect('/admin/login'); const { slug } = await params; const file = await getFile(`content/profiles/${slug}.md`); if (!file) notFound(); const { data } = matter(file.content); return <ProfileForm mode="edit" initialValues={{ slug, name: String(data.name ?? ''), role: String(data.role ?? ''), bio: String(data.bio ?? ''), photo: String(data.photo ?? ''), email: String(data.email ?? ''), linkedin: String(data.linkedin ?? ''), twitter: String(data.twitter ?? ''), website: String(data.website ?? ''), status: data.status === 'published' ? 'published' : 'draft' }} /> }
