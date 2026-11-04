const express = require('express');
const events = require('../controllers/eventController');
const registrations = require('../controllers/registrationController');
const validateObjectId = require('../middleware/validateObjectId');
const requireOrganizer = require('../middleware/requireOrganizer');

const router = express.Router();

router.route('/').get(events.listEvents).post(requireOrganizer, events.createEvent);
router
  .route('/:id')
  .all(validateObjectId('id'))
  .get(events.getEvent)
  .put(requireOrganizer, events.updateEvent)
  .delete(requireOrganizer, events.deleteEvent);

router.post('/:eventId/register', validateObjectId('eventId'), registrations.registerParticipant);
router.get(
  '/:eventId/registrations',
  validateObjectId('eventId'),
  requireOrganizer,
  registrations.listRegistrations,
);

module.exports = router;
