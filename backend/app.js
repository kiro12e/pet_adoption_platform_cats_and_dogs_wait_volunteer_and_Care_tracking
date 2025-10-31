const express = require('express');
const cors = require('cors');
require('dotenv').config();
const createAuthRouter = require('./routes/userPetAdopter/authRoutes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api/adopters', createAuthRouter());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
