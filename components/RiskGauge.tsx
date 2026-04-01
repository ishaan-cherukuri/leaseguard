'use client'

import { useEffect, useRef } from 'react'
import type { RiskLevel } from '@/types'

interface RiskGaugeProps {
  score: number
  level: RiskLevel
}

function scoreToColor(score: number): string {
  if (score <= 30) return 'var(--safe)'
  if (score <= 60) return 'var(--warning)'
  return 'var(--critical)'
}

function levelLabel(level: RiskLevel): string {
  return level.toUpperCase()
}

export default function RiskGauge({ score, level }: RiskGaugeProps) {
  const scoreRef = useRef<SVGTextElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)

  const size = 200
  const strokeWidth = 12
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  // Only fill 270° of the circle (¾ arc), starting from bottom-left
  const arcLength = circumference * 0.75
  const targetDash = (score / 100) * arcLength
  const color = scoreToColor(score)

  useEffect(() => {
    let start: number | null = null
    const duration = 1200

    function animate(timestamp: number) {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      const currentScore = Math.round(eased * score)
      const currentDash = eased * targetDash

      if (scoreRef.current) scoreRef.current.textContent = String(currentScore)
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(arcLength - currentDash)
      }

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [score, arcLength, targetDash])

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        {/* Animated fill */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={arcLength}
          transform={`rotate(135 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke 0.3s ease' }}
        />
        {/* Score number */}
        <text
          ref={scoreRef}
          x={size / 2}
          y={size / 2 + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--text-primary)"
          fontSize="40"
          fontWeight="bold"
          fontFamily="var(--font-playfair)"
        >
          0
        </text>
        {/* /100 label */}
        <text
          x={size / 2}
          y={size / 2 + 34}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="12"
          fontFamily="var(--font-dm-sans)"
        >
          out of 100
        </text>
      </svg>

      <div
        className="mt-1 px-4 py-1 rounded-full text-sm font-bold tracking-widest"
        style={{
          color,
          backgroundColor: `${color}18`,
          border: `1px solid ${color}40`,
        }}
      >
        {levelLabel(level)}
      </div>
    </div>
  )
}
