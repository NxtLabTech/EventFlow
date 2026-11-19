export default function Loading({ label = 'Loading...' }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-12 text-slate-500">
      <span
        aria-hidden="true"
        className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-indigo-600 motion-safe:animate-spin"
      />
      <span>{label}</span>
    </div>
  );
}
