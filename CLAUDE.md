# LeaseGuard — Project Context

## What it is
B2C SaaS contract analyzer. Users upload a PDF lease/contract, AI analyzes it and returns a risk score, flagged clauses, cost estimate, and negotiation scripts.

**Monetization:** $9.99/mo subscription (unlimited) OR $19 one-time. 1 free analysis on signup.

---

## Tech Stack

- **Next.js 14** App Router, TypeScript strict
- **Tailwind CSS** + shadcn/ui
- **Supabase** — auth, PostgreSQL, storage (bucket: `contracts`)
- **OpenAI GPT-4o** — AI analysis (`lib/claude.ts`) — *temporary, will switch back to Claude when Anthropic credits are funded*
- **Stripe** — payments (not yet configured, keys pending)
- **Resend** — feedback emails to Ishaan.cherukuri@gmail.com
- **pdf-parse** — server-side PDF text extraction
- **Framer Motion** — animations
- **react-dropzone** — drag-and-drop upload

---

## Environment Variables (.env)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...         # funded, will switch back to Claude
OPENAI_API_KEY=...            # currently active for AI analysis
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=...            # needed for feedback emails — get from resend.com
# Stripe keys not yet added
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SUBSCRIPTION_PRICE_ID=
STRIPE_ONE_TIME_PRICE_ID=
```

---

## Key Decisions & Changes (chronological)

### AI Provider
- Originally spec'd for `claude-sonnet-4-20250514` (wrong model ID)
- Corrected to `claude-sonnet-4-5`
- **Switched to OpenAI GPT-4o** (`lib/claude.ts`) because Anthropic credits ran out
- Uses `response_format: { type: 'json_object' }` to guarantee valid JSON
- Will switch back to Claude when Anthropic account is funded
- The function signature and return type are identical — only the provider changes

### Supabase Storage
- Bucket name: `contracts` (private)
- Had RLS policy issues — required explicit storage policies to allow uploads
- Required policies (already run in SQL Editor):
  - Authenticated users can upload to `contracts` bucket
  - Users can read files in their own folder
  - Service role has full access

### Supabase RLS
- Service role needed explicit policies to update `analyses` table and read/update `profiles`
- All policies are in `supabase/schema.sql`

### Email confirmation
- Disabled in Supabase Auth settings for dev (hit rate limits)
- Turn back on before production launch

### Feedback form
- `components/FeedbackModal.tsx` — modal in sidebar bottom
- `app/api/feedback/route.ts` — sends email via Resend to Ishaan.cherukuri@gmail.com
- Requires `RESEND_API_KEY` in `.env` (get from resend.com, free tier)

### Stripe
- `lib/stripe.ts` uses placeholder `sk_test_placeholder` if key not set — app won't crash
- Payments not yet functional — keys pending
- Webhook handler ready at `/api/webhooks/stripe`

---

## Project Structure

```
app/
  page.tsx                    # Landing page
  (auth)/login/               # Login
  (auth)/signup/              # Signup
  (app)/layout.tsx            # Sidebar shell (has FeedbackModal)
  (app)/dashboard/            # Past analyses list
  (app)/upload/               # Upload + analyze
  (app)/analysis/[id]/        # Results page
  api/
    analyze/route.ts          # Core: PDF extract + AI + save to DB
    create-checkout/route.ts  # Stripe checkout session
    webhooks/stripe/route.ts  # Stripe webhook handler
    feedback/route.ts         # Feedback email via Resend
    auth/signout/route.ts     # Sign out
    health/route.ts           # GET /api/health
components/
  RiskGauge.tsx               # Animated SVG score circle
  ClauseCard.tsx              # Flagged clause card (collapsible)
  UploadZone.tsx              # Drag-and-drop PDF upload
  AnalysisSkeleton.tsx        # Loading skeleton
  PricingModal.tsx            # Upgrade modal
  FeedbackModal.tsx           # Feedback form → email
lib/
  claude.ts                   # AI analysis (currently OpenAI GPT-4o)
  pdf.ts                      # PDF text extraction via pdf-parse
  stripe.ts                   # Stripe instance
  supabase/client.ts          # Browser Supabase client
  supabase/server.ts          # Server Supabase client + service client
  utils.ts                    # cn() utility
types/index.ts                # All TypeScript types
middleware.ts                 # Auth protection for /dashboard, /upload, /analysis
supabase/schema.sql           # Full DB schema + RLS + storage policies
```

---

## To Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## What's left before launch
- [ ] Add Stripe keys and test payments
- [ ] Add `RESEND_API_KEY` to `.env` for feedback emails
- [ ] Re-enable email confirmation in Supabase Auth
- [ ] Switch `lib/claude.ts` back to Anthropic Claude when credits funded
- [ ] Deploy to Vercel + set env vars there
