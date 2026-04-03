'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { BackgroundPaths } from '@/components/ui/background-paths'

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const DollarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
)
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

// ─── Injected CSS ─────────────────────────────────────────────────────────────
const PAGE_CSS = `
  /* Scroll reveal */
  .lp-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .lp-reveal.visible {
    opacity: 1;
    transform: none;
  }

  /* Fade-up for hero elements */
  .lp-fade-up {
    opacity: 0;
    transform: translateY(20px);
    animation: lpFadeUp 0.6s ease forwards;
  }
  .lp-fade-1 { animation-delay: 0ms; }
  .lp-fade-2 { animation-delay: 80ms; }
  .lp-fade-3 { animation-delay: 160ms; }
  .lp-fade-4 { animation-delay: 240ms; }
  .lp-fade-5 { animation-delay: 320ms; }
  @keyframes lpFadeUp {
    to { opacity: 1; transform: none; }
  }

  /* ── Suppress global spring-lift for all landing page links ──────────────
     The global a:hover { transform: translateY(-2px) } with spring easing
     causes links to overshoot and jump during scroll. Reset it here and
     let only .btn-primary / .btn-ghost control their own transforms.      */
  #lp-root a,
  #lp-root button {
    transition: color 0.2s ease, opacity 0.15s ease, border-color 0.15s ease, background 0.15s ease !important;
  }
  #lp-root a:hover,
  #lp-root button:hover {
    transform: none !important;
  }
  #lp-root a:active,
  #lp-root button:active {
    transform: scale(0.97) !important;
  }
  /* Re-enable btn-primary hover lift (override the suppression above) */
  #lp-root a.btn-primary,
  #lp-root button.btn-primary {
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, filter 0.2s ease !important;
  }
  #lp-root a.btn-primary:hover,
  #lp-root button.btn-primary:hover {
    transform: translateY(-4px) scale(1.03) !important;
  }
  #lp-root a.btn-primary:active,
  #lp-root button.btn-primary:active {
    transform: translateY(0px) scale(0.97) !important;
  }
  /* Re-enable btn-ghost hover lift */
  #lp-root a.btn-ghost,
  #lp-root button.btn-ghost {
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), border-color 0.15s ease, color 0.15s ease, box-shadow 0.22s ease, background 0.15s ease !important;
  }
  #lp-root a.btn-ghost:hover,
  #lp-root button.btn-ghost:hover {
    transform: translateY(-4px) scale(1.02) !important;
  }
  #lp-root a.btn-ghost:active,
  #lp-root button.btn-ghost:active {
    transform: translateY(0px) scale(0.97) !important;
  }

  /* Landing nav link (no sidebar slide effect) */
  .lp-nav-link {
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
  }
  .lp-nav-link:hover {
    color: var(--accent);
  }

  /* Badge pill */
  .lp-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.8125rem;
    font-weight: 600;
    background: rgba(183,110,121,0.1);
    border: 1px solid rgba(183,110,121,0.25);
    color: var(--accent);
  }

  /* Ambient glow blobs */
  .lp-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,116,138,0.15), transparent 70%);
    filter: blur(60px);
    pointer-events: none;
    z-index: 0;
  }

  /* Dot texture overlay */
  .lp-texture::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(201,116,138,0.05) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    z-index: 0;
  }

  /* Feature card */
  .lp-feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 1.75rem;
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, border-color 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .lp-feature-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at center, rgba(201,116,138,0.06) 1px, transparent 1px);
    background-size: 4px 4px;
    pointer-events: none;
  }
  .lp-feature-card:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: 0 16px 40px rgba(0,0,0,0.14), 0 0 0 1px rgba(201,116,138,0.22);
    border-color: rgba(201,116,138,0.28);
  }

  /* Pricing card wrapper — gives space for the badge above featured card */
  .lp-pricing-wrapper {
    display: flex;
    flex-direction: column;
    overflow: visible;
  }
  .lp-pricing-wrapper.lp-featured-wrapper {
    padding-top: 18px;
  }

  /* Pricing card */
  .lp-pricing-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    padding: 1.75rem;
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease;
    overflow: visible;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  /* Dot texture via pseudo-element (overflow visible on parent, clip only texture) */
  .lp-pricing-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    background-image: radial-gradient(circle at center, rgba(201,116,138,0.06) 1px, transparent 1px);
    background-size: 4px 4px;
    pointer-events: none;
    overflow: hidden;
  }
  .lp-pricing-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  }
  .lp-pricing-card.lp-featured {
    background: linear-gradient(135deg, rgba(201,116,138,0.09) 0%, var(--surface) 100%);
    border-color: rgba(201,116,138,0.38);
    box-shadow: 0 0 0 1px rgba(201,116,138,0.15), 0 20px 60px rgba(201,116,138,0.15);
    transform: scale(1.02);
  }
  .lp-pricing-card.lp-featured:hover {
    transform: scale(1.02) translateY(-6px);
    box-shadow: 0 0 0 1px rgba(201,116,138,0.32), 0 24px 60px rgba(201,116,138,0.22);
  }

  /* Feature list fills available space, pushes button down */
  .lp-pricing-features {
    flex: 1;
    margin-bottom: 1.75rem;
  }

  /* Uniform CTA button height */
  .lp-pricing-cta {
    margin-top: auto;
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
  }

  /* Step number */
  .lp-step-num {
    font-family: var(--font-playfair), serif;
    font-size: 3.5rem;
    font-weight: 800;
    color: rgba(201,116,138,0.2);
    line-height: 1;
  }

  /* Step divider */
  .lp-divider {
    height: 2px;
    width: 40px;
    background: linear-gradient(90deg, var(--accent), transparent);
    border-radius: 9999px;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }

  /* Risk badges in demo card */
  .lp-risk-critical { background: rgba(224,82,82,0.15); color: #E05252; border-radius: 9999px; }
  .lp-risk-high     { background: rgba(224,82,82,0.1);  color: #E07D52; border-radius: 9999px; }
  .lp-risk-medium   { background: rgba(224,154,48,0.1); color: #E09A30; border-radius: 9999px; }

  @media (min-width: 1024px) {
    .lp-nav-center { display: flex !important; }
    #lp-hero-card  { display: block !important; }
  }
  @media (max-width: 1023px) {
    .lp-nav-center { display: none !important; }
    #lp-hero-card  { display: none !important; }
  }
`

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lp-reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'var(--surface-glass)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      padding: '0 1.5rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 65%, #000))',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <ShieldIcon />
          </div>
          <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            LeaseGuard
          </span>
        </Link>

        {/* Center nav */}
        <div className="lp-nav-center" style={{ display: 'none', alignItems: 'center', gap: '2rem' }}>
          <a className="lp-nav-link" href="#features">Features</a>
          <a className="lp-nav-link" href="#how-it-works">How it works</a>
          <a className="lp-nav-link" href="#pricing">Pricing</a>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleDark}
            style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: '50%',
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href="/login" className="lp-nav-link" style={{ padding: '0.5rem 1rem' }}>Sign in</Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', borderRadius: '0.625rem' }}>
            Try for free
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Demo card (floats in hero on desktop) ────────────────────────────────────
function DemoCard() {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      boxShadow: '0 30px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(201,116,138,0.1)',
    }}>
      {/* File header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--accent-dim)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
          <FileTextIcon />
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>apartment_lease.pdf</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>24 pages · Analysis complete</div>
        </div>
      </div>

      {/* Risk score */}
      <div style={{ background: 'var(--surface-raised)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Risk Score</span>
          <span className="lp-risk-high" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem' }}>HIGH</span>
        </div>
        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-playfair), serif', fontWeight: 800, color: '#E07D52', lineHeight: 1 }}>72</div>
        <div style={{ marginTop: '0.75rem', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #3ECF8E, #E09A30, #E07D52)', borderRadius: '3px' }} />
        </div>
      </div>

      {/* Flagged clauses */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>
          Flagged Clauses
        </div>
        {[
          { label: 'Early termination fee: $3,200', level: 'lp-risk-critical' },
          { label: 'Landlord entry: 2-hour notice', level: 'lp-risk-high' },
          { label: 'Pet deposit non-refundable', level: 'lp-risk-medium' },
        ].map((c) => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className={c.level} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', flexShrink: 0 }}>!</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Hidden cost estimate */}
      <div style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)', borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.25rem' }}>Estimated Hidden Costs</div>
        <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-playfair), serif', fontWeight: 700, color: 'var(--text-primary)' }}>$4,850 – $6,200</div>
      </div>

      {/* AI detection result */}
      <div style={{ background: 'rgba(26,58,74,0.15)', border: '1px solid rgba(26,58,74,0.3)', borderRadius: '0.75rem', padding: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#4a9ab5', fontWeight: 600 }}>AI Detection</div>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'rgba(201,116,138,0.15)', color: '#C9748A', border: '1px solid rgba(201,116,138,0.25)' }}>
            Likely AI
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          73% of this contract shows AI-generation patterns — verify terms with the other party.
        </div>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="lp-texture" style={{ position: 'relative', paddingTop: '130px', paddingBottom: '100px', overflow: 'hidden' }}>
      <div className="lp-glow" style={{ top: '-100px', right: '-100px', opacity: 0.8 }} />
      <div className="lp-glow" style={{ bottom: '-50px', left: '-150px', width: '500px', height: '500px', opacity: 0.5 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '760px' }}>
          {/* Badge */}
          <div className="lp-badge lp-fade-up lp-fade-1" style={{ marginBottom: '1.75rem' }}>
            <ZapIcon />
            Risk Analysis · AI Detection · Negotiation Scripts
          </div>

          {/* Headline */}
          <h1 className="lp-fade-up lp-fade-2" style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', marginBottom: '1.5rem',
          }}>
            Read every contract.{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #EDAFC0, #C9748A)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Trust nothing.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="lp-fade-up lp-fade-3" style={{ fontSize: '1.2rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '540px' }}>
            Upload any contract and get a full risk score, flagged clauses, hidden cost estimate,
            negotiation scripts — and an AI authorship check to see if the contract was machine-generated.
          </p>

          {/* CTAs */}
          <div className="lp-fade-up lp-fade-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '3.5rem' }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.25rem', borderRadius: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
              <UploadIcon />
              Analyze my contract
            </Link>
            <a href="#how-it-works" className="btn-ghost" style={{ fontSize: '1rem', padding: '1rem 1.75rem', borderRadius: '0.875rem' }}>
              See how it works
            </a>
          </div>

          {/* Stats — whole row fades up as one unit */}
          <div className="lp-fade-up lp-fade-5" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { value: '60s', label: 'Average analysis time' },
              { value: '2-in-1', label: 'Risk review + AI detection' },
              { value: 'Free', label: 'First contract on us' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating demo card — desktop only */}
        <div id="lp-hero-card" className="lp-fade-up lp-fade-3"
          style={{ position: 'absolute', right: '1.5rem', top: '60px', width: '320px', display: 'none' }}>
          <DemoCard />
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: <AlertIcon />, title: 'Risk Score', desc: 'Every contract gets a 0–100 risk score. Know instantly whether to sign, negotiate, or walk away.' },
    { icon: <FileTextIcon />, title: 'Flagged Clauses', desc: 'AI highlights the clauses that could cost you — with plain-English explanations of why they matter.' },
    { icon: <MessageIcon />, title: 'Negotiation Scripts', desc: 'Get word-for-word scripts to push back on bad terms. Know exactly what to say to your landlord.' },
    { icon: <DollarIcon />, title: 'Hidden Cost Estimate', desc: 'Uncover fees buried in the fine print. See the true total cost of signing before you commit.' },
    { icon: <LayersIcon />, title: 'AI Authorship Detection', desc: 'Find out if your contract was AI-generated. Boilerplate AI drafts often miss jurisdiction-specific protections.' },
    { icon: <ClockIcon />, title: '60-Second Analysis', desc: 'Upload your PDF and get risk review + AI detection results in under a minute. No legalese required.' },
  ]

  return (
    <section id="features" style={{ padding: '100px 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="lp-reveal" style={{ marginBottom: '4rem' }}>
          <div className="lp-badge" style={{ marginBottom: '1.25rem' }}>Features</div>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15, maxWidth: '560px', color: 'var(--text-primary)' }}>
            Risk review <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>and</span> AI detection,{' '}
            in one upload
          </h2>
        </div>

        <div className="lp-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {features.map((f) => (
            <div key={f.title} className="lp-feature-card">
              <div style={{
                width: '44px', height: '44px',
                background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', marginBottom: '1.25rem', position: 'relative', zIndex: 1,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--text-primary)', position: 'relative', zIndex: 1 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--text-secondary)', position: 'relative', zIndex: 1 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Upload your contract', desc: 'Drag and drop any PDF lease, rental, or business contract. We handle any size.', detail: 'Supports leases, rentals, employment, gym, insurance, car, and more.' },
    { n: '02', title: 'Two analyses run in parallel', desc: 'Claude reads every clause for risk, flagged terms, and hidden costs. Pangram checks whether the contract was AI-generated.', detail: 'Both results appear side by side in the same interface.' },
    { n: '03', title: 'Sign — or negotiate', desc: 'Get your risk score, flagged clauses, cost estimate, negotiation scripts, and an AI authorship verdict. Know what to push back on.', detail: 'Takes under 60 seconds from upload to results.' },
  ]

  return (
    <section id="how-it-works" className="lp-texture" style={{ padding: '100px 1.5rem', background: 'var(--surface-raised)', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="lp-reveal" style={{ marginBottom: '4.5rem' }}>
          <div className="lp-badge" style={{ marginBottom: '1.25rem' }}>How it works</div>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15, color: 'var(--text-primary)' }}>
            One upload.{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Two layers of protection.</span>
          </h2>
        </div>

        <div className="lp-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {steps.map((step) => (
            <div key={step.n}>
              <div className="lp-step-num">{step.n}</div>
              <div className="lp-divider" />
              <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.875rem', color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {step.desc}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="lp-reveal" style={{
          marginTop: '4rem', paddingTop: '3rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1.5rem',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Ready to protect yourself?
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
              First contract is completely free. No credit card required.
            </p>
          </div>
          <Link href="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2rem', borderRadius: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Start for free <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: 'Free', price: '$0', period: '',
      desc: 'Perfect for first-time users. See what you\'re signing up for.',
      docs: '1 contract / month',
      features: ['Full AI contract analysis', 'Risk score & risk level', 'Flagged clauses', 'Cost estimate'],
      cta: 'Get started free', href: '/signup', featured: false, badge: null,
    },
    {
      name: 'Shield', price: '$14', period: 'one-time',
      desc: 'Moving into a new place? One deep analysis, pay once.',
      docs: '1 contract, never expires',
      features: ['Everything in Free', 'Negotiation scripts', 'Market comparison', 'No subscription'],
      cta: 'Buy Shield', href: '/upgrade', featured: false, badge: null,
    },
    {
      name: 'Guard', price: '$9.99', period: '/mo',
      desc: 'For renters and freelancers who sign contracts regularly.',
      docs: '4 contracts / month',
      features: ['Everything in Shield', '4 doc credits / month', 'Heavy doc support', 'Resets monthly'],
      cta: 'Start Guard', href: '/upgrade', featured: true, badge: 'Most Popular',
    },
    {
      name: 'Sentinel', price: '$24.99', period: '/mo',
      desc: 'For landlords, small businesses, and power users.',
      docs: '12 contracts / month',
      features: ['Everything in Guard', '12 doc credits / month', '2 credits for heavy docs', 'Priority support'],
      cta: 'Start Sentinel', href: '/upgrade', featured: false, badge: null,
    },
  ]

  return (
    <section id="pricing" style={{ padding: '100px 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="lp-reveal" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div className="lp-badge" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>Pricing</div>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Simple, honest pricing
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.65 }}>
            Start free. Upgrade when you need more. No surprises in the fine print.
          </p>
        </div>

        {/* overflow:visible on grid so badge above Guard isn't clipped */}
        <div className="lp-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', alignItems: 'stretch', overflow: 'visible' }}>
          {tiers.map((tier) => (
            /* Wrapper adds top padding for featured badge, keeps overflow visible */
            <div
              key={tier.name}
              className={`lp-pricing-wrapper${tier.featured ? ' lp-featured-wrapper' : ''}`}
              style={{ willChange: 'transform' }}
            >
              <div className={`lp-pricing-card${tier.featured ? ' lp-featured' : ''}`}>
                {/* Badge floats above the card */}
                {tier.badge && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 65%, #000))',
                    color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                    padding: '0.3rem 1rem', borderRadius: '9999px', whiteSpace: 'nowrap', zIndex: 10,
                  }}>
                    {tier.badge}
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                    {tier.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{tier.period}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.625rem', lineHeight: 1.55 }}>
                    {tier.desc}
                  </p>
                </div>

                <div style={{
                  background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                  borderRadius: '0.625rem', padding: '0.625rem 0.875rem',
                  fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '1.5rem',
                  position: 'relative', zIndex: 1,
                }}>
                  {tier.docs}
                </div>

                {/* flex:1 makes this section grow to fill card height */}
                <ul className="lp-pricing-features" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', position: 'relative', zIndex: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}><CheckIcon /></span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* mt-auto + uniform h-[48px] keeps all buttons at the same bottom position */}
                <Link
                  href={tier.href}
                  className={`lp-pricing-cta ${tier.featured ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="lp-reveal" style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Heavy documents (20+ pages or 5,000+ words) use 2 doc credits on Guard &amp; Sentinel.
        </p>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 1.5rem', background: 'var(--surface-raised)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 65%, #000))',
            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <ShieldIcon />
          </div>
          <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            LeaseGuard
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[{ label: 'Features', href: '#features' }, { label: 'How it works', href: '#how-it-works' }, { label: 'Pricing', href: '#pricing' }].map((l) => (
            <a key={l.label} className="lp-nav-link" href={l.href}>{l.label}</a>
          ))}
          <Link className="lp-nav-link" href="/login">Sign in</Link>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          © 2026 LeaseGuard ·{' '}
          <a href="mailto:Ishaan.cherukuri@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
        </p>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  useScrollReveal()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const dark = resolvedTheme === 'dark'
  const toggleDark = () => setTheme(dark ? 'light' : 'dark')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      {/* Fixed animated background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundPaths />
      </div>

      <div id="lp-root" style={{ minHeight: '100vh', background: 'var(--background)', position: 'relative', zIndex: 1 }}>
        <Nav dark={mounted ? dark : false} toggleDark={toggleDark} />
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Footer />
      </div>
    </>
  )
}
