'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AccountPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      setFullName(data?.full_name ?? '')
      setLoading(false)
    }
    load()
  }, [])

  async function saveName(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ full_name: fullName.trim() || null }).eq('id', user.id)
    }
    setSaving(false)
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2500)
  }

  return (
    <div className="p-8 max-w-2xl relative">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
            <User className="w-4 h-4 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Account</h1>
        </div>
        <p className="text-text-secondary text-sm ml-11">Manage your profile and security settings.</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-border overflow-hidden mb-4"
        style={{ background: 'var(--surface)' }}>
        <div className="px-6 py-4 border-b border-border"
          style={{ background: 'var(--surface-raised)' }}>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-text-muted" />
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Profile</p>
          </div>
        </div>

        <form onSubmit={saveName} className="p-6 space-y-5">
          {/* Email — read only */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email address</label>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm"
              style={{
                background: 'var(--surface-raised)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}>
              <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span>{loading ? '—' : email}</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                read-only
              </span>
            </div>
          </div>

          {/* Full name */}
          <div>
            <label htmlFor="full-name" className="block text-xs font-medium text-text-secondary mb-1.5">Full name</label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
              style={{
                background: 'var(--surface-raised)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || loading}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {nameSaved && (
              <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--safe)' }}>
                <CheckCircle className="w-4 h-4" /> Saved
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Security card */}
      <div className="rounded-2xl border border-border overflow-hidden"
        style={{ background: 'var(--surface)' }}>
        <div className="px-6 py-4 border-b border-border"
          style={{ background: 'var(--surface-raised)' }}>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-text-muted" />
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Security</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Password</p>
              <p className="text-xs text-text-muted mt-0.5">Update your password using your current one to verify.</p>
            </div>
            <Link
              href="/settings/change-password"
              className="btn-ghost flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm shrink-0"
            >
              Change
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
