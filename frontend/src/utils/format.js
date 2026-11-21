// Dates are stored as UTC midnight, so always format in UTC to avoid off-by-one days.
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function toDateInput(iso) {
  return iso ? iso.slice(0, 10) : '';
}

export function isUpcomingEvent(eventOrDate, referenceDate = new Date()) {
  if (!eventOrDate) return false;
  let rawDate = eventOrDate;
  if (typeof eventOrDate === 'object' && !(eventOrDate instanceof Date)) {
    if (!eventOrDate.date) return false;
    rawDate = eventOrDate.date;
  }
  if (!rawDate) return false;

  const eventDateStr = toDateInput(
    typeof rawDate === 'string' ? rawDate : rawDate.toISOString?.() || ''
  );
  if (!eventDateStr) return false;

  const ref = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const nowUtc = ref.toISOString().slice(0, 10);
  const nowLocal = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}-${String(ref.getDate()).padStart(2, '0')}`;

  // Upcoming includes events scheduled for today (UTC or local) or later
  return eventDateStr >= nowUtc || eventDateStr >= nowLocal;
}

export function isPastEvent(eventOrDate, referenceDate = new Date()) {
  if (!eventOrDate) return false;
  let rawDate = eventOrDate;
  if (typeof eventOrDate === 'object' && !(eventOrDate instanceof Date)) {
    if (!eventOrDate.date) return false;
    rawDate = eventOrDate.date;
  }
  if (!rawDate) return false;
  return !isUpcomingEvent(eventOrDate, referenceDate);
}

