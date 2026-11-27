import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api, getToken } from '../api/client.js';
import EventForm from '../components/EventForm.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import NotFound from './NotFound.jsx';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, loading, error, reload } = useFetch(() => api.getEvent(id), [id]);

  useEffect(() => {
    if (!getToken()) navigate('/login', { replace: true, state: { from: `/events/${id}/edit` } });
  }, [navigate, id]);

  if (!getToken()) return null;
  if (loading) return <Loading />;
  if (error?.status === 404) return <NotFound message="Event not found" />;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;

  async function handleSubmit(data) {
    try {
      await api.updateEvent(id, data);
      navigate(`/events/${id}`);
    } catch (err) {
      if (err.status === 401) {
        navigate('/login', { state: { from: `/events/${id}/edit` } });
        throw err;
      }
      throw err;
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit event</h1>
      <EventForm initialValues={event} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
