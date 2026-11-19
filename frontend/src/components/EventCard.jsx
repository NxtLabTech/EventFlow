import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format.js';

export default function EventCard({ event }) {
  const hasCount = typeof event.registrationCount === 'number';
  const isFull = hasCount && event.registrationCount >= event.capacity;

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
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
        <span>
          Registrations: {hasCount ? event.registrationCount : '–'} / {event.capacity}
        </span>
        {isFull && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Full</span>
        )}
      </p>
      <p className="mt-1 text-xs text-slate-500">Organized by {event.organizer}</p>
    </Link>
  );
}
