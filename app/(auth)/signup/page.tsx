'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, Mail, ArrowLeft, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Defined OUTSIDE the page component so React never recreates it on re-render,
// which would unmount inputs and steal focus after every keystroke.
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <span className="font-display text-lg font-bold text-text-primary">LeaseGuard</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}

type Step = 'form' | 'otp'

export default function SignupPage() {
  const router = useRouter()

  // Form fields — kept in state across both steps
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // UI state
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Email-specific error (shown inline under the email field)
  const [emailError, setEmailError] = useState<string | null>(null)

  // OTP input — 6 separate boxes
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step === 'otp') otpRefs.current[0]?.focus()
  }, [step])

  // ── Step 1: send OTP ─────────────────────────────────────────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setEmailError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName }),
      })
      const data = await res.json() as { ok?: boolean; error?: string; message?: string }

      if (!res.ok) {
        if (data.error === 'account_exists') {
          // Show inline under the email field — do NOT advance to OTP step
          setEmailError('account_exists')
          return
        }
        setError(data.message ?? 'Something went wrong. Please try again.')
        return
      }

      setStep('otp')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: verify OTP + create account ──────────────────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const code = otp.join('')
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password }),
      })
      const data = await res.json() as { ok?: boolean; error?: string; message?: string }

      if (!res.ok) {
        if (data.error === 'account_exists') {
          // Race condition — back to form with email error
          setStep('form')
          setEmailError('account_exists')
          return
        }
        if (data.error === 'otp_expired') {
          setStep('form')
          setOtp(['', '', '', '', '', ''])
          setError('Verification code expired. Please try again.')
          return
        }
        setError(data.message ?? 'Verification failed. Please try again.')
        return
      }

      // Account created — sign in via client so session cookies are set,
      // then hard-navigate so the middleware sees the fresh session.
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        // Sign-in failed unexpectedly — send to login with a hint
        window.location.href = '/login?created=1'
        return
      }

      window.location.href = '/dashboard'
    } finally {
      setLoading(false)
    }
  }

  // ── OTP box key handler ───────────────────────────────────────────────────────
  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      e.preventDefault()
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  // ── OTP step ──────────────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <Shell>
        <div className="rounded-2xl border border-border p-7 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />

          <button
            onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '']); setError(null) }}
            className="flex items-center gap-1.5 text-text-muted hover:text-text-secondary text-xs mb-5 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>

          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
            <Mail className="w-5 h-5 text-accent" />
          </div>

          <h1 className="font-display text-2xl font-bold text-text-primary mb-1">Check your email</h1>
          <p className="text-text-secondary text-sm mb-1">
            We sent a 6-digit code to
          </p>
          <p className="text-accent text-sm font-medium mb-6">{email}</p>

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* 6-box OTP input */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">
                Verification code
              </label>
              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-14 text-center text-xl font-bold rounded-xl text-text-primary focus:outline-none transition-all shrink-0"
                    style={{
                      background: 'var(--background)',
                      border: digit ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 60%, transparent)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = digit ? 'var(--accent)' : 'var(--border)'}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm"
                style={{ background: 'rgba(224,82,82,0.08)', border: '1px solid rgba(224,82,82,0.2)', color: 'var(--critical)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              style={{
                width: '100%', padding: '0.75rem',
                background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: '0.75rem',
                fontSize: '0.875rem', fontWeight: 600,
                cursor: (loading || otp.join('').length < 6) ? 'not-allowed' : 'pointer',
                opacity: (loading || otp.join('').length < 6) ? 0.5 : 1,
              }}
            >
              {loading ? 'Verifying...' : 'Verify & create account'}
            </button>
          </form>

          <button
            onClick={handleSendOtp as unknown as React.MouseEventHandler}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-1.5 text-text-muted hover:text-text-secondary text-xs transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3 h-3" />
            Resend code
          </button>

          <p className="text-center text-text-muted text-xs mt-4">
            Code expires in 10 minutes
          </p>
        </div>
      </Shell>
    )
  }

  // ── Step 1: registration form ─────────────────────────────────────────────────
  return (
    <Shell>
      <h1 className="font-display text-3xl font-bold text-text-primary text-center mb-2">Create your account</h1>
      <p className="text-text-secondary text-center text-sm mb-8">First contract is completely free.</p>

      <div className="rounded-2xl border border-border p-7 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none transition-all"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 40%, transparent)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(null) }}
              className="w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none transition-all"
              style={{
                background: 'var(--background)',
                border: emailError ? '1px solid rgba(224,82,82,0.5)' : '1px solid var(--border)',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = emailError ? 'rgba(224,82,82,0.5)' : 'color-mix(in srgb, var(--accent) 40%, transparent)'}
              onBlur={(e) => e.currentTarget.style.borderColor = emailError ? 'rgba(224,82,82,0.5)' : 'var(--border)'}
              placeholder="you@example.com"
            />
            {/* Inline duplicate-email error */}
            {emailError === 'account_exists' && (
              <p className="mt-1.5 text-xs" style={{ color: 'var(--critical)' }}>
                An account with this email already exists.{' '}
                <Link href="/login" className="underline font-semibold" style={{ color: 'var(--accent)' }}>
                  Sign in instead?
                </Link>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none transition-all pr-12"
                style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 40%, transparent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
            style={{
              width: '100%', padding: '0.75rem', marginTop: '0.5rem',
              background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: '0.75rem',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Sending code...' : 'Send verification code'}
          </button>

          <p className="text-center text-xs text-text-muted">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <p className="text-center text-text-secondary text-sm mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </Shell>
  )
}
