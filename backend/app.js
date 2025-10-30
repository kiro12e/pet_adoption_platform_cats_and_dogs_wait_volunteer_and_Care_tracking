const express = require('express');
const cors = require('cors');
const createAuthRouter = require('./routes/userPetAdopter/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/adopters', createAuthRouter());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
