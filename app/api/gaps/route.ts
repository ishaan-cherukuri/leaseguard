// Migration (run once):
// ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS lease_gaps_result jsonb;

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { extractTextFromPDF } from '@/lib/pdf'

export interface GapItem {
  category: string
  title: string
  severity: 'critical' | 'important' | 'recommended'
  explanation: string
  suggested_addition: string
  location_specific: boolean
}

export interface LeaseGapsResult {
  gaps_score: number
  gaps_level: 'comprehensive' | 'adequate' | 'incomplete' | 'bare-bones'
  summary: string
  missing_items: GapItem[]
  questions_to_ask: string[]
  state_disclaimer: string
}

const GAPS_SYSTEM_PROMPT = `You are a tenant protection specialist reviewing a lease or rental contract for missing clauses. Your job is NOT to flag problematic clauses — that is handled elsewhere. Your job is to identify what is ABSENT from this contract that a well-drafted lease should include. For each missing item, explain why its absence creates risk for the tenant and what they should ask the landlord to add or clarify before signing. Be specific to the contract text provided — only flag items that are genuinely absent, not items that are present but poorly written. Return a JSON object with this exact schema:
{
  "gaps_score": number (0-100, where 0 = completely missing protections, 100 = comprehensive coverage),
  "gaps_level": "comprehensive" | "adequate" | "incomplete" | "bare-bones",
  "summary": string (2-3 sentence overview),
  "missing_items": [
    {
      "category": string,
      "title": string,
      "severity": "critical" | "important" | "recommended",
      "explanation": string (why absence is risky),
      "suggested_addition": string (what the tenant should ask to be added),
      "location_specific": boolean (true if this varies by state/county)
    }
  ],
  "questions_to_ask": string[] (list of specific questions tenant should ask landlord before signing),
  "state_disclaimer": string
}

Always respond with valid JSON only. No markdown, no preamble.`

function buildGapsUserMessage(text: string): string {
  return `Check this lease contract for the following eight missing-clause categories and any other significant omissions:

1. Move-in/move-out inspection (photos, video documentation, condition report)
2. Noise regulations (quiet hours, decibel limits, local ordinance references)
3. Mold disclosure and remediation responsibilities
4. Tenant-caused damage policy (process, timelines, repair vs replace decisions)
5. Appliance repair and replacement (who is responsible, response time, what counts as habitable)
6. Roommate and subletting terms (adding/removing occupants, deposit disposition between roommates, notice requirements)
7. Move-out instructions (required notice to vacate period, inspection process, key return, cleaning requirements, deposit refund deadline and process)
8. Location-specific legal requirements (state/county-mandated disclosures that should be in the lease)

For each category that is genuinely absent from the contract, include it in missing_items. If a category is adequately covered, do not include it.

Contract text:
${text}`
}

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

  // Return cached result if available
  if (analysis.lease_gaps_result) {
    return NextResponse.json(analysis.lease_gaps_result)
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

  // Call Claude
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let raw = ''
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: GAPS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildGapsUserMessage(text) }],
    })
    raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  } catch (llmErr) {
    const msg = llmErr instanceof Error ? llmErr.message : String(llmErr)
    console.error('[gaps] LLM error:', msg)
    return NextResponse.json({ error: `LLM error: ${msg}` }, { status: 502 })
  }

  // Parse response
  let result: LeaseGapsResult
  try {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
    result = JSON.parse(cleaned) as LeaseGapsResult
  } catch {
    console.error('[gaps] JSON parse failed. Raw:', raw.slice(0, 400))
    return NextResponse.json({ error: 'Failed to parse LLM response', raw }, { status: 422 })
  }

  // Cache in DB (best-effort)
  try {
    await serviceClient
      .from('analyses')
      .update({ lease_gaps_result: result })
      .eq('id', analysisId)
  } catch (cacheErr) {
    console.warn('[gaps] Could not cache result:', cacheErr)
  }

  return NextResponse.json(result)
}
