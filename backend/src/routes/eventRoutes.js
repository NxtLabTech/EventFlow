const express = require('express');
const events = require('../controllers/eventController');
const registrations = require('../controllers/registrationController');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.route('/').get(events.listEvents).post(events.createEvent);
router
  .route('/:id')
  .all(validateObjectId('id'))
  .get(events.getEvent)
  .put(events.updateEvent)
  .delete(events.deleteEvent);

router.post('/:eventId/register', validateObjectId('eventId'), registrations.registerParticipant);
router.get('/:eventId/registrations', validateObjectId('eventId'), registrations.listRegistrations);

module.exports = router;
