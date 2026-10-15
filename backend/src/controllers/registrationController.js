const Registration = require('../models/Registration');
const HttpError = require('../utils/HttpError');
const { validateRegistrationInput } = require('../services/validation');
const { findEventOr404 } = require('./eventController');

async function registerParticipant(req, res) {
  const event = await findEventOr404(req.params.eventId);

  const { errors, value } = validateRegistrationInput(req.body);
  if (Object.keys(errors).length) throw new HttpError(400, 'Validation failed', errors);

  const existing = await Registration.exists({ eventId: event._id, email: value.email });
  if (existing) throw new HttpError(409, 'This email is already registered for this event');

  const count = await Registration.countDocuments({ eventId: event._id });
  if (count >= event.capacity) throw new HttpError(409, 'Event is full');

  // The unique index turns a concurrent duplicate into a 409 via the error handler.
  const registration = await Registration.create({ ...value, eventId: event._id });
  res.status(201).json(registration);
}
async function listRegistrations(req, res) {
  const event = await findEventOr404(req.params.eventId);
  const registrations = await Registration.find({ eventId: event._id }).sort({ registeredAt: 1 });
  res.json(registrations);
}

function escapeCsvValue(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

async function exportRegistrationsCsv(req, res) {
  const event = await findEventOr404(req.params.eventId);
  const registrations = await Registration.find({ eventId: event._id }).sort({ registeredAt: 1 });

  const headers = ['Participant Name', 'Email', 'Event Name', 'Registration Date'];
  const rows = [headers.map(escapeCsvValue).join(',')];

  for (const reg of registrations) {
    const regDate = reg.registeredAt ? reg.registeredAt.toISOString() : '';
    rows.push(
      [
        escapeCsvValue(reg.name),
        escapeCsvValue(reg.email),
        escapeCsvValue(event.title),
        escapeCsvValue(regDate),
      ].join(',')
    );
  }

  const csvContent = rows.join('\r\n');
  const safeTitle = event.title.toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'event';
  const filename = `${safeTitle}-registrations.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csvContent);
}

module.exports = { registerParticipant, listRegistrations, exportRegistrationsCsv };
