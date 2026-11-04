import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';

export default function NotFound({ message = 'Page not found' }) {
  return (
    <EmptyState title={message}>
      <Link
        to="/events"
        className="inline-flex min-h-[36px] items-center font-medium text-slate-900 underline hover:text-slate-700"
      >
        Back to events
      </Link>
    </EmptyState>
  );
}
