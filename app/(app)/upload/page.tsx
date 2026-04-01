'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Upload, AlertCircle } from 'lucide-react'
import UploadZone from '@/components/UploadZone'

const DOCUMENT_TYPES = [
  { value: 'lease', label: 'Lease Agreement' },
  { value: 'rental', label: 'Rental Agreement' },
  { value: 'gym', label: 'Gym Contract' },
  { value: 'car', label: 'Car Purchase / Lease' },
  { value: 'employment', label: 'Employment Contract' },
  { value: 'insurance', label: 'Insurance Policy' },
  { value: 'other', label: 'Other Contract' },
]

const STAGES = [
  'Extracting document...',
  'Analyzing clauses...',
  'Calculating risk score...',
]

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('lease')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    if (!file) return
    setLoading(true)
    setError(null)
    setStage(0)

    // Cycle through stages for UX
    const stageTimer1 = setTimeout(() => setStage(1), 4000)
    const stageTimer2 = setTimeout(() => setStage(2), 12000)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 402) {
          setError('You have used your free analysis. Please upgrade to continue.')
        } else {
          setError(data.error ?? 'Analysis failed. Please try again.')
        }
        return
      }

      router.push(`/analysis/${data.analysisId}`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      clearTimeout(stageTimer1)
      clearTimeout(stageTimer2)
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">New Analysis</h1>
        <p className="text-text-secondary mt-1">Upload a PDF contract to analyze</p>
      </div>

      <div className="space-y-6">
        {/* Document type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Contract type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DOCUMENT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setDocumentType(type.value)}
                className={`px-3 py-2 rounded-md text-sm border transition-all text-left ${
                  documentType === type.value
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-text-secondary hover:border-accent/40 hover:text-text-primary'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload zone */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Upload PDF
          </label>
          <UploadZone onFileAccepted={setFile} disabled={loading} />
        </div>

        {/* Selected file info */}
        {file && !loading && (
          <div className="flex items-center gap-3 p-3 rounded-md bg-surface-raised border border-border">
            <FileText className="w-5 h-5 text-accent shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm font-medium truncate">{file.name}</p>
              <p className="text-text-secondary text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="p-6 rounded-xl border border-accent/30 bg-accent/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-accent font-medium">{STAGES[stage]}</span>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-1000"
                style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
              />
            </div>
            <p className="text-text-secondary text-xs mt-3">This usually takes 15–30 seconds</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-4 rounded-md bg-critical/10 border border-critical/30">
            <AlertCircle className="w-4 h-4 text-critical shrink-0 mt-0.5" />
            <p className="text-critical text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full py-3 px-6 rounded-md bg-accent text-background font-semibold hover:bg-accent-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Analyze Contract'}
        </button>
      </div>
    </div>
  )
}
