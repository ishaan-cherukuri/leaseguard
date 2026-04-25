export const SEO = {
  siteName: 'LeaseGuard',
  siteUrl: 'https://theleaseguard.com',
  defaultTitle: 'LeaseGuard AI Detector & Contract Analyzer',
  defaultDescription:
    'Free AI lease analyzer. Upload any contract and get an instant risk score, flagged clauses, hidden cost estimate, and negotiation scripts in under 60 seconds. Protect yourself before you sign.',
  defaultOgImage: 'https://theleaseguard.com/logo.png',
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
