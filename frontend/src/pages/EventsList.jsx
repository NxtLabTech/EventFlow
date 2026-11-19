import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const SEARCH_DEBOUNCE_MS = 300;

export default function EventsList() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  // Wait until the user pauses typing before asking the backend.
  useEffect(() => {
    const id = setTimeout(() => setSearch(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const { data: events, loading, error, reload } = useFetch(() => api.listEvents(search), [search]);

  function clearSearch() {
    setQuery('');
    setSearch('');
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link to="/events/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          New Event
        </Link>
      </div>
      <div className="mb-6">
        <label htmlFor="event-search" className="sr-only">
          Search events
        </label>
        <input
          id="event-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          maxLength={100}
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}
      {events && events.length === 0 && search && (
        <EmptyState title={`No events match "${search}"`}>
          <button type="button" onClick={clearSearch} className="text-indigo-600 underline">
            Clear search
          </button>
        </EmptyState>
      )}
      {events && events.length === 0 && !search && (
        <EmptyState title="No events yet">
          <Link to="/events/new" className="text-indigo-600 underline">
            Create your first event
          </Link>
        </EmptyState>
      )}
      {events && events.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
