import { ImageResponse } from 'next/og'
import { getPost } from '@/lib/blog'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  const title = post?.title ?? 'LeaseGuard Blog'
  const description = post?.description ?? 'AI Lease & Contract Analyzer'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: '#0D0E14',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(201,116,138,0.18), transparent 70%)',
          borderRadius: '50%',
        }} />

        {/* Logo */}
        <div style={{
          position: 'absolute', top: '48px', left: '60px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(201,116,138,0.15)',
            border: '1px solid rgba(201,116,138,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: '20px' }}>🛡</div>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>LeaseGuard</span>
        </div>

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', marginBottom: '20px',
        }}>
          <span style={{
            fontSize: '14px', fontWeight: 600, color: '#C9748A',
            background: 'rgba(201,116,138,0.1)',
            border: '1px solid rgba(201,116,138,0.25)',
            borderRadius: '9999px',
            padding: '4px 14px',
          }}>
            Blog · LeaseGuard
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: title.length > 60 ? '38px' : '46px',
          fontWeight: 800,
          color: '#FAFAF9',
          lineHeight: 1.15,
          maxWidth: '900px',
          marginBottom: '20px',
        }}>
          {title}
        </div>

        {/* Description */}
        <div style={{
          fontSize: '20px',
          color: 'rgba(255,255,255,0.55)',
          maxWidth: '780px',
          lineHeight: 1.5,
        }}>
          {description}
        </div>
      </div>
    ),
    { ...size }
  )
}
