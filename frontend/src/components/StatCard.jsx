export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-5 sm:p-6 shadow-sm ring-1 ring-slate-200 min-w-0">
      <p className="text-sm font-medium text-slate-500 break-words">{label}</p>
      <p className="mt-2 text-2xl sm:text-3xl font-semibold text-indigo-600">{value}</p>
    </div>
  );
}
