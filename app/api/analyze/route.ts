import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { analyzeContract } from '@/lib/claude'
import { extractTextFromPDF } from '@/lib/pdf'

export async function POST(request: NextRequest) {
  const supabase = await createServiceClient()

  // Authenticate
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    request.headers.get('authorization')?.split(' ')[1] ?? ''
  )

  // Try cookie-based auth as fallback
  const { createClient } = await import('@/lib/supabase/server')
  const cookieClient = await createClient()
  const { data: { user: cookieUser } } = await cookieClient.auth.getUser()

  const authedUser = user ?? cookieUser
  if (!authedUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authedUser.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Check credits
  if (profile.subscription_status !== 'active') {
    if (profile.free_analyses_used >= 1) {
      return NextResponse.json(
        { error: 'Free analysis used. Please upgrade to continue.', upgradeUrl: '/upload' },
        { status: 402 }
      )
    }
  }

  // Parse form data
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const documentType = (formData.get('documentType') as string) ?? 'other'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = file.name

  // Upload to Supabase Storage
  const storagePath = `${authedUser.id}/${Date.now()}_${fileName}`
  const { error: uploadError } = await supabase.storage
    .from('contracts')
    .upload(storagePath, buffer, { contentType: 'application/pdf' })

  if (uploadError) {
    return NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('contracts').getPublicUrl(storagePath)

  // Create analysis record
  const { data: analysisRecord, error: insertError } = await supabase
    .from('analyses')
    .insert({
      user_id: authedUser.id,
      file_name: fileName,
      file_url: publicUrl,
      document_type: documentType,
      status: 'processing',
      payment_type: profile.subscription_status === 'active' ? 'subscription' : 'free_trial',
    })
    .select()
    .single()

  if (insertError || !analysisRecord) {
    return NextResponse.json({ error: 'Failed to create analysis record' }, { status: 500 })
  }

  // Extract text from PDF
  let extractedText: string
  try {
    extractedText = await extractTextFromPDF(buffer)
  } catch {
    await supabase.from('analyses').update({ status: 'failed' }).eq('id', analysisRecord.id)
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 422 })
  }

  if (!extractedText.trim()) {
    await supabase.from('analyses').update({ status: 'failed' }).eq('id', analysisRecord.id)
    return NextResponse.json({ error: 'PDF appears to be empty or scanned (non-text)' }, { status: 422 })
  }

  // Call Claude
  let result
  try {
    result = await analyzeContract(extractedText, documentType, fileName)
  } catch (err) {
    await supabase.from('analyses').update({ status: 'failed' }).eq('id', analysisRecord.id)
    return NextResponse.json(
      { error: (err as Error).message ?? 'AI analysis failed' },
      { status: 500 }
    )
  }

  // Update analysis with results
  const { error: updateError } = await supabase
    .from('analyses')
    .update({
      status: 'complete',
      document_type: result.document_type,
      risk_score: result.risk_score,
      risk_level: result.risk_level,
      summary: result.summary,
      total_cost_estimate: result.total_cost_estimate,
      flagged_clauses: result.flagged_clauses,
      negotiation_points: result.negotiation_points,
      market_comparison: result.market_comparison,
      completed_at: new Date().toISOString(),
    })
    .eq('id', analysisRecord.id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
  }

  // Increment free usage if applicable
  if (profile.subscription_status !== 'active') {
    await supabase
      .from('profiles')
      .update({ free_analyses_used: profile.free_analyses_used + 1 })
      .eq('id', authedUser.id)
  }

  return NextResponse.json({ analysisId: analysisRecord.id, status: 'complete' })
}
