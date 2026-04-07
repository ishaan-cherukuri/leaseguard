import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}
import { Shield, LayoutDashboard, Upload, LogOut, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import FeedbackModal from '@/components/FeedbackModal'
import SettingsPopover from '@/components/SettingsPopover'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-border relative"
        style={{ background: 'linear-gradient(180deg, var(--surface) 0%, var(--background) 100%)' }}>

        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 40%, transparent), transparent)' }} />

        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:border-accent/50"
              style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              <Shield className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="font-display text-base font-bold text-text-primary">LeaseGuard</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <Link href="/dashboard"
            className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary text-sm group"
          >
            <LayoutDashboard className="w-4 h-4 transition-colors duration-150" />
            Dashboard
          </Link>
          <Link href="/upload"
            className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary text-sm group"
          >
            <Upload className="w-4 h-4 transition-colors duration-150" />
            New Analysis
          </Link>
          <Link href="/upgrade"
            className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary text-sm group"
          >
            <CreditCard className="w-4 h-4 transition-colors duration-150" />
            Billing
          </Link>
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-border space-y-0.5">
          <div className="px-3 py-2.5">
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
          <FeedbackModal />
          <form action="/api/auth/signout" method="post">
            <button type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-critical hover:bg-critical/5 text-sm w-full"
              style={{ transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), color 0.15s ease, background 0.15s ease' }}
            >
              <LogOut className="w-4 h-4 transition-colors duration-150" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>

      {/* Fixed settings circle — persists on all app pages */}
      <SettingsPopover />
    </div>
  )
}
