'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

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
          <h1 className="font-display text-3xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-secondary mt-2 text-sm">Sign in to your account</p>
        </div>

        <div className="rounded-2xl border border-border p-7 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Email
              </label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none transition-all"
                style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 40%, transparent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-accent hover:text-accent-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none transition-all pr-12"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 40%, transparent)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
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

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {loading ? 'Signing in...' : <>Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-5">
            No account?{' '}
            <Link href="/signup" className="text-accent hover:text-accent-hover transition-colors font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
