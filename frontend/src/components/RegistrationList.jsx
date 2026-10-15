import EmptyState from './EmptyState.jsx';

export default function RegistrationList({ registrations, onCancel }) {
  if (registrations.length === 0) {
    return <EmptyState title="No registrations yet" />;
  }
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Registered</th>
            {onCancel && <th className="px-4 py-2 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {registrations.map((r) => (
            <tr key={r._id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-2">{r.name}</td>
              <td className="px-4 py-2">{r.email}</td>
              <td className="px-4 py-2">{new Date(r.registeredAt).toLocaleString()}</td>
              {onCancel && (
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onCancel(r)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline"
                  >
                    Cancel
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
