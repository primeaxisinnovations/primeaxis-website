import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { addSubscriber } from '@/lib/newsletter'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const result = await addSubscriber(email)

    if (!result.success) {
      // 'Already subscribed' is a client-side conflict (409); any other failure
      // (e.g. the Blob write failing) is a server error (500).
      const status = result.error === 'Already subscribed' ? 409 : 500
      return NextResponse.json({ error: result.error }, { status })
    }

    // Lazy-init Resend inside the handler and guard the key: a missing/empty
    // RESEND_API_KEY must never crash the route — the subscriber is already
    // saved, so we simply skip the welcome email and log it.
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured — skipping welcome email')
    } else {
      const resend = new Resend(process.env.RESEND_API_KEY)
      try {
        await resend.emails.send({
          from: 'PrimeAxis Innovations <news@primeaxisinnovations.com.ng>',
          to: email,
          subject: 'Welcome to PrimeAxis Intelligence Briefings',
          html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0D1824; color: #ffffff;">
          <h1 style="color: #c8a96e; font-size: 24px;">Welcome to PrimeAxis</h1>
          <p style="color: #d1d5db; line-height: 1.6;">
            Thank you for subscribing to PrimeAxis Intelligence Briefings — strategic intelligence, policy analysis, and industry perspectives on Africa's maritime sector, delivered direct to your inbox.
          </p>
          <p style="color: #d1d5db; line-height: 1.6;">
            You'll hear from us with our latest analysis and executive conversations shaping the industry.
          </p>
          <p style="color: #8b93a3; font-size: 12px; margin-top: 40px;">
            PrimeAxis Innovations Limited — Africa's Maritime Intelligence Platform
          </p>
        </div>
      `,
        })
      } catch (emailError) {
        // Subscriber is saved even if email fails - log but don't fail the request
        console.error('Welcome email failed to send:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    // Catch-all so the endpoint never returns a non-JSON 500, regardless of
    // misconfiguration (e.g. a malformed request body).
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
