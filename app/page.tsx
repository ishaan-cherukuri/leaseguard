import Link from 'next/link'
import { Shield, AlertTriangle, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,168,76,0.15), transparent),
                       radial-gradient(ellipse 60% 40% at 80% 80%, rgba(90,100,180,0.08), transparent),
                       #0A0B0D`,
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-accent" />
          <span className="font-display text-xl font-bold text-text-primary">LeaseGuard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-background transition-all font-medium"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-32 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          AI-powered contract analysis in under 2 minutes
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-text-primary leading-tight mb-4">
          Your lease has secrets.
        </h1>
        <h2 className="font-display text-5xl md:text-7xl font-bold mb-8" style={{ color: 'var(--accent)' }}>
          We find them.
        </h2>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload any contract. Get a plain-English breakdown of every clause that could cost you — before you sign.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-accent text-background font-semibold text-lg hover:bg-accent-hover transition-all hover:gap-3"
        >
          Analyze Your Lease Free
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-text-secondary text-sm mt-4">No credit card required · 1 free analysis on signup</p>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 pt-8 border-t border-border/50">
          {[
            { value: '12,847', label: 'leases analyzed' },
            { value: '$3,200', label: 'avg. hidden fees found' },
            { value: '2 min', label: 'average analysis time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-text-secondary text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <h3 className="font-display text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
          Everything you need to negotiate confidently
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: AlertTriangle,
              title: 'AI Clause Detection',
              description: 'Every suspicious clause is flagged with a severity label — Critical, Warning, or Info — so you know exactly what to focus on.',
              color: 'var(--warning)',
            },
            {
              icon: Shield,
              title: 'Risk Score',
              description: 'A single 0–100 risk score tells you how dangerous this contract is compared to standard market terms.',
              color: 'var(--accent)',
            },
            {
              icon: TrendingUp,
              title: 'Negotiation Scripts',
              description: 'Get exact language to request from your landlord or dealer. Know what to ask for, word for word.',
              color: 'var(--safe)',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all"
              style={{ borderLeftWidth: '3px', borderLeftColor: feature.color }}
            >
              <feature.icon className="w-8 h-8 mb-4" style={{ color: feature.color }} />
              <h4 className="font-display text-xl font-semibold text-text-primary mb-2">{feature.title}</h4>
              <p className="text-text-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
        <h3 className="font-display text-3xl md:text-4xl font-bold text-center text-text-primary mb-4">
          Simple pricing
        </h3>
        <p className="text-center text-text-secondary mb-16">Start free. Pay only when you need more.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pay per use */}
          <div className="p-8 rounded-xl border border-border bg-surface">
            <div className="text-text-secondary text-sm mb-2 font-medium uppercase tracking-wider">Pay-per-analysis</div>
            <div className="font-display text-4xl font-bold text-text-primary mb-1">$19</div>
            <div className="text-text-secondary mb-6">one-time per document</div>
            <ul className="space-y-3 mb-8">
              {['Single contract analysis', 'Full clause breakdown', 'Negotiation scripts', 'Risk score & report'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-text-secondary text-sm">
                  <CheckCircle className="w-4 h-4 text-safe shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center py-3 px-6 rounded-md border border-border text-text-primary hover:border-accent hover:text-accent transition-all font-medium"
            >
              Get started
            </Link>
          </div>

          {/* Subscription */}
          <div className="p-8 rounded-xl border-2 border-accent bg-surface-raised relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-background text-xs font-bold">
              BEST VALUE
            </div>
            <div className="text-accent text-sm mb-2 font-medium uppercase tracking-wider">Subscription</div>
            <div className="font-display text-4xl font-bold text-text-primary mb-1">$9.99</div>
            <div className="text-text-secondary mb-6">per month · unlimited analyses</div>
            <ul className="space-y-3 mb-8">
              {['Unlimited analyses', 'Full clause breakdown', 'Negotiation scripts', 'Risk score & report', 'Priority processing', 'Email reports'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-text-secondary text-sm">
                  <CheckCircle className="w-4 h-4 text-safe shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center py-3 px-6 rounded-md bg-accent text-background hover:bg-accent-hover transition-all font-semibold"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-text-secondary text-sm">© 2026 LeaseGuard</span>
        </div>
        <p className="text-text-secondary text-xs text-center">
          LeaseGuard provides informational analysis only and does not constitute legal advice.
        </p>
      </footer>
    </div>
  )
}
