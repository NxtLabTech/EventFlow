import { useState } from 'react';
import EmptyState from './EmptyState.jsx';
import { cancelRegistration } from '../api/client';

export default function RegistrationList({ registrations, onCancel }) {
  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState(null);

  if (!registrations || registrations.length === 0) {
    return <EmptyState title="No registrations yet" />;
  }

  const handleCancel = async (eventId, registrationId) => {
    try {
      setError(null);
      setCancelingId(registrationId);
      await cancelRegistration(eventId, registrationId);
      if (onCancel) {
        onCancel(registrationId);
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel registration');
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Registered</th>
              <th className="px-4 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r._id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 font-medium text-slate-900">{r.name}</td>
                <td className="px-4 py-2 text-slate-600">{r.email}</td>
                <td className="px-4 py-2 text-slate-500">
                  {new Date(r.registeredAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleCancel(r.eventId, r._id)}
                    disabled={cancelingId === r._id}
                    className="rounded border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    {cancelingId === r._id ? 'Canceling...' : 'Cancel'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}