const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const doctorSchema = new mongoose.Schema({
  id: { 
    type: String, 
    default: uuidv4,
    unique: true
  },
  name: { 
    type: String, 
    required: true 
  },
  specialization: { 
    type: String, 
    required: true 
  },
  profileImage: { 
    type: String 
  },
  workingDays: { 
    type: [String], 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: { 
    type: String, 
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/ 
  },
  endTime: { 
    type: String, 
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  appointmentDuration: { 
    type: Number, 
    default: 30,
    min: 10,
    max: 120
  }
});

const Doctor = mongoose.model('doctors', doctorSchema);
module.exports = Doctor;