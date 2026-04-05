'use client'

import { useState } from 'react'
import { CheckCircle, X, Shield, Lock, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type PlanType = 'shield' | 'guard' | 'sentinel'

// Higher number = higher tier. Shield is one-time (exempt from rank check).
const SUBSCRIPTION_RANK: Record<string, number> = { free: 0, guard: 1, sentinel: 2 }

const PLANS = [
  {
    id: null,
    name: 'Free',
    icon: X,
    iconColor: 'var(--text-muted)',
    iconBg: 'var(--surface-raised)',
    iconBorder: 'var(--border)',
    price: '$0',
    period: '',
    tagline: '1 doc / month',
    badge: null,
    featured: false,
    planKey: 'free',
    features: [
      { text: '1 contract per month', included: true },
      { text: 'Risk score', included: true },
      { text: 'Flagged clause list', included: true },
      { text: 'Explanations', included: false },
      { text: 'Negotiation scripts', included: false },
      { text: 'Heavy doc support', included: false },
    ],
    cta: null as PlanType | null,
    ctaLabel: 'Current plan',
  },
  {
    id: 'shield' as PlanType,
    name: 'Shield',
    icon: Shield,
    iconColor: 'var(--text-secondary)',
    iconBg: 'var(--surface-raised)',
    iconBorder: 'var(--border)',
    price: '$14',
    period: 'one-time',
    tagline: '1 doc included',
    badge: null,
    featured: false,
    planKey: 'shield',
    features: [
      { text: '1 contract analysis', included: true },
      { text: 'Risk score', included: true },
      { text: 'Flagged clause list', included: true },
      { text: 'Full explanations', included: true },
      { text: 'Negotiation scripts', included: true },
      { text: '1 heavy doc = 1 doc credit', included: true },
    ],
    cta: 'shield' as PlanType,
    ctaLabel: 'Get Shield — $14',
  },
  {
    id: 'guard' as PlanType,
    name: 'Guard',
    icon: Lock,
    iconColor: 'var(--accent)',
    iconBg: 'var(--accent-dim)',
    iconBorder: 'color-mix(in srgb, var(--accent) 25%, transparent)',
    price: '$9.99',
    period: '/mo',
    tagline: '4 docs / month',
    badge: 'MOST POPULAR',
    featured: true,
    planKey: 'guard',
    features: [
      { text: '4 contracts per month', included: true },
      { text: 'Risk score', included: true },
      { text: 'Flagged clause list', included: true },
      { text: 'Full explanations', included: true },
      { text: 'Negotiation scripts', included: true },
      { text: '1 heavy doc = 2 doc credits', included: true },
    ],
    cta: 'guard' as PlanType,
    ctaLabel: 'Subscribe — $9.99/mo',
  },
  {
    id: 'sentinel' as PlanType,
    name: 'Sentinel',
    icon: Zap,
    iconColor: 'var(--text-primary)',
    iconBg: 'color-mix(in srgb, var(--text-primary) 8%, transparent)',
    iconBorder: 'color-mix(in srgb, var(--text-primary) 15%, transparent)',
    price: '$24.99',
    period: '/mo',
    tagline: '12 docs / month',
    badge: null,
    featured: false,
    planKey: 'sentinel',
    features: [
      { text: '12 contracts per month', included: true },
      { text: 'Risk score', included: true },
      { text: 'Flagged clause list', included: true },
      { text: 'Full explanations', included: true },
      { text: 'Negotiation scripts', included: true },
      { text: '1 heavy doc = 2 doc credits', included: true },
    ],
    cta: 'sentinel' as PlanType,
    ctaLabel: 'Subscribe — $24.99/mo',
  },
]

interface UpgradePlansProps {
  currentPlan: string
}

export default function UpgradePlans({ currentPlan }: UpgradePlansProps) {
  const [loading, setLoading] = useState<PlanType | null>(null)

  const currentRank = SUBSCRIPTION_RANK[currentPlan] ?? 0

  async function handleUpgrade(type: PlanType) {
    setLoading(type)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  function getPlanState(plan: typeof PLANS[number]): {
    disabled: boolean
    label: string
    reason: string | null
  } {
    // Free card — never has a CTA
    if (!plan.cta) return { disabled: true, label: currentPlan === 'free' ? 'Current plan' : 'Not available', reason: null }

    // Shield (one-time) — exempt from rank restriction
    if (plan.planKey === 'shield') {
      if (currentPlan === 'shield') return { disabled: true, label: 'Purchased', reason: null }
      return { disabled: false, label: plan.ctaLabel, reason: null }
    }

    // Subscription plans
    const planRank = SUBSCRIPTION_RANK[plan.planKey] ?? 0
    if (currentPlan === plan.planKey) return { disabled: true, label: 'Current plan', reason: null }
    if (planRank < currentRank) return { disabled: true, label: 'Lower tier', reason: 'You\'re already on a higher plan' }
    if (planRank === currentRank) return { disabled: true, label: 'Current plan', reason: null }

    return { disabled: false, label: plan.ctaLabel, reason: null }
  }

  return (
    <div className="p-8 max-w-6xl">

      {/* Back */}
      <Link href="/dashboard"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
          Choose a plan
        </h1>
        <p className="text-text-secondary">
          {currentPlan === 'free'
            ? 'Start free. Upgrade when you need more.'
            : `You're on the ${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan. Upgrade to unlock more.`
          }
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch" style={{ overflow: 'visible' }}>
        {PLANS.map((plan) => {
          const Icon = plan.icon
          const isFeatured = plan.featured
          const state = getPlanState(plan)
          const isCurrentPlan = plan.planKey === currentPlan

          return (
            <div key={plan.name} className="flex flex-col" style={{ paddingTop: isFeatured ? '18px' : '0', overflow: 'visible' }}>
              <div
                className={`relative rounded-2xl p-6 flex flex-col h-full ${
                  isCurrentPlan
                    ? 'border-2'
                    : isFeatured
                    ? 'gradient-border glow-gold scale-[1.02]'
                    : 'border border-border'
                }`}
                style={{
                  background: isCurrentPlan
                    ? 'var(--surface)'
                    : isFeatured
                    ? 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent) 0%, var(--surface) 70%)'
                    : 'var(--surface)',
                  borderColor: isCurrentPlan ? 'var(--accent)' : undefined,
                  opacity: state.disabled && !isCurrentPlan && plan.planKey !== 'free' ? 0.55 : 1,
                  overflow: 'visible',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="btn-primary absolute left-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{ top: '-14px', transform: 'translateX(-50%)', zIndex: 10 }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Current plan indicator */}
                {isCurrentPlan && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
                    Active
                  </div>
                )}

                {/* Icon + name */}
                <div className="mb-5">
                  <div
                    className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: plan.iconBg, border: `1px solid ${plan.iconBorder}` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: plan.iconColor }} />
                  </div>
                  <div
                    className="text-xs uppercase tracking-widest mb-3 font-semibold"
                    style={{ color: isFeatured ? 'var(--accent)' : 'var(--text-secondary)' }}
                  >
                    {plan.name}
                  </div>

                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-display text-4xl font-bold text-text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="text-text-secondary text-sm mb-1.5">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-text-secondary text-xs">{plan.tagline}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: f.included ? (isFeatured ? 'var(--accent)' : 'var(--safe)') : 'var(--border)' }}
                      />
                      <span style={{ color: f.included ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.cta ? (
                  <div className="mt-auto space-y-1">
                    <button
                      onClick={() => !state.disabled && handleUpgrade(plan.cta!)}
                      disabled={state.disabled || !!loading}
                      className={`w-full h-12 rounded-xl text-sm font-semibold disabled:pointer-events-none ${
                        state.disabled
                          ? 'disabled:opacity-40'
                          : isFeatured
                          ? 'btn-primary'
                          : 'btn-ghost'
                      }`}
                    >
                      {loading === plan.cta ? 'Redirecting...' : state.label}
                    </button>
                    {state.reason && (
                      <p className="text-center text-xs text-text-muted">{state.reason}</p>
                    )}
                  </div>
                ) : (
                  <div
                    className="mt-auto w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                  >
                    {isCurrentPlan ? 'Current plan' : plan.ctaLabel}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Heavy doc note */}
      <div className="mt-8 p-4 rounded-xl border border-border"
        style={{ background: 'var(--surface-raised)' }}>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-text-primary font-medium">Heavy documents</span> — contracts over 20 pages or 5,000 words count as 2 doc credits on Guard and Sentinel plans.
          On Shield, a heavy doc still counts as 1 (your only credit).
        </p>
      </div>

      <p className="text-center text-text-muted text-xs mt-6">
        Payments processed securely by Stripe. Monthly plans cancel anytime.
      </p>
    </div>
  )
}
