require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});