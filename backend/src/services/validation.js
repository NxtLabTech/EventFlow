// Small hand-written validators. Each returns { errors, value }.
// `errors` maps field name -> message; `value` holds the cleaned input.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isString(v) {
  return typeof v === 'string';
}

function parseDate(str) {
  if (!isString(str) || !DATE_RE.test(str)) return null;
  const d = new Date(`${str}T00:00:00.000Z`);
  // Reject things like 2026-02-31 which JS would roll over
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== str) return null;
  return d;
}

function requiredText(body, field, max, errors, out) {
  const raw = body[field];
  if (!isString(raw) || raw.trim() === '') {
    errors[field] = `${field} is required`;
  } else if (raw.trim().length > max) {
    errors[field] = `${field} must be at most ${max} characters`;
  } else {
    out[field] = raw.trim();
  }
}

const MAX_CAPACITY = 100000;
// Plain decimal notation only: rejects "1e2", "0x10", "Infinity" and similar
// strings that Number() would otherwise silently accept.
const NUMERIC_RE = /^[+-]?\d+(\.\d+)?$/;

// Capacity must be a whole number between 1 and MAX_CAPACITY.
// Accepts a JSON number or a numeric string (HTML forms send strings).
function validateCapacity(raw) {
  if (raw === undefined || raw === null || (isString(raw) && raw.trim() === '')) {
    return { error: 'capacity is required' };
  }

  let num;
  if (typeof raw === 'number') num = raw;
  else if (isString(raw) && NUMERIC_RE.test(raw.trim())) num = Number(raw.trim());

  if (num === undefined || !Number.isFinite(num)) return { error: 'capacity must be a number' };
  if (!Number.isInteger(num)) return { error: 'capacity must be a whole number' };
  if (num < 1) return { error: 'capacity must be greater than 0' };
  if (num > MAX_CAPACITY) return { error: `capacity must be at most ${MAX_CAPACITY}` };
  return { value: num };
}

function validateEventInput(input) {
  const body = input && typeof input === 'object' ? input : {};
  const errors = {};
  const value = {};

  requiredText(body, 'title', 100, errors, value);
  requiredText(body, 'location', 200, errors, value);
  requiredText(body, 'organizer', 100, errors, value);

  if (body.description === undefined || body.description === null) {
    value.description = '';
  } else if (!isString(body.description) || body.description.trim().length > 2000) {
    errors.description = 'description must be text of at most 2000 characters';
  } else {
    value.description = body.description.trim();
  }

  if (body.date === undefined || body.date === '') {
    errors.date = 'date is required';
  } else {
    const d = parseDate(body.date);
    if (d) value.date = d;
    else errors.date = 'date must be a valid date in YYYY-MM-DD format';
  }

  if (body.time === undefined || body.time === '') {
    errors.time = 'time is required';
  } else if (!isString(body.time) || !TIME_RE.test(body.time)) {
    errors.time = 'time must be in HH:MM (24-hour) format';
  } else {
    value.time = body.time;
  }

  const capacity = validateCapacity(body.capacity);
  if (capacity.error) errors.capacity = capacity.error;
  else value.capacity = capacity.value;

  return { errors, value };
}

function validateRegistrationInput(input) {
  const body = input && typeof input === 'object' ? input : {};
  const errors = {};
  const value = {};

  requiredText(body, 'name', 100, errors, value);

  if (!isString(body.email) || body.email.trim() === '') {
    errors.email = 'email is required';
  } else if (body.email.trim().length > 254 || !EMAIL_RE.test(body.email.trim())) {
    errors.email = 'email must be a valid email address';
  } else {
    value.email = body.email.trim().toLowerCase();
  }

  return { errors, value };
}

module.exports = { validateEventInput, validateRegistrationInput };
