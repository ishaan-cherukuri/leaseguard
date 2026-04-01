# LeaseGuard

AI-powered contract analyzer. Upload any PDF contract and get a plain-English risk breakdown, flagged clauses, cost estimates, and negotiation scripts.

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd leaseguard
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Go to **Storage** and create a private bucket named `contracts`
4. Copy your Project URL, anon key, and service role key

### 3. Set up Stripe (optional for dev)

1. Create products at [stripe.com](https://stripe.com):
   - $9.99/month subscription → copy price ID
   - $19 one-time → copy price ID
2. Copy your secret and publishable keys
3. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` for local webhook testing

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
# Fill in all values
```

### 5. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Auth, PostgreSQL, Storage)
- **Anthropic Claude** (claude-sonnet-4-20250514)
- **Stripe** (subscriptions + one-time payments)
- **Tailwind CSS** + shadcn/ui
- **Framer Motion** (animations)

## Project Structure

```
app/
  page.tsx              # Landing page
  (auth)/               # Login / Signup
  (app)/                # Protected app routes
    dashboard/          # Past analyses
    upload/             # Upload new contract
    analysis/[id]/      # Results page
  api/
    analyze/            # Core analysis endpoint
    create-checkout/    # Stripe checkout
    webhooks/stripe/    # Stripe webhook handler
    health/             # Health check
components/
  RiskGauge.tsx         # Animated SVG risk score
  ClauseCard.tsx        # Flagged clause card
  UploadZone.tsx        # Drag-and-drop uploader
  AnalysisSkeleton.tsx  # Loading skeleton
  PricingModal.tsx      # Upgrade modal
lib/
  claude.ts             # AI analysis logic
  pdf.ts                # PDF text extraction
  stripe.ts             # Stripe instance
  supabase/             # Supabase clients
types/
  index.ts              # All TypeScript types
supabase/
  schema.sql            # Database schema + RLS policies
```

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Add all environment variables in Vercel Dashboard → Settings → Environment Variables.

Add your production URL as a webhook endpoint in Stripe Dashboard → Developers → Webhooks.
