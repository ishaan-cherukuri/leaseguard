export const SEO = {
  siteName: 'LeaseGuard',
  siteUrl: 'https://theleaseguard.com',
  defaultTitle: 'LeaseGuard — AI Lease & Contract Analyzer',
  defaultDescription:
    'Upload your lease and get an instant risk score, flagged clauses, and negotiation scripts powered by AI. Protect yourself before you sign.',
  defaultOgImage: 'https://theleaseguard.com/og-image.png',
  twitterHandle: '@leaseguard',
  themeColor: '#C9748A',
} as const

export type PageMeta = {
  title: string
  description?: string
  noindex?: boolean
  canonical?: string
  ogImage?: string
}
