import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, formatDate } from '@/lib/blog'
import { SEO } from '@/lib/seo'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — Lease Tips, Renter Rights & Contract Guides',
  description:
    'Guides on reading leases, spotting red flags, understanding your rights as a renter, and using AI to review contracts before you sign.',
  alternates: { canonical: `${SEO.siteUrl}/blog` },
  openGraph: {
    title: 'LeaseGuard Blog — Lease Tips & Renter Guides',
    description: 'Practical guides for renters navigating leases and contracts.',
    url: `${SEO.siteUrl}/blog`,
  },
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4"
        style={{ background: 'var(--surface)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              <Shield className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="font-display font-bold text-base">LeaseGuard</span>
          </Link>
          <Link href="/signup" className="btn-primary text-sm px-4 py-2 rounded-lg">
            Analyze my lease →
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Blog</p>
          <h1 className="font-display text-4xl font-bold text-text-primary mb-4">
            Lease tips & renter guides
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Plain-English guides on understanding your lease, spotting red flags, and negotiating better terms.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug}
              className="group border border-border rounded-2xl p-6 card-interactive"
              style={{ background: 'var(--surface)' }}>
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span>{post.readingTime} min read</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-text-muted text-center py-16">No posts yet — check back soon.</p>
        )}
      </div>
    </div>
  )
}
