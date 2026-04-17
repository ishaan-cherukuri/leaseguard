'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, TrendingUp, ChevronDown,
  Fingerprint, Bot, Info, Shield, MapPin, ListChecks, FileSearch,
} from 'lucide-react'
import RiskGauge from '@/components/RiskGauge'
import AIGauge from '@/components/AIGauge'
import CoverageGauge from '@/components/CoverageGauge'
import ClauseCard from '@/components/ClauseCard'
import { BentoCard } from '@/components/ui/bento-grid'
import type { Analysis } from '@/types'
import type { LeaseGapsResult, GapItem } from '@/app/api/gaps/route'

/* ── Pangram types ────────────────────────────────── */
interface PangramWindow {
  text: string
  label: 'AI-Generated' | 'AI-Assisted' | 'Human'
  ai_assistance_score: number // 0–1
  confidence: 'High' | 'Medium' | 'Low'
  word_count: number
}

interface PangramResult {
  headline: string
  prediction: string
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
  lease_gaps_result?: LeaseGapsResult | null
}

/* ── Props ────────────────────────────────────────── */
interface Props {
  analysis: AnalysisWithDetection
  pdfSignedUrl: string | null
}

/* ── Helpers ──────────────────────────────────────── */
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

function severityColor(severity: GapItem['severity']): string {
  if (severity === 'critical') return '#C9748A'
  if (severity === 'important') return '#E09A30'
  return 'var(--text-muted)'
}

/* ── Skeletons ────────────────────────────────────── */
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

function GapsSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
      <div className="h-1/2 border-b border-border p-6">
        <div className="flex items-start gap-6">
          <div className="w-[180px] h-[180px] rounded-full shrink-0"
            style={{ background: 'rgba(146,97,10,0.12)' }} />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-24 rounded-xl" style={{ background: 'var(--surface-raised)' }} />
            <div className="h-10 rounded-xl" style={{ background: 'var(--surface-raised)' }} />
          </div>
        </div>
      </div>
      <div className="h-1/2 p-6 space-y-3">
        <div className="h-4 w-40 rounded" style={{ background: 'var(--surface-raised)' }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 rounded-xl" style={{ background: 'var(--surface-raised)' }} />
        ))}
      </div>
    </div>
  )
}

/* ── SentenceCard ─────────────────────────────────── */
interface SegmentCardData {
  text: string
  score: number
  label: string
  confidence: string
}

function SentenceCard({ sentence, index }: { sentence: SegmentCardData; index: number }) {
  const [open, setOpen] = useState(false)
  const pct = Math.round(sentence.score * 100)
  const isAI = sentence.label === 'AI-Generated'
  const badgeColor = isAI ? '#C9748A' : '#E09A30'

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
                {sentence.label}
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

/* ── GapItemCard ──────────────────────────────────── */
function GapItemCard({ item, index }: { item: GapItem; index: number }) {
  const [open, setOpen] = useState(false)
  const color = severityColor(item.severity)

  return (
    <div className="group relative rounded-xl overflow-hidden card-interactive will-change-transform"
      style={{
        background: `color-mix(in srgb, ${color} 4%, var(--surface))`,
        border: '1px solid var(--border)',
        borderLeftWidth: '3px',
        borderLeftColor: color,
      }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono text-text-muted shrink-0 mt-0.5">
            #{String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
                style={{
                  color,
                  backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                }}>
                {item.severity}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-medium text-text-muted"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                {item.category}
              </span>
              {item.location_specific && (
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <MapPin className="w-3 h-3" />
                  Varies by state/county
                </span>
              )}
            </div>
            <p className="text-text-primary text-sm font-medium">{item.title}</p>
            <button onClick={() => setOpen(!open)}
              className="mt-2 flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors text-xs">
              <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
              {open ? 'Hide' : 'View'} details
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-0 space-y-2">
          <div className="rounded-lg p-3 text-sm text-text-secondary leading-relaxed"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Why this matters</p>
            {item.explanation}
          </div>
          <div className="rounded-lg p-3 text-sm leading-relaxed"
            style={{
              background: `color-mix(in srgb, ${color} 6%, transparent)`,
              border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
            }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color }}>
              What to ask for
            </p>
            <p className="text-text-secondary">{item.suggested_addition}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Module-level cache — persists across client-side navigation in same session ── */
const detectMemCache = new Map<string, PangramResult>()
const gapsMemCache = new Map<string, LeaseGapsResult>()

/* ── Main component ───────────────────────────────── */
export default function AnalysisResultsPanel({ analysis, pdfSignedUrl }: Props) {
  const [activeTab, setActiveTab] = useState<'risk' | 'detect' | 'gaps'>('risk')

  // Draggable split divider (30–70%)
  const [splitPct, setSplitPct] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function onDividerMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    function onMouseMove(ev: MouseEvent) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((ev.clientX - rect.left) / rect.width) * 100
      setSplitPct(Math.min(70, Math.max(30, pct)))
    }
    function onMouseUp() {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // AI Detection state — seed from DB props first, fall back to memory cache
  const [detectResult, setDetectResult] = useState<PangramResult | null>(
    (analysis.ai_detection_result as PangramResult | null) ?? detectMemCache.get(analysis.id) ?? null
  )
  const [detectLoading, setDetectLoading] = useState(false)
  const [detectError, setDetectError] = useState<string | null>(null)
  const detectAbortRef = useRef<AbortController | null>(null)

  // Lease Gaps state — same seeding strategy
  const [gapsResult, setGapsResult] = useState<LeaseGapsResult | null>(
    (analysis.lease_gaps_result as LeaseGapsResult | null) ?? gapsMemCache.get(analysis.id) ?? null
  )
  const [gapsLoading, setGapsLoading] = useState(false)
  const [gapsError, setGapsError] = useState<string | null>(null)
  const gapsAbortRef = useRef<AbortController | null>(null)

  // Background pre-fetch both tabs on mount so they're ready when user clicks them
  useEffect(() => {
    const bgDetectCtrl = new AbortController()
    const bgGapsCtrl = new AbortController()

    if (!detectResult) {
      fetch('/api/detect', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: analysis.id }),
        signal: bgDetectCtrl.signal,
      })
        .then(r => r.json())
        .then(data => {
          if (!data.error) {
            detectMemCache.set(analysis.id, data)
            setDetectResult(data as PangramResult)
          }
        })
        .catch(() => {})
    }

    if (!gapsResult) {
      fetch('/api/gaps', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: analysis.id }),
        signal: bgGapsCtrl.signal,
      })
        .then(r => r.json())
        .then(data => {
          if (!data.error) {
            gapsMemCache.set(analysis.id, data)
            setGapsResult(data as LeaseGapsResult)
          }
        })
        .catch(() => {})
    }

    return () => {
      bgDetectCtrl.abort()
      bgGapsCtrl.abort()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Abort tab-specific in-flight requests on unmount
  useEffect(() => {
    return () => {
      detectAbortRef.current?.abort()
      gapsAbortRef.current?.abort()
    }
  }, [])

  const criticalCount = analysis.flagged_clauses.filter(c => c.severity === 'critical').length
  const warningCount = analysis.flagged_clauses.filter(c => c.severity === 'warning').length
  const sortedClauses = [...analysis.flagged_clauses].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })

  function handleRiskTab() {
    // Abort any in-flight secondary fetches when returning to Risk Review
    if (detectLoading) { detectAbortRef.current?.abort(); setDetectLoading(false) }
    if (gapsLoading)   { gapsAbortRef.current?.abort();   setGapsLoading(false)   }
    setActiveTab('risk')
  }

  async function handleDetectTab() {
    // Abort gaps fetch if it's in-flight
    if (gapsLoading) { gapsAbortRef.current?.abort(); setGapsLoading(false) }
    setActiveTab('detect')
    if (detectResult || detectError) return
    if (detectLoading) return
    setDetectLoading(true)
    setDetectError(null)
    const controller = new AbortController()
    detectAbortRef.current = controller
    try {
      const minDelay = new Promise<void>(r => setTimeout(r, 1200))
      const fetchData = fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: analysis.id }),
        signal: controller.signal,
      }).then(r => r.json())
      const [data] = await Promise.all([fetchData, minDelay])
      if (data.error) throw new Error(data.error)
      detectMemCache.set(analysis.id, data as PangramResult)
      setDetectResult(data as PangramResult)
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      setDetectError(e instanceof Error ? e.message : 'Detection failed')
    } finally {
      setDetectLoading(false)
    }
  }

  async function handleGapsTab() {
    // Abort detect fetch if it's in-flight
    if (detectLoading) { detectAbortRef.current?.abort(); setDetectLoading(false) }
    setActiveTab('gaps')
    if (gapsResult || gapsError) return
    if (gapsLoading) return
    setGapsLoading(true)
    setGapsError(null)
    const controller = new AbortController()
    gapsAbortRef.current = controller
    try {
      const minDelay = new Promise<void>(r => setTimeout(r, 1200))
      const fetchData = fetch('/api/gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: analysis.id }),
        signal: controller.signal,
      }).then(r => r.json())
      const [data] = await Promise.all([fetchData, minDelay])
      if (data.error) throw new Error(data.error)
      gapsMemCache.set(analysis.id, data as LeaseGapsResult)
      setGapsResult(data as LeaseGapsResult)
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      setGapsError(e instanceof Error ? e.message : 'Gaps analysis failed')
    } finally {
      setGapsLoading(false)
    }
  }

  const flaggedWindows = (detectResult?.windows ?? [])
    .filter(w => w.label !== 'Human')
    .sort((a, b) => b.ai_assistance_score - a.ai_assistance_score)
    .slice(0, 12)

  const sortedGapItems = (gapsResult?.missing_items ?? []).sort((a, b) => {
    const order = { critical: 0, important: 1, recommended: 2 }
    return order[a.severity] - order[b.severity]
  })

  // Pill position calculation for 3 segments
  const pillLeft = activeTab === 'risk' ? 4 : activeTab === 'detect' ? '33.33%' : '66.66%'
  const pillRight = activeTab === 'gaps' ? 4 : activeTab === 'detect' ? '33.33%' : '66.66%'
  const pillColor = activeTab === 'risk' ? '#C9748A' : activeTab === 'detect' ? '#2a6080' : '#B8790A'

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Thin filename bar ──────────────────────── */}
      <div className="shrink-0 px-6 py-2.5 border-b border-border bg-surface">
        <p className="text-text-secondary text-xs truncate capitalize">
          {analysis.document_type} · {analysis.file_name}
        </p>
      </div>

      {/* ── Split content area ──────────────────────── */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">

        {/* LEFT — PDF (always visible) */}
        <div className="border-r border-border flex flex-col shrink-0 relative" style={{ width: `${splitPct}%` }}>
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
          {/* Transparent overlay prevents iframe from swallowing mouse events during drag */}
          {isDragging && (
            <div className="absolute inset-0" style={{ zIndex: 20 }} />
          )}
        </div>

        {/* DIVIDER — draggable */}
        <div
          onMouseDown={onDividerMouseDown}
          className="shrink-0 flex items-center justify-center group"
          style={{ width: '10px', cursor: 'col-resize', background: 'var(--border)', position: 'relative', zIndex: 10 }}
        >
          <div
            className="rounded-full transition-all group-hover:opacity-100 group-active:opacity-100"
            style={{
              width: '4px', height: '40px',
              background: 'var(--text-muted)',
              opacity: 0.4,
              transition: 'opacity 0.15s, background 0.15s',
            }}
          />
        </div>

        {/* RIGHT — toggle + animated panel */}
        <div className="flex flex-col overflow-hidden" style={{ flex: 1 }}>

          {/* 3-segment pill toggle — centered in the right column */}
          <div className="shrink-0 flex justify-center items-center py-3 px-4 border-b border-border"
            style={{ background: 'var(--surface-raised)' }}>
            <div className="relative flex p-1 rounded-full"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <motion.div
                className="absolute top-1 bottom-1 rounded-full"
                animate={{ left: pillLeft, right: pillRight, backgroundColor: pillColor }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
              <button
                onClick={handleRiskTab}
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
              <button
                onClick={handleGapsTab}
                className="relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full min-w-[110px] justify-center transition-colors duration-200"
                style={{ color: activeTab === 'gaps' ? '#fff' : 'var(--text-secondary)' }}
              >
                <FileSearch className="w-3 h-3" />
                Lease Gaps
              </button>
            </div>
          </div>

          {/* Animated panels */}
          <div className="flex-1 relative overflow-hidden">
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
                {detectLoading && <DetectionSkeleton />}

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

                {detectResult && !detectLoading && (
                  <>
                    <div className="h-1/2 border-b border-border overflow-y-auto p-6 space-y-4">
                      <div className="flex items-start gap-6">
                        <div className="shrink-0">
                          <AIGauge score={fractionToScore(detectResult.fraction_ai)} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3 pt-2">
                          <BentoCard className="p-3 border bg-surface" persistent
                            style={{ borderColor: 'rgba(91,196,232,0.35)', borderLeftWidth: '3px', borderLeftColor: '#5bc4e8' }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Bot className="w-3.5 h-3.5" style={{ color: '#5bc4e8' }} />
                              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#5bc4e8' }}>
                                Verdict
                              </span>
                            </div>
                            <p className="text-text-primary font-bold text-base mb-1.5">
                              {detectResult.headline}
                            </p>
                            <p className="text-text-secondary text-sm leading-relaxed">
                              {verdictDescription(detectResult)}
                            </p>
                          </BentoCard>

                          <BentoCard className="p-3 border border-border bg-surface-raised">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Info className="w-3.5 h-3.5 text-text-secondary" />
                              <span className="text-text-secondary text-xs font-bold uppercase tracking-wider">Breakdown</span>
                            </div>
                            <div className="flex h-2.5 rounded-full overflow-hidden gap-px mb-3">
                              <div style={{ width: `${detectResult.fraction_ai * 100}%`, background: '#C9748A' }} />
                              <div style={{ width: `${detectResult.fraction_ai_assisted * 100}%`, background: '#E09A30' }} />
                              <div style={{ width: `${detectResult.fraction_human * 100}%`, background: '#4ade80' }} />
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                              <span className="flex items-center gap-1.5" style={{ color: '#C9748A' }}>
                                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#C9748A' }} />
                                AI {Math.round(detectResult.fraction_ai * 100)}%
                              </span>
                              <span className="flex items-center gap-1.5" style={{ color: '#E09A30' }}>
                                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#E09A30' }} />
                                AI-Assisted {Math.round(detectResult.fraction_ai_assisted * 100)}%
                              </span>
                              <span className="flex items-center gap-1.5" style={{ color: '#4ade80' }}>
                                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#4ade80' }} />
                                Human {Math.round(detectResult.fraction_human * 100)}%
                              </span>
                            </div>
                            <p className="text-text-secondary text-xs mt-2">
                              Powered by <span className="font-semibold text-text-primary">Pangram AI</span> · probabilistic, not a legal determination
                            </p>
                          </BentoCard>
                        </div>
                      </div>
                    </div>

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

            {/* ── LEASE GAPS ── */}
            {activeTab === 'gaps' && (
              <motion.div
                key="gaps"
                className="absolute inset-0 flex flex-col"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {gapsLoading && <GapsSkeleton />}

                {gapsError && !gapsLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border"
                      style={{ background: 'rgba(146,97,10,0.1)', borderColor: 'rgba(146,97,10,0.25)' }}>
                      <FileSearch className="w-6 h-6" style={{ color: '#92610A' }} />
                    </div>
                    <div>
                      <p className="text-text-primary font-semibold mb-1">Gaps analysis failed</p>
                      <p className="text-text-secondary text-sm">{gapsError}</p>
                      <button onClick={handleGapsTab} className="mt-4 btn-primary px-5 py-2 rounded-lg text-sm">
                        Try again
                      </button>
                    </div>
                  </div>
                )}

                {gapsResult && !gapsLoading && (
                  <>
                    {/* TOP — CoverageGauge + summary + disclaimer */}
                    <div className="h-1/2 border-b border-border overflow-y-auto p-6 space-y-4">
                      <div className="flex items-start gap-6">
                        <div className="shrink-0">
                          <CoverageGauge score={gapsResult.gaps_score} level={gapsResult.gaps_level} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3 pt-2">
                          <BentoCard className="p-3 border border-border bg-surface" persistent>
                            <h2 className="font-display text-lg font-bold text-text-primary mb-1">Coverage Summary</h2>
                            <p className="text-text-secondary text-sm leading-relaxed">{gapsResult.summary}</p>
                          </BentoCard>
                          {sortedGapItems.length > 0 && (
                            <BentoCard className="p-3 border bg-surface-raised"
                              style={{ borderColor: 'rgba(224,154,48,0.35)', borderLeftWidth: '3px', borderLeftColor: '#E09A30' }}>
                              <div className="flex items-center gap-4 text-xs font-bold">
                                {(['critical', 'important', 'recommended'] as const).map(sev => {
                                  const count = sortedGapItems.filter(i => i.severity === sev).length
                                  if (!count) return null
                                  const c = sev === 'critical' ? '#C9748A' : sev === 'important' ? '#E09A30' : 'var(--text-secondary)'
                                  return (
                                    <span key={sev} className="flex items-center gap-1.5"
                                      style={{ color: c }}>
                                      <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                                      {count} {sev}
                                    </span>
                                  )
                                })}
                                <span className="text-text-secondary font-normal">missing clauses</span>
                              </div>
                            </BentoCard>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM — missing items + questions */}
                    <div className="h-1/2 overflow-y-auto p-6">
                      {sortedGapItems.length > 0 ? (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <h2 className="font-display text-lg font-bold text-text-primary">Missing Clauses</h2>
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{ color: '#E09A30', background: 'rgba(224,154,48,0.14)', border: '1px solid rgba(224,154,48,0.3)' }}>
                              {sortedGapItems.length} found
                            </span>
                          </div>
                          <div className="space-y-2.5">
                            {sortedGapItems.map((item, i) => (
                              <GapItemCard key={i} item={item} index={i} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-4 rounded-xl border text-center mb-4"
                          style={{ borderColor: 'rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.05)' }}>
                          <p className="text-sm font-semibold" style={{ color: '#4ade80' }}>No significant gaps found</p>
                          <p className="text-text-secondary text-xs mt-1">This lease covers the key protection areas well.</p>
                        </div>
                      )}

                      {/* Questions to ask */}
                      {gapsResult.questions_to_ask.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <ListChecks className="w-4 h-4 text-text-muted" />
                            <h2 className="font-display text-base font-bold text-text-primary">Questions to Ask Your Landlord</h2>
                          </div>
                          <BentoCard className="border border-border bg-surface p-4" persistent>
                            <ol className="space-y-2.5">
                              {gapsResult.questions_to_ask.map((q, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                                  <div className="shrink-0 w-5 h-5 rounded border flex items-center justify-center mt-0.5"
                                    style={{ borderColor: 'rgba(146,97,10,0.4)', background: 'rgba(146,97,10,0.08)' }}>
                                    <span className="text-xs font-bold" style={{ color: '#92610A' }}>{i + 1}</span>
                                  </div>
                                  {q}
                                </li>
                              ))}
                            </ol>
                          </BentoCard>
                        </div>
                      )}

                      {/* State disclaimer */}
                      {gapsResult.state_disclaimer && (
                        <p className="mt-4 text-text-muted text-xs italic leading-relaxed">
                          {gapsResult.state_disclaimer}
                        </p>
                      )}

                      <p className="mt-3 text-text-muted text-xs leading-relaxed">
                        Lease requirements vary significantly by location. Items marked with <MapPin className="w-3 h-3 inline mx-0.5" /> should be verified against your local laws before signing.
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
          </div>{/* end flex-1 relative */}
        </div>{/* end right column */}
      </div>
    </div>
  )
}
