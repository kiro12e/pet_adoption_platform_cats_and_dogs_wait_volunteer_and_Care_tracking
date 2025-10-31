const express = require('express');
const { signUpUser, loginUser } = require('../../controller/userPetAdopter/authController');

function createAuthRouter() {
  const router = express.Router();
  router.post('/signup', signUpUser);
  router.post('/login', loginUser);
  return router;
}

module.exports = createAuthRouter;
