function requireEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`${name} is not configured. Copy backend/.env.example to .env and set it.`);
  }
  return String(value).trim();
}

function getAuthConfig() {
  return {
    username: requireEnv('ORGANIZER_USERNAME'),
    passwordHash: requireEnv('ORGANIZER_PASSWORD_HASH'),
    jwtSecret: requireEnv('JWT_SECRET'),
    tokenTtl: process.env.JWT_EXPIRES_IN || '8h',
  };
}

module.exports = { getAuthConfig };
