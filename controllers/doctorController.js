const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const generateTimeSlots = require('../utils/timeSlotGenerator');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    // const queryId = new UUID(req.params.id).toBinary();
    // const doctor = await Doctor.findOne({ id: queryId });
    const doctor = await Doctor.findOne({ _id: req.params.id });
    console.log(doctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available time slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    
    // const queryId = new UUID(req.params.id).toBinary();
    // const doctor = await Doctor.findOne({ id: queryId });
    const doctor = await Doctor.findOne({ _id: req.params.id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Check if date is valid
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Check if doctor works on this day
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (!doctor.workingDays.includes(dayName)) {
      return res.json({ slots: [] }); // No availability
    }
    
    // Get existing appointments
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const appointments = await Appointment.find({
      doctorId: doctor.id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'booked'
    });
    
    const bookedSlots = appointments.map(a => a.time);
    
    // Generate available slots
    const slots = generateTimeSlots(
      doctor.startTime,
      doctor.endTime,
      doctor.appointmentDuration,
      bookedSlots
    );
    
    res.json({ slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};