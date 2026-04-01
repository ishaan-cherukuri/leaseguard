import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, LayoutDashboard, Upload, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import FeedbackModal from '@/components/FeedbackModal'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <span className="font-display text-lg font-bold text-text-primary">LeaseGuard</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all text-sm"
          >
            <Upload className="w-4 h-4" />
            New Analysis
          </Link>
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <p className="text-xs text-text-secondary truncate">{user.email}</p>
          <FeedbackModal />
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
