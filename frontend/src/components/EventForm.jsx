import { useState } from 'react';
import FormField from './FormField.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import { toDateInput } from '../utils/format.js';

const empty = { title: '', description: '', date: '', time: '', location: '', organizer: '', capacity: '' };

export function validateEvent(v) {
  const errors = {};
  if (!v.title.trim()) errors.title = 'Title is required';
  else if (v.title.trim().length > 100) errors.title = 'Title must be at most 100 characters';
  if (!v.date) errors.date = 'Date is required';
  if (!v.time) errors.time = 'Time is required';
  if (!v.location.trim()) errors.location = 'Location is required';
  if (!v.organizer.trim()) errors.organizer = 'Organizer is required';
  const cap = Number(v.capacity);
  if (v.capacity === '' || !Number.isInteger(cap) || cap < 1) {
    errors.capacity = 'Capacity must be a positive whole number';
  }
  return errors;
}

// Used for both creating and editing. `onSubmit` receives the cleaned values
// and may throw an ApiError (its `details` are shown next to the fields).
export default function EventForm({ initialValues, onSubmit, submitLabel = 'Save event' }) {
  const [values, setValues] = useState(
    initialValues ? { ...empty, ...initialValues, date: toDateInput(initialValues.date) } : empty
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        date: values.date,
        time: values.time,
        location: values.location.trim(),
        organizer: values.organizer.trim(),
        capacity: Number(values.capacity),
      });
    } catch (err) {
      setErrors(err.details || {});
      setFormError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7"
    >
      {formError && <ErrorMessage message={formError} />}
      <FormField label="Title" name="title" value={values.title} onChange={handleChange} error={errors.title} />
      <FormField
        label="Description"
        name="description"
        as="textarea"
        rows={3}
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Date" name="date" type="date" value={values.date} onChange={handleChange} error={errors.date} />
        <FormField label="Time" name="time" type="time" value={values.time} onChange={handleChange} error={errors.time} />
      </div>
      <FormField label="Location" name="location" value={values.location} onChange={handleChange} error={errors.location} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Organizer" name="organizer" value={values.organizer} onChange={handleChange} error={errors.organizer} />
        <FormField
          label="Capacity"
          name="capacity"
          type="number"
          min="1"
          value={values.capacity}
          onChange={handleChange}
          error={errors.capacity}
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation sm:w-auto"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
