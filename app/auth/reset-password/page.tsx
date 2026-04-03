'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
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

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [ready, setReady] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function init() {
      const code = searchParams.get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setInitError('This reset link is invalid or has expired.')
          return
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setInitError('This reset link is invalid or has expired.')
          return
        }
      }
      setReady(true)
    }
    init()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (newPassword !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword })
    if (updateErr) { setError(updateErr.message); setLoading(false); return }

    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  // Invalid / expired link
  if (initError) {
    return (
      <div className="text-center py-2">
        <p className="text-sm mb-1" style={{ color: 'var(--critical)' }}>{initError}</p>
        <Link href="/forgot-password" className="text-sm text-accent hover:text-accent-hover transition-colors">
          Request a new link →
        </Link>
      </div>
    )
  }

  // Success
  if (done) {
    return (
      <div className="text-center py-2">
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--safe) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--safe) 30%, transparent)' }}>
          <CheckCircle className="w-6 h-6" style={{ color: 'var(--safe)' }} />
        </div>
        <p className="font-medium text-text-primary mb-1">Password updated</p>
        <p className="text-xs text-text-muted">Redirecting you to sign in…</p>
      </div>
    )
  }

  // Loading (exchanging code)
  if (!ready) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-5 h-5 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    )
  }

  // Form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput
        id="new-password"
        label="New password"
        value={newPassword}
        onChange={setNewPassword}
        placeholder="Min. 8 characters"
      />
      <PasswordInput
        id="confirm-password"
        label="Confirm password"
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
        disabled={loading || !newPassword || !confirm}
        className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
      >
        {loading ? 'Updating…' : 'Set new password'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <span className="font-display text-lg font-bold text-text-primary">LeaseGuard</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-text-primary">Set new password</h1>
          <p className="text-text-secondary mt-2 text-sm">Choose a strong password for your account.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border p-7 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />

          <Suspense fallback={
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>

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
