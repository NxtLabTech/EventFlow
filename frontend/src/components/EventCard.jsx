import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format.js';

export default function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event._id}`}
      className="block rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
      <p className="mt-1 text-sm text-slate-600">
        {formatDate(event.date)} at {event.time}
      </p>
      <p className="text-sm text-slate-600">{event.location}</p>
      <p className="mt-3 text-xs text-slate-500">
        Organized by {event.organizer} · Capacity {event.capacity}
      </p>
    </Link>
  );
}
