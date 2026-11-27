const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');
const { getAuthConfig } = require('./authConfig');

async function login(username, password) {
  const details = {};
  if (typeof username !== 'string' || !username.trim()) details.username = 'username is required';
  if (typeof password !== 'string' || !password) details.password = 'password is required';
  if (Object.keys(details).length) {
    throw new HttpError(400, 'Validation failed', details);
  }

  const config = getAuthConfig();
  const usernameOk = username.trim() === config.username;
  const passwordOk = await bcrypt.compare(password, config.passwordHash);

  // Same error either way so callers cannot probe which field failed.
  if (!usernameOk || !passwordOk) {
    throw new HttpError(401, 'Invalid username or password');
  }

  const token = jwt.sign(
    { role: 'organizer', username: config.username },
    config.jwtSecret,
    { expiresIn: config.tokenTtl },
  );

  return { token, tokenType: 'Bearer', expiresIn: config.tokenTtl };
}

function verifyOrganizerToken(token) {
  if (!token) {
    throw new HttpError(401, 'Authentication required');
  }

  try {
    const config = getAuthConfig();
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.role !== 'organizer') {
      throw new HttpError(401, 'Authentication required');
    }
    return payload;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(401, 'Invalid or expired token');
  }
}

module.exports = { login, verifyOrganizerToken };
