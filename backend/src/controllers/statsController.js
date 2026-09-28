const Event = require('../models/Event');
const Registration = require('../models/Registration');

function startOfTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

async function getStats(req, res) {
  const [totalEvents, totalRegistrations, upcomingEvents] = await Promise.all([
    Event.countDocuments(),
    Registration.countDocuments(),
    Event.countDocuments({ date: { $gte: startOfTodayUTC() } }),
  ]);
  res.json({ totalEvents, totalRegistrations, upcomingEvents });
}

module.exports = { getStats };
