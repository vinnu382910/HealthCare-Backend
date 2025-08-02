const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const appointmentSchema = new mongoose.Schema({
  id: { 
    type: String, 
    default: uuidv4,
    unique: true 
  },
  doctorId: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  status: { 
    type: String, 
    default: 'booked',
    enum: ['booked', 'cancelled', 'completed'] 
  },
  notes: {  // NEW: For special requirements
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for faster queries
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });
appointmentSchema.index({ patientId: 1 });  // NEW: For patient queries

module.exports = mongoose.model('Appointment', appointmentSchema);