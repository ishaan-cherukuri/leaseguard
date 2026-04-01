import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Analysis, Profile } from '@/types'

function RiskBadge({ score, level }: { score: number; level: string }) {
  const color =
    level === 'critical' ? 'var(--critical)' :
    level === 'high' ? 'var(--warning)' :
    level === 'medium' ? 'var(--accent)' :
    'var(--safe)'

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-background"
        style={{ backgroundColor: color }}
      >
        {score}
      </div>
      <span className="text-xs uppercase tracking-wider font-medium" style={{ color }}>
        {level}
      </span>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: analyses }, { data: profile }] = await Promise.all([
    supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
  ])

  const typedAnalyses = (analyses ?? []) as Analysis[]
  const typedProfile = profile as Profile | null

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            {typedProfile?.full_name ? `Hi, ${typedProfile.full_name.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="text-text-secondary mt-1">Your contract analyses</p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-background font-medium hover:bg-accent-hover transition-all text-sm"
        >
          <Upload className="w-4 h-4" />
          New analysis
        </Link>
      </div>

      {/* Usage indicator */}
      <div className="mb-8 p-4 rounded-xl border border-border bg-surface">
        {typedProfile?.subscription_status === 'active' ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-safe" />
            <span className="text-text-secondary text-sm">
              <span className="text-safe font-medium">Unlimited</span> — Active Subscriber
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${(typedProfile?.free_analyses_used ?? 0) >= 1 ? 'bg-critical' : 'bg-accent'}`} />
              <span className="text-text-secondary text-sm">
                <span className="text-text-primary font-medium">
                  {typedProfile?.free_analyses_used ?? 0} of 1
                </span>{' '}
                free analyses used
              </span>
            </div>
            {(typedProfile?.free_analyses_used ?? 0) >= 1 && (
              <span className="text-text-secondary text-sm">
                Upgrades not available yet
              </span>
            )}
          </div>
        )}
      </div>

      {/* Analyses grid */}
      {typedAnalyses.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-xl">
          <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-text-primary mb-2">No analyses yet</h3>
          <p className="text-text-secondary mb-6">Upload your first contract to get started</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-background font-semibold hover:bg-accent-hover transition-all"
          >
            <Upload className="w-4 h-4" />
            Analyze a contract
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {typedAnalyses.map((analysis) => (
            <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
              <div className="p-5 rounded-xl border border-border bg-surface hover:border-accent/40 hover:bg-surface-raised transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-surface-raised flex items-center justify-center">
                    <FileText className="w-4 h-4 text-text-secondary" />
                  </div>
                  {analysis.status === 'processing' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                      Processing
                    </span>
                  )}
                  {analysis.status === 'failed' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-critical/10 text-critical border border-critical/20 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Failed
                    </span>
                  )}
                </div>

                <h4 className="text-text-primary font-medium text-sm truncate mb-1">{analysis.file_name}</h4>
                <p className="text-text-secondary text-xs mb-4 capitalize">
                  {analysis.document_type ?? 'Contract'} · {new Date(analysis.created_at).toLocaleDateString()}
                </p>

                {analysis.status === 'complete' && (
                  <RiskBadge score={analysis.risk_score} level={analysis.risk_level} />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
