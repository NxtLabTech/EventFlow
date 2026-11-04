import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api/client.js';
import EventForm from '../components/EventForm.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import NotFound from './NotFound.jsx';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, loading, error, reload } = useFetch(() => api.getEvent(id), [id]);

  if (loading) return <Loading />;
  if (error?.status === 404) return <NotFound message="Event not found" />;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;

  async function handleSubmit(data) {
    await api.updateEvent(id, data);
    navigate(`/events/${id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Edit event</h1>
        <p className="mt-1 text-sm text-slate-500">Update the details and schedule for this event.</p>
      </div>
      <EventForm initialValues={event} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
