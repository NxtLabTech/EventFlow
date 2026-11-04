import EmptyState from './EmptyState.jsx';

export default function RegistrationList({ registrations }) {
  if (registrations.length === 0) {
    return <EmptyState title="No registrations yet" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="hidden border-b border-slate-200/80 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-header-group">
            <tr>
              <th scope="col" className="px-5 py-3">Name</th>
              <th scope="col" className="px-5 py-3">Email</th>
              <th scope="col" className="px-5 py-3">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 sm:divide-y-0">
            {registrations.map((r) => (
              <tr
                key={r._id}
                className="block p-4.5 transition-colors hover:bg-slate-50/50 sm:table-row sm:border-b sm:border-slate-100 sm:p-0 sm:last:border-0"
              >
                <td className="block font-medium text-slate-900 sm:table-cell sm:px-5 sm:py-3.5 sm:font-normal">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:hidden">
                    Name:{' '}
                  </span>
                  <span className="break-words font-medium text-slate-900">{r.name}</span>
                </td>
                <td className="mt-1 block text-slate-600 sm:mt-0 sm:table-cell sm:px-5 sm:py-3.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:hidden">
                    Email:{' '}
                  </span>
                  <span className="break-all">{r.email}</span>
                </td>
                <td className="mt-1 block text-xs text-slate-500 sm:mt-0 sm:table-cell sm:px-5 sm:py-3.5 sm:text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:hidden">
                    Registered:{' '}
                  </span>
                  <span className="break-words text-slate-500">{new Date(r.registeredAt).toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
