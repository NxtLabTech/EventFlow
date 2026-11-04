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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Create event</h1>
        <p className="mt-1 text-sm text-slate-500">Fill in the details below to publish a new event.</p>
      </div>
      <EventForm onSubmit={handleSubmit} submitLabel="Create event" />
    </div>
  );
}
