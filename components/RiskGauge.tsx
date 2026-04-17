'use client'

import { useEffect, useRef } from 'react'
import type { RiskLevel } from '@/types'

interface RiskGaugeProps {
  score: number
  level: RiskLevel
}

function scoreToColor(score: number): string {
  if (score <= 30) return '#3ECF8E'
  if (score <= 60) return '#E09A30'
  if (score <= 80) return '#E8445A'
  return '#E05252'
}

const LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'LOW RISK',
  medium: 'MEDIUM RISK',
  high: 'HIGH RISK',
  critical: 'CRITICAL',
}

export default function RiskGauge({ score, level }: RiskGaugeProps) {
  const scoreRef = useRef<SVGTextElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)

  const size = 180
  const strokeWidth = 10
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * 0.75
  const targetDash = (score / 100) * arcLength
  const color = scoreToColor(score)

  useEffect(() => {
    let start: number | null = null
    const duration = 1400

    function animate(ts: number) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)

      const currentScore = Math.round(eased * score)
      const currentDash = eased * targetDash

      if (scoreRef.current) scoreRef.current.textContent = String(currentScore)
      if (circleRef.current) circleRef.current.style.strokeDashoffset = String(arcLength - currentDash)
      if (glowRef.current) glowRef.current.style.strokeDashoffset = String(arcLength - currentDash)

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [score, arcLength, targetDash])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ background: color, transform: 'scale(0.8)' }} />

        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
          {/* Track */}
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(135 ${size / 2} ${size / 2})`}
          />
          {/* Glow layer */}
          <circle ref={glowRef} cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth + 6} strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={arcLength}
            transform={`rotate(135 ${size / 2} ${size / 2})`}
            opacity={0.15} style={{ filter: 'blur(4px)' }}
          />
          {/* Main arc */}
          <circle ref={circleRef} cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={arcLength}
            transform={`rotate(135 ${size / 2} ${size / 2})`}
          />
          {/* Score */}
          <text ref={scoreRef}
            x={size / 2} y={size / 2 - 6}
            textAnchor="middle" dominantBaseline="middle"
            fill="var(--text-primary)" fontSize="36" fontWeight="700"
            fontFamily="var(--font-playfair)"
          >0</text>
          <text x={size / 2} y={size / 2 + 22}
            textAnchor="middle" dominantBaseline="middle"
            fill="var(--text-secondary)" fontSize="13"
            fontFamily="var(--font-dm-sans)"
          >out of 100</text>
        </svg>
      </div>

      {/* Level badge */}
      <div className="px-3 py-1 rounded-full text-xs font-bold tracking-widest"
        style={{
          color,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
        }}>
        {LEVEL_LABELS[level]}
      </div>
    </div>
  )
}
