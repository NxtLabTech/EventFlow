import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function EventsList() {
  const { data: events, loading, error, reload } = useFetch(() => api.listEvents());
  const [filter, setFilter] = useState('all');

  const today = new Date().toISOString().slice(0, 10);

  const filteredEvents = (events || []).filter((e) => {
    const eventDate = e.date ? String(e.date).slice(0, 10) : '';
    if (filter === 'upcoming') {
      return eventDate >= today;
    }
    if (filter === 'past') {
      return eventDate < today;
    }
    return true;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link to="/events/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          New Event
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}

      {events && events.length === 0 && (
        <EmptyState title="No events yet">
          <Link to="/events/new" className="text-indigo-600 underline">
            Create your first event
          </Link>
        </EmptyState>
      )}

      {events && events.length > 0 && (
        <>
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
              aria-pressed={filter === 'all'}
            >
              All Events
            </button>
            <button
              type="button"
              onClick={() => setFilter('upcoming')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
              aria-pressed={filter === 'upcoming'}
            >
              Upcoming Events
            </button>
            <button
              type="button"
              onClick={() => setFilter('past')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === 'past'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
              aria-pressed={filter === 'past'}
            >
              Past Events
            </button>
          </div>

          {filteredEvents.length === 0 ? (
            <EmptyState
              title={
                filter === 'upcoming'
                  ? 'No upcoming events'
                  : filter === 'past'
                  ? 'No past events'
                  : 'No events available'
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((e) => (
                <EventCard key={e._id} event={e} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
