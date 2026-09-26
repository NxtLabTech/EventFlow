import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';

export default function NotFound({ message = 'Page not found' }) {
  return (
    <EmptyState title={message}>
      <Link to="/events" className="text-indigo-600 underline">
        Back to events
      </Link>
    </EmptyState>
  );
}
