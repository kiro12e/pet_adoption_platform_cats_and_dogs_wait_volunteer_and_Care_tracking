const express = require('express');
const StaffController = require('../../controller/userPetAdopter/authStaffController');

function createStaffAuthRouter() {
  const router = express.Router();
  const staffController = new StaffController();

  router.post('/signup', staffController.staffSignUser.bind(staffController));
  router.post('/login', staffController.staffLoginUser.bind(staffController));

  return router;
}

module.exports = createStaffAuthRouter;
