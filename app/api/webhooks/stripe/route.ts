import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${(err as Error).message}` }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string | null
      const userId = session.metadata?.userId
      const plan = (session.metadata?.plan ?? 'guard') as 'shield' | 'guard' | 'sentinel'

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_id: subscriptionId ?? null,
            subscription_status: 'active',
            plan,
            // Reset monthly counter on new subscription (not shield — it's one-time)
            ...(plan !== 'shield' ? {
              docs_used_this_month: 0,
              docs_reset_at: new Date().toISOString(),
            } : {}),
          })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('profiles')
        .update({ subscription_status: 'canceled', plan: 'free', subscription_id: null })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const status = sub.status === 'active' ? 'active'
        : sub.status === 'canceled' ? 'canceled'
        : 'past_due'
      await supabase
        .from('profiles')
        .update({
          subscription_status: status,
          ...(status === 'canceled' ? { plan: 'free' } : {}),
        })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', invoice.customer as string)
      break
    }

    // Reset monthly doc counter on successful subscription renewal
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      // Only reset on recurring renewals (billing_reason = subscription_cycle), not first payment
      if (invoice.billing_reason === 'subscription_cycle') {
        await supabase
          .from('profiles')
          .update({
            docs_used_this_month: 0,
            docs_reset_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', invoice.customer as string)
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
