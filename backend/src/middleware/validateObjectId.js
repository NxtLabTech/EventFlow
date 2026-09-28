const mongoose = require('mongoose');
const HttpError = require('../utils/HttpError');

// Malformed ids can never match an event, so answer 404 before touching the DB
function validateObjectId(...params) {
  return (req, res, next) => {
    for (const p of params) {
      const id = String(req.params[p]);
      if (id.length !== 24 || !mongoose.Types.ObjectId.isValid(id)) {
        return next(new HttpError(404, 'Event not found'));
      }
    }
    next();
  };
}

module.exports = validateObjectId;
