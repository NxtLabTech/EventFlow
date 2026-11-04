export default function StatCard({ label, value }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 sm:p-6">
      <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{value}</p>
    </div>
  );
}
