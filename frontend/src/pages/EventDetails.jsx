import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import RegistrationForm from '../components/RegistrationForm.jsx';
import RegistrationList from '../components/RegistrationList.jsx';
import NotFound from './NotFound.jsx';
import { formatDate } from '../utils/format.js';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const event = useFetch(() => api.getEvent(id), [id]);
  const regs = useFetch(() => api.listRegistrations(id), [id]);

  if (event.loading) return <Loading />;
  if (event.error?.status === 404) return <NotFound message="Event not found" />;
  if (event.error) return <ErrorMessage message={event.error.message} onRetry={event.reload} />;

  const e = event.data;
  const isFull = e.registrationCount >= e.capacity;

  async function handleConfirmDelete() {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await api.deleteEvent(id);
      setDeleteSuccess('Event deleted successfully');
      setShowDeleteConfirm(false);
      navigate('/events', { state: { message: 'Event deleted successfully' } });
    } catch (err) {
      setDeleteError(err.message);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleRegistered() {
    event.reload();
    regs.reload();
  }

  return (
    <div className="space-y-8">
      {deleteSuccess && (
        <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {deleteSuccess}
        </p>
      )}

      <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{e.title}</h1>
          <div className="flex gap-2">
            <Link to={`/events/${id}/edit`} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
        {deleteError && <div className="mt-3"><ErrorMessage message={deleteError} /></div>}
        <p className="mt-3 text-slate-600">{e.description || 'No description provided.'}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="inline font-medium">Date: </dt><dd className="inline">{formatDate(e.date)}</dd></div>
          <div><dt className="inline font-medium">Time: </dt><dd className="inline">{e.time}</dd></div>
          <div><dt className="inline font-medium">Location: </dt><dd className="inline">{e.location}</dd></div>
          <div><dt className="inline font-medium">Organizer: </dt><dd className="inline">{e.organizer}</dd></div>
          <div>
            <dt className="inline font-medium">Registrations: </dt>
            <dd className="inline">{e.registrationCount} / {e.capacity}{isFull && ' (full)'}</dd>
          </div>
        </dl>
      </section>

      {showDeleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 id="dialog-title" className="text-lg font-semibold text-slate-900">
              Delete Event
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this event?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <RegistrationForm eventId={id} disabled={isFull} onRegistered={handleRegistered} />
      {isFull && <p className="text-sm text-amber-700">This event is full. Registration is closed.</p>}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Registered participants</h2>
        {regs.loading && <Loading />}
        {regs.error && <ErrorMessage message={regs.error.message} onRetry={regs.reload} />}
        {regs.data && <RegistrationList registrations={regs.data} />}
      </section>
    </div>
  );
}
