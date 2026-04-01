'use client'

import { useState } from 'react'
import { ChevronDown, AlertTriangle, Info, Lightbulb, AlertOctagon } from 'lucide-react'
import type { FlaggedClause, SeverityLevel } from '@/types'

interface ClauseCardProps {
  clause: FlaggedClause
  index: number
}

const SEVERITY_CONFIG: Record<SeverityLevel, { color: string; label: string; Icon: React.ElementType }> = {
  critical: { color: 'var(--critical)', label: 'Critical', Icon: AlertOctagon },
  warning: { color: 'var(--warning)', label: 'Warning', Icon: AlertTriangle },
  info: { color: 'var(--info)', label: 'Info', Icon: Info },
}

export default function ClauseCard({ clause }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { color, label, Icon } = SEVERITY_CONFIG[clause.severity]

  return (
    <div
      className="rounded-xl border border-border bg-surface overflow-hidden transition-all hover:border-opacity-60"
      style={{ borderLeftWidth: '4px', borderLeftColor: color }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                >
                  {label}
                </span>
                {clause.potentially_illegal && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-critical bg-critical/10 border border-critical/30">
                    Potentially Illegal
                  </span>
                )}
              </div>
              <h4 className="font-medium text-text-primary">{clause.title}</h4>
              <p className="text-text-secondary text-sm mt-1 leading-relaxed">{clause.explanation}</p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-3 flex items-start gap-2 p-3 rounded-md bg-surface-raised">
          <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-text-secondary text-sm">{clause.recommendation}</p>
        </div>

        {/* Toggle original text */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-text-secondary text-xs hover:text-text-primary transition-colors"
        >
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Hide' : 'Show'} original text
        </button>
      </div>

      {/* Collapsible original quote */}
      {expanded && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-text-secondary mb-1 uppercase tracking-wider">Original clause</p>
          <blockquote className="font-mono text-xs text-text-secondary leading-relaxed bg-surface-raised p-3 rounded-md border-l-2 border-border">
            &ldquo;{clause.original_text}&rdquo;
          </blockquote>
        </div>
      )}
    </div>
  )
}
