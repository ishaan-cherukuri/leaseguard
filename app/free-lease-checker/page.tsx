import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Upload, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import { SEO } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Free Lease Red Flag Scanner — See Your Risk Score in 60 Seconds',
  description:
    'Free AI lease analyzer. Upload your lease and instantly see hidden red flags, risky clauses, and your risk score. No credit card required. Used by thousands of renters.',
  keywords: [
    'free lease review',
    'free lease analyzer',
    'AI lease analyzer',
    'is my lease fair',
    'lease red flags',
    'free contract analysis',
    'free lease checker',
  ],
  alternates: { canonical: `${SEO.siteUrl}/free-lease-checker` },
  openGraph: {
    title: 'Free Lease Red Flag Scanner — 60-Second AI Lease Review',
    description:
      'Upload your lease PDF and get an instant risk score, flagged clauses, and negotiation scripts. Free AI lease analyzer — no credit card needed.',
    url: `${SEO.siteUrl}/free-lease-checker`,
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Check Your Lease for Red Flags Using LeaseGuard',
  description:
    'Use LeaseGuard\'s free AI lease analyzer to identify risky clauses, hidden costs, and missing tenant protections in your lease — in under 60 seconds.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Upload your lease PDF',
      text: 'Drag and drop your lease PDF into LeaseGuard. We accept any residential lease, rental agreement, or contract up to 20 pages.',
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'AI analyzes every clause',
      text: 'Claude AI reads your entire lease, identifies risky clauses, estimates hidden costs, and scans for missing tenant protections across 8 categories.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'Get your risk score and negotiation scripts',
      text: 'Receive a 0–100 risk score, a list of flagged clauses with explanations, word-for-word negotiation scripts, and a gap scan showing what\'s missing from your lease.',
      position: 3,
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the lease review really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. LeaseGuard\'s free AI lease analyzer gives you one full free lease review — including risk score, flagged clauses, hidden cost estimate, and gap scan. No credit card required.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the free AI lease analyzer work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You upload your lease PDF. Our AI contract analysis engine reads every clause, flags risky terms, estimates hidden costs, and identifies missing protections — then generates negotiation scripts tailored to your lease.',
      },
    },
    {
      '@type': 'Question',
      name: 'What lease red flags does the scanner detect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LeaseGuard\'s free lease review flags auto-renewal traps, excessive late fees, missing security deposit timelines, unreasonable entry rights, unclear repair responsibilities, penalty clauses, and more — across 8 categories of tenant protection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a substitute for a lawyer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LeaseGuard provides AI-powered contract analysis for informational purposes. For complex commercial leases or disputes, consulting a licensed attorney in your jurisdiction is recommended.',
      },
    },
  ],
}

const redFlags = [
  { icon: '⏰', title: 'Auto-renewal traps', desc: 'Leases that lock you in for another year if you miss a 60-day notice window.' },
  { icon: '💸', title: 'Hidden cost clauses', desc: 'Fees for early termination, utility billing tricks, and vague "damage" charges.' },
  { icon: '🔑', title: 'Illegal entry rights', desc: 'Landlords claiming the right to enter with less than 24 hours notice.' },
  { icon: '🛠', title: 'Shifted repair duties', desc: 'Leases that make you responsible for appliances, HVAC, or structural repairs.' },
  { icon: '📋', title: 'Missing deposit terms', desc: 'No timeline for security deposit return — leaving you chasing money for months.' },
  { icon: '🚫', title: 'Waived tenant rights', desc: 'Clauses that appear to remove legal protections you actually cannot waive.' },
]

export default function FreeLeaseCheckerPage() {
  return (
    <>
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />

      <div className="min-h-screen" style={{ background: 'var(--background)' }}>

        {/* Nav */}
        <nav className="border-b border-border px-6 py-4 sticky top-0 z-50"
          style={{ background: 'var(--surface)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
                <Shield className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="font-display font-bold text-base">LeaseGuard</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-text-secondary text-sm hover:text-text-primary transition-colors">Sign in</Link>
              <Link href="/signup" className="btn-primary text-sm px-4 py-2 rounded-lg">
                Try for free
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="px-6 py-20 text-center" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '700px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(201,116,138,0.12), transparent 70%)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />

          <div className="max-w-3xl mx-auto relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: 'rgba(201,116,138,0.1)', border: '1px solid rgba(201,116,138,0.25)', color: 'var(--accent)' }}>
              Free AI Lease Analyzer
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary leading-tight mb-6">
              Free Lease Red Flag Scanner —{' '}
              <span className="font-italic" style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
                See Your Risk Score in 60 Seconds
              </span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-10 max-w-2xl mx-auto">
              Upload your lease PDF and get an instant AI lease review. Our free contract analysis
              surfaces red flags, estimates hidden costs, and gives you word-for-word negotiation scripts —
              so you know exactly what you&apos;re signing before you sign it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold">
                <Upload className="w-5 h-5" />
                Analyze my lease free →
              </Link>
              <p className="text-text-muted text-sm">No credit card · First review free · Results in 60s</p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
              {[
                { icon: <CheckCircle className="w-4 h-4 text-safe" />, text: 'Free AI lease review' },
                { icon: <Clock className="w-4 h-4 text-accent" />, text: 'Results in 60 seconds' },
                { icon: <CheckCircle className="w-4 h-4 text-safe" />, text: 'No legal jargon' },
                { icon: <CheckCircle className="w-4 h-4 text-safe" />, text: 'Negotiation scripts included' },
              ].map((b) => (
                <span key={b.text} className="flex items-center gap-1.5">
                  {b.icon} {b.text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Red flags section */}
        <section className="px-6 py-20" style={{ background: 'var(--surface-raised)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(224,82,82,0.08)', border: '1px solid rgba(224,82,82,0.2)', color: 'var(--critical)' }}>
                <AlertTriangle className="w-3.5 h-3.5" />
                Common lease red flags
              </div>
              <h2 className="font-display text-3xl font-bold text-text-primary mb-3">
                Is my lease fair? These 6 clauses say it isn&apos;t.
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                Our free lease analyzer detects all of these and more — across 8 categories of tenant protection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {redFlags.map((flag) => (
                <div key={flag.title} className="p-5 rounded-2xl border border-border card-interactive"
                  style={{ background: 'var(--surface)' }}>
                  <div className="text-2xl mb-3">{flag.icon}</div>
                  <h3 className="font-semibold text-text-primary mb-1.5">{flag.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{flag.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-text-primary mb-3">
                How the free lease review works
              </h2>
              <p className="text-text-secondary">Three steps. Under 60 seconds.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { n: '1', title: 'Upload your lease PDF', desc: 'Drag and drop any residential lease, rental agreement, or contract. Supports PDFs up to 20 pages.' },
                { n: '2', title: 'AI reads every clause', desc: 'Claude AI analyzes your contract — flagging risky terms, estimating hidden costs, and scanning for missing tenant protections.' },
                { n: '3', title: 'Get your risk score', desc: 'Receive a 0–100 risk score, flagged clause list, cost estimate, negotiation scripts, and a full lease gap scan.' },
              ].map((step) => (
                <div key={step.n} className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '2px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
                    {step.n}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold">
                Start my free lease review →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20" style={{ background: 'var(--surface-raised)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-text-primary mb-10 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is the lease review really free?',
                  a: 'Yes. LeaseGuard\'s free AI lease analyzer gives you one full free lease review — including risk score, flagged clauses, hidden cost estimate, and gap scan. No credit card required.',
                },
                {
                  q: 'How does the free AI lease analyzer work?',
                  a: 'You upload your lease PDF. Our AI contract analysis engine reads every clause, flags risky terms, estimates hidden costs, and identifies missing protections — then generates negotiation scripts tailored to your specific lease.',
                },
                {
                  q: 'What types of contracts can I check for free?',
                  a: 'LeaseGuard supports residential leases, rental agreements, employment contracts, gym memberships, car leases, insurance contracts, and general business agreements. The free lease checker handles any standard PDF contract.',
                },
                {
                  q: 'Is this a substitute for a lawyer?',
                  a: 'LeaseGuard provides AI-powered contract analysis for informational purposes. For complex commercial leases or active legal disputes, consulting a licensed attorney in your jurisdiction is recommended.',
                },
              ].map((item) => (
                <div key={item.q} className="p-5 rounded-2xl border border-border"
                  style={{ background: 'var(--surface)' }}>
                  <h3 className="font-semibold text-text-primary mb-2">{item.q}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              Ready to find out if your lease is fair?
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Join thousands of renters who used LeaseGuard&apos;s free AI lease review to spot red flags,
              negotiate better terms, and protect themselves before signing.
            </p>
            <Link href="/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold">
              <Upload className="w-5 h-5" />
              Analyze my lease free →
            </Link>
            <p className="text-text-muted text-sm mt-4">No account needed for your first free lease review.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-8" style={{ background: 'var(--surface-raised)' }}>
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-text-primary">
              <Shield className="w-4 h-4 text-accent" />
              <span className="font-display font-bold text-sm">LeaseGuard</span>
            </Link>
            <div className="flex gap-6 text-sm text-text-muted flex-wrap">
              <Link href="/" className="hover:text-text-secondary transition-colors">Home</Link>
              <Link href="/blog" className="hover:text-text-secondary transition-colors">Blog</Link>
              <Link href="/upgrade" className="hover:text-text-secondary transition-colors">Pricing</Link>
              <Link href="/login" className="hover:text-text-secondary transition-colors">Sign in</Link>
            </div>
            <p className="text-text-muted text-xs">© 2026 LeaseGuard</p>
          </div>
        </footer>
      </div>
    </>
  )
}
