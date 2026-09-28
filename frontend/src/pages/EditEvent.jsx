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
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit event</h1>
      <EventForm initialValues={event} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
