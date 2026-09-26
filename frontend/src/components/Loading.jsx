export default function Loading({ label = 'Loading...' }) {
  return (
    <div role="status" className="py-12 text-center text-slate-500">
      {label}
    </div>
  );
}
