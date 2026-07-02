import { put, get } from '@vercel/blob'

interface Subscriber {
  email: string
  subscribedAt: string
}

const SUBSCRIBERS_PATH = 'newsletter/subscribers.json'

export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    // Private blob: `get` authenticates via BLOB_READ_WRITE_TOKEN and resolves
    // the store URL from the pathname — an anonymous fetch would be rejected.
    const result = await get(SUBSCRIBERS_PATH, { access: 'private' })
    if (!result || result.statusCode !== 200) return []
    return (await new Response(result.stream).json()) as Subscriber[]
  } catch {
    return []
  }
}

export async function addSubscriber(email: string): Promise<{ success: boolean; error?: string }> {
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
  })

  return { success: true }
}
