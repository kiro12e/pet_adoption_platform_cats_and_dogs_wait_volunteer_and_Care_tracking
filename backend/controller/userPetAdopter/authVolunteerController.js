const { json } = require('express');
const volunteerService = require('../../services/volunteerService');
const volunteerRepository = require('../../repositories/volunteerRepository');
const bcrypt = require('bcrypt');
const repo = new volunteerRepository(dbPool); // Create instance of repository

class Volunteer {
    constructor(load) {
        this.load = load || {};
    }

    // Check if email format is valid
    validateEmail(volunteerEmail) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
        return re.test(String(volunteerEmail || '').toLowerCase());
    }

    // Check if phone number format is valid (allows +, -, (), space)
    validatePhone(volunteerPhone) {
        const re = /^[+()\d\s-]{7,20}$/;
        return re.test(String(volunteerPhone || ''));
    }

    // User signup logic
    async volSignUpUser(req, res) {
        const load = req.body || {};

        // Check if may kulang na fields
        if (!load.volunteerFName || !load.volunteerLName || !load.volunteerPhone || !load.volunteerPassword) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Validate email format
        if (!this.validateEmail(load.volunteerEmail)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        // Validate phone format
        if (load.volunteerPhone && !this.validatePhone(load.volunteerPhone)) {
            return res.status(400).json({ success: false, message: 'Invalid phone number' });
        }

        // Check kung 11 digits lang ang phone number
        if (load.volunteerPhone.length !== 11) {
            return res.status(400).json({ success: false, message: 'Please enter exactly 11 digits' });
        }

        // Password check — dapat string at at least 6 characters
        if (typeof load.volunteerPassword !== 'string' || load.volunteerPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        // Continue process kung pasado lahat
        this.handleVolunteerSignUpUser(load, res);
    }

    // Handles the saving or creating of volunteer account
    async handleVolunteerSignUpUser(load, res) {
        try {
            const { volunteerId } = await volunteerService.volunteerSignup(load);
            return res.status(200).json({ success: true, message: 'Successful signup', volunteerId });
        } catch (err) {
            const status = err && err.status ? err.status : 500;
            return res.status(status).json({
                success: false,
                message: err && err.message ? err.message : 'Failed to create account'
            });
        }
    }

    // User login logic
    async volLoginUser(req, res) {
        const { volunteerEmail, volunteerPassword } = req.body || {};

        // Check kung may laman ang email at password
        if (!volunteerEmail || !volunteerPassword) {
            return res.status(400).json({ success: false, message: 'Please enter your email and password' });
        }

        // Check if user exists
        const user = await repo.findAdopterByEmail(null, volunteerEmail);
        if (!user) return res.status(401).json({ success: false, message: 'Incorrect Email' });

        // Compare password with bcrypt
        const match = await bcrypt.compare(volunteerPassword, user.volunteerPassword);
        if (!match) return res.status(401).json({ success: false, message: 'Incorrect Password' });

        this.handleVolLoginUser(user, res);
    }

    // Handles successful login response
    async handleVolLoginUser(load, res) {
        try {
            const { volunteerId } = await volunteerService.volunteerLogin(load);
            return res.status(200).json({ success: true, message: 'Please wait...', volunteerId });
        } catch (err) {
            const status = err && err.status ? err.status : 500;
            return res.status(status).json({
                success: false,
                message: err && err.message ? err.message : 'Failed to login your account'
            });
        }
    }
}

module.exports = Volunteer;
