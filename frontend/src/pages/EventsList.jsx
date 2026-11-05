import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { isUpcomingEvent, isPastEvent } from '../utils/format.js';

const FILTERS = [
  { id: 'all', label: 'All Events' },
  { id: 'upcoming', label: 'Upcoming Events' },
  { id: 'past', label: 'Past Events' },
];

export default function EventsList() {
  const { data: events, loading, error, reload } = useFetch(() => api.listEvents());
  const [filter, setFilter] = useState('all');

  const filteredEvents = (events || []).filter((e) => {
    if (filter === 'upcoming') return isUpcomingEvent(e);
    if (filter === 'past') return isPastEvent(e);
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

      {!loading && !error && events && (
        <>
          <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Event filters">
            {FILTERS.map((f) => {
              const isSelected = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {filteredEvents.length === 0 ? (
            <EmptyState
              title={
                filter === 'upcoming'
                  ? 'No upcoming events'
                  : filter === 'past'
                  ? 'No past events'
                  : 'No events yet'
              }
            >
              {filter === 'all' && events.length === 0 ? (
                <Link to="/events/new" className="text-indigo-600 underline">
                  Create your first event
                </Link>
              ) : (
                <p>No events found for this filter.</p>
              )}
            </EmptyState>
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

