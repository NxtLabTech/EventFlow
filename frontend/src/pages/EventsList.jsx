import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function EventsList() {
  const [search, setSearch] = useState('');
  const { data: events, loading, error, reload } = useFetch(() => api.listEvents(search), [search]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link to="/events/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          New Event
        </Link>
      </div>

      <div className="mb-6 flex max-w-md gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          aria-label="Search events"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>
        )}
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}

      {!loading && events && events.length === 0 && (
        search.trim() ? (
          <EmptyState title={`No events found matching "${search.trim()}"`}>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-indigo-600 underline"
            >
              Clear search
            </button>
          </EmptyState>
        ) : (
          <EmptyState title="No events yet">
            <Link to="/events/new" className="text-indigo-600 underline">
              Create your first event
            </Link>
          </EmptyState>
        )
      )}

      {!loading && events && events.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
