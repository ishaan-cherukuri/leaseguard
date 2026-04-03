'use client'

import { useState } from 'react'
import { MessageSquare, X, CheckCircle } from 'lucide-react'

const FEEDBACK_TYPES = ['Bug report', 'Feature request', 'General feedback', 'Other']

export default function FeedbackModal() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('General feedback')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message }),
      })

      if (!res.ok) throw new Error('Failed to send')

      setSent(true)
      setMessage('')
      setTimeout(() => {
        setOpen(false)
        setSent(false)
      }, 2000)
    } catch {
      setError('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary text-sm w-full"
      >
        <MessageSquare className="w-4 h-4" />
        Send feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-lg font-bold text-text-primary mb-1">Send feedback</h3>
            <p className="text-text-secondary text-sm mb-5">Your feedback goes directly to the founder.</p>

            {sent ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <CheckCircle className="w-10 h-10 text-safe" />
                <p className="text-text-primary font-medium">Thanks for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {FEEDBACK_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-3 py-1 rounded-full text-xs border transition-all ${
                        type === t
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-text-secondary hover:border-accent/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 rounded-md bg-surface-raised border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors resize-none text-sm"
                />

                {error && <p className="text-critical text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="w-full py-2.5 rounded-md bg-accent text-background font-semibold hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? 'Sending...' : 'Send feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
