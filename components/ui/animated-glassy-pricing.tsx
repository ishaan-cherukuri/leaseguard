'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const CheckIcon = ({ popular }: { popular?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className="shrink-0 mt-0.5"
    style={{ color: popular ? 'var(--accent)' : 'var(--safe)' }}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  priceLabel?: string;
  features: string[];
  buttonText: string;
  href?: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
}

export function PricingCard({
  planName,
  description,
  price,
  priceLabel,
  features,
  buttonText,
  href = '/signup',
  isPopular = false,
  buttonVariant = 'secondary',
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl px-6 py-7 transition-all duration-300',
        'backdrop-blur-[14px]',
        isPopular
          ? 'scale-[1.04] shadow-2xl z-10'
          : 'shadow-lg hover:-translate-y-0.5',
      )}
      style={isPopular ? {
        background: 'linear-gradient(145deg, color-mix(in srgb, var(--accent) 10%, var(--surface-glass)) 0%, var(--surface-glass) 100%)',
        border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
        boxShadow: `0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent), 0 20px 60px color-mix(in srgb, var(--accent) 15%, rgba(0,0,0,0.2))`,
      } : {
        background: 'var(--surface-glass)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      {/* Bento dot texture — always on */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(201,116,138,0.07) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
      </div>

      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold btn-primary whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 65%, #000))' }}>
          Most Popular
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-1">
        {/* Plan name */}
        <div className="mb-4">
          <h3
            className="text-[38px] font-extralight tracking-[-0.03em] font-display leading-none mb-1"
            style={{ color: isPopular ? 'var(--accent)' : 'var(--text-primary)' }}
          >
            {planName}
          </h3>
          <p className="text-[13px] text-text-secondary leading-snug">{description}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-5">
          <span
            className="text-[38px] font-extralight font-display leading-none"
            style={isPopular ? {
              background: 'linear-gradient(135deg, #EDAFC0 0%, var(--accent) 60%, #D4A07A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            } : { color: 'var(--text-primary)' }}
          >
            ${price}
          </span>
          {priceLabel && (
            <span className="text-xs text-text-muted">{priceLabel}</span>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-5"
          style={{ background: isPopular
            ? 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 40%, transparent) 50%, transparent)'
            : 'linear-gradient(90deg, transparent, var(--border) 50%, transparent)'
          }} />

        {/* Features */}
        <ul className="flex flex-col gap-2.5 mb-7 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-secondary">
              <CheckIcon popular={isPopular} />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={href}
          className={cn(
            'block text-center py-2.5 rounded-xl text-sm font-semibold transition-all',
            buttonVariant === 'primary' ? 'btn-primary' : 'btn-ghost',
          )}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
