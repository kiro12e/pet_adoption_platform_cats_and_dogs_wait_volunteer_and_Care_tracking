    const StaffService = require('../../services/staffServices');

    class StaffController {
    staffValidateEmail(staffEmail) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
        return re.test(String(staffEmail || '').toLowerCase());
    }

    staffValidatePhone(staffPhone) {
        const re = /^[+()\d\s-]{7,20}$/;
        return re.test(String(staffPhone || '').trim());
    }

    async staffSignUser(req, res) {
        const load = req.body || {};

        // validate input
        if (!this.handlerSignupValidate(load, res)) return;

        try {
        const service = new StaffService(load);
        await service.staffSignUp();
        return res.status(200).json({ success: true, message: 'Successful Signup' });
        } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Failed to Create Account'
        });
        }
    }

    handlerSignupValidate(service, res) {
        if (!service.staffFName || !service.staffLName || !service.staffPhone || !service.staffPassword) {
        res.status(400).json({ success: false, message: 'Please fill all required fields' });
        return false;
        }
        if (!this.staffValidateEmail(service.staffEmail)) {
        res.status(400).json({ success: false, message: 'Invalid email format' });
        return false;
        }
        if (!this.staffValidatePhone(service.staffPhone)) {
        res.status(400).json({ success: false, message: 'Invalid phone number format' });
        return false;
        }
        if (service.staffPhone.length !== 11) {
        res.status(400).json({ success: false, message: 'Phone number must be exactly 11 digits' });
        return false;
        }
        if (!service.staffPassword) {
        res.status(400).json({ success: false, message: 'Password is required' });
        return false;
        }
        if (service.staffPassword.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        return false;
        }
        return true;
    }

    async staffLoginUser(req, res) {
        const { staffEmail, staffPassword } = req.body || {};
        if (!staffEmail || !staffPassword) {
        return res.status(400).json({ success: false, message: 'Please enter your email and password' });
        }

        try {
        const service = new StaffService({ staffEmail, staffPassword });
        const result = await service.staffLogin();
        return res.status(200).json({ success: true, message: 'Login successful', ...result });
        } catch (err) {
        return res.status(err.status || 401).json({
            success: false,
            message: err.message || 'Failed to login your account'
        });
        }
    }
    }

    module.exports = StaffController;
