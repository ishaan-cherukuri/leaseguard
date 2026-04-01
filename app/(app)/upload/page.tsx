'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, AlertCircle, X, FileText } from 'lucide-react'
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
  { label: 'Extracting document...', detail: 'Reading your PDF text' },
  { label: 'Analyzing clauses...', detail: 'Identifying risky terms with AI' },
  { label: 'Calculating risk score...', detail: 'Scoring against market standards' },
]

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [documentType, setDocumentType] = useState('lease')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function handleRemoveFile() {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
  }

  async function handleAnalyze() {
    if (!file) return
    setLoading(true)
    setError(null)
    setStage(0)

    const t1 = setTimeout(() => setStage(1), 5000)
    const t2 = setTimeout(() => setStage(2), 15000)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(res.status === 402
          ? 'You have used your free word allowance. Paid plans are not available yet — check back soon.'
          : (data.error ?? 'Analysis failed. Please try again.'))
        return
      }

      router.push(`/analysis/${data.analysisId}`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setLoading(false)
    }
  }

  // SPLIT SCREEN — file selected
  if (file && previewUrl) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* LEFT — PDF preview */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-accent shrink-0" />
              <span className="text-text-primary text-sm font-medium truncate">{file.name}</span>
              <span className="text-text-secondary text-xs shrink-0">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            {!loading && (
              <button
                onClick={handleRemoveFile}
                className="text-text-secondary hover:text-critical transition-colors ml-2 shrink-0"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="flex-1 w-full"
            title="PDF preview"
          />
        </div>

        {/* RIGHT — settings + status */}
        <div className="w-1/2 flex flex-col justify-center px-10 py-8 overflow-y-auto">
          {!loading ? (
            <div className="space-y-6 max-w-md mx-auto w-full">
              <div>
                <h1 className="font-display text-3xl font-bold text-text-primary">Ready to analyze</h1>
                <p className="text-text-secondary mt-1">Choose the contract type then click analyze</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">Contract type</label>
                <div className="grid grid-cols-2 gap-2">
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

              {error && (
                <div className="flex items-start gap-2 p-4 rounded-md bg-critical/10 border border-critical/30">
                  <AlertCircle className="w-4 h-4 text-critical shrink-0 mt-0.5" />
                  <p className="text-critical text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                className="w-full py-3 px-6 rounded-md bg-accent text-background font-semibold hover:bg-accent-hover transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Analyze Contract
              </button>
            </div>
          ) : (
            /* Loading state */
            <div className="max-w-md mx-auto w-full space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-1">Analyzing your contract</h2>
                <p className="text-text-secondary text-sm">This usually takes 15–30 seconds</p>
              </div>

              <div className="space-y-4">
                {STAGES.map((s, i) => {
                  const isDone = i < stage
                  const isActive = i === stage
                  return (
                    <div key={s.label} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      isActive ? 'border-accent/40 bg-accent/5' :
                      isDone ? 'border-safe/30 bg-safe/5' :
                      'border-border opacity-40'
                    }`}>
                      <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
                        isDone ? 'bg-safe' : isActive ? 'border-2 border-accent' : 'border-2 border-border'
                      }`}>
                        {isDone && (
                          <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isActive ? 'text-accent' : isDone ? 'text-safe' : 'text-text-secondary'}`}>
                          {s.label}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">{s.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000"
                  style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // DEFAULT — no file yet
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">New Analysis</h1>
        <p className="text-text-secondary mt-1">Upload a PDF contract to analyze</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Contract type</label>
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

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Upload PDF</label>
          <UploadZone onFileAccepted={setFile} disabled={false} />
        </div>
      </div>
    </div>
  )
}
