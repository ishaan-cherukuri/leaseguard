import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const type = searchParams.get('type')
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/auth/reset-password', request.url))
      }
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // If something went wrong, send to login
  return NextResponse.redirect(new URL('/login', request.url))
}
