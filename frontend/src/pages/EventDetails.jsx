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

  const event = useFetch(() => api.getEvent(id), [id]);
  const regs = useFetch(() => api.listRegistrations(id), [id]);

  if (event.loading) return <Loading />;
  if (event.error?.status === 404) return <NotFound message="Event not found" />;
  if (event.error) return <ErrorMessage message={event.error.message} onRetry={event.reload} />;

  const e = event.data;
  const isFull = e.registrationCount >= e.capacity;

  async function handleDelete() {
    if (!window.confirm(`Delete "${e.title}" and all its registrations?`)) return;
    try {
      await api.deleteEvent(id);
      navigate('/events');
    } catch (err) {
      setDeleteError(err.message);
    }
  }

  function handleRegistered() {
    event.reload();
    regs.reload();
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Event Overview Section */}
      <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Event
              </span>
              {isFull && (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Full
                </span>
              )}
            </div>
            <h1 className="mt-1.5 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {e.title}
            </h1>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Link
              to={`/events/${id}/edit`}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:min-h-0 sm:flex-initial sm:py-1.5"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-xs transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 sm:min-h-0 sm:flex-initial sm:py-1.5"
            >
              Delete
            </button>
          </div>
        </div>

        {deleteError && (
          <div className="mt-4">
            <ErrorMessage message={deleteError} />
          </div>
        )}

        <p className="mt-4 break-words whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
          {e.description || 'No description provided.'}
        </p>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50/70 p-3 break-words">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">Date</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{formatDate(e.date)}</dd>
            </div>
            <div className="rounded-lg bg-slate-50/70 p-3 break-words">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">Time</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{e.time}</dd>
            </div>
            <div className="rounded-lg bg-slate-50/70 p-3 break-words">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">Location</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{e.location}</dd>
            </div>
            <div className="rounded-lg bg-slate-50/70 p-3 break-words">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">Organizer</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{e.organizer}</dd>
            </div>
            <div className="rounded-lg bg-slate-50/70 p-3 break-words sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">Registrations</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">
                {e.registrationCount} / {e.capacity}
                {isFull && <span className="ml-1.5 text-xs font-medium text-amber-700">(full)</span>}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Registration Section */}
      <RegistrationForm eventId={id} disabled={isFull} onRegistered={handleRegistered} />
      {isFull && (
        <p className="break-words rounded-lg border border-amber-200/80 bg-amber-50/70 p-3.5 text-sm font-medium text-amber-800">
          This event is full. Registration is closed.
        </p>
      )}

      {/* Participants List */}
      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight text-slate-900">Registered participants</h2>
        {regs.loading && <Loading />}
        {regs.error && <ErrorMessage message={regs.error.message} onRetry={regs.reload} />}
        {regs.data && <RegistrationList registrations={regs.data} />}
      </section>
    </div>
  );
}
