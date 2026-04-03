'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          required
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none transition-all pr-12"
          style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 40%, transparent)'
            e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 10%, transparent)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          placeholder={placeholder ?? '••••••••'}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

export default function ChangePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (next.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (next !== confirm) {
      setError('New passwords do not match.')
      return
    }
    if (current === next) {
      setError('New password must differ from your current password.')
      return
    }

    setLoading(true)

    // Verify current password by re-authenticating
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: current })
    if (signInErr) {
      setError('Current password is incorrect.')
      setLoading(false)
      return
    }

    // Update to new password
    const { error: updateErr } = await supabase.auth.updateUser({ password: next })
    if (updateErr) {
      setError(updateErr.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setDone(true)
  }

  // ── Success screen ─────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-full flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="w-full max-w-sm relative z-10 text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'color-mix(in srgb, var(--safe) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--safe) 30%, transparent)' }}>
            <CheckCircle className="w-7 h-7" style={{ color: 'var(--safe)' }} />
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Password updated</h2>
          <p className="text-text-secondary text-sm mb-8">Your password has been changed successfully.</p>
          <Link href="/settings/account" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
            Back to account
          </Link>
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-full flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <span className="font-display text-lg font-bold text-text-primary">LeaseGuard</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-accent" />
            <h1 className="font-display text-3xl font-bold text-text-primary">Change password</h1>
          </div>
          <p className="text-text-secondary text-sm">Enter your current password to continue.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border p-7 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="current-password"
              label="Current password"
              value={current}
              onChange={setCurrent}
              placeholder="Your current password"
            />

            <div className="border-t border-border my-1" />

            <PasswordInput
              id="new-password"
              label="New password"
              value={next}
              onChange={setNext}
              placeholder="Min. 8 characters"
            />

            <PasswordInput
              id="confirm-password"
              label="Confirm new password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Repeat new password"
            />

            {error && (
              <div className="p-3 rounded-xl text-sm"
                style={{ background: 'rgba(224,82,82,0.08)', border: '1px solid rgba(224,82,82,0.2)', color: 'var(--critical)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !current || !next || !confirm}
              className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-5">
          <Link href="/settings/account"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to account
          </Link>
        </div>
      </div>
    </div>
  )
}
