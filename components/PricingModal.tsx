'use client'

import { useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface PricingModalProps {
  onClose: () => void
}

export default function PricingModal({ onClose }: PricingModalProps) {
  const [loading, setLoading] = useState<'subscription' | 'one_time' | null>(null)

  async function handleUpgrade(type: 'subscription' | 'one_time') {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
          Upgrade to continue
        </h2>
        <p className="text-text-secondary mb-8">
          You&apos;ve used your free analysis. Choose a plan to keep going.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* One-time */}
          <div className="p-6 rounded-xl border border-border">
            <div className="text-text-secondary text-xs uppercase tracking-wider mb-2">One-time</div>
            <div className="font-display text-3xl font-bold text-text-primary mb-1">$19</div>
            <div className="text-text-secondary text-sm mb-5">single analysis</div>
            <ul className="space-y-2 mb-6">
              {['Full analysis report', 'Risk score', 'Negotiation scripts'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-text-secondary text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-safe shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade('one_time')}
              disabled={!!loading}
              className="w-full py-2.5 rounded-md border border-border text-text-primary hover:border-accent hover:text-accent transition-all text-sm font-medium disabled:opacity-50"
            >
              {loading === 'one_time' ? 'Redirecting...' : 'Pay $19'}
            </button>
          </div>

          {/* Subscription */}
          <div className="p-6 rounded-xl border-2 border-accent bg-surface-raised">
            <div className="text-accent text-xs uppercase tracking-wider mb-2">Best value</div>
            <div className="font-display text-3xl font-bold text-text-primary mb-1">$9.99</div>
            <div className="text-text-secondary text-sm mb-5">per month · unlimited</div>
            <ul className="space-y-2 mb-6">
              {['Unlimited analyses', 'Full reports', 'Negotiation scripts', 'Priority processing'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-text-secondary text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-safe shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade('subscription')}
              disabled={!!loading}
              className="w-full py-2.5 rounded-md bg-accent text-background font-semibold hover:bg-accent-hover transition-all text-sm disabled:opacity-50"
            >
              {loading === 'subscription' ? 'Redirecting...' : 'Subscribe — $9.99/mo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
