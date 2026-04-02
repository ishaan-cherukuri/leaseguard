# LeaseGuard — Full Project Context

## What it is
B2C SaaS contract analyzer. Users upload a PDF lease/contract, AI analyzes it and returns a risk score, flagged clauses, cost estimate, and negotiation scripts. Target users: renters, freelancers, landlords, small business owners — anyone signing a contract they don't fully understand.

**Live domain:** theleaseguard.com (GoDaddy)
**Email:** noreply@noreply.theleaseguard.com (via Resend, DNS verified on GoDaddy)
**Founder contact:** Ishaan.cherukuri@gmail.com

---

## Pricing Tiers

| Tier | Price | Docs/month | Heavy doc cost | Best for |
|---|---|---|---|---|
| Free | $0 | 1 | 1 credit | First-time users |
| Shield | $14 one-time | 1 | 1 credit | Moving into a new place, one-time use |
| Guard | $9.99/mo | 4 | 2 credits | Renters, freelancers, frequent signers |
| Sentinel | $24.99/mo | 12 | 2 credits | Landlords, small biz, power users |

**Heavy document:** 20+ pages or 5,000+ words uses 2 doc credits (Guard/Sentinel only).
**Shield** is one-time — `free_analyses_used` is set to 1 and never resets.
**Free/Guard/Sentinel** use `docs_used_this_month` which resets each calendar month.

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router, TypeScript strict) — upgraded from 14 during scaffolding
- **Tailwind CSS** — all styling via CSS variables for theme support
- **shadcn/ui** — component primitives (configured in `components.json`)
- **Framer Motion** — animations
- **react-dropzone** — drag-and-drop PDF upload
- **next-themes** — dark/light mode toggle
- **lucide-react** — icons throughout

### Backend
- **Supabase** — auth, PostgreSQL database, file storage (bucket: `contracts`)
- **Anthropic Claude** (`claude-sonnet-4-5`) — AI contract analysis (`lib/claude.ts`)
- **Stripe** — subscription + one-time payments (fully wired)
- **Resend** — transactional email (confirmation emails + feedback)
- **Formspree** — feedback form fallback (free tier, 50/mo limit)
- **pdf-parse** — server-side PDF text extraction

### Infrastructure
- **Vercel** — deployment target
- **GoDaddy** — domain registrar (theleaseguard.com)

---

## Environment Variables (.env)

```
NEXT_PUBLIC_SUPABASE_URL=https://vttcdzvqcdfqbkjpzfmu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...              # funded, switch back when ready
OPENAI_API_KEY=...                 # currently active for AI analysis
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=...                 # active — for confirmation emails
NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/mojpllzz
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...    # from `stripe listen` locally
STRIPE_SHIELD_PRICE_ID=price_1THZsqBaPwkvYgGoXpQN3jeq   # $14 one-time
STRIPE_GUARD_PRICE_ID=price_1THZt6BaPwkvYgGojKDGDS5K    # $9.99/mo
STRIPE_SENTINEL_PRICE_ID=price_1THZtCBaPwkvYgGoLvrbAEl5 # $24.99/mo
```

---

## Database Schema (Supabase PostgreSQL)

### `profiles` table
```sql
id uuid (PK, references auth.users)
email text
full_name text
stripe_customer_id text
subscription_status text  -- 'free' | 'active' | 'canceled' | 'past_due'
subscription_id text
plan text                  -- 'free' | 'shield' | 'guard' | 'sentinel'
free_analyses_used integer -- used by shield + legacy free (never resets)
docs_used_this_month integer -- used by free/guard/sentinel (resets monthly)
docs_reset_at timestamptz  -- when docs_used_this_month was last reset
created_at timestamptz
```

### `analyses` table
```sql
id uuid (PK)
user_id uuid (FK → profiles)
file_name text
file_url text
document_type text   -- 'lease'|'rental'|'gym'|'car'|'employment'|'insurance'|'other'
status text          -- 'processing' | 'complete' | 'failed'
risk_score integer   -- 0-100
risk_level text      -- 'low' | 'medium' | 'high' | 'critical'
summary text
total_cost_estimate text
flagged_clauses jsonb
negotiation_points jsonb
market_comparison text
payment_type text    -- 'subscription' | 'one_time' | 'free_trial'
created_at timestamptz
completed_at timestamptz
```

### Migration to run if columns missing
```sql
alter table public.profiles
  add column if not exists plan text default 'free',
  add column if not exists docs_used_this_month integer default 0,
  add column if not exists docs_reset_at timestamptz default now();
```

---

## Project Structure

```
app/
  page.tsx                    # Landing page (4-column pricing, features, hero)
  (auth)/
    login/page.tsx            # Login form
    signup/page.tsx           # Signup form (email confirmation flow)
  (app)/
    layout.tsx                # Sidebar shell (logo, nav, ThemeToggle, FeedbackModal, signout)
    dashboard/page.tsx        # Analysis history + plan usage card
    upload/page.tsx           # Upload + split-screen PDF preview + analyze
    upgrade/page.tsx          # 4-tier pricing page (Free, Shield, Guard, Sentinel)
    analysis/[id]/page.tsx    # Results page (RiskGauge, ClauseCards, negotiation points)
  auth/
    callback/route.ts         # Supabase email confirmation handler
  api/
    analyze/route.ts          # Core: PDF extract + AI + quota check + save to DB
    create-checkout/route.ts  # Stripe checkout session (shield/guard/sentinel)
    webhooks/stripe/route.ts  # Stripe webhook → update profiles (plan, status, reset counter)
    feedback/route.ts         # Feedback email via Resend
    auth/signout/route.ts     # POST sign out
    health/route.ts           # GET /api/health
components/
  RiskGauge.tsx               # Animated SVG risk score circle
  ClauseCard.tsx              # Collapsible flagged clause card (card-interactive)
  UploadZone.tsx              # Drag-and-drop PDF upload
  AnalysisSkeleton.tsx        # Loading skeleton for results page
  PricingModal.tsx            # Legacy upgrade modal (still used in some flows)
  FeedbackModal.tsx           # Feedback form → Formspree
  ThemeToggle.tsx             # Dark/light mode toggle (next-themes)
lib/
  claude.ts                   # AI analysis — currently OpenAI GPT-4o
  pdf.ts                      # PDF text extraction via pdf-parse
  stripe.ts                   # Stripe instance (falls back to placeholder if key missing)
  supabase/client.ts          # Browser Supabase client
  supabase/server.ts          # Server Supabase client + service client
  utils.ts                    # cn() utility
types/index.ts                # All TS types + PLAN_LIMITS constant
proxy.ts                      # Auth middleware (Next.js 16 — replaces middleware.ts)
supabase/schema.sql           # Full DB schema + RLS + storage policies
```

---

## Key Decisions & Improvements Made

### Design system
- **Rose gold accent** — dark mode accent changed from gold `#C9A84C` to rose gold `#C9748A` throughout
- **Light mode** — full light theme with rose/warm tones (`--background: #FAF8F5`)
- **CSS variable theming** — all colors via CSS vars, Tailwind maps to them
- **Spring animations** — all buttons/links use `cubic-bezier(0.34, 1.56, 0.64, 1)` for springy hover lift
- **Global clickable lift** — every `a` and `button` gets `translateY(-1px)` on hover via global CSS
- **`.btn-primary`** — rose gold gradient, `translateY(-3px) scale(1.02)` on hover, glow shadow
- **`.btn-ghost`** — border button, lifts with accent border/glow on hover
- **`.card-interactive`** — cards lift `translateY(-5px) scale(1.01)` on hover

### Auth flow
- Email confirmation via Supabase with custom SMTP (Resend) sending from `noreply@noreply.theleaseguard.com`
- Confirmation callback at `app/auth/callback/route.ts` — exchanges code for session
- Redirect URL must be whitelisted in Supabase → Authentication → URL Configuration
- Email confirmation disabled in dev to avoid rate limits — re-enable before launch
- Supabase free tier email rate limit: ~4/hour — use custom SMTP (Resend) to bypass

### AI provider
- Now using **Anthropic `claude-sonnet-4-5`** via `@anthropic-ai/sdk`
- Was temporarily on OpenAI GPT-4o while Anthropic credits were funded
- Uses `client.messages.create()` with `max_tokens: 4096`
- Strips markdown code fences from response before JSON parsing
- Retries once on failure

### Supabase storage
- Bucket: `contracts` (private)
- RLS policies required explicit rules for authenticated uploads + service role full access
- Storage path: `{userId}/{timestamp}_{filename}`

### Stripe integration
- 3 Stripe products created via API (test mode): Shield, Guard, Sentinel
- Price IDs stored in `.env` and hardcoded above
- Checkout route maps `shield|guard|sentinel` → correct price + mode (payment/subscription)
- Webhook handler at `/api/webhooks/stripe` handles:
  - `checkout.session.completed` → set plan, status, reset monthly counter
  - `customer.subscription.deleted` → set canceled, revert to free plan
  - `customer.subscription.updated` → sync status
  - `invoice.payment_failed` → set past_due
  - `invoice.payment_succeeded` (subscription_cycle) → reset `docs_used_this_month`
- Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Quota enforcement
- Client-side check in `upload/page.tsx` before API call — instant redirect to `/upgrade` if at limit, no loading flash
- Server-side check in `analyze/route.ts` as authoritative guard
- Monthly counter resets automatically when a new calendar month is detected
- Shield (one-time): uses `free_analyses_used`, never resets
- Free/Guard/Sentinel: uses `docs_used_this_month`, resets monthly

### UX improvements
- **No flash on success** — upload page stays in loading state during navigation to results (no snap back to "Ready" screen)
- **Instant upgrade redirect** — limit checked client-side before any spinner shown
- **Dashboard usage card** — shows plan icon, name, `X / limit` counter, progress bar, upgrade CTA
- **`/upgrade` page** — full 4-column pricing page replacing the old modal-only flow

### Middleware
- Next.js 16 uses `proxy.ts` not `middleware.ts` — both cannot coexist
- Protects `/dashboard`, `/upload`, `/analysis` routes

---

## Supabase Setup Notes

- **RLS policies** — all in `supabase/schema.sql`, required separate policies for service role
- **Auth redirect URL** — must add `http://localhost:3000/auth/callback` in Supabase → Authentication → URL Configuration
- **For production** also add `https://theleaseguard.com/auth/callback`
- **Auto-create profile** — trigger `on_auth_user_created` creates profile row on signup

---

## Email Setup

- **Provider:** Resend
- **Domain:** noreply.theleaseguard.com (verified DNS on GoDaddy)
- **Sender:** noreply@noreply.theleaseguard.com
- **Supabase SMTP settings:**
  - Host: `smtp.resend.com`
  - Port: `465`
  - Username: `resend`
  - Password: Resend API key

---

## What's Left Before Launch

- [ ] Run DB migration (add `plan`, `docs_used_this_month`, `docs_reset_at` columns)
- [ ] Add `http://localhost:3000/auth/callback` to Supabase URL Configuration
- [ ] Re-enable email confirmation in Supabase Auth (disabled for dev)
- [ ] Switch Stripe from test mode → live mode + swap keys in Vercel env vars
- [ ] Add live webhook endpoint in Stripe Dashboard → `https://theleaseguard.com/api/webhooks/stripe`
- [x] Switch `lib/claude.ts` back to Anthropic `claude-sonnet-4-5` ✓
- [ ] Deploy to Vercel + add all env vars there
- [ ] Add `https://theleaseguard.com/auth/callback` to Supabase URL Configuration (production)

---

## To Run Locally

```bash
npm install
npm run dev
# In a second terminal (for Stripe webhook testing):
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Visit http://localhost:3000

## Scaling Cost Estimates

| Service | Free limit | Paid |
|---|---|---|
| Supabase | Pauses after 1 week inactivity | $25/mo Pro |
| Vercel | 100GB bandwidth, 10s fn timeout | $20/mo Pro |
| Resend | 3,000 emails/mo, 100/day | $20/mo |
| OpenAI GPT-4o | Pay-as-you-go | ~$0.01–0.03/analysis |
| GoDaddy domain | — | ~$15–20/year |
| Formspree | 50 submissions/mo | $10/mo (or replace with Resend) |

**Minimum launch cost:** ~$45/mo fixed + OpenAI usage. Break-even at ~5 subscribers.
