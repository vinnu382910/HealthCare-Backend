const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Get doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Get available time slots
router.get('/:id/availability', doctorController.getAvailableSlots);

module.exports = router;