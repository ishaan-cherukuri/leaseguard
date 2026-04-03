'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, Sun, Moon, Monitor, ChevronRight, Check, Bell, User, Activity } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function SettingsPopover() {
  const [open, setOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setAppearanceOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const themes = [
    { id: 'light',  label: 'Light',  icon: Sun },
    { id: 'dark',   label: 'Dark',   icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ]

  const currentThemeLabel = themes.find(t => t.id === theme)?.label ?? 'System'

  const gearColor = 'var(--accent)'

  return (
    <div ref={ref} className="fixed bottom-5 z-50" style={{ left: '232px' }}>

      {/* Popover — always opens upward from the button */}
      {open && (
        <div
          className="absolute left-0 w-56 rounded-2xl border border-border overflow-hidden"
          style={{
            bottom: 'calc(100% + 10px)',
            background: 'var(--surface)',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px var(--border)',
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Preferences</p>
          </div>

          {/* Nav rows */}
          {[
            { href: '/settings/notifications', icon: Bell,     label: 'Notifications' },
            { href: '/settings/account',       icon: User,     label: 'Account' },
            { href: '/settings/usage',         icon: Activity, label: 'API & Usage' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => { setOpen(false); setAppearanceOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-secondary hover:text-accent hover:bg-accent/5 transition-all"
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-text-muted" />
            </Link>
          ))}

          <div className="border-t border-border" />

          {/* Appearance row — expandable */}
          <div>
            <button
              onClick={() => setAppearanceOpen(!appearanceOpen)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-secondary hover:text-accent hover:bg-accent/5 transition-all"
            >
              {mounted && theme === 'dark'
                ? <Moon className="w-4 h-4 shrink-0" />
                : mounted && theme === 'light'
                  ? <Sun className="w-4 h-4 shrink-0" />
                  : <Monitor className="w-4 h-4 shrink-0" />
              }
              <span className="flex-1 text-left">Appearance</span>
              <span className="text-text-muted text-xs mr-1">{mounted ? currentThemeLabel : ''}</span>
              <ChevronRight
                className="w-3.5 h-3.5 shrink-0 text-text-muted transition-transform duration-200"
                style={{ transform: appearanceOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              />
            </button>

            {/* Expanded theme options */}
            {appearanceOpen && (
              <div className="border-t border-border" style={{ background: 'var(--surface-raised)' }}>
                {themes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setTheme(id); setAppearanceOpen(false); setOpen(false) }}
                    className="flex items-center gap-3 w-full px-5 py-2.5 text-sm transition-all"
                    onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--border) 30%, var(--surface-raised))')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                    style={{ color: mounted && theme === id ? 'var(--accent)' : 'var(--text-secondary)' }}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {label}
                    {mounted && theme === id && (
                      <Check className="w-3 h-3 ml-auto" style={{ color: 'var(--accent)' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trigger circle — larger, rose gold gear */}
      <button
        onClick={() => { setOpen(!open); if (open) setAppearanceOpen(false) }}
        aria-label="Settings"
        className="w-11 h-11 rounded-full flex items-center justify-center border"
        style={{
          background: open ? 'var(--accent-dim)' : 'var(--surface)',
          borderColor: open
            ? 'color-mix(in srgb, var(--accent) 50%, transparent)'
            : 'color-mix(in srgb, var(--accent) 30%, transparent)',
          boxShadow: open
            ? `0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent), 0 4px 16px rgba(0,0,0,0.12)`
            : '0 2px 12px rgba(0,0,0,0.1)',
          transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease, border-color 0.15s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.transform = 'translateY(-3px) scale(1.08)'
          el.style.boxShadow = `0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent), 0 6px 18px color-mix(in srgb, var(--accent) 25%, transparent)`
          el.style.borderColor = 'color-mix(in srgb, var(--accent) 60%, transparent)'
          el.style.background = 'var(--accent-dim)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.transform = open ? '' : 'translateY(0) scale(1)'
          el.style.boxShadow = open
            ? `0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent), 0 4px 16px rgba(0,0,0,0.12)`
            : '0 2px 12px rgba(0,0,0,0.1)'
          el.style.borderColor = open
            ? 'color-mix(in srgb, var(--accent) 50%, transparent)'
            : 'color-mix(in srgb, var(--accent) 30%, transparent)'
          el.style.background = open ? 'var(--accent-dim)' : 'var(--surface)'
        }}
      >
        <Settings
          className="w-5 h-5 transition-all duration-300"
          style={{
            color: gearColor,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        />
      </button>
    </div>
  )
}
