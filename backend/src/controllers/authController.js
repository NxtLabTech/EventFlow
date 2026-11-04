const { login } = require('../services/authService');

async function loginOrganizer(req, res) {
  const { username, password } = req.body || {};
  const result = await login(username, password);
  res.json(result);
}

module.exports = { loginOrganizer };
