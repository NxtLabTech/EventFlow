import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format.js';

export default function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event._id}`}
      className="group flex min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:bg-slate-50"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="break-words text-base font-semibold text-slate-900 transition-colors group-hover:text-slate-700 sm:text-lg">
            {event.title}
          </h3>
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            Cap: {event.capacity}
          </span>
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-slate-600">
          <p className="flex items-center gap-2 break-words">
            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)} at {event.time}</span>
          </p>
          <p className="flex items-center gap-2 break-words">
            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="break-words text-xs text-slate-500">
          Organized by <span className="font-medium text-slate-700">{event.organizer}</span>
        </p>
      </div>
    </Link>
  );
}
