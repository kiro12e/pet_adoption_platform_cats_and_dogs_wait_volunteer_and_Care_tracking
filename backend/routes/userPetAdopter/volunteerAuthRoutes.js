const express = require('express');
const VolunteerController = require('../../controller/userPetAdopter/volunteerController');

function createVolunteerAuthRouter() {
  const router = express.Router();
  const volunteerController = new VolunteerController();

  router.post('/signup', volunteerController.volSignUser.bind(volunteerController));
  router.post('/login', volunteerController.volLoginUser.bind(volunteerController));

  return router;
}

module.exports = createVolunteerAuthRouter;