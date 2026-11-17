import EmptyState from './EmptyState.jsx';

// Below the `sm` breakpoint each row is shown as a stacked card (one cell per line)
// so the table never forces horizontal scrolling on phones.
export default function RegistrationList({ registrations }) {
  if (registrations.length === 0) {
    return <EmptyState title="No registrations yet" />;
  }
  return (
    <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 sm:overflow-x-auto">
      <table className="block w-full text-left text-sm sm:table sm:min-w-full">
        <thead className="hidden border-b border-slate-200 text-slate-500 sm:table-header-group">
          <tr>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Registered</th>
          </tr>
        </thead>
        <tbody className="block sm:table-row-group">
          {registrations.map((r) => (
            <tr key={r._id} className="block border-b border-slate-100 px-4 py-3 last:border-0 sm:table-row sm:p-0">
              <td className="block font-medium sm:table-cell sm:px-4 sm:py-2 sm:font-normal">{r.name}</td>
              <td className="block text-slate-600 sm:table-cell sm:px-4 sm:py-2 sm:text-slate-800">{r.email}</td>
              <td className="block text-xs text-slate-500 sm:table-cell sm:px-4 sm:py-2 sm:text-sm sm:text-slate-800">
                {new Date(r.registeredAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
