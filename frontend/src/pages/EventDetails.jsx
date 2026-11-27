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
  const [exportError, setExportError] = useState(null);
  const [exporting, setExporting] = useState(false);

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

  async function handleExport() {
    setExporting(true);
    setExportError(null);
    try {
      const { blob, filename } = await api.exportRegistrations(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err.message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{e.title}</h1>
          <div className="flex gap-2">
            <Link to={`/events/${id}/edit`} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
              Edit
            </Link>
            <button onClick={handleDelete} className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
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

      <RegistrationForm eventId={id} disabled={isFull} onRegistered={handleRegistered} />
      {isFull && <p className="text-sm text-amber-700">This event is full. Registration is closed.</p>}

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Registered participants</h2>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
        {exportError && <div className="mb-3"><ErrorMessage message={exportError} /></div>}
        {regs.loading && <Loading />}
        {regs.error && <ErrorMessage message={regs.error.message} onRetry={regs.reload} />}
        {regs.data && <RegistrationList registrations={regs.data} />}
      </section>
    </div>
  );
}
