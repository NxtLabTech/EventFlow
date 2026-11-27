const HttpError = require('../utils/HttpError');
const { verifyOrganizerToken } = require('../services/authService');

function requireOrganizer(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return next(new HttpError(401, 'Authentication required'));
  }

  try {
    req.organizer = verifyOrganizerToken(token);
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = requireOrganizer;
