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
