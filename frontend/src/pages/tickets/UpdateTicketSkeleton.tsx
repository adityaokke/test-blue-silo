export default function UpdateTicketSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Topbar skeleton */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-3">
        <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
        <span className="text-slate-700">|</span>
        <div className="h-4 w-40 bg-slate-800 rounded animate-pulse" />
        <span className="text-slate-700">|</span>
        <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-5">

        {/* Ticket summary skeleton */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
          <div className="h-5 w-64 bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-40 bg-slate-800 rounded animate-pulse" />
        </div>

        {/* Card skeletons */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="h-10 w-full bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-20 w-full bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-slate-800 rounded-lg animate-pulse" />
          </div>
        ))}

      </main>
    </div>
  );
}