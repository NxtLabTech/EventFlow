import { useState } from 'react';
import EmptyState from './EmptyState.jsx';

export default function RegistrationList({ registrations = [], onCancel }) {
  const [cancellingEmail, setCancellingEmail] = useState(null);

  if (registrations.length === 0) {
    return <EmptyState title="No registrations yet" />;
  }

  async function handleCancel(email) {
    if (!onCancel) return;
    setCancellingEmail(email);
    try {
      await onCancel(email);
    } finally {
      setCancellingEmail(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Registered</th>
            <th className="px-4 py-2 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r) => (
            <tr key={r._id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-2">{r.name}</td>
              <td className="px-4 py-2">{r.email}</td>
              <td className="px-4 py-2">{new Date(r.registeredAt).toLocaleString()}</td>
              <td className="px-4 py-2">
                <button
                  type="button"
                  disabled={cancellingEmail === r.email}
                  onClick={() => handleCancel(r.email)}
                  className="rounded border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {cancellingEmail === r.email ? 'Cancelling...' : 'Cancel'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
