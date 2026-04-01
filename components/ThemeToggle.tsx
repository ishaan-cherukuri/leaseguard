'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-sm group"
      style={{ color: 'var(--text-secondary)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--surface-raised)'
        e.currentTarget.style.color = 'var(--text-primary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
      aria-label="Toggle theme"
    >
      <div className="w-4 h-4 relative">
        <Sun className={`w-4 h-4 absolute inset-0 transition-all ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
          style={{ color: 'var(--accent)' }} />
        <Moon className={`w-4 h-4 absolute inset-0 transition-all ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
          style={{ color: 'var(--accent)' }} />
      </div>
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
