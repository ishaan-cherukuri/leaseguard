import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPost, getAllPosts, formatDate } from '@/lib/blog'
import { SEO } from '@/lib/seo'
import AuthorBio from '@/components/AuthorBio'
import JsonLd from '@/components/JsonLd'
import { Shield, Clock, ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SEO.siteUrl}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SEO.siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: post.authorLinkedIn,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LeaseGuard',
      url: SEO.siteUrl,
    },
    url: `${SEO.siteUrl}/blog/${slug}`,
    keywords: post.tags.join(', '),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I negotiate a lease after I\'ve already signed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Technically, once signed, a lease is a binding contract. However, landlords can agree to modify terms in writing at any time — especially if you catch an issue early and approach it professionally. The best leverage is always before you sign.',
        },
      },
      {
        '@type': 'Question',
        name: 'What\'s the fastest way to check if my lease is fair?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An AI lease analyzer can flag the most common red flags in under 60 seconds. LeaseGuard\'s free AI lease review surfaces risky clauses, estimates hidden costs, and generates negotiation scripts — without requiring you to understand legal language.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are lease red flags the same in every state?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No — landlord-tenant law varies significantly by state and county. Late fee caps, security deposit timelines, and entry notice requirements all differ. LeaseGuard\'s lease gap analysis flags location-specific issues and notes when a missing clause varies by state.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a lawyer to negotiate lease terms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For standard residential leases, no. Most landlords expect tenants to negotiate basic terms. An AI contract analysis tool can give you the same talking points a lawyer would for common clauses — at a fraction of the cost.',
        },
      },
    ],
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />

      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        {/* Nav */}
        <nav className="border-b border-border px-6 py-4" style={{ background: 'var(--surface)' }}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
                <Shield className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="font-display font-bold text-base">LeaseGuard</span>
            </Link>
            <Link href="/upload" className="btn-primary text-sm px-4 py-2 rounded-lg">
              Analyze my lease →
            </Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Back */}
          <Link href="/blog"
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-secondary text-sm mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            All posts
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}>
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-text-muted mb-8">
              <span className="font-medium text-text-secondary">{post.author}</span>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min read
              </span>
            </div>

            <AuthorBio
              name={post.author}
              bio={post.authorBio}
              linkedIn={post.authorLinkedIn}
            />
          </header>

          {/* Article content */}
          <article
            className="blog-content text-text-secondary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Sticky bottom CTA */}
          <div className="mt-16 p-6 rounded-2xl border text-center"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), var(--surface))',
              borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
            }}>
            <p className="font-display text-xl font-bold text-text-primary mb-2">
              Worried about your lease?
            </p>
            <p className="text-text-secondary text-sm mb-4">
              Get an instant AI analysis — risk score, flagged clauses, negotiation scripts, and a full gap scan.
            </p>
            <Link href="/upload" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold">
              Get an instant AI analysis →
            </Link>
            <p className="text-text-muted text-xs mt-3">First contract free. No credit card required.</p>
          </div>
        </div>
      </div>

      <style>{`
        .blog-content h2 {
          font-family: var(--font-playfair), serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 2.5rem 0 1rem;
          line-height: 1.25;
        }
        .blog-content h3 {
          font-family: var(--font-playfair), serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 2rem 0 0.75rem;
        }
        .blog-content p { margin-bottom: 1.25rem; line-height: 1.75; }
        .blog-content ol, .blog-content ul {
          margin: 1rem 0 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .blog-content ol { list-style: decimal; }
        .blog-content ul { list-style: disc; }
        .blog-content li { line-height: 1.7; }
        .blog-content strong { color: var(--text-primary); font-weight: 600; }
        .blog-content a { color: var(--accent); text-decoration: underline; }
        .blog-content a:hover { opacity: 0.85; }
        .blog-content .blog-cta-inline {
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
          border-left: 3px solid var(--accent);
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          margin: 2rem 0;
        }
        .blog-content .blog-cta-inline p { margin: 0; }
        .blog-content .faq-item {
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1.25rem;
          margin: 1rem 0;
          background: var(--surface);
        }
        .blog-content .faq-item h3 { margin: 0 0 0.625rem; font-size: 1rem; }
        .blog-content .faq-item p { margin: 0; font-size: 0.9375rem; }
      `}</style>
    </>
  )
}
