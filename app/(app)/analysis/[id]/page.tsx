import { redirect, notFound } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import AnalysisResultsPanel from '@/components/AnalysisResultsPanel'
import AnalysisSkeleton from '@/components/AnalysisSkeleton'
import type { Analysis } from '@/types'

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) notFound()

  const analysis = data as Analysis & { ai_detection_result?: unknown }

  if (analysis.status === 'processing') {
    return <AnalysisSkeleton />
  }

  if (analysis.status === 'failed') {
    return (
      <div className="p-8 max-w-2xl">
        <div className="text-center py-16 border border-critical/30 rounded-xl bg-critical/5">
          <p className="font-display text-xl font-semibold text-critical mb-2">Analysis failed</p>
          <p className="text-text-secondary">Something went wrong. Please try uploading again.</p>
        </div>
      </div>
    )
  }

  // Generate signed URL for PDF preview
  let pdfSignedUrl: string | null = null
  try {
    const serviceClient = await createServiceClient()
    const urlParts = analysis.file_url.split('/storage/v1/object/public/contracts/')
    if (urlParts[1]) {
      const { data: signedData } = await serviceClient.storage
        .from('contracts')
        .createSignedUrl(urlParts[1], 3600)
      pdfSignedUrl = signedData?.signedUrl ?? null
    }
  } catch {
    // PDF preview unavailable — not critical
  }

  return <AnalysisResultsPanel analysis={analysis} pdfSignedUrl={pdfSignedUrl} />
}
