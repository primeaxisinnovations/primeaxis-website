import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import ProfileForm from '@/components/admin/ProfileForm'

export const dynamic = 'force-dynamic'

export default async function NewProfilePage() {
  const cookieStore = await cookies()
  if (!verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect('/admin/login')
  return <ProfileForm />
}
