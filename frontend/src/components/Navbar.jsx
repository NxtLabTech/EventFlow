import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const linkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="bg-indigo-600 shadow">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <span className="text-lg font-bold text-white">EventFlow</span>
        <button
          type="button"
          className="hidden min-h-11 min-w-11 items-center justify-center rounded-md text-indigo-100 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white max-[374px]:flex"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className="text-xl">{menuOpen ? '×' : '☰'}</span>
        </button>
        <div className="flex gap-1 max-[374px]:hidden">
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
        {menuOpen && (
          <div id="mobile-navigation" className="basis-full max-[374px]:block">
            <div className="mt-2 flex flex-col gap-1 border-t border-indigo-500 pt-2">
              <NavLink to="/" end className={linkClass} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/events" end className={linkClass} onClick={closeMenu}>
                Events
              </NavLink>
              <NavLink to="/events/new" className={linkClass} onClick={closeMenu}>
                New Event
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
