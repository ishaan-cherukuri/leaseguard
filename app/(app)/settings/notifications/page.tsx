'use client'

import { useEffect, useState } from 'react'
import { Bell, Mail, BarChart2, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface NotifPrefs {
  notif_analysis_complete: boolean
  notif_weekly_digest: boolean
  notif_billing_alerts: boolean
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-all duration-200"
      style={{
        background: checked ? 'var(--accent)' : 'var(--border)',
        borderColor: checked ? 'var(--accent)' : 'var(--border)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <span
        className="pointer-events-none inline-block h-4 w-4 rounded-full shadow transition-transform duration-200"
        style={{
          background: 'white',
          transform: checked ? 'translateX(20px)' : 'translateX(2px)',
          marginTop: '2px',
        }}
      />
    </button>
  )
}

export default function NotificationsPage() {
  const supabase = createClient()
  const [prefs, setPrefs] = useState<NotifPrefs>({
    notif_analysis_complete: true,
    notif_weekly_digest: false,
    notif_billing_alerts: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('notif_analysis_complete, notif_weekly_digest, notif_billing_alerts')
        .eq('id', user.id)
        .single()
      if (data) {
        setPrefs({
          notif_analysis_complete: data.notif_analysis_complete ?? true,
          notif_weekly_digest: data.notif_weekly_digest ?? false,
          notif_billing_alerts: data.notif_billing_alerts ?? true,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update(prefs).eq('id', user.id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const rows = [
    {
      key: 'notif_analysis_complete' as const,
      icon: Mail,
      title: 'Analysis complete',
      description: 'Email when your contract analysis finishes',
    },
    {
      key: 'notif_weekly_digest' as const,
      icon: BarChart2,
      title: 'Weekly digest',
      description: 'Summary of your activity sent every Monday',
    },
    {
      key: 'notif_billing_alerts' as const,
      icon: CreditCard,
      title: 'Billing alerts',
      description: 'Payment confirmations, renewals, and failures',
    },
  ]

  return (
    <div className="p-8 max-w-2xl relative">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
            <Bell className="w-4 h-4 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Notifications</h1>
        </div>
        <p className="text-text-secondary text-sm ml-11">Choose what emails you receive from LeaseGuard.</p>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden"
        style={{ background: 'var(--surface)' }}>
        {loading ? (
          <div className="p-6 space-y-5">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-36 rounded" style={{ background: 'var(--surface-raised)' }} />
                  <div className="h-3 w-52 rounded" style={{ background: 'var(--surface-raised)' }} />
                </div>
                <div className="w-11 h-6 rounded-full" style={{ background: 'var(--surface-raised)' }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {rows.map(({ key, icon: Icon, title, description }, i) => (
              <div key={key}
                className={`flex items-center justify-between px-6 py-5 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                    <Icon className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{description}</p>
                  </div>
                </div>
                <div className="ml-6 shrink-0">
                  <Toggle
                    checked={prefs[key]}
                    onChange={v => setPrefs(p => ({ ...p, [key]: v }))}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || loading}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Save preferences'}
        </button>
        {saved && (
          <span className="text-sm font-medium" style={{ color: 'var(--safe)' }}>
            Saved ✓
          </span>
        )}
      </div>
    </div>
  )
}
