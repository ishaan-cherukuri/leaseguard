import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

type PlanType = 'shield' | 'guard' | 'sentinel'

const PLANS: Record<PlanType, { priceId: string; mode: 'payment' | 'subscription' }> = {
  shield:   { priceId: process.env.STRIPE_SHIELD_PRICE_ID!,   mode: 'payment'      },
  guard:    { priceId: process.env.STRIPE_GUARD_PRICE_ID!,    mode: 'subscription' },
  sentinel: { priceId: process.env.STRIPE_SENTINEL_PRICE_ID!, mode: 'subscription' },
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type } = await request.json() as { type: PlanType }
  const plan = PLANS[type]

  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: plan.mode,
    payment_method_types: ['card'],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgrade=success`,
    cancel_url: `${appUrl}/upgrade`,
    metadata: { userId: user.id, plan: type },
    customer_email: user.email,
  })

  return NextResponse.json({ url: session.url })
}
