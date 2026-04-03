"use client";

import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
            "border border-border bg-surface",
            "hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
            "hover:-translate-y-0.5 will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
            item.hasPersistentHover && "-translate-y-0.5"
          )}
        >
          {/* Dot texture — always visible */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,116,138,0.06)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 group-hover:bg-accent/15 transition-all duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span className="text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm bg-accent/8 text-text-secondary border border-border transition-colors duration-300 group-hover:border-accent/30">
                  {item.status}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-medium text-text-primary tracking-tight text-[15px]">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-text-muted font-normal">{item.meta}</span>
                )}
              </h3>
              <p className="text-sm text-text-secondary leading-snug">{item.description}</p>
            </div>

            {(item.tags?.length || item.cta) && (
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.tags?.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-accent/8 text-text-muted border border-border/60 transition-all duration-200 hover:border-accent/30">
                      #{tag}
                    </span>
                  ))}
                </div>
                {item.cta && (
                  <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.cta}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Gradient border shimmer — always visible */}
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-accent/5 via-accent/10 to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
}

/** Lightweight wrapper that adds bento dot-texture + gradient-border to any card */
export function BentoCard({
  children,
  className,
  persistent = false,
  style,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  persistent?: boolean;
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>) {
  return (
    <div
      style={style}
      {...rest}
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-300 will-change-transform",
        "hover:-translate-y-0.5",
        persistent && "-translate-y-0.5",
        className
      )}
    >
      {/* Dot texture — always visible */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,116,138,0.07)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Gradient border shimmer — always visible */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-accent/5 via-accent/15 to-transparent pointer-events-none" />
    </div>
  );
}

export { BentoGrid };
