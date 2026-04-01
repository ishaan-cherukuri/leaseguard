import { redirect, notFound } from 'next/navigation'
import { DollarSign, TrendingUp, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import RiskGauge from '@/components/RiskGauge'
import ClauseCard from '@/components/ClauseCard'
import AnalysisSkeleton from '@/components/AnalysisSkeleton'
import type { Analysis } from '@/types'

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) notFound()

  const analysis = data as Analysis

  if (analysis.status === 'processing') {
    return <AnalysisSkeleton />
  }

  if (analysis.status === 'failed') {
    return (
      <div className="p-8 max-w-2xl">
        <div className="text-center py-16 border border-critical/30 rounded-xl bg-critical/5">
          <p className="font-display text-xl font-semibold text-critical mb-2">Analysis failed</p>
          <p className="text-text-secondary">Something went wrong. Please try uploading again.</p>
        </div>
      </div>
    )
  }

  const criticalCount = analysis.flagged_clauses.filter((c) => c.severity === 'critical').length
  const warningCount = analysis.flagged_clauses.filter((c) => c.severity === 'warning').length

  const sortedClauses = [...analysis.flagged_clauses].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-text-secondary text-sm mb-1 capitalize">{analysis.document_type} · {analysis.file_name}</p>
        <h1 className="font-display text-3xl font-bold text-text-primary">Contract Analysis</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Risk summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk gauge card */}
          <div className="p-6 rounded-xl border border-border bg-surface text-center">
            <RiskGauge score={analysis.risk_score} level={analysis.risk_level} />
          </div>

          {/* Summary */}
          <div className="p-6 rounded-xl border border-border bg-surface">
            <h3 className="font-display text-lg font-semibold text-text-primary mb-3">Summary</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Cost estimate */}
          <div className="p-6 rounded-xl border border-accent/30 bg-surface"
            style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--accent)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <h3 className="font-display text-lg font-semibold text-text-primary">Total Cost Estimate</h3>
            </div>
            <p className="text-accent font-medium">{analysis.total_cost_estimate}</p>
          </div>

          {/* Market comparison */}
          <div className="p-6 rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-info" />
              <h3 className="font-display text-lg font-semibold text-text-primary">Market Comparison</h3>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{analysis.market_comparison}</p>
          </div>
        </div>

        {/* RIGHT: Flagged clauses */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-xl font-bold text-text-primary">Flagged Clauses</h2>
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-critical/10 text-critical border border-critical/20">
                  {criticalCount} critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                  {warningCount} warnings
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {sortedClauses.map((clause, index) => (
              <ClauseCard key={clause.id} clause={clause} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Negotiation points */}
      {analysis.negotiation_points.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Negotiation Scripts</h2>
          <div className="space-y-3">
            {analysis.negotiation_points.map((point, i) => (
              <details key={i} className="group border border-border rounded-xl bg-surface overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-raised transition-colors">
                  <span className="font-medium text-text-primary">{point.title}</span>
                  <ChevronDown className="w-4 h-4 text-text-secondary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5 border-t border-border pt-4 space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">Current term</p>
                    <p className="text-text-primary text-sm font-mono bg-surface-raised px-3 py-2 rounded-md">{point.current_term}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">Ask for instead</p>
                    <p className="text-safe text-sm font-mono bg-safe/5 border border-safe/20 px-3 py-2 rounded-md">{point.ask_for}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
