const bcrypt = require('bcryptjs');
const { UserDb } = require('../config/user/userDatabase');
const StaffRepository = require('../repositories/staffRepository');

class StaffService {
    constructor(payload) {
        this.staffFName = payload.staffFName;
        this.staffLName = payload.staffLName;
        this.staffEmail = payload.staffEmail;
        this.staffPhone = payload.staffPhone;
        this.staffPassword = payload.staffPassword;
        this.staffConsent = payload.staffConsent || [];
    }

    async staffSignUp() {
        const pool = await UserDb();
        const conn = await pool.getConnection();
        await conn.beginTransaction();

        try {
            const staffID = await this.staffSignUpHandleRegister(conn);
            await this.handlerStaffConsents(conn, staffID);
            await conn.commit();
            conn.release();
            return staffID;
        } catch (err) {
            await conn.rollback();
            conn.release();
            throw err;
        }
    }

    async staffSignUpHandleRegister(conn) {
        const repo = new StaffRepository(conn);
        const exist = await repo.getStaffByEmail(conn, this.staffEmail);

        if (exist) {
            const err = new Error('Email already exists');
            err.status = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(this.staffPassword, 10);
        const staffID = await repo.insertStaff(conn, this.staffFName, this.staffLName, this.staffEmail, hashedPassword, this.staffPhone);
        return staffID;
    }

    async handlerStaffConsents(conn, staff_id) {
        const repo = new StaffRepository(conn);
        const consents = Array.isArray(this.staffConsent) ? this.staffConsent : [];

        const agreed_terms = consents.includes('agreed_terms') ? 1 : 0;
        const consents_background_check = consents.includes('consents_background_check') ? 1 : 0;
        const wants_updates = consents.includes('wants_updates') ? 1 : 0;

        await repo.insertStaffConsents(conn, staff_id, agreed_terms, consents_background_check, wants_updates);
    }

    async staffLogin() {
        const pool = await UserDb();
        const repo = new StaffRepository(pool);
        const user = await repo.findStaffByEmail(pool, this.staffEmail);

        if (!user) {
            const invalid = new Error('Invalid Credentials');
            invalid.status = 401;
            throw invalid;
        }

        const match = await bcrypt.compare(this.staffPassword, user.password);
        if (!match) {
            const e = new Error('Invalid Credentials');
            e.status = 401;
            throw e;
        }

        return { staffID: user.id, name: `${user.first_name} ${user.last_name}` };
    }
}

module.exports = StaffService;