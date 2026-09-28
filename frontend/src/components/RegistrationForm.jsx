import { useState } from 'react';
import { api } from '../api/client.js';
import FormField from './FormField.jsx';
import ErrorMessage from './ErrorMessage.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationForm({ eventId, disabled, onRegistered }) {
  const [values, setValues] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);

    const found = {};
    if (!values.name.trim()) found.name = 'Name is required';
    if (!EMAIL_RE.test(values.email.trim())) found.email = 'Enter a valid email address';
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await api.register(eventId, { name: values.name.trim(), email: values.email.trim() });
      setValues({ name: '', email: '' });
      setSuccess(true);
      onRegistered?.();
    } catch (err) {
      setErrors(err.details || {});
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold">Register</h2>
      {success && (
        <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          Registration successful!
        </p>
      )}
      {formError && <ErrorMessage message={formError} />}
      <FormField label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} disabled={disabled} />
      <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} disabled={disabled} />
      <button
        type="submit"
        disabled={disabled || submitting}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
