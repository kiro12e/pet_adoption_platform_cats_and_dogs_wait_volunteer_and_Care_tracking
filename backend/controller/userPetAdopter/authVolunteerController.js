const VolunteerService = require('../../services/volunteerService');

class VolunteerController {
  validateEmail(volunteerEmail) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    return re.test(String(volunteerEmail || '').toLowerCase());
  }

  validatePhone(volunteerPhone) {
    const re = /^[+()\d\s-]{7,20}$/;
    return re.test(String(volunteerPhone || ''));
  }

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
      const service = new VolunteerService(load);
      await service.volunteerSignUp();
      return res.status(200).json({ success: true, message: 'Successful signup' });
    } catch (err) {
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Failed to create account'
      });
    }
  }

  async volLoginUser(req, res) {
    const { volunteerEmail, volunteerPassword } = req.body || {};
    if (!volunteerEmail || !volunteerPassword) {
      return res.status(400).json({ success: false, message: 'Please enter your email and password' });
    }

    try {
      const service = new VolunteerService();
      const result = await service.VolunteerLogin({ volunteerEmail, volunteerPassword });
      return res.status(200).json({ success: true, message: 'Login successful', ...result });
    } catch (err) {
      return res.status(err.status || 401).json({
        success: false,
        message: err.message || 'Failed to login your account'
      });
    }
  }
}

module.exports = VolunteerController;