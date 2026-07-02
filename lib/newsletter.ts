import { put, get } from '@vercel/blob'

interface Subscriber {
  email: string
  subscribedAt: string
}

const SUBSCRIBERS_PATH = 'newsletter/subscribers.json'

// Dedicated Blob store for newsletter data, kept separate from the image
// upload store. Every get()/put() below passes this token explicitly — the
// SDK would otherwise fall back to process.env.BLOB_READ_WRITE_TOKEN (the
// image store), silently writing subscribers to the wrong store.
const NEWSLETTER_BLOB_TOKEN = process.env.NEWSLETTER_READ_WRITE_TOKEN

export async function getSubscribers(): Promise<Subscriber[]> {
  if (!NEWSLETTER_BLOB_TOKEN) {
    console.error('NEWSLETTER_READ_WRITE_TOKEN is not set — cannot read subscribers')
    return []
  }
  try {
    // Private blob: `get` authenticates via the newsletter token and resolves
    // the store URL from the pathname — an anonymous fetch would be rejected.
    const result = await get(SUBSCRIBERS_PATH, { access: 'private', token: NEWSLETTER_BLOB_TOKEN })
    if (!result || result.statusCode !== 200) return []
    return (await new Response(result.stream).json()) as Subscriber[]
  } catch {
    return []
  }
}

export async function addSubscriber(email: string): Promise<{ success: boolean; error?: string }> {
  if (!NEWSLETTER_BLOB_TOKEN) {
    console.error('NEWSLETTER_READ_WRITE_TOKEN is not set — cannot save subscriber')
    return { success: false, error: 'Failed to save subscription' }
  }
  try {
    const existing = await getSubscribers()
    if (existing.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Already subscribed' }
    }
    const updated = [...existing, { email, subscribedAt: new Date().toISOString() }]
    await put(SUBSCRIBERS_PATH, JSON.stringify(updated, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: NEWSLETTER_BLOB_TOKEN,
    })
    return { success: true }
  } catch (error) {
    // A Blob write failure (e.g. missing token) must return a clear result
    // instead of throwing, so the route can respond with proper JSON.
    console.error('addSubscriber failed - full error:', error)
    console.error('addSubscriber failed - error message:', error instanceof Error ? error.message : String(error))
    console.error('addSubscriber failed - error stack:', error instanceof Error ? error.stack : 'no stack')
    return { success: false, error: 'Failed to save subscription' }
  }
}

export async function removeSubscriber(email: string): Promise<{ success: boolean; error?: string }> {
  if (!NEWSLETTER_BLOB_TOKEN) {
    console.error('NEWSLETTER_READ_WRITE_TOKEN is not set — cannot remove subscriber')
    return { success: false, error: 'Failed to remove subscriber' }
  }
  const existing = await getSubscribers()
  const filtered = existing.filter((s) => s.email.toLowerCase() !== email.toLowerCase())

  if (filtered.length === existing.length) {
    return { success: false, error: 'Subscriber not found' }
  }

  // Keep 'private' to match addSubscriber — this store was switched to private
  // access, and a 'public' write here would flip the whole file back to public.
  await put(SUBSCRIBERS_PATH, JSON.stringify(filtered, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    token: NEWSLETTER_BLOB_TOKEN,
  })

  return { success: true }
}
