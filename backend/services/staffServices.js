const bcrypt = require('bcryptjs');
const { UserDb } = require('../config/user/userDatabase');
const staffRepository = require('../../backend/repositories/staffRepository');

export class StaffService {
    constructor(payload) {
        const {
            staffFName,
            staffLName,
            staffEmail,
            staffPhone,
            staffPassword,
            staffConsent = []
        } = payload;

        this.staffFName = staffFName;
        this.staffLName = staffLName;
        this.staffEmail = staffEmail;
        this.staffPhone = staffPhone;
        this.staffPassword = staffPassword;
        this.staffConsent = staffConsent;
    }

    async staffSignUp() {
        const pool = await UserDb();
        const conn = await pool.getConnection();

        try {
            const staffID = await this.staffSignUpHandleRegister(conn);
            await this.handlerStaffConsents(conn, staffID);
            
            await conn.commit();
            conn.release();
        } catch (err) {
            if (conn) {
                try { await conn.rollback(); conn.release(); } catch (e) {}
            }
            throw err;
        }
    }

    async staffSignUpHandleRegister(conn) {
        const repo = new staffRepository(conn);
        const exist = await repo.getStaffByEmail(this.staffEmail);

        if (exist && exist.length > 0) {
            const err = new Error('Gmail already existing');
            err.status = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(this.staffPassword, 10);

        const staffID = await repo.insertStaff(
            conn,
            this.staffFName,
            this.staffLName,
            this.staffEmail,
            hashedPassword,
            this.staffPhone
        );

        return staffID;
    }

    async handlerStaffConsents(conn, staff_id) {
        const repo = new staffRepository(conn);

        const consents = Array.isArray(this.staffConsent)
            ? this.staffConsent
            : (typeof this.staffConsent === 'string' ? [this.staffConsent] : []);

        const consentsArray = {
            agreed_terms: 0,
            consents_background_check: 0,
            wants_updates: 0
        };

        Object.keys(consentsArray).forEach(element => {
            if (consents.includes(element)) {
                consentsArray[element] = 1;
            }
        });

        await repo.insertStaffConsents(
            conn,
            staff_id,
            consentsArray.agreed_terms,
            consentsArray.consents_background_check,
            consentsArray.wants_updates
        );
    }
        async handlerFetchingBackend(load, staffForm) {
        try {
        const res = await fetch('http://localhost:3000/api/staff/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(load)
        });

        const result = await res.json();

        if (res.ok) {
            this.showMessage(result.message || 'Registration successful!', 'success');
            volunteerForm.reset();
        } else {
            this.showMessage(result.message || result.error || 'Registration failed.', 'danger');
        }

        console.log('Signup response:', result);
        } catch (err) {
        console.error('Connection error', err);
        this.showMessage('Unable to connect to server. Please try again later.', 'danger');
        }
    }


    async staffLogin() {
        const pool = await UserDb();
        const repo = new staffRepository(pool);
        const user = await repo.findStaffByEmail(pool, this.staffEmail);

        if (!user) {
            const invalid = new Error('Invalid Credentials');
            invalid.status = 401;
            throw invalid;
        }

        const match = await bcrypt.compare(this.staffPassword, user.password);
        if (!match) {
            const e = new Error('Invalid Credential');
            e.status = 401;
            throw e;
        }

        return { staffID: user.id, name: `${user.first_name} ${user.last_name}` };
    }

}
