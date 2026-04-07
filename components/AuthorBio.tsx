import JsonLd from '@/components/JsonLd'

interface AuthorBioProps {
  name: string
  bio: string
  linkedIn: string
  twitter?: string
}

export default function AuthorBio({ name, bio, linkedIn, twitter }: AuthorBioProps) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: linkedIn,
    sameAs: [linkedIn, ...(twitter ? [`https://twitter.com/${twitter.replace('@', '')}`] : [])],
  }

  return (
    <>
      <JsonLd data={personSchema} />
      <div className="flex items-start gap-4 p-5 rounded-2xl border border-border"
        style={{ background: 'var(--surface-raised)' }}>
        {/* Avatar placeholder */}
        <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '2px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-text-primary text-sm mb-0.5">{name}</p>
          <p className="text-text-secondary text-sm leading-relaxed mb-2">{bio}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-accent hover:underline"
            >
              LinkedIn →
            </a>
            {twitter && (
              <a
                href={`https://twitter.com/${twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-accent hover:underline"
              >
                {twitter}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
