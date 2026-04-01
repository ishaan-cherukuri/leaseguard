'use client'

import { useCallback, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadZoneProps {
  onFileAccepted: (file: File) => void
  disabled?: boolean
}

export default function UploadZone({ onFileAccepted, disabled }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null)
  const [accepted, setAccepted] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null)
      if (rejectedFiles.length > 0) {
        const msg = rejectedFiles[0].errors[0]?.message
        if (msg?.includes('file-too-large')) {
          setError('File must be under 10MB.')
        } else if (msg?.includes('file-invalid-type')) {
          setError('Only PDF files are accepted.')
        } else {
          setError('Invalid file.')
        }
        return
      }
      if (acceptedFiles.length > 0) {
        setAccepted(true)
        onFileAccepted(acceptedFiles[0])
      }
    },
    [onFileAccepted]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          relative flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed
          cursor-pointer transition-all
          ${isDragActive ? 'border-accent bg-accent/10 scale-[1.01]' : ''}
          ${accepted ? 'border-safe bg-safe/5' : ''}
          ${!isDragActive && !accepted ? 'border-accent/40 hover:border-accent hover:bg-accent/5' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} aria-label="Upload PDF contract" />

        {accepted ? (
          <CheckCircle className="w-10 h-10 text-safe mb-3" />
        ) : (
          <Upload
            className={`w-10 h-10 mb-3 transition-colors ${isDragActive ? 'text-accent' : 'text-text-secondary'}`}
          />
        )}

        <p className="text-text-primary font-medium text-sm text-center">
          {isDragActive
            ? 'Drop your PDF here'
            : accepted
            ? 'File ready — click to replace'
            : 'Drag & drop your PDF here'}
        </p>
        <p className="text-text-secondary text-xs mt-1">
          {accepted ? '' : 'or click to browse · PDF only · max 10MB'}
        </p>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-critical text-xs">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
