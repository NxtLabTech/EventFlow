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
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7"
    >
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">Register</h2>
      {success && (
        <p role="status" className="break-words rounded-lg border border-emerald-200/80 bg-emerald-50/70 p-3.5 text-sm text-emerald-800">
          Registration successful!
        </p>
      )}
      {formError && <ErrorMessage message={formError} />}
      <FormField label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} disabled={disabled} />
      <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} disabled={disabled} />
      <div className="pt-2">
        <button
          type="submit"
          disabled={disabled || submitting}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation sm:w-auto"
        >
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
}
