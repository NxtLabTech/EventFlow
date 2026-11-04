export default function FormField({ label, name, error, as: Tag = 'input', className = '', ...props }) {
  const errorId = `${name}-error`;

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Tag
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:text-sm ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300 focus:border-slate-900 focus:ring-slate-900'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 break-words text-xs sm:text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
