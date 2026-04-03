// Migration (run once if column doesn't exist):
// ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS ai_detection_result jsonb;

import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { extractTextFromPDF } from '@/lib/pdf'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let analysisId: string
  try {
    const body = await request.json()
    analysisId = body.analysisId
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!analysisId) return NextResponse.json({ error: 'Missing analysisId' }, { status: 400 })

  // Fetch analysis and confirm ownership
  const { data: analysis, error: fetchError } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !analysis) {
    return NextResponse.json({ error: 'Analysis not found' }, { status: 403 })
  }

  // Return cached result if already run
  if (analysis.ai_detection_result) {
    return NextResponse.json(analysis.ai_detection_result)
  }

  // Fetch PDF from Supabase Storage
  const serviceClient = await createServiceClient()
  const urlParts = analysis.file_url.split('/storage/v1/object/public/contracts/')
  if (!urlParts[1]) {
    return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 })
  }

  const { data: fileData, error: fileError } = await serviceClient.storage
    .from('contracts')
    .download(urlParts[1])

  if (fileError || !fileData) {
    return NextResponse.json({ error: 'Could not fetch file from storage' }, { status: 502 })
  }

  // Extract text
  let text: string
  try {
    const buffer = Buffer.from(await fileData.arrayBuffer())
    text = await extractTextFromPDF(buffer)
  } catch {
    return NextResponse.json({ error: 'Could not extract text from document' }, { status: 422 })
  }

  if (!text || text.trim().length < 50) {
    return NextResponse.json({ error: 'Document has too little text to analyze' }, { status: 422 })
  }

  // Call Pangram API
  // Docs: POST https://text.api.pangram.com/v3
  // Auth: x-api-key header (no Bearer prefix)
  const pangram = await fetch('https://text.api.pangram.com/v3', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.PANGRAM_API_KEY ?? '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!pangram.ok) {
    const errText = await pangram.text().catch(() => 'unknown')
    console.error('[detect] Pangram API error:', pangram.status, errText)
    return NextResponse.json(
      { error: `Detection service returned ${pangram.status}: ${errText}` },
      { status: 502 }
    )
  }

  let result: unknown
  try {
    result = await pangram.json()
  } catch {
    const raw = await pangram.text().catch(() => '')
    console.error('[detect] Pangram response is not JSON:', raw.slice(0, 200))
    return NextResponse.json(
      { error: `Detection service returned invalid JSON` },
      { status: 502 }
    )
  }

  // Cache in DB (best-effort)
  try {
    await serviceClient
      .from('analyses')
      .update({ ai_detection_result: result })
      .eq('id', analysisId)
  } catch (cacheErr) {
    console.warn('[detect] Could not cache result:', cacheErr)
  }

  return NextResponse.json(result)
}
