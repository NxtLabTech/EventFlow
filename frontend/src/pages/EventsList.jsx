import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function EventsList() {
  const { data: events, loading, error, reload } = useFetch(() => api.listEvents());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Events</h1>
          <p className="mt-1 text-sm text-slate-500">Discover and manage all scheduled community events.</p>
        </div>
        <Link
          to="/events/new"
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 sm:min-h-0 sm:w-auto sm:py-2"
        >
          New Event
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}

      {events && events.length === 0 && (
        <EmptyState title="No events yet">
          <Link
            to="/events/new"
            className="inline-flex min-h-[36px] items-center font-medium text-slate-900 underline hover:text-slate-700"
          >
            Create your first event
          </Link>
        </EmptyState>
      )}

      {events && events.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
