import Link from 'next/link'
import { Shield, ArrowRight, CheckCircle, Zap, Lock, TrendingUp, FileSearch, AlertTriangle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden noise">

      {/* Gradient mesh background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, rgba(232,68,90,0.4) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, rgba(91,141,239,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Dot grid */}
      <div className="fixed inset-0 z-0 dot-grid opacity-40 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent" />
          </div>
          <span className="font-display text-lg font-bold text-text-primary tracking-tight">LeaseGuard</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link href="/signup"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#080910' }}
          >
            <span className="relative z-10">Get started free</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #E2C06A, #C9A84C)' }} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-8 pt-24 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-10 fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-glow" />
          AI-powered contract analysis · Under 60 seconds
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-bold leading-none tracking-tight mb-6 fade-in-up" style={{ animationDelay: '80ms' }}>
          <span className="text-text-primary">Your lease</span>
          <br />
          <span className="gradient-text-gold">has secrets.</span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto mb-12 leading-relaxed fade-in-up" style={{ animationDelay: '160ms' }}>
          Upload any contract. Our AI reads it like a real estate attorney and surfaces every clause that could cost you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up" style={{ animationDelay: '240ms' }}>
          <Link href="/signup"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all glow-gold"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#080910' }}
          >
            Analyze for free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-sm text-text-secondary border border-border hover:border-accent/30 hover:text-text-primary transition-all glass"
          >
            Sign in
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-20 fade-in-up" style={{ animationDelay: '320ms' }}>
          {[
            { value: '12,847', label: 'contracts analyzed' },
            { value: '$3,200', label: 'avg. hidden fees found' },
            { value: '< 60s', label: 'average analysis time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold gradient-text-gold">{stat.value}</div>
              <div className="text-text-secondary text-sm mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section id="features" className="relative z-10 px-8 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Every angle covered
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            We go beyond keyword scanning. Our AI understands context, intent, and legal precedent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: FileSearch,
              title: 'Deep Clause Analysis',
              description: 'Every clause is read in context. We catch the subtle ones that look harmless but aren\'t.',
              accent: 'var(--accent)',
              gradient: 'from-accent/10 to-transparent',
            },
            {
              icon: AlertTriangle,
              title: 'Risk Scoring',
              description: 'A single 0–100 score tells you exactly how dangerous this contract is before you sign.',
              accent: 'var(--rose)',
              gradient: 'from-rose/10 to-transparent',
            },
            {
              icon: TrendingUp,
              title: 'Negotiation Scripts',
              description: 'Exact language to bring to your landlord or dealer. Word for word, clause for clause.',
              accent: 'var(--safe)',
              gradient: 'from-safe/10 to-transparent',
            },
          ].map((f) => (
            <div key={f.title} className="group relative rounded-2xl p-6 border border-border bg-surface hover:border-opacity-60 transition-all overflow-hidden cursor-default">
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl mb-5 flex items-center justify-center"
                  style={{ backgroundColor: `color-mix(in srgb, ${f.accent} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${f.accent} 25%, transparent)` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.accent }} />
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-20 grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Upload', description: 'Drop your PDF — lease, gym contract, car purchase, anything.' },
            { step: '02', title: 'Extract', description: 'We extract every word and send it to our AI engine.' },
            { step: '03', title: 'Analyze', description: 'Claude reads it like a $500/hr attorney, in under a minute.' },
            { step: '04', title: 'Review', description: 'Get your risk score, flagged clauses, and negotiation points.' },
          ].map((item, i) => (
            <div key={item.step} className="relative p-5 rounded-xl border border-border bg-surface-raised">
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-border z-10" />
              )}
              <div className="text-xs font-mono text-text-muted mb-3">{item.step}</div>
              <div className="font-display text-lg font-bold text-text-primary mb-1">{item.title}</div>
              <p className="text-text-secondary text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 px-8 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">Simple pricing</h2>
          <p className="text-text-secondary">Start free. No card required.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Pay per use */}
          <div className="p-8 rounded-2xl border border-border bg-surface">
            <div className="text-text-secondary text-xs uppercase tracking-widest mb-3 font-medium">Pay-per-analysis</div>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-display text-5xl font-bold text-text-primary">$19</span>
            </div>
            <div className="text-text-secondary text-sm mb-8">one-time per document</div>
            <ul className="space-y-3 mb-8">
              {['Single contract analysis', 'Full risk breakdown', 'Negotiation scripts', 'PDF report'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-text-secondary text-sm">
                  <CheckCircle className="w-4 h-4 text-safe shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup"
              className="block text-center py-3 rounded-xl border border-border text-text-secondary hover:border-accent/40 hover:text-text-primary transition-all text-sm font-medium glass"
            >
              Get started
            </Link>
          </div>

          {/* Subscription */}
          <div className="p-8 rounded-2xl relative overflow-hidden gradient-border glow-gold"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, var(--surface) 60%)' }}>
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#080910' }}>
              BEST VALUE
            </div>
            <div className="text-accent text-xs uppercase tracking-widest mb-3 font-medium">Subscription</div>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-display text-5xl font-bold text-text-primary">$9.99</span>
              <span className="text-text-secondary text-sm mb-2">/mo</span>
            </div>
            <div className="text-text-secondary text-sm mb-8">unlimited analyses</div>
            <ul className="space-y-3 mb-8">
              {['Unlimited analyses', 'Full risk breakdown', 'Negotiation scripts', 'Priority AI processing', 'Email reports', 'Early access to new features'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-text-secondary text-sm">
                  <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup"
              className="block text-center py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#080910' }}
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-8 py-24 max-w-3xl mx-auto text-center">
        <div className="p-12 rounded-3xl border border-accent/20 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(8,9,16,0.9) 100%)' }}>
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="relative z-10">
            <Zap className="w-10 h-10 text-accent mx-auto mb-6 float" />
            <h2 className="font-display text-4xl font-bold text-text-primary mb-4">
              Don&apos;t sign before you scan.
            </h2>
            <p className="text-text-secondary mb-8 max-w-sm mx-auto">
              10,000 words free. No credit card. Takes less than a minute.
            </p>
            <Link href="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all glow-gold group"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#080910' }}
            >
              Analyze your contract free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-8 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Shield className="w-3 h-3 text-accent" />
          </div>
          <span className="text-text-secondary text-sm">© 2026 LeaseGuard</span>
        </div>
        <div className="flex items-center gap-4">
          <Lock className="w-3 h-3 text-text-muted" />
          <p className="text-text-muted text-xs">
            Informational only · Not legal advice
          </p>
        </div>
      </footer>
    </div>
  )
}
