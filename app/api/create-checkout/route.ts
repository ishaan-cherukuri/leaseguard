import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type } = await request.json() as { type: 'subscription' | 'one_time' }

  const priceId =
    type === 'subscription'
      ? process.env.STRIPE_SUBSCRIPTION_PRICE_ID!
      : process.env.STRIPE_ONE_TIME_PRICE_ID!

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: type === 'subscription' ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgrade=success`,
    cancel_url: `${appUrl}/upload`,
    metadata: { userId: user.id },
    customer_email: user.email,
  })

  return NextResponse.json({ url: session.url })
}
