export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-indigo-600">{value}</p>
    </div>
  );
}
