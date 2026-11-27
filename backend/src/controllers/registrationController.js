const Event = require('../models/Event');
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

  const reservedEvent = await Event.findOneAndUpdate(
    {
      _id: event._id,
      $expr: { $lt: [{ $ifNull: ['$registeredCount', 0] }, '$capacity'] },
    },
    { $inc: { registeredCount: 1 } },
    { returnDocument: 'after' }
  );

  if (!reservedEvent) {
    const stillExists = await Event.exists({ _id: event._id });
    if (!stillExists) throw new HttpError(404, 'Event not found');
    throw new HttpError(409, 'Event is full');
  }

  let registration;
  try {
    registration = await Registration.create({ ...value, eventId: event._id });
  } catch (err) {
    await Event.updateOne(
      { _id: event._id, registeredCount: { $gt: 0 } },
      { $inc: { registeredCount: -1 } }
    );
    if (err.code === 11000) {
      throw new HttpError(409, 'This email is already registered for this event');
    }
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
