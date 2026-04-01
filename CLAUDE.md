# LeaseGuard — Full Claude Code Scaffold Prompt

Paste everything below this line into Claude Code.

---

```
Build me a complete production-ready SaaS web app called LeaseGuard.

## What it does
LeaseGuard is a B2C SaaS tool where users upload a lease, rental agreement, gym contract, car purchase agreement, or any consumer contract as a PDF. The AI (Claude API) analyzes it and returns:
- A risk score (0–100, color-coded red/amber/green)
- A list of flagged clauses with severity labels (Critical / Warning / Info)
- Plain-English explanations of each flagged clause
- Estimated true total cost of the agreement
- A comparison to standard market terms
- Recommended negotiation points

Monetization: $9.99/mo subscription (unlimited analyses) OR $19 one-time per analysis (pay-per-use). Users get 1 free analysis on signup.

---

## Full Tech Stack

### Core Framework
- Next.js 14 with App Router (TypeScript, strict mode)
- Tailwind CSS
- shadcn/ui for all components (install via CLI)

### Backend / Database
- Supabase for auth, database (PostgreSQL), and file storage (PDF uploads)
- Supabase SSR helpers for Next.js

### Payments
- Stripe for subscription billing and one-time payments
- stripe npm package + @stripe/stripe-js for frontend
- Stripe webhooks handler at /api/webhooks/stripe

### AI
- Anthropic SDK (@anthropic-ai/sdk)
- Use claude-sonnet-4-20250514 model
- PDF text is extracted server-side then sent to Claude

### Deployment
- Vercel-ready (vercel.json, environment variable references)

### PDF Parsing
- Use pdf-parse npm package to extract text from uploaded PDFs server-side

---

## Design System

Design aesthetic: refined legal-tech meets modern fintech. Think a law firm that got a $10M Series A and hired a great design team. NOT generic purple-gradient SaaS.

Color palette (use CSS variables in globals.css):
- --background: #0A0B0D (near-black)
- --surface: #111318 (card backgrounds)
- --surface-raised: #1A1D26 (elevated cards)
- --border: #2A2D3A
- --text-primary: #F0F1F5
- --text-secondary: #8B8FA8
- --accent: #C9A84C (gold/amber — for warnings, highlights, brand)
- --accent-hover: #E2C06A
- --critical: #E05252 (red for critical issues)
- --warning: #E09A30 (orange for warnings)
- --safe: #4CAF82 (green for safe clauses)
- --info: #5B8DEF (blue for informational items)

Typography:
- Display/headings: 'Playfair Display' (Google Font) — gives a legal/trustworthy editorial feel
- Body: 'DM Sans' (Google Font) — clean and readable
- Monospace (for clause text snippets): 'DM Mono'

Load fonts in app/layout.tsx via next/font/google.

Motion: Use framer-motion for:
- Page transitions (opacity + slight Y translate)
- Staggered card reveals on results page
- Risk score counter animation (count up from 0 to final score on load)
- Clause cards expand/collapse with smooth height animation

Layout feel:
- Generous padding, lots of negative space
- Cards with subtle gold border-left accent on flagged items
- The risk score is a large circular gauge (SVG, animated stroke-dashoffset)

---

## Project Structure

Create this exact file structure:

leaseguard/
├── app/
│   ├── layout.tsx                    # Root layout with fonts, Toaster
│   ├── page.tsx                      # Landing page (marketing)
│   ├── globals.css                   # CSS variables + base styles
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx                # App shell with sidebar/nav
│   │   ├── dashboard/page.tsx        # List of past analyses
│   │   ├── upload/page.tsx           # Upload + start analysis
│   │   └── analysis/[id]/page.tsx    # Full results page
│   └── api/
│       ├── analyze/route.ts          # POST: extract PDF + call Claude
│       ├── webhooks/stripe/route.ts  # Stripe webhook handler
│       └── create-checkout/route.ts  # POST: create Stripe session
├── components/
│   ├── ui/                           # shadcn components (auto-generated)
│   ├── RiskGauge.tsx                 # Animated SVG risk score circle
│   ├── ClauseCard.tsx                # Individual flagged clause card
│   ├── UploadZone.tsx                # Drag-and-drop PDF upload
│   ├── AnalysisSkeleton.tsx          # Loading skeleton for results
│   └── PricingModal.tsx             # Subscription vs pay-per-use choice
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client
│   ├── stripe.ts                     # Stripe instance
│   ├── claude.ts                     # Claude analysis function
│   └── pdf.ts                        # PDF text extraction utility
├── types/
│   └── index.ts                      # All TypeScript types
├── middleware.ts                     # Supabase auth middleware
├── .env.local.example               # All required env vars listed
└── supabase/
    └── schema.sql                    # Full database schema

---

## Database Schema (supabase/schema.sql)

Create these tables in Supabase:

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  stripe_customer_id text,
  subscription_status text default 'free', -- 'free' | 'active' | 'canceled'
  subscription_id text,
  free_analyses_used integer default 0,
  created_at timestamptz default now()
);

-- Analyses table
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  document_type text, -- 'lease' | 'gym' | 'car' | 'employment' | 'other'
  status text default 'processing', -- 'processing' | 'complete' | 'failed'
  risk_score integer, -- 0-100
  risk_level text, -- 'low' | 'medium' | 'high' | 'critical'
  summary text,
  total_cost_estimate text,
  flagged_clauses jsonb default '[]',
  negotiation_points jsonb default '[]',
  payment_type text, -- 'subscription' | 'one_time' | 'free_trial'
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Row level security
alter table public.profiles enable row level security;
alter table public.analyses enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read own analyses" on public.analyses for select using (auth.uid() = user_id);
create policy "Users can insert own analyses" on public.analyses for insert with check (auth.uid() = user_id);
```

---

## Environment Variables (.env.local.example)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUBSCRIPTION_PRICE_ID=price_... (create $9.99/mo product in Stripe)
STRIPE_ONE_TIME_PRICE_ID=price_... (create $19 one-time product in Stripe)

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Core Logic — lib/claude.ts

This is the most important file. The analysis function should:

1. Accept: extractedText (string), documentType (string), fileName (string)
2. Call Claude API with this system prompt:

```
You are LeaseGuard, an expert contract and lease analyzer. Your job is to protect consumers from unfair, illegal, or financially harmful contract terms. You analyze documents with the precision of a real estate attorney combined with the clarity of a consumer advocate.

Always respond with valid JSON only. No markdown, no preamble.
```

3. User message:
```
Analyze this contract document. Return a JSON object with exactly this structure:

{
  "document_type": "lease|gym|car|employment|insurance|other",
  "risk_score": <integer 0-100, where 0=completely safe, 100=extremely dangerous>,
  "risk_level": "low|medium|high|critical",
  "summary": "<2-3 sentence plain-English summary of what this contract is and the overall risk>",
  "total_cost_estimate": "<plain-English estimate of total financial obligation, e.g. '$18,000 over 12 months + potential $2,400 in fees'>",
  "flagged_clauses": [
    {
      "id": "<unique string>",
      "severity": "critical|warning|info",
      "title": "<short title of the clause issue>",
      "original_text": "<exact quote from the document, max 200 chars>",
      "explanation": "<plain-English explanation of why this is a problem>",
      "recommendation": "<specific action the user should take or ask for>",
      "potentially_illegal": <boolean>
    }
  ],
  "negotiation_points": [
    {
      "title": "<what to negotiate>",
      "current_term": "<what the contract says>",
      "ask_for": "<specific language to request instead>"
    }
  ],
  "market_comparison": "<2-3 sentences comparing these terms to typical market standards>"
}

Document to analyze:
${extractedText}
```

4. Parse the JSON response
5. Return the parsed object

Handle errors: if Claude returns malformed JSON, retry once with a stricter prompt. If it fails twice, return a structured error.

---

## Key Pages — Detailed Specs

### Landing page (app/page.tsx)

Hero section:
- Large headline: "Your lease has secrets." / "We find them."
- Subheadline: "Upload any contract. Get a plain-English breakdown of every clause that could cost you."
- Single CTA: "Analyze Your Lease Free →"
- Animated background: subtle noise texture over dark background, gold particles drifting slowly (CSS animation)
- Social proof bar: "Analyzed 12,847 leases" | "Avg. $3,200 in hidden fees found" | "2 min analysis"

Features section (3 cards):
- AI Clause Detection
- Risk Score
- Negotiation Scripts

Pricing section:
- Two cards: Pay-per-analysis ($19/doc) vs Subscription ($9.99/mo, unlimited)
- Highlight the subscription card with gold border

### Upload page (app/(app)/upload/page.tsx)

- Drag-and-drop zone (UploadZone component) with dashed gold border, accepts PDF only, max 10MB
- File type selector: Lease / Rental Agreement / Gym Contract / Car Purchase / Employment / Insurance / Other
- On upload: POST to /api/analyze with formData (file + documentType + userId)
- Show a progress animation while analyzing (3 stages: "Extracting document..." → "Analyzing clauses..." → "Calculating risk...")
- On complete: redirect to /analysis/[id]

### Results page (app/(app)/analysis/[id]/page.tsx)

Layout (two-column on desktop, stacked on mobile):

LEFT column (40%):
- Large RiskGauge SVG component (animated, circular gauge, color-coded)
- Risk score number (large, bold, Playfair Display)
- Risk level badge (CRITICAL / HIGH / MEDIUM / LOW)
- Summary paragraph
- Total cost estimate (highlighted in gold)
- Market comparison paragraph

RIGHT column (60%):
- "Flagged Clauses" section header with count badge
- List of ClauseCard components sorted by severity (critical first)
- Each ClauseCard shows: severity color bar on left, title, explanation, original quote in monospace, recommendation, "Potentially Illegal" badge if applicable
- Collapse/expand animation for the original text quote

Below both columns:
- "Negotiation Scripts" section: accordion list of negotiation points

### Dashboard page (app/(app)/dashboard/page.tsx)

- Grid of past analysis cards (date, filename, risk score gauge mini, document type badge)
- Empty state: large upload CTA if no analyses yet
- Usage indicator: "X of 1 free analyses used" (for free tier) or "Unlimited — Active Subscriber" (for paid)

---

## API Route — app/api/analyze/route.ts

Steps:
1. Authenticate user via Supabase (reject if not logged in)
2. Check if user has credits:
   - If free tier: check profiles.free_analyses_used < 1, otherwise return 402 with upgrade URL
   - If active subscriber: always allow
   - If one-time payment: validate payment intent id passed in request
3. Get file from FormData, validate it's a PDF under 10MB
4. Upload PDF to Supabase Storage bucket called "contracts" at path `${userId}/${Date.now()}_${fileName}`
5. Extract text using pdf-parse: `const data = await pdfParse(buffer); const text = data.text;`
6. Create an analysis record in DB with status='processing'
7. Call the Claude analysis function from lib/claude.ts
8. Update the analysis record with all results + status='complete'
9. If free tier, increment profiles.free_analyses_used
10. Return { analysisId, status: 'complete' }

---

## Stripe Webhook — app/api/webhooks/stripe/route.ts

Handle these events:
- `checkout.session.completed`: Update profile subscription_status='active', store subscription_id and stripe_customer_id
- `customer.subscription.deleted`: Update subscription_status='canceled'
- `customer.subscription.updated`: Sync status changes
- `invoice.payment_failed`: Update subscription_status='past_due'

Use raw body parsing (not JSON) for webhook signature verification.

---

## Components — Detailed Specs

### RiskGauge.tsx
- SVG circular gauge, 200x200px
- Stroke color: interpolate between --safe (green) at 0 → --warning (orange) at 50 → --critical (red) at 100
- Uses framer-motion to animate stroke-dashoffset from 0 to final value on mount
- Score number animates from 0 to final score using useMotionValue + useTransform
- Show risk level text below the circle

### ClauseCard.tsx
Props: { clause: FlaggedClause, index: number }
- Left border: 4px solid, color based on severity (critical=red, warning=orange, info=blue)
- Animated entry: fade in + slide up, staggered by index * 0.05s delay
- Severity badge: pill with background color
- "Potentially Illegal" badge in red if true
- Collapsible quote section with smooth height animation
- Recommendation section with lightbulb icon

### UploadZone.tsx
- Drag-and-drop with react-dropzone
- Visual states: idle (dashed gold border) → dragging (solid gold border, scale 1.02) → uploading (progress bar) → success (checkmark)
- Only accepts application/pdf

---

## Middleware (middleware.ts)

Use Supabase SSR middleware to:
- Protect all routes under /(app)/* — redirect to /login if not authenticated
- Refresh session on every request

---

## Package.json dependencies to install

```bash
npx create-next-app@latest leaseguard --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd leaseguard
npx shadcn@latest init
npx shadcn@latest add button card badge separator skeleton toast dialog progress accordion

npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install stripe @stripe/stripe-js
npm install pdf-parse @types/pdf-parse
npm install framer-motion
npm install react-dropzone
npm install lucide-react
npm install clsx tailwind-merge
npm install next-themes
```

---

## shadcn/ui config (components.json)

Set style to "default", base color to "zinc", CSS variables to true.

---

## Additional Instructions

1. Make every page fully responsive (mobile-first, lg: breakpoints for desktop layout)
2. Add proper loading states on every async action using shadcn Skeleton
3. Add error boundaries and user-friendly error messages (toast notifications)
4. All database calls must go through server components or API routes — never expose service role key to client
5. The landing page must be fully accessible (aria labels, semantic HTML, focus states)
6. Add a simple /api/health route that returns { status: 'ok', timestamp }
7. Include a README.md with setup instructions:
   - Clone and install
   - Set up Supabase project + run schema.sql
   - Set up Stripe products and get price IDs
   - Fill in .env.local
   - Run `npm run dev`
8. Use TypeScript strictly — define all types in types/index.ts. Key types:
```typescript
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type SeverityLevel = 'critical' | 'warning' | 'info';
export type SubscriptionStatus = 'free' | 'active' | 'canceled' | 'past_due';
export type DocumentType = 'lease' | 'rental' | 'gym' | 'car' | 'employment' | 'insurance' | 'other';
export type AnalysisStatus = 'processing' | 'complete' | 'failed';

export interface FlaggedClause {
  id: string;
  severity: SeverityLevel;
  title: string;
  original_text: string;
  explanation: string;
  recommendation: string;
  potentially_illegal: boolean;
}

export interface NegotiationPoint {
  title: string;
  current_term: string;
  ask_for: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  document_type: DocumentType;
  status: AnalysisStatus;
  risk_score: number;
  risk_level: RiskLevel;
  summary: string;
  total_cost_estimate: string;
  flagged_clauses: FlaggedClause[];
  negotiation_points: NegotiationPoint[];
  market_comparison: string;
  payment_type: string;
  created_at: string;
  completed_at: string | null;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_id: string | null;
  free_analyses_used: number;
  created_at: string;
}
```

9. The Claude API call must include a 30-second timeout. If it exceeds this, update analysis status to 'failed' and return a helpful error.

10. For the landing page hero, use this exact gradient background CSS:
```css
background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,168,76,0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(90,100,180,0.08), transparent),
            #0A0B0D;
```

Build the complete project now. Create every file. Do not skip any file listed in the project structure. After creating all files, output a summary of what was built and the exact steps to get it running.
```
