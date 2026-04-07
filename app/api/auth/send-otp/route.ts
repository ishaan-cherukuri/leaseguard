import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const OTP_TTL = 600 // 10 minutes

// HMAC-sign email+code so we never store the plaintext code in the cookie
function signOtp(email: string, code: string): string {
  return crypto
    .createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(`${email}:${code}`)
    .digest('hex')
}

function generateCode(): string {
  // crypto.randomInt is uniform and safe
  return String(crypto.randomInt(100000, 1000000))
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const body = await request.json() as { email?: unknown; fullName?: unknown }
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : null
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'invalid_email', message: 'Invalid email address.' },
      { status: 400 }
    )
  }

  // ── Duplicate email check ────────────────────────────────────────────────────
  const serviceClient = await createServiceClient()
  const { data: existing } = await serviceClient
    .from('profiles')
    .select('email')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'account_exists', message: 'An account with this email already exists.' },
      { status: 409 }
    )
  }

  // ── Generate & sign OTP ──────────────────────────────────────────────────────
  const code = generateCode()
  const sig = signOtp(email, code)
  const exp = Math.floor(Date.now() / 1000) + OTP_TTL

  // ── Send email ───────────────────────────────────────────────────────────────
  const { error: sendError } = await resend.emails.send({
    from: 'noreply@noreply.theleaseguard.com',
    to: email,
    subject: `${code} — your LeaseGuard verification code`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FAF8F5;border-radius:12px">
        <div style="margin-bottom:24px">
          <span style="font-size:1.3rem;font-weight:700;color:#1a1a1a">🛡 LeaseGuard</span>
        </div>
        <h1 style="font-size:1.5rem;font-weight:700;color:#1a1a1a;margin:0 0 8px">Verify your email</h1>
        <p style="color:#555;margin:0 0 28px;line-height:1.6">Use the code below to complete your account setup. It expires in 10 minutes.</p>
        <div style="background:#fff;border:1px solid #e5e0da;border-radius:10px;padding:28px;text-align:center;margin-bottom:24px">
          <span style="font-size:2.5rem;font-weight:800;letter-spacing:0.18em;color:#C9748A;font-family:monospace">${code}</span>
        </div>
        <p style="color:#888;font-size:0.875rem;line-height:1.6;margin:0">
          If you didn't request this, you can safely ignore this email.<br>
          This code is valid for 10 minutes only.
        </p>
      </div>
    `,
  })

  if (sendError) {
    return NextResponse.json(
      { error: 'send_failed', message: 'Failed to send verification email. Please try again.' },
      { status: 500 }
    )
  }

  // ── Store OTP state in signed httpOnly cookie ────────────────────────────────
  // We store the HMAC signature, NOT the plaintext code.
  const payload = JSON.stringify({ email, fullName, sig, exp })
  const response = NextResponse.json({ ok: true })
  response.cookies.set('lg_otp', payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: OTP_TTL,
    path: '/',
  })

  return response
}
