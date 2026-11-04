import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import StatCard from '../components/StatCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch(() => api.getStats());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your events, participants, and upcoming schedules.</p>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Events" value={data.totalEvents} />
          <StatCard label="Total Registrations" value={data.totalRegistrations} />
          <StatCard label="Upcoming Events" value={data.upcomingEvents} />
        </div>
      )}
    </div>
  );
}
