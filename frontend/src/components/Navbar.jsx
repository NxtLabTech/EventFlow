import { useSyncExternalStore } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken, getToken, subscribeAuth } from '../api/client.js';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = Boolean(useSyncExternalStore(subscribeAuth, getToken, () => null));

  function handleLogout() {
    clearToken();
    navigate('/events');
  }

  return (
    <header className="bg-indigo-600 shadow">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-white">EventFlow</span>
        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/events" end className={linkClass}>
            Events
          </NavLink>
          {loggedIn && (
            <NavLink to="/events/new" className={linkClass}>
              New Event
            </NavLink>
          )}
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-500"
            >
              Log out
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Organizer login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
