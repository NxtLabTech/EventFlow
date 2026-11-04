export default function FormField({ label, name, error, as: Tag = 'input', ...props }) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Tag
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        className={`mt-1 block max-w-full w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? 'border-red-400' : 'border-slate-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 break-words text-sm text-red-600">{error}</p>}
    </div>
  );
}
