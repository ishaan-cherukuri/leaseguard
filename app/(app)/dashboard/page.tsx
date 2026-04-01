import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Upload, FileText, AlertCircle, TrendingUp, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Analysis, Profile } from '@/types'

function RiskBadge({ score, level }: { score: number; level: string }) {
  const color =
    level === 'critical' ? '#E05252' :
    level === 'high' ? '#E8445A' :
    level === 'medium' ? '#E09A30' :
    '#3ECF8E'

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
  const isSubscribed = typedProfile?.subscription_status === 'active'
  const wordsUsed = typedProfile?.free_analyses_used ?? 0
  const FREE_LIMIT = 10000
  const pct = Math.min((wordsUsed / FREE_LIMIT) * 100, 100)

  return (
    <div className="p-8 max-w-6xl relative">

      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            {typedProfile?.full_name ? `Welcome back, ${typedProfile.full_name.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Your contract analysis history</p>
        </div>
        <Link href="/upload"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#080910' }}
        >
          <Upload className="w-4 h-4" />
          New analysis
        </Link>
      </div>

      {/* Usage card */}
      <div className="mb-8 p-5 rounded-2xl border border-border relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />

        {isSubscribed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(62,207,142,0.1)', border: '1px solid rgba(62,207,142,0.2)' }}>
              <Shield className="w-4 h-4 text-safe" />
            </div>
            <div>
              <p className="text-text-primary font-medium text-sm">Unlimited analyses</p>
              <p className="text-text-secondary text-xs">Active subscriber</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-text-primary text-sm font-medium">Free tier usage</span>
              </div>
              <span className="text-text-secondary text-xs font-mono">
                {wordsUsed.toLocaleString()} / {FREE_LIMIT.toLocaleString()} words
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: pct > 80 ? 'linear-gradient(90deg, #E09A30, #E05252)' : 'linear-gradient(90deg, #C9A84C, #E2C06A)',
                }} />
            </div>
          </div>
        )}
      </div>

      {/* Analyses grid */}
      {typedAnalyses.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-dashed border-border relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <FileText className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">No analyses yet</h3>
            <p className="text-text-secondary text-sm mb-8">Upload your first contract to get started</p>
            <Link href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#080910' }}
            >
              <Upload className="w-4 h-4" />
              Analyze a contract
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {typedAnalyses.map((analysis) => (
            <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
              <div className="group p-5 rounded-2xl border border-border transition-all hover:border-accent/30 hover:translate-y-[-2px] cursor-pointer relative overflow-hidden"
                style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                      <FileText className="w-4 h-4 text-text-secondary" />
                    </div>
                    {analysis.status === 'processing' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ color: 'var(--accent)', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                        Processing
                      </span>
                    )}
                    {analysis.status === 'failed' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                        style={{ color: 'var(--critical)', background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.2)' }}>
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
