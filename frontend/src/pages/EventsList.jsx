import { Link, useLocation } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function EventsList() {
  const location = useLocation();
  const successMessage = location.state?.message;
  const { data: events, loading, error, reload } = useFetch(() => api.listEvents());

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link to="/events/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          New Event
        </Link>
      </div>
      {successMessage && (
        <p role="status" className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          {successMessage}
        </p>
      )}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
