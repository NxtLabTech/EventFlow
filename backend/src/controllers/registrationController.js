const mongoose = require('mongoose');
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

async function cancelRegistration(req, res) {
  const event = await findEventOr404(req.params.eventId);
  const identifier = req.params.registrationId || (req.body && req.body.email);

  if (!identifier) {
    throw new HttpError(400, 'Registration ID or email is required');
  }

  let registration = null;
  const strId = String(identifier).trim();

  if (mongoose.Types.ObjectId.isValid(strId) && strId.length === 24) {
    registration = await Registration.findOne({ _id: strId, eventId: event._id });
  }

  if (!registration) {
    registration = await Registration.findOne({ email: strId.toLowerCase(), eventId: event._id });
  }

  if (!registration) {
    throw new HttpError(404, 'Registration not found');
  }

  await registration.deleteOne();
  res.json({ message: 'Registration cancelled' });
}

module.exports = { registerParticipant, listRegistrations, cancelRegistration };
