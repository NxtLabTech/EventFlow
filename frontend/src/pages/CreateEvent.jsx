import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getToken } from '../api/client.js';
import EventForm from '../components/EventForm.jsx';

export default function CreateEvent() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) navigate('/login', { replace: true, state: { from: '/events/new' } });
  }, [navigate]);

  async function handleSubmit(data) {
    try {
      const created = await api.createEvent(data);
      navigate(`/events/${created._id}`);
    } catch (err) {
      if (err.status === 401) {
        navigate('/login', { state: { from: '/events/new' } });
        throw err;
      }
      throw err;
    }
  }

  if (!getToken()) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Create event</h1>
      <EventForm onSubmit={handleSubmit} submitLabel="Create event" />
    </div>
  );
}
