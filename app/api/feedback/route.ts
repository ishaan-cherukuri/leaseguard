import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { message, type } = await request.json() as { message: string; type: string }

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  await resend.emails.send({
    from: 'LeaseGuard Feedback <onboarding@resend.dev>',
    to: 'Ishaan.cherukuri@gmail.com',
    subject: `[LeaseGuard Feedback] ${type}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C9A84C;">New Feedback — LeaseGuard</h2>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>From:</strong> ${user?.email ?? 'Anonymous'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #C9A84C; padding-left: 16px; color: #555;">
          ${message.replace(/\n/g, '<br/>')}
        </blockquote>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
