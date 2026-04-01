export default function AnalysisSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl animate-pulse">
      <div className="mb-8">
        <div className="h-4 w-48 bg-surface-raised rounded mb-2" />
        <div className="h-8 w-64 bg-surface-raised rounded" />
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border border-border bg-surface flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-surface-raised" />
            <div className="mt-4 h-6 w-24 bg-surface-raised rounded-full" />
          </div>
          <div className="p-6 rounded-xl border border-border bg-surface space-y-2">
            <div className="h-5 w-24 bg-surface-raised rounded" />
            <div className="h-4 w-full bg-surface-raised rounded" />
            <div className="h-4 w-5/6 bg-surface-raised rounded" />
          </div>
          <div className="p-6 rounded-xl border border-border bg-surface space-y-2">
            <div className="h-5 w-36 bg-surface-raised rounded" />
            <div className="h-4 w-3/4 bg-surface-raised rounded" />
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-3 space-y-3">
          <div className="h-7 w-48 bg-surface-raised rounded mb-5" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-surface space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-surface-raised rounded-full" />
                <div className="h-5 w-32 bg-surface-raised rounded" />
              </div>
              <div className="h-4 w-full bg-surface-raised rounded" />
              <div className="h-4 w-4/5 bg-surface-raised rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
