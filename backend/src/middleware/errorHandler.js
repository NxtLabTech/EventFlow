const HttpError = require('../utils/HttpError');

function notFound(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Centralized error handler. Never leaks stack traces; details only outside production.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  if (err instanceof HttpError) {
    const body = { error: err.message };
    if (err.details) body.details = err.details;
    return res.status(err.status).json(body);
  }
  if (err.name === 'ValidationError') {
    const details = {};
    for (const [key, val] of Object.entries(err.errors || {})) {
      details[key] = val.message;
    }
    return res.status(400).json({ error: 'Validation failed', details });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: { [err.path]: `${err.path} must be a valid number` },
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate entry' });
  }

  console.error(err);
  const body = { error: 'Internal server error' };
  if (process.env.NODE_ENV !== 'production') body.message = err.message;
  res.status(500).json(body);
}

module.exports = { notFound, errorHandler };
