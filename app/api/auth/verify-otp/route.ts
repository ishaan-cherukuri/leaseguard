import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

interface OtpCookie {
  email: string
  fullName: string
  sig: string
  exp: number
}

function signOtp(email: string, code: string): string {
  return crypto
    .createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(`${email}:${code}`)
    .digest('hex')
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { code?: unknown; password?: unknown }
  const code = typeof body.code === 'string' ? body.code.trim() : null
  const password = typeof body.password === 'string' ? body.password : null

  // ── Read OTP cookie ──────────────────────────────────────────────────────────
  const raw = request.cookies.get('lg_otp')?.value
  if (!raw) {
    return NextResponse.json(
      { error: 'otp_expired', message: 'Verification code expired. Please request a new one.' },
      { status: 400 }
    )
  }

  let payload: OtpCookie
  try {
    payload = JSON.parse(raw) as OtpCookie
  } catch {
    return NextResponse.json(
      { error: 'otp_invalid', message: 'Invalid verification state. Please start over.' },
      { status: 400 }
    )
  }

  // ── Expiry ───────────────────────────────────────────────────────────────────
  if (Math.floor(Date.now() / 1000) > payload.exp) {
    return NextResponse.json(
      { error: 'otp_expired', message: 'Verification code expired. Please request a new one.' },
      { status: 400 }
    )
  }

  // ── Validate inputs ──────────────────────────────────────────────────────────
  if (!code) {
    return NextResponse.json(
      { error: 'otp_required', message: 'Please enter the verification code.' },
      { status: 400 }
    )
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: 'password_invalid', message: 'Password must be at least 8 characters.' },
      { status: 400 }
    )
  }

  // ── Verify code via timing-safe comparison ───────────────────────────────────
  const expected = signOtp(payload.email, code)
  const expectedBuf = Buffer.from(expected, 'hex')
  const actualBuf = Buffer.from(payload.sig, 'hex')

  if (
    expectedBuf.length !== actualBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, actualBuf)
  ) {
    return NextResponse.json(
      { error: 'otp_wrong', message: 'Incorrect verification code. Please try again.' },
      { status: 400 }
    )
  }

  // ── Secondary guard: race-condition protection ───────────────────────────────
  const serviceClient = await createServiceClient()
  const { data: existing } = await serviceClient
    .from('profiles')
    .select('email')
    .eq('email', payload.email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'account_exists', message: 'An account with this email already exists.' },
      { status: 409 }
    )
  }

  // ── Create the user ──────────────────────────────────────────────────────────
  const { error: createError } = await serviceClient.auth.admin.createUser({
    email: payload.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: payload.fullName },
  })

  if (createError) {
    // Supabase returns a specific message for already-registered emails
    if (createError.message.toLowerCase().includes('already')) {
      return NextResponse.json(
        { error: 'account_exists', message: 'An account with this email already exists.' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'create_failed', message: createError.message },
      { status: 500 }
    )
  }

  // ── Clear OTP cookie on success ──────────────────────────────────────────────
  const response = NextResponse.json({ ok: true })
  response.cookies.set('lg_otp', '', { maxAge: 0, path: '/' })
  return response
}
