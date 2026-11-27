import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, setToken } from '../api/client.js';
import FormField from '../components/FormField.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function onChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { token } = await api.login(values.username.trim(), values.password);
      setToken(token);
      navigate(location.state?.from || '/events', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">Organizer login</h1>
      <p className="mb-6 text-sm text-slate-600">
        Sign in to create, edit, or delete events and view registrations.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Username" name="username" value={values.username} onChange={onChange} required />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          required
        />
        {error && <ErrorMessage message={error} />}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
