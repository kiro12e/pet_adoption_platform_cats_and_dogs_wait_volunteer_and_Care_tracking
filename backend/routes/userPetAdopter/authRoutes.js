const express = require('express');
const { signUpUser } = require('../../controller/userPetAdopter/authController');

function createAuthRouter() {
  const router = express.Router();
  router.post('/signup', signUpUser);
  return router;
}

module.exports = createAuthRouter;
