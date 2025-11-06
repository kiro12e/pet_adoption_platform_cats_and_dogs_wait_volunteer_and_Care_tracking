const volunteerService = require('../../services/volunteerService');
const bcrypt = require('bcryptjs');

class VolunteerController {
  // ✅ Helper validation methods
  validateEmail(volunteerEmail) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    return re.test(String(volunteerEmail || '').toLowerCase());
  }

  validatePhone(volunteerPhone) {
    const re = /^[+()\d\s-]{7,20}$/;
    return re.test(String(volunteerPhone || ''));
  }

  // ✅ Signup handler
  async volSignUser(req, res) {
    const load = req.body || {};
    if (!load.volunteerFName || !load.volunteerLName || !load.volunteerPhone || !load.volunteerPassword) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!this.validateEmail(load.volunteerEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (load.volunteerPhone && !this.validatePhone(load.volunteerPhone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    if (load.volunteerPhone.length !== 11) {
      return res.status(400).json({ success: false, message: 'Please enter exactly 11 digits' });
    }

    if (typeof load.volunteerPassword !== 'string' || load.volunteerPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    try {
      const service = new volunteerService(load);
      await service.volunteerSignUp();
      return res.status(200).json({ success: true, message: 'Successful signup' });
    } catch (err) {
      const status = err && err.status ? err.status : 500;
      return res.status(status).json({
        success: false,
        message: err && err.message ? err.message : 'Failed to create account'
      });
    }
  }

  // ✅ Login handler
  async volLoginUser(req, res) {
    const { volunteerEmail, volunteerPassword } = req.body || {};
    if (!volunteerEmail || !volunteerPassword) {
      return res.status(400).json({ success: false, message: 'Please enter your email and password' });
    }

    try {
      const service = new volunteerService();
      const result = await service.VolunteerLogin({ volunteerEmail, volunteerPassword });
      return res.status(200).json({ success: true, message: 'Login successful', ...result });
    } catch (err) {
      const status = err && err.status ? err.status : 401;
      return res.status(status).json({
        success: false,
        message: err && err.message ? err.message : 'Failed to login your account'
      });
    }
  }
}

module.exports = new VolunteerController();
