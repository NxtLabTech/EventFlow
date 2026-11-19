import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2.5 text-base font-medium transition ${
    isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
  }`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-indigo-600 shadow">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-white hover:text-indigo-100">
            EventFlow
          </Link>
          <div className="hidden sm:flex sm:items-center sm:gap-1">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/events" end className={linkClass}>
              Events
            </NavLink>
            <NavLink to="/events/new" className={linkClass}>
              New Event
            </NavLink>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            className="inline-flex items-center justify-center rounded-md p-2 text-indigo-100 hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white sm:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="mt-2 space-y-1 border-t border-indigo-500 pt-2 pb-1 sm:hidden">
            <NavLink to="/" end className={mobileLinkClass} onClick={() => setIsOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/events" end className={mobileLinkClass} onClick={() => setIsOpen(false)}>
              Events
            </NavLink>
            <NavLink to="/events/new" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
              New Event
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
