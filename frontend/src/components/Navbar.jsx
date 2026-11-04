import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-slate-900 text-white shadow-xs'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors ${
    isActive
      ? 'bg-slate-900 text-white shadow-xs'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 transition hover:opacity-90"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-xs"
            >
              EF
            </span>
            <span>EventFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden gap-1 sm:flex sm:items-center">
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

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:hidden"
          >
            {isOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div id="mobile-menu" className="space-y-1 border-t border-slate-100 py-3 sm:hidden">
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
