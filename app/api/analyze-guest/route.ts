import { NextRequest, NextResponse } from 'next/server'
import { analyzeContract } from '@/lib/claude'
import { extractTextFromPDF } from '@/lib/pdf'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const documentType = (formData.get('documentType') as string) ?? 'other'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (file.type !== 'application/pdf') return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())

  let extractedText: string
  try {
    extractedText = await extractTextFromPDF(buffer)
  } catch {
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 422 })
  }

  if (!extractedText.trim()) {
    return NextResponse.json({ error: 'PDF appears to be empty or scanned (non-text)' }, { status: 422 })
  }

  try {
    const result = await analyzeContract(extractedText, documentType, file.name)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message ?? 'AI analysis failed' }, { status: 500 })
  }
}
