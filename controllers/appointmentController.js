const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, patientEmail, date, time } = req.body;
    
    // Validate input
    if (!doctorId || !patientName || !patientEmail || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check doctor exists
    // const queryId = new UUID(req.params.id).toBinary();
    // const doctor = await Doctor.findOne({ id: queryId });
    const doctor = await Doctor.findOne({ _id: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Validate date
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Check if doctor works on this day
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (!doctor.workingDays.includes(dayName)) {
      return res.status(400).json({ message: 'Doctor not available on this day' });
    }
    
    // Check if time slot is valid
    const [hours, minutes] = time.split(':').map(Number);
    if (hours < parseInt(doctor.startTime.split(':')[0]) || 
        hours > parseInt(doctor.endTime.split(':')[0]) ||
        (hours === parseInt(doctor.endTime.split(':')[0]) && 
         minutes > parseInt(doctor.endTime.split(':')[1]))) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }
    
    // Check if slot is available
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: 'booked'
    });
    
    if (existingAppointment) {
      return res.status(409).json({ message: 'Time slot already booked' });
    }
    
    // Create new appointment
    const newAppointment = new Appointment({
      doctorId,
      patientName,
      patientEmail,
      date: appointmentDate,
      time
    });
    
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};