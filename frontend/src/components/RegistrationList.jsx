import EmptyState from './EmptyState.jsx';

export default function RegistrationList({ registrations }) {
  if (registrations.length === 0) {
    return <EmptyState title="No registrations yet" />;
  }
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full text-left text-xs sm:text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-3 py-2.5 sm:px-4 sm:py-2 font-medium whitespace-nowrap">Name</th>
            <th className="px-3 py-2.5 sm:px-4 sm:py-2 font-medium whitespace-nowrap">Email</th>
            <th className="px-3 py-2.5 sm:px-4 sm:py-2 font-medium whitespace-nowrap">Registered</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {registrations.map((r) => (
            <tr key={r._id} className="last:border-0 hover:bg-slate-50/50">
              <td className="px-3 py-2.5 sm:px-4 sm:py-2 font-medium text-slate-800 break-words">{r.name}</td>
              <td className="px-3 py-2.5 sm:px-4 sm:py-2 text-slate-600 break-all">{r.email}</td>
              <td className="px-3 py-2.5 sm:px-4 sm:py-2 text-slate-500 whitespace-nowrap">{new Date(r.registeredAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
