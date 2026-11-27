const express = require('express');
const { loginOrganizer } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginOrganizer);

module.exports = router;
