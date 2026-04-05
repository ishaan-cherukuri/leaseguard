import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

type PlanType = 'shield' | 'guard' | 'sentinel'

const PLANS: Record<PlanType, { priceId: string; mode: 'payment' | 'subscription' }> = {
  shield:   { priceId: process.env.STRIPE_SHIELD_PRICE_ID!,   mode: 'payment'      },
  guard:    { priceId: process.env.STRIPE_GUARD_PRICE_ID!,    mode: 'subscription' },
  sentinel: { priceId: process.env.STRIPE_SENTINEL_PRICE_ID!, mode: 'subscription' },
}

// Higher number = higher tier. Shield is one-time and exempt from rank checks.
const SUBSCRIPTION_RANK: Record<string, number> = { free: 0, guard: 1, sentinel: 2 }

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

  // Enforce upgrade-only for subscription plans (shield is one-time, always allowed)
  if (type !== 'shield') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const currentPlan = profile?.plan ?? 'free'
    const currentRank = SUBSCRIPTION_RANK[currentPlan] ?? 0
    const targetRank = SUBSCRIPTION_RANK[type] ?? 0

    if (targetRank <= currentRank) {
      return NextResponse.json(
        { error: 'You can only upgrade to a higher plan.' },
        { status: 400 }
      )
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: plan.mode,
    payment_method_types: ['card'],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/upgrade`,
    metadata: { userId: user.id, plan: type },
    customer_email: user.email,
  })

  return NextResponse.json({ url: session.url })
}
