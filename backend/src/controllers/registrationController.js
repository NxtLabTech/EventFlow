const Registration = require('../models/Registration');
const HttpError = require('../utils/HttpError');
const { validateRegistrationInput } = require('../services/validation');
const { findEventOr404 } = require('./eventController');

async function registerParticipant(req, res) {
  const event = await findEventOr404(req.params.eventId);

  const { errors, value } = validateRegistrationInput(req.body);
  if (Object.keys(errors).length) throw new HttpError(400, 'Validation failed', errors);

  const existing = await Registration.exists({ eventId: event._id, email: value.email });
  if (existing) throw new HttpError(409, 'You are already registered for this event');

  const count = await Registration.countDocuments({ eventId: event._id });
  if (count >= event.capacity) throw new HttpError(409, 'Event is full');

  // A concurrent duplicate slips past the check above but is caught by the unique index.
  let registration;
  try {
    registration = await Registration.create({ ...value, eventId: event._id });
  } catch (err) {
    if (err.code === 11000) throw new HttpError(409, 'You are already registered for this event.');
    throw err;
  }

  res.status(201).json(registration);
}

async function listRegistrations(req, res) {
  const event = await findEventOr404(req.params.eventId);
  const registrations = await Registration.find({ eventId: event._id }).sort({ registeredAt: 1 });
  res.json(registrations);
}

module.exports = { registerParticipant, listRegistrations };
