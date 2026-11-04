export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="min-w-0 overflow-hidden rounded-xl border border-red-200/80 bg-red-50/70 p-4 text-sm text-red-800">
      <div className="flex items-start gap-3">
        <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <p className="break-words font-medium">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex min-h-[36px] cursor-pointer items-center text-xs font-semibold uppercase tracking-wider text-red-900 underline hover:text-red-950 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
