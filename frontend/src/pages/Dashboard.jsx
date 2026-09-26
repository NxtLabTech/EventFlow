import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import StatCard from '../components/StatCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch(() => api.getStats());

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      {loading && <Loading />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}
      {data && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Events" value={data.totalEvents} />
          <StatCard label="Total Registrations" value={data.totalRegistrations} />
          <StatCard label="Upcoming Events" value={data.upcomingEvents} />
        </div>
      )}
    </div>
  );
}
