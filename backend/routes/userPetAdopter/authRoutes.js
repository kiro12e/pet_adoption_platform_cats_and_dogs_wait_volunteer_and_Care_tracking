const express = require('express');
const { signUpUser, loginUser } = require('../../controller/userPetAdopter/authController');
const volunteerController = require('../../controller/volunteerController');

function createAuthRouter() {
  const router = express.Router();

  router.post('/signup', signUpUser, (req, res) => volunteerController.volSignUser(req, res));
  router.post('/login', loginUser, (req, res) => volunteerController.volLoginUser(req, res));

  return router;
}

module.exports = createAuthRouter;
