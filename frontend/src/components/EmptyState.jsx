export default function EmptyState({ title, children }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8">
      <p className="font-medium text-slate-700">{title}</p>
      {children && <div className="mt-3 text-sm text-slate-500">{children}</div>}
    </div>
  );
}
