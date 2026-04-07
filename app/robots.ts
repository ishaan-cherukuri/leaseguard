import type { MetadataRoute } from 'next'
import { SEO } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/upgrade', '/login', '/signup', '/free-lease-checker'],
        disallow: ['/dashboard', '/upload', '/analysis', '/settings', '/api'],
      },
    ],
    sitemap: `${SEO.siteUrl}/sitemap.xml`,
  }
}
