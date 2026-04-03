import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Activity, FileText, ArrowUpRight, Shield, Lock, Zap, X } from 'lucide-react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Analysis, Profile, PlanType } from '@/types'
import { PLAN_LIMITS } from '@/types'

const PLAN_META: Record<PlanType, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  free:     { label: 'Free',     icon: X,      color: 'var(--text-muted)',     bg: 'var(--surface-raised)',                                           border: 'var(--border)' },
  shield:   { label: 'Shield',   icon: Shield, color: 'var(--text-secondary)', bg: 'var(--surface-raised)',                                           border: 'var(--border)' },
  guard:    { label: 'Guard',    icon: Lock,   color: 'var(--accent)',          bg: 'var(--accent-dim)',                                               border: 'color-mix(in srgb, var(--accent) 25%, transparent)' },
  sentinel: { label: 'Sentinel', icon: Zap,    color: 'var(--text-primary)',    bg: 'color-mix(in srgb, var(--text-primary) 8%, transparent)',         border: 'color-mix(in srgb, var(--text-primary) 15%, transparent)' },
}

function riskColor(level: string) {
  if (level === 'critical') return 'var(--critical)'
  if (level === 'high') return 'var(--rose)'
  if (level === 'medium') return 'var(--warning)'
  return 'var(--safe)'
}

export default async function UsagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = await createServiceClient()
  const [{ data: profile }, { data: analyses }] = await Promise.all([
    serviceClient.from('profiles').select('*').eq('id', user.id).single(),
    serviceClient
      .from('analyses')
      .select('id, file_name, created_at, risk_score, risk_level, status')
      .eq('user_id', user.id)
      .eq('status', 'complete')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const typedProfile = profile as Profile | null
  const typedAnalyses = (analyses ?? []) as Pick<Analysis, 'id' | 'file_name' | 'created_at' | 'risk_score' | 'risk_level' | 'status'>[]

  const plan: PlanType = typedProfile?.plan ?? 'free'
  const limit = PLAN_LIMITS[plan]
  const meta = PLAN_META[plan]
  const PlanIcon = meta.icon

  const docsUsed = plan === 'shield'
    ? (typedProfile?.free_analyses_used ?? 0)
    : (typedProfile?.docs_used_this_month ?? 0)
  const pct = Math.min((docsUsed / limit) * 100, 100)

  return (
    <div className="p-8 max-w-2xl relative">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">API &amp; Usage</h1>
        </div>
        <p className="text-text-secondary text-sm ml-11">Your current plan and analysis history.</p>
      </div>

      {/* Plan + usage card */}
      <div className="rounded-2xl border border-border overflow-hidden mb-4"
        style={{ background: 'var(--surface)' }}>
        <div className="px-6 py-4 border-b border-border"
          style={{ background: 'var(--surface-raised)' }}>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Current plan</p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                <PlanIcon className="w-4 h-4" style={{ color: meta.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{meta.label}</p>
                <p className="text-xs text-text-muted">
                  {plan === 'shield' ? 'One-time purchase' : plan === 'free' ? 'Free tier' : 'Monthly subscription'}
                </p>
              </div>
            </div>
            {(plan === 'free' || plan === 'shield') && (
              <Link href="/upgrade" className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold">
                Upgrade
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Usage bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-secondary">
                {plan === 'shield' ? 'Analyses used' : 'Docs this month'}
              </span>
              <span className="text-xs font-semibold text-text-primary">
                {docsUsed} / {limit}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: pct >= 100
                    ? 'var(--critical)'
                    : pct >= 75
                      ? 'var(--warning)'
                      : 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
                }}
              />
            </div>
            {pct >= 100 && (
              <p className="text-xs mt-2" style={{ color: 'var(--critical)' }}>
                You&apos;ve reached your limit.{' '}
                <Link href="/upgrade" className="underline underline-offset-2">Upgrade to continue.</Link>
              </p>
            )}
            {plan !== 'shield' && plan !== 'free' && (
              <p className="text-xs text-text-muted mt-2">Resets on the 1st of each month.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent analyses card */}
      <div className="rounded-2xl border border-border overflow-hidden"
        style={{ background: 'var(--surface)' }}>
        <div className="px-6 py-4 border-b border-border"
          style={{ background: 'var(--surface-raised)' }}>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Last 5 analyses</p>
        </div>

        {typedAnalyses.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <FileText className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-muted">No completed analyses yet.</p>
            <Link href="/upload" className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm mt-4">
              Run your first analysis
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {typedAnalyses.map(a => (
              <Link key={a.id} href={`/analysis/${a.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-accent/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                  <FileText className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{a.file_name}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `color-mix(in srgb, ${riskColor(a.risk_level)} 15%, transparent)`,
                      color: riskColor(a.risk_level),
                      border: `1px solid color-mix(in srgb, ${riskColor(a.risk_level)} 30%, transparent)`,
                    }}>
                    {a.risk_score}
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold hidden sm:block"
                    style={{ color: riskColor(a.risk_level) }}>
                    {a.risk_level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {(plan === 'guard' || plan === 'sentinel') && (
        <div className="mt-4 text-center">
          <Link href="/upgrade" className="btn-ghost inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
            View all plans
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
