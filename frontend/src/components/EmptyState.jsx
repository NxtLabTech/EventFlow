export default function EmptyState({ title, children }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center sm:p-12">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="mt-3 break-words text-sm font-semibold text-slate-900 sm:text-base">{title}</p>
      {children && <div className="mt-2 break-words text-sm text-slate-500">{children}</div>}
    </div>
  );
}
