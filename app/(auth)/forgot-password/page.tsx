'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, ArrowLeft, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <span className="font-display text-lg font-bold text-text-primary">LeaseGuard</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-text-primary">Reset password</h1>
          <p className="text-text-secondary mt-2 text-sm">
            {sent ? 'Link sent — check your inbox.' : "We'll email you a reset link."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border p-7 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />

          {sent ? (
            /* Success state */
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-text-secondary mb-1">We sent a link to</p>
              <p className="font-medium text-text-primary mb-5">{email}</p>
              <p className="text-xs text-text-muted">Didn&apos;t receive it? Check your spam folder.</p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none transition-all"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 40%, transparent)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl text-sm"
                  style={{ background: 'rgba(224,82,82,0.08)', border: '1px solid rgba(224,82,82,0.2)', color: 'var(--critical)' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>

        {/* Back to login */}
        <div className="text-center mt-5">
          <Link href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
