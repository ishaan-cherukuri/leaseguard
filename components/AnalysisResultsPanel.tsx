'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, TrendingUp, ChevronDown,
  Fingerprint, Bot, Info, Shield,
} from 'lucide-react'
import RiskGauge from '@/components/RiskGauge'
import AIGauge from '@/components/AIGauge'
import ClauseCard from '@/components/ClauseCard'
import { BentoCard } from '@/components/ui/bento-grid'
import type { Analysis } from '@/types'

/* ── Pangram types ────────────────────────────────── */
// Pangram API v3: POST https://text.api.pangram.com/v3
interface PangramWindow {
  text: string
  label: 'AI-Generated' | 'AI-Assisted' | 'Human'
  ai_assistance_score: number // 0–1
  confidence: 'High' | 'Medium' | 'Low'
  word_count: number
}

interface PangramResult {
  headline: string          // e.g. "AI Detected"
  prediction: string        // full sentence description
  prediction_short: 'Human' | 'Mixed' | 'AI'
  fraction_ai: number       // 0–1
  fraction_ai_assisted: number
  fraction_human: number
  num_ai_segments: number
  num_ai_assisted_segments: number
  num_human_segments: number
  windows: PangramWindow[]
}

interface AnalysisWithDetection extends Analysis {
  ai_detection_result?: PangramResult | null
}

/* ── Props ────────────────────────────────────────── */
interface Props {
  analysis: AnalysisWithDetection
  pdfSignedUrl: string | null
}

/* ── Helpers ──────────────────────────────────────── */
// fraction_ai is 0–1; convert to 0–100 for gauge
function fractionToScore(fraction: number): number {
  return Math.round(fraction * 100)
}

function verdictDescription(result: PangramResult): string {
  const pct = Math.round(result.fraction_ai * 100)
  if (result.prediction_short === 'Human') {
    return 'This contract shows strong indicators of being written by a human author. Language patterns, sentence variety, and structural choices all align with typical human drafting.'
  }
  if (result.prediction_short === 'Mixed') {
    return `This contract mixes human and AI-written passages — approximately ${pct}% of the content shows AI-generation patterns. This is common when AI tools are used to draft boilerplate sections.`
  }
  return `This contract shows strong AI-generation patterns across approximately ${pct}% of its content. Uniform sentence structure, repetitive phrasing, and formulaic language are consistent with AI drafting tools.`
}

/* ── Skeleton ─────────────────────────────────────── */
function DetectionSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
      <div className="h-1/2 border-b border-border p-6">
        <div className="flex items-start gap-6">
          <div className="w-[180px] h-[180px] rounded-full shrink-0"
            style={{ background: 'rgba(26,58,74,0.15)' }} />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-24 rounded-xl" style={{ background: 'var(--surface-raised)' }} />
            <div className="h-10 rounded-xl" style={{ background: 'var(--surface-raised)' }} />
          </div>
        </div>
      </div>
      <div className="h-1/2 p-6 space-y-3">
        <div className="h-4 w-40 rounded" style={{ background: 'var(--surface-raised)' }} />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 rounded-xl" style={{ background: 'var(--surface-raised)' }} />
        ))}
      </div>
    </div>
  )
}

/* ── SentenceCard — mirrors ClauseCard style ──────── */
interface SegmentCardData {
  text: string
  score: number // 0–1
  label: string // 'AI-Generated' | 'AI-Assisted' | 'Human'
  confidence: string // 'High' | 'Medium' | 'Low'
}

function SentenceCard({ sentence, index }: { sentence: SegmentCardData; index: number }) {
  const [open, setOpen] = useState(false)
  const pct = Math.round(sentence.score * 100)
  const isAI = sentence.label === 'AI-Generated'
  const badgeColor = isAI ? '#C9748A' : '#E09A30'
  const label = sentence.label

  return (
    <div className="group relative rounded-xl overflow-hidden card-interactive will-change-transform"
      style={{
        background: 'rgba(26,58,74,0.08)',
        border: '1px solid rgba(26,58,74,0.2)',
        borderLeftWidth: '3px',
        borderLeftColor: badgeColor,
      }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,154,181,0.06)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-[#1a3a4a]/5 via-[#1a3a4a]/10 to-transparent pointer-events-none" />

      <div className="relative z-10 p-4">
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono text-text-muted shrink-0 mt-0.5">
            #{String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  color: badgeColor,
                  backgroundColor: `color-mix(in srgb, ${badgeColor} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${badgeColor} 25%, transparent)`,
                }}>
                {label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ color: '#4a9ab5', backgroundColor: 'rgba(26,58,74,0.2)', border: '1px solid rgba(26,58,74,0.3)' }}>
                {pct}% score
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-medium text-text-muted"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                {sentence.confidence} confidence
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
              &ldquo;{sentence.text}&rdquo;
            </p>
            <button onClick={() => setOpen(!open)}
              className="mt-2.5 flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors text-xs">
              <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
              {open ? 'Hide' : 'View'} full sentence
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="relative z-10 px-4 pb-4 pt-0">
          <div className="rounded-lg overflow-hidden"
            style={{ background: 'rgba(8,9,16,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="px-3 py-1.5 border-b flex items-center gap-1.5"
              style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-xs text-text-muted font-mono">flagged sentence</span>
            </div>
            <blockquote className="font-mono text-xs text-text-secondary leading-relaxed p-3">
              &ldquo;{sentence.text}&rdquo;
            </blockquote>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main component ───────────────────────────────── */
export default function AnalysisResultsPanel({ analysis, pdfSignedUrl }: Props) {
  const [activeTab, setActiveTab] = useState<'risk' | 'detect'>('risk')
  const [detectResult, setDetectResult] = useState<PangramResult | null>(
    analysis.ai_detection_result ?? null
  )
  const [detectLoading, setDetectLoading] = useState(false)
  const [detectError, setDetectError] = useState<string | null>(null)

  const criticalCount = analysis.flagged_clauses.filter(c => c.severity === 'critical').length
  const warningCount = analysis.flagged_clauses.filter(c => c.severity === 'warning').length
  const sortedClauses = [...analysis.flagged_clauses].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })

  async function handleDetectTab() {
    setActiveTab('detect')
    if (detectResult || detectLoading) return
    setDetectLoading(true)
    setDetectError(null)
    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: analysis.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Detection failed')
      setDetectResult(data as PangramResult)
    } catch (e) {
      setDetectError(e instanceof Error ? e.message : 'Detection failed')
    } finally {
      setDetectLoading(false)
    }
  }

  // Pangram windows: show AI-Generated + AI-Assisted segments, sorted by score desc
  const flaggedWindows = (detectResult?.windows ?? [])
    .filter(w => w.label !== 'Human')
    .sort((a, b) => b.ai_assistance_score - a.ai_assistance_score)
    .slice(0, 12)

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Full-width toggle header ────────────────── */}
      <div className="shrink-0 px-6 py-3 border-b border-border bg-surface flex items-center justify-between gap-4">
        <p className="text-text-secondary text-xs truncate capitalize">
          {analysis.document_type} · {analysis.file_name}
        </p>

        {/* Pill toggle */}
        <div className="relative flex p-1 rounded-full shrink-0"
          style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
          {/* Sliding bg pill */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full"
            animate={{
              left: activeTab === 'risk' ? 4 : '50%',
              right: activeTab === 'risk' ? '50%' : 4,
              backgroundColor: activeTab === 'risk' ? '#C9748A' : '#1a3a4a',
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          />
          <button
            onClick={() => setActiveTab('risk')}
            className="relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full min-w-[110px] justify-center transition-colors duration-200"
            style={{ color: activeTab === 'risk' ? '#fff' : 'var(--text-secondary)' }}
          >
            <Shield className="w-3 h-3" />
            Risk Review
          </button>
          <button
            onClick={handleDetectTab}
            className="relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full min-w-[110px] justify-center transition-colors duration-200"
            style={{ color: activeTab === 'detect' ? '#fff' : 'var(--text-secondary)' }}
          >
            <Fingerprint className="w-3 h-3" />
            AI Detection
          </button>
        </div>
      </div>

      {/* ── Split content area ──────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — PDF (always visible) */}
        <div className="w-1/2 border-r border-border flex flex-col shrink-0">
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

        {/* RIGHT — animated panel */}
        <div className="w-1/2 relative overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ── RISK REVIEW ── */}
            {activeTab === 'risk' && (
              <motion.div
                key="risk"
                className="absolute inset-0 flex flex-col"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {/* TOP — dial + summary */}
                <div className="h-1/2 border-b border-border overflow-y-auto p-6 space-y-4">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <RiskGauge score={analysis.risk_score} level={analysis.risk_level} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3 pt-2">
                      <BentoCard className="p-3 border border-border bg-surface" persistent>
                        <h2 className="font-display text-lg font-bold text-text-primary mb-1">Summary</h2>
                        <p className="text-text-secondary text-sm leading-relaxed">{analysis.summary}</p>
                      </BentoCard>
                      <BentoCard className="p-3 border border-accent/30 bg-accent/5"
                        style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--accent)' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <DollarSign className="w-3.5 h-3.5 text-accent" />
                          <span className="text-accent text-xs font-semibold uppercase tracking-wider">Total Cost</span>
                        </div>
                        <p className="text-text-primary text-sm font-medium">{analysis.total_cost_estimate}</p>
                      </BentoCard>
                      <BentoCard className="p-3 border border-border bg-surface-raised">
                        <div className="flex items-center gap-1.5 mb-1">
                          <TrendingUp className="w-3.5 h-3.5 text-info" />
                          <span className="text-info text-xs font-semibold uppercase tracking-wider">Market Comparison</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">{analysis.market_comparison}</p>
                      </BentoCard>
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

                  {analysis.negotiation_points.length > 0 && (
                    <div className="mt-8">
                      <h2 className="font-display text-lg font-bold text-text-primary mb-3">Negotiation Scripts</h2>
                      <div className="space-y-2">
                        {analysis.negotiation_points.map((point, i) => (
                          <BentoCard key={i} className="border border-border bg-surface overflow-hidden">
                            <details className="group">
                              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-surface-raised/60 transition-colors">
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
                          </BentoCard>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── AI DETECTION ── */}
            {activeTab === 'detect' && (
              <motion.div
                key="detect"
                className="absolute inset-0 flex flex-col"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {/* Loading skeleton */}
                {detectLoading && <DetectionSkeleton />}

                {/* Error */}
                {detectError && !detectLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-critical/10 border border-critical/20">
                      <Fingerprint className="w-6 h-6 text-critical" />
                    </div>
                    <div>
                      <p className="text-text-primary font-semibold mb-1">Detection failed</p>
                      <p className="text-text-secondary text-sm">{detectError}</p>
                      <button onClick={handleDetectTab} className="mt-4 btn-primary px-5 py-2 rounded-lg text-sm">
                        Try again
                      </button>
                    </div>
                  </div>
                )}

                {/* Results */}
                {detectResult && !detectLoading && (
                  <>
                    {/* TOP — AI gauge + verdict + attribution */}
                    <div className="h-1/2 border-b border-border overflow-y-auto p-6 space-y-4">
                      <div className="flex items-start gap-6">
                        <div className="shrink-0">
                          <AIGauge score={fractionToScore(detectResult.fraction_ai)} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3 pt-2">
                          <BentoCard className="p-3 border bg-surface" persistent
                            style={{ borderColor: 'rgba(26,58,74,0.4)', borderLeftWidth: '3px', borderLeftColor: '#1a3a4a' }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Bot className="w-3.5 h-3.5" style={{ color: '#4a9ab5' }} />
                              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a9ab5' }}>
                                Verdict
                              </span>
                            </div>
                            <p className="text-text-primary font-semibold text-sm mb-1.5">
                              {detectResult.headline}
                            </p>
                            <p className="text-text-secondary text-sm leading-relaxed">
                              {verdictDescription(detectResult)}
                            </p>
                          </BentoCard>

                          {/* Breakdown bar */}
                          <BentoCard className="p-3 border border-border bg-surface-raised">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Info className="w-3.5 h-3.5 text-text-muted" />
                              <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">Breakdown</span>
                            </div>
                            <div className="flex h-2 rounded-full overflow-hidden gap-px mb-2">
                              <div style={{ width: `${detectResult.fraction_ai * 100}%`, background: '#C9748A' }} />
                              <div style={{ width: `${detectResult.fraction_ai_assisted * 100}%`, background: '#E09A30' }} />
                              <div style={{ width: `${detectResult.fraction_human * 100}%`, background: '#4ade80' }} />
                            </div>
                            <div className="flex items-center gap-4 text-xs text-text-muted">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#C9748A' }} />
                                AI {Math.round(detectResult.fraction_ai * 100)}%
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#E09A30' }} />
                                AI-Assisted {Math.round(detectResult.fraction_ai_assisted * 100)}%
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#4ade80' }} />
                                Human {Math.round(detectResult.fraction_human * 100)}%
                              </span>
                            </div>
                            <p className="text-text-muted text-xs mt-2">
                              Powered by <span className="font-semibold text-text-secondary">Pangram AI</span> · probabilistic, not a legal determination
                            </p>
                          </BentoCard>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM — segment analysis + what this means */}
                    <div className="h-1/2 overflow-y-auto p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="font-display text-lg font-bold text-text-primary">Flagged Segments</h2>
                        {flaggedWindows.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ color: '#4a9ab5', background: 'rgba(26,58,74,0.2)', border: '1px solid rgba(26,58,74,0.3)' }}>
                            {flaggedWindows.length} flagged
                          </span>
                        )}
                      </div>

                      {flaggedWindows.length > 0 ? (
                        <div className="space-y-2.5">
                          {flaggedWindows.map((w, i) => (
                            <SentenceCard
                              key={i}
                              sentence={{ text: w.text, score: w.ai_assistance_score, label: w.label, confidence: w.confidence }}
                              index={i}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-border bg-surface-raised text-center mb-4">
                          <p className="text-text-secondary text-sm">No individual segments flagged as AI-generated.</p>
                        </div>
                      )}

                      {/* What This Means */}
                      <div className="mt-6">
                        <BentoCard className="border border-border bg-surface p-4" persistent>
                          <h3 className="font-display text-base font-bold text-text-primary mb-3">What This Means</h3>
                          <div className="space-y-2.5 text-sm text-text-secondary leading-relaxed">
                            <p>
                              <span className="font-semibold text-text-primary">AI-generated contracts are not inherently invalid.</span>{' '}
                              Many professionals use AI tools to draft standard agreements. The concern arises when important terms are generated without proper legal review.
                            </p>
                            <p>
                              AI-drafted contracts may contain generic boilerplate that doesn&apos;t account for your jurisdiction&apos;s specific laws, or overly one-sided terms that a human attorney would soften.
                            </p>
                            <p>
                              If this contract scores high for AI generation, consider requesting a conversation with the other party&apos;s counsel to confirm the terms were intentional — not accidental AI output.
                            </p>
                            <p className="text-text-muted text-xs pt-2 border-t border-border mt-2">
                              This score is probabilistic. LeaseGuard is not a legal authority on contract authenticity. A high score does not guarantee AI authorship, nor does a low score guarantee human authorship.
                            </p>
                          </div>
                        </BentoCard>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
