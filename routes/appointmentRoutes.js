const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Book appointment
router.post('/', appointmentController.bookAppointment);

module.exports = router;