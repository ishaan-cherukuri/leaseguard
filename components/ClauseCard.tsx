'use client'

import { useState } from 'react'
import { ChevronDown, Lightbulb, AlertOctagon, AlertTriangle, Info, Scale } from 'lucide-react'
import type { FlaggedClause, SeverityLevel } from '@/types'
import { cn } from '@/lib/utils'

interface ClauseCardProps {
  clause: FlaggedClause
  index: number
}

const SEVERITY_CONFIG: Record<SeverityLevel, {
  color: string
  bgColor: string
  borderColor: string
  label: string
  Icon: React.ElementType
}> = {
  critical: {
    color: '#E05252',
    bgColor: 'rgba(224,82,82,0.08)',
    borderColor: 'rgba(224,82,82,0.2)',
    label: 'Critical',
    Icon: AlertOctagon,
  },
  warning: {
    color: '#E09A30',
    bgColor: 'rgba(224,154,48,0.08)',
    borderColor: 'rgba(224,154,48,0.2)',
    label: 'Warning',
    Icon: AlertTriangle,
  },
  info: {
    color: '#5B8DEF',
    bgColor: 'rgba(91,141,239,0.08)',
    borderColor: 'rgba(91,141,239,0.2)',
    label: 'Info',
    Icon: Info,
  },
}

export default function ClauseCard({ clause }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cfg = SEVERITY_CONFIG[clause.severity]

  return (
    <div
      className={cn("group relative rounded-xl overflow-hidden card-interactive will-change-transform")}
      style={{
        background: cfg.bgColor,
        border: `1px solid ${cfg.borderColor}`,
        borderLeftWidth: '3px',
        borderLeftColor: cfg.color,
      }}
    >
      {/* Bento dot texture — always visible */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,116,138,0.06)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>
      {/* Gradient shimmer — always visible */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-accent/4 via-accent/8 to-transparent pointer-events-none" />
      <div className="relative z-10 p-4">
        <div className="flex items-start gap-3">
          <cfg.Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: cfg.color }} />

          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold tracking-wide"
                style={{ color: cfg.color, backgroundColor: cfg.bgColor, border: `1px solid ${cfg.borderColor}` }}>
                {cfg.label}
              </span>
              {clause.potentially_illegal && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                  style={{ color: '#E8445A', backgroundColor: 'rgba(232,68,90,0.1)', border: '1px solid rgba(232,68,90,0.25)' }}>
                  <Scale className="w-3 h-3" />
                  Potentially Illegal
                </span>
              )}
            </div>

            <h4 className="font-semibold text-text-primary text-sm mb-1.5">{clause.title}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">{clause.explanation}</p>

            {/* Recommendation */}
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-dim)' }}>
              <Lightbulb className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <p className="text-text-secondary text-xs leading-relaxed">{clause.recommendation}</p>
            </div>

            {/* Toggle */}
            <button onClick={() => setExpanded(!expanded)}
              className="mt-2.5 flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors text-xs"
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              {expanded ? 'Hide' : 'View'} original clause
            </button>
          </div>
        </div>
      </div>

      {/* Original text */}
      {expanded && (
        <div className="relative z-10 px-4 pb-4 pt-0">
          <div className="rounded-lg overflow-hidden"
            style={{ background: 'rgba(8,9,16,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="px-3 py-1.5 border-b flex items-center gap-1.5"
              style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-xs text-text-muted font-mono">original clause</span>
            </div>
            <blockquote className="font-mono text-xs text-text-secondary leading-relaxed p-3">
              &ldquo;{clause.original_text}&rdquo;
            </blockquote>
          </div>
        </div>
      )}
    </div>
  )
}
