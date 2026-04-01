import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, LayoutDashboard, Upload, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import FeedbackModal from '@/components/FeedbackModal'
import ThemeToggle from '@/components/ThemeToggle'

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
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />

        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:border-accent/50"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <Shield className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="font-display text-base font-bold text-text-primary">LeaseGuard</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <Link href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all text-sm group"
          >
            <LayoutDashboard className="w-4 h-4 group-hover:text-accent transition-colors" />
            Dashboard
          </Link>
          <Link href="/upload"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all text-sm group"
          >
            <Upload className="w-4 h-4 group-hover:text-accent transition-colors" />
            New Analysis
          </Link>
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-border space-y-0.5">
          <div className="px-3 py-2">
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
          <ThemeToggle />
          <FeedbackModal />
          <form action="/api/auth/signout" method="post">
            <button type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-critical hover:bg-critical/5 transition-all text-sm w-full group"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
    </div>
  )
}
