import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
  }`;

export default function Navbar() {
  return (
    <header className="bg-indigo-600 shadow">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-white">EventFlow</span>
        <div className="flex gap-1">
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
      </nav>
    </header>
  );
}
