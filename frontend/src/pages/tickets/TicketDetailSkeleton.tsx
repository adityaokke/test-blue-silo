export default function TicketDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Topbar skeleton */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-3">
        <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
        <span className="text-slate-700">|</span>
        <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Ticket info skeleton */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-5 w-64 bg-slate-800 rounded animate-pulse" />
            <div className="h-5 w-20 bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />

          <div className="grid grid-cols-4 gap-4 pt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                <div className="h-4 w-20 bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logs skeleton */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-px flex-1 bg-slate-800 mt-1" />
              </div>
              <div className="pb-5 flex-1 space-y-2">
                <div className="h-3 w-48 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-64 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
