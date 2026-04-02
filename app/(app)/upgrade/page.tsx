'use client'

import { useState } from 'react'
import { CheckCircle, X, Shield, Lock, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type PlanType = 'shield' | 'guard' | 'sentinel'

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
    features: [
      { text: '1 contract per month', included: true },
      { text: 'Risk score', included: true },
      { text: 'Flagged clause list', included: true },
      { text: 'Explanations', included: false },
      { text: 'Negotiation scripts', included: false },
      { text: 'Heavy doc support', included: false },
    ],
    cta: null,
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
    features: [
      { text: '1 contract analysis', included: true },
      { text: 'Risk score', included: true },
      { text: 'Flagged clause list', included: true },
      { text: 'Full explanations', included: true },
      { text: 'Negotiation scripts', included: true },
      { text: '1 heavy doc = 1 doc credit', included: true },
    ],
    cta: 'shield',
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
    features: [
      { text: '4 contracts per month', included: true },
      { text: 'Risk score', included: true },
      { text: 'Flagged clause list', included: true },
      { text: 'Full explanations', included: true },
      { text: 'Negotiation scripts', included: true },
      { text: '1 heavy doc = 2 doc credits', included: true },
    ],
    cta: 'guard',
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
    features: [
      { text: '12 contracts per month', included: true },
      { text: 'Risk score', included: true },
      { text: 'Flagged clause list', included: true },
      { text: 'Full explanations', included: true },
      { text: 'Negotiation scripts', included: true },
      { text: '1 heavy doc = 2 doc credits', included: true },
    ],
    cta: 'sentinel',
    ctaLabel: 'Subscribe — $24.99/mo',
  },
]

export default function UpgradePage() {
  const [loading, setLoading] = useState<PlanType | null>(null)

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
          Start free. Upgrade when you need more.
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          const isFeatured = plan.featured

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col overflow-hidden ${isFeatured ? 'gradient-border glow-gold' : 'border border-border'}`}
              style={{
                background: isFeatured
                  ? 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent) 0%, var(--surface) 70%)'
                  : 'var(--surface)',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold btn-primary">
                  {plan.badge}
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

                {/* Price */}
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
                <button
                  onClick={() => handleUpgrade(plan.cta as PlanType)}
                  disabled={!!loading}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none ${
                    isFeatured ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  {loading === plan.cta ? 'Redirecting...' : plan.ctaLabel}
                </button>
              ) : (
                <div
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-center"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  {plan.ctaLabel}
                </div>
              )}
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

      {/* Footer note */}
      <p className="text-center text-text-muted text-xs mt-6">
        Payments processed securely by Stripe. Monthly plans cancel anytime.
      </p>
    </div>
  )
}
