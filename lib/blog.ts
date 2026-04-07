export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string        // ISO date string e.g. "2026-04-06"
  author: string
  authorBio: string
  authorLinkedIn: string
  tags: string[]
  readingTime: number // minutes
  content: string     // HTML string
}

const posts: BlogPost[] = [
  {
    slug: 'is-my-lease-fair',
    title: 'Is My Lease Fair? 10 Signs Your Landlord Is Taking Advantage of You',
    description:
      'Most renters sign leases without knowing what to look for. Here are 10 red flags that signal your landlord may be taking advantage — and what to do about each one.',
    date: '2026-04-06',
    author: 'Ishaan Cherukuri',
    authorBio:
      'Ishaan is the founder of LeaseGuard, an AI lease analyzer that helps renters understand and negotiate their contracts. He built LeaseGuard after watching friends sign unfair leases they didn\'t fully understand.',
    authorLinkedIn: 'https://www.linkedin.com/in/ishaancherukuri',
    tags: ['lease review', 'renter rights', 'AI lease analyzer', 'contract red flags'],
    readingTime: 7,
    content: `
<p>You finally found an apartment you love. The landlord hands you a stack of papers and says, "Just sign here." Most renters do exactly that — without reading a word.</p>

<p>That's how landlords get away with charging thousands of dollars in fees that were always buried in the fine print. This guide covers the 10 most common signs your lease is stacked against you, what each clause actually means, and how to push back before you sign.</p>

<div class="blog-cta-inline">
  <p>Want to know if YOUR lease has these red flags? <a href="/upload"><strong>Analyze your lease free →</strong></a></p>
</div>

<h2>1. Auto-Renewal Clauses With Short Notice Windows</h2>
<p>Some leases automatically convert to a new 12-month term if you don't give notice 60 or even 90 days before your lease ends. Miss the window by one day and you're locked in for another year.</p>
<p><strong>What to look for:</strong> Language like "this lease shall automatically renew unless Tenant provides written notice no later than [X] days prior to expiration."</p>
<p><strong>What to ask for:</strong> A 30-day notice window, or an automatic month-to-month conversion instead of a full-year renewal. Any AI lease analyzer will flag auto-renewal clauses as high-risk because they regularly trap tenants.</p>

<h2>2. Excessive Late Fees</h2>
<p>Late fees are standard, but some landlords charge fees that stack daily, or charge a flat fee that's a significant percentage of rent. In many states there are legal caps on late fees — your lease may be violating them already.</p>
<p><strong>Red flags:</strong> Late fees over 5–10% of monthly rent, fees that accrue daily after a grace period, or fees that apply before any grace period at all.</p>
<p><strong>What to ask for:</strong> A 5-day grace period and a flat late fee capped at 5% of monthly rent. Check your state's specific limits — this is one of the areas where lease red flags vary most by location.</p>

<h2>3. Security Deposit Traps</h2>
<p>Landlords legally must return your security deposit within a set number of days after move-out (varies by state, typically 14–30 days), with itemized documentation of any deductions. Many leases quietly omit this timeline, leaving you to chase them indefinitely.</p>
<p><strong>Watch for:</strong> No mention of a return timeline, vague language about "damages beyond normal wear and tear" without defining what that means, or a clause that lets the landlord deduct cleaning fees regardless of condition.</p>
<p><strong>What to ask for:</strong> Add explicit language: "Landlord shall return the security deposit or provide itemized written deductions within 21 days of move-out." A proper lease review will always flag a missing deposit return clause.</p>

<h2>4. Illegal or Unreasonable Entry Rights</h2>
<p>Your home is your home — even when you rent it. Most states require landlords to give at least 24 hours notice before entering, except in genuine emergencies. Some leases try to claim the right to enter with only a few hours notice, or even at will.</p>
<p><strong>Red flags:</strong> "Landlord may enter premises at any time with reasonable notice" without defining what "reasonable" means. Two hours is not reasonable.</p>
<p><strong>What to ask for:</strong> "Landlord shall provide no less than 24 hours written notice before entry, except in the case of emergency." This is one of the most common lease gaps our AI lease analyzer surfaces.</p>

<h2>5. Unreasonable Repair Responsibilities</h2>
<p>Landlords are legally required to maintain habitable conditions — heat, plumbing, structural integrity. But some leases try to shift maintenance obligations onto tenants. Read the repair section carefully.</p>
<p><strong>Watch for:</strong> Clauses that require you to maintain HVAC systems, replace smoke detector batteries (normal), but also fix appliances, pipes, or anything "caused by Tenant's use." The last phrase is deliberately vague.</p>
<p><strong>What to ask for:</strong> A clear list of what the landlord is responsible for and a repair response timeline: emergency repairs within 24 hours, non-emergency within 14 days.</p>

<h2>6. Penalty Clauses That Punish Normal Living</h2>
<p>Some leases charge fees for things that are entirely normal: having guests stay for more than a week, owning certain houseplants, working from home, or even receiving packages. These clauses are often unenforceable, but they're used to intimidate tenants.</p>
<p><strong>Red flags:</strong> "Guest stays exceeding 72 hours constitute a lease violation," "No commercial activity of any kind," or "Tenant may not alter the premises in any way" (which includes things like hanging a picture).</p>
<p><strong>What to ask for:</strong> Strike these or add reasonable carve-outs. A clause prohibiting all guests overnight is likely unenforceable in most jurisdictions — but it's still worth fixing before you sign.</p>

<h2>7. Utility Billing Tricks</h2>
<p>RUBS — Ratio Utility Billing Systems — allow landlords to divide a building's total utility bill among all tenants based on unit size or occupancy, rather than actual usage. You pay for your neighbor's long showers. This is legal in many states but should be disclosed upfront.</p>
<p><strong>Watch for:</strong> "Utilities shall be billed based on Tenant's proportionate share of building consumption." That's RUBS. Your bill will vary month to month with no way to control it.</p>
<p><strong>What to ask for:</strong> Individual metering, or a fixed utility allowance included in rent. At minimum, ask for a history of average monthly utility bills under the RUBS system before you sign.</p>

<h2>8. Subletting Restrictions</h2>
<p>Life happens. You may need to travel for work, move in with a partner, or leave unexpectedly. A lease that prohibits subletting entirely — without a carve-out for landlord approval — can leave you paying rent on an apartment you can't live in.</p>
<p><strong>Red flags:</strong> "Tenant shall not sublet or assign this lease under any circumstances." No exceptions, no approval process.</p>
<p><strong>What to ask for:</strong> "Tenant may sublet with written landlord approval, which shall not be unreasonably withheld." That's a standard carve-out that protects you without removing the landlord's oversight.</p>

<h2>9. Move-Out Gotchas</h2>
<p>Many security deposit disputes stem from poorly defined move-out conditions. If the lease doesn't specify what "clean" means, the landlord defines it — usually as "professionally cleaned," which costs $300–$600 regardless of how clean you left the unit.</p>
<p><strong>Watch for:</strong> Vague move-out requirements ("Tenant shall return premises in same condition as received"), mandatory professional cleaning fees, or required carpet replacement after any tenancy.</p>
<p><strong>What to ask for:</strong> A move-out checklist attached to the lease, a joint move-out inspection clause, and explicit language that "normal wear and tear" does not constitute damage.</p>

<h2>10. Waived Rights Clauses</h2>
<p>Some leases include clauses that ask you to waive legal rights you can't actually waive — like the right to a habitable unit, or protections under your state's landlord-tenant law. These clauses are usually unenforceable, but they're designed to make you think you've given up those rights.</p>
<p><strong>Red flags:</strong> "Tenant waives any and all claims arising from Landlord's negligence," or "Tenant agrees that the premises are provided as-is with no warranty of habitability."</p>
<p><strong>What to do:</strong> Flag these for a lawyer or run them through a free AI lease review tool. Waived rights clauses are the kind of thing that looks scary but is often legally meaningless — still worth knowing about before you sign.</p>

<h2>How to Protect Yourself</h2>
<p>The best time to catch these problems is before you sign. Once you're in, your leverage drops significantly. Here's a practical approach:</p>
<ol>
  <li>Read every section, not just the rent and dates.</li>
  <li>Run the lease through an AI lease analyzer to surface red flags you might miss.</li>
  <li>Request changes in writing — most landlords expect some negotiation.</li>
  <li>Document the unit's condition with photos before and after move-in.</li>
  <li>Know your state's landlord-tenant law — many lease clauses are unenforceable.</li>
</ol>

<div class="blog-cta-inline">
  <p>Want to know if YOUR lease has these red flags? <a href="/upload"><strong>Analyze your lease free →</strong></a> LeaseGuard's AI lease analyzer flags all 10 of these issues and gives you word-for-word negotiation scripts to fix them.</p>
</div>

<h2>Frequently Asked Questions</h2>

<div class="faq-item">
  <h3>Can I negotiate a lease after I've already signed?</h3>
  <p>Technically, once signed, a lease is a binding contract. However, landlords can agree to modify terms in writing at any time — especially if you catch an issue early and approach it professionally. The best leverage is always before you sign.</p>
</div>

<div class="faq-item">
  <h3>What's the fastest way to check if my lease is fair?</h3>
  <p>An AI lease analyzer can flag the most common red flags in under 60 seconds. LeaseGuard's free AI lease review surfaces risky clauses, estimates hidden costs, and generates negotiation scripts — without requiring you to understand legal language.</p>
</div>

<div class="faq-item">
  <h3>Are these red flags the same in every state?</h3>
  <p>No — landlord-tenant law varies significantly by state and county. Late fee caps, security deposit timelines, and entry notice requirements all differ. LeaseGuard's lease gap analysis flags location-specific issues and notes when a missing clause varies by state.</p>
</div>

<div class="faq-item">
  <h3>Do I need a lawyer to negotiate lease terms?</h3>
  <p>For standard residential leases, no. Most landlords expect tenants to negotiate basic terms. An AI contract analysis tool can give you the same talking points a lawyer would for common clauses — at a fraction of the cost. For commercial leases or unusual terms, consulting a local attorney is worth it.</p>
</div>
    `.trim(),
  },
]

export function getAllPosts(): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
