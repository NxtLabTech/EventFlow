import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import EventForm from '../components/EventForm.jsx';

export default function CreateEvent() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    const created = await api.createEvent(data);
    navigate(`/events/${created._id}`);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Create event</h1>
      <EventForm onSubmit={handleSubmit} submitLabel="Create event" />
    </div>
  );
}
