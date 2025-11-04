const express = require('express');
const { signUpUser, loginUser } = require('../../controller/userPetAdopter/authController');
const { volSignUser, volLoginUser} = require ('../../controller/userPetAdopter/authVolunteerController')

function createAuthRouter() {
  const router = express.Router();
  router.post('/signup', signUpUser, volSignUser);
  router.post('/login', loginUser, volLoginUser);
  return router;
}

module.exports = createAuthRouter;
