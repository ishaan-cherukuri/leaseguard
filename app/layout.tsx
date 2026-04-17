import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import JsonLd from '@/components/JsonLd'
import { SEO } from '@/lib/seo'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    default: SEO.defaultTitle,
    template: '%s | LeaseGuard',
  },
  description: SEO.defaultDescription,
  keywords: [
    'AI lease analyzer',
    'free lease analyzer',
    'lease review',
    'contract analysis',
    'lease red flags',
    'free lease checker',
    'rental agreement review',
    'AI contract reviewer',
    'is my lease fair',
    'lease risk score',
    'hidden lease costs',
    'negotiation scripts lease',
    'renter protection',
    'contract risk analyzer',
  ],
  authors: [{ name: 'LeaseGuard' }],
  creator: 'LeaseGuard',
  publisher: 'LeaseGuard',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: SEO.siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SEO.siteUrl,
    siteName: SEO.siteName,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [
      {
        url: SEO.defaultOgImage,
        width: 512,
        height: 512,
        alt: 'LeaseGuard — Free AI Lease & Contract Analyzer',
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: SEO.twitterHandle,
    creator: SEO.twitterHandle,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [SEO.defaultOgImage],
  },
  other: {
    'theme-color': SEO.themeColor,
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LeaseGuard',
  url: SEO.siteUrl,
  logo: `${SEO.siteUrl}/logo.png`,
  sameAs: [
    'https://twitter.com/leaseguard',
    'https://www.linkedin.com/company/leaseguard',
    'https://www.producthunt.com/products/leaseguard',
  ],
  description: 'AI-powered lease and contract analyzer for renters and freelancers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={SEO.themeColor} />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <JsonLd data={organizationSchema} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
