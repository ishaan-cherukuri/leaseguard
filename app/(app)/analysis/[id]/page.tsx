import { redirect, notFound } from 'next/navigation'
import { DollarSign, TrendingUp, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
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

  // Generate signed URL for PDF preview
  let pdfSignedUrl: string | null = null
  try {
    const serviceClient = await createServiceClient()
    // Extract storage path from file_url
    const urlParts = analysis.file_url.split('/storage/v1/object/public/contracts/')
    if (urlParts[1]) {
      const { data: signedData } = await serviceClient.storage
        .from('contracts')
        .createSignedUrl(urlParts[1], 3600)
      pdfSignedUrl = signedData?.signedUrl ?? null
    }
  } catch {
    // PDF preview unavailable — not critical
  }

  const criticalCount = analysis.flagged_clauses.filter((c) => c.severity === 'critical').length
  const warningCount = analysis.flagged_clauses.filter((c) => c.severity === 'warning').length

  const sortedClauses = [...analysis.flagged_clauses].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <div className="flex h-screen overflow-hidden">

      {/* LEFT — PDF preview */}
      <div className="w-1/2 border-r border-border flex flex-col shrink-0">
        <div className="px-5 py-3 border-b border-border bg-surface shrink-0">
          <p className="text-text-secondary text-xs truncate capitalize">
            {analysis.document_type} · {analysis.file_name}
          </p>
        </div>
        {pdfSignedUrl ? (
          <iframe
            src={`${pdfSignedUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="flex-1 w-full"
            title="Contract PDF"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
            PDF preview unavailable
          </div>
        )}
      </div>

      {/* RIGHT — results */}
      <div className="w-1/2 flex flex-col overflow-hidden">

        {/* TOP — dial + summary */}
        <div className="h-1/2 border-b border-border overflow-y-auto p-6 space-y-4">
          <div className="flex items-start gap-6">
            {/* Gauge */}
            <div className="shrink-0">
              <RiskGauge score={analysis.risk_score} level={analysis.risk_level} />
            </div>

            {/* Summary + cost */}
            <div className="flex-1 min-w-0 space-y-3 pt-2">
              <div>
                <h2 className="font-display text-lg font-bold text-text-primary mb-1">Summary</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{analysis.summary}</p>
              </div>

              <div className="p-3 rounded-lg border border-accent/30 bg-accent/5"
                style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--accent)' }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-accent" />
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider">Total Cost</span>
                </div>
                <p className="text-text-primary text-sm font-medium">{analysis.total_cost_estimate}</p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-surface-raised">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-info" />
                  <span className="text-info text-xs font-semibold uppercase tracking-wider">Market Comparison</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{analysis.market_comparison}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM — clauses + negotiation */}
        <div className="h-1/2 overflow-y-auto p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-lg font-bold text-text-primary">Flagged Clauses</h2>
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

          {/* Negotiation points */}
          {analysis.negotiation_points.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-text-primary mb-4">Negotiation Scripts</h2>
              <div className="space-y-2">
                {analysis.negotiation_points.map((point, i) => (
                  <details key={i} className="group border border-border rounded-xl bg-surface overflow-hidden">
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-surface-raised transition-colors">
                      <span className="font-medium text-text-primary text-sm">{point.title}</span>
                      <ChevronDown className="w-4 h-4 text-text-secondary group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">Current term</p>
                        <p className="text-text-primary text-xs font-mono bg-surface-raised px-3 py-2 rounded-md">{point.current_term}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">Ask for instead</p>
                        <p className="text-safe text-xs font-mono bg-safe/5 border border-safe/20 px-3 py-2 rounded-md">{point.ask_for}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
