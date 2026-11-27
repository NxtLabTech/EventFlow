const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'eventflow_organizer_token';

const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details || {}; // field -> message, from the backend validation
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  notify();
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  notify();
}

export function subscribeAuth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is the backend running?');
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON response; handled below
  }

  if (!res.ok) {
    throw new ApiError(res.status, body?.error || `Request failed (${res.status})`, body?.details);
  }
  return body;
}

const send = (method, path, data) =>
  request(path, { method, body: data === undefined ? undefined : JSON.stringify(data) });

export const api = {
  login: (username, password) => send('POST', '/auth/login', { username, password }),
  getStats: () => request('/stats'),
  listEvents: () => request('/events'),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (data) => send('POST', '/events', data),
  updateEvent: (id, data) => send('PUT', `/events/${id}`, data),
  deleteEvent: (id) => send('DELETE', `/events/${id}`),
  listRegistrations: (id) => request(`/events/${id}/registrations`),
  register: (id, data) => send('POST', `/events/${id}/register`, data),
};
