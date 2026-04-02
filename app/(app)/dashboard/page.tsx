import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Upload, FileText, AlertCircle, TrendingUp, Shield, Lock, Zap, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Analysis, Profile, PlanType } from '@/types'
import { PLAN_LIMITS } from '@/types'

const PLAN_META: Record<PlanType, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  free:     { label: 'Free',     icon: X,      color: 'var(--text-muted)',      bg: 'var(--surface-raised)',                                              border: 'var(--border)' },
  shield:   { label: 'Shield',   icon: Shield, color: 'var(--text-secondary)',  bg: 'var(--surface-raised)',                                              border: 'var(--border)' },
  guard:    { label: 'Guard',    icon: Lock,   color: 'var(--accent)',           bg: 'var(--accent-dim)',                                                  border: 'color-mix(in srgb, var(--accent) 25%, transparent)' },
  sentinel: { label: 'Sentinel', icon: Zap,    color: 'var(--text-primary)',     bg: 'color-mix(in srgb, var(--text-primary) 8%, transparent)',            border: 'color-mix(in srgb, var(--text-primary) 15%, transparent)' },
}

function RiskBadge({ score, level }: { score: number; level: string }) {
  const color =
    level === 'critical' ? 'var(--critical)' :
    level === 'high' ? 'var(--rose)' :
    level === 'medium' ? 'var(--warning)' :
    'var(--safe)'

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` }}>
        {score}
      </div>
      <span className="text-xs uppercase tracking-wider font-semibold" style={{ color }}>{level}</span>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: analyses }, { data: profile }] = await Promise.all([
    supabase.from('analyses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ])

  const typedAnalyses = (analyses ?? []) as Analysis[]
  const typedProfile = profile as Profile | null

  const plan: PlanType = typedProfile?.plan ?? 'free'
  const limit = PLAN_LIMITS[plan]
  const meta = PLAN_META[plan]
  const PlanIcon = meta.icon

  // Compute usage
  const docsUsed = plan === 'shield'
    ? (typedProfile?.free_analyses_used ?? 0)
    : (typedProfile?.docs_used_this_month ?? 0)
  const pct = Math.min((docsUsed / limit) * 100, 100)
  const isAtLimit = docsUsed >= limit

  return (
    <div className="p-8 max-w-6xl relative">

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(ellipse, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            {typedProfile?.full_name ? `Welcome back, ${typedProfile.full_name.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Your contract analysis history</p>
        </div>
        <Link href="/upload" className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm">
          <Upload className="w-4 h-4" />
          New analysis
        </Link>
      </div>

      {/* Usage card */}
      <div className="mb-8 p-5 rounded-2xl border border-border relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Plan icon */}
            <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
              style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
              <PlanIcon className="w-4 h-4" style={{ color: meta.color }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-text-primary font-medium text-sm">{meta.label} plan</p>
                {plan === 'shield' && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    one-time
                  </span>
                )}
                {(plan === 'guard' || plan === 'sentinel') && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: 'var(--safe)', background: 'color-mix(in srgb, var(--safe) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--safe) 20%, transparent)' }}>
                    active
                  </span>
                )}
              </div>
              <p className="text-text-muted text-xs mt-0.5">
                {plan === 'shield' ? '1 contract · one-time' : `${limit} contracts / month`}
              </p>
            </div>
          </div>

          {/* Usage count */}
          <div className="text-right shrink-0">
            <p className="text-text-primary font-mono text-sm font-semibold">{docsUsed} / {limit}</p>
            <p className="text-text-muted text-xs">{plan === 'shield' ? 'used' : 'this month'}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-2">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: isAtLimit
                  ? 'linear-gradient(90deg, var(--warning), var(--critical))'
                  : 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
              }} />
          </div>

          {isAtLimit && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-secondary">
                {plan === 'free' ? 'Upgrade for more analyses.' : plan === 'shield' ? 'Upgrade to a monthly plan.' : 'Limit reached — resets next month.'}
              </p>
              {(plan === 'free' || plan === 'shield') && (
                <Link href="/upgrade"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold btn-primary"
                >
                  <TrendingUp className="w-3 h-3" />
                  Upgrade
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analyses grid */}
      {typedAnalyses.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-dashed border-border relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}>
              <FileText className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">No analyses yet</h3>
            <p className="text-text-secondary text-sm mb-8">Upload your first contract to get started</p>
            <Link href="/upload" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
              <Upload className="w-4 h-4" />
              Analyze a contract
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {typedAnalyses.map((analysis) => (
            <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
              <div className="card-interactive group p-5 rounded-2xl border border-border cursor-pointer relative overflow-hidden"
                style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, var(--accent-dim) 0%, transparent 60%)' }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors group-hover:border-accent/40"
                      style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                      <FileText className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors" />
                    </div>
                    {analysis.status === 'processing' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
                        Processing
                      </span>
                    )}
                    {analysis.status === 'failed' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                        style={{ color: 'var(--critical)', background: 'color-mix(in srgb, var(--critical) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--critical) 20%, transparent)' }}>
                        <AlertCircle className="w-3 h-3" />Failed
                      </span>
                    )}
                  </div>

                  <p className="text-text-primary font-medium text-sm truncate mb-1">{analysis.file_name}</p>
                  <p className="text-text-secondary text-xs mb-4 capitalize">
                    {analysis.document_type ?? 'Contract'} · {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  {analysis.status === 'complete' && (
                    <RiskBadge score={analysis.risk_score} level={analysis.risk_level} />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
