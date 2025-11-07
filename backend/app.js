const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const createAuthRouter = require('./routes/userPetAdopter/authRoutes');
// COMMENT MUNA:
const createStaffAuthRouter = require('./routes/userPetAdopter/staffAuthRoutes');
// const createVolunteerAuthRouter = require('./routes/userPetAdopter/volunteerAuthRoutes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Serve static files from the 'frontend' directory
app.use(express.static('frontend'));

// Serve the index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use('/api/adopters', createAuthRouter());
// COMMENT MUNA:
app.use('/api/staff', createStaffAuthRouter());
// app.use('/api/volunteers', createVolunteerAuthRouter());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
