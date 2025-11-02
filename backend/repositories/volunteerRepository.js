class VolunteerRepository {
    constructor(db) {
        // db can be a pool or a connection; methods also accept connOrPool as first arg
        this.db = db;
    }

    // Insert a new volunteer. First parameter may be a connection/pool when called as (conn, ...)
    async insertVolunteer(connOrPool, firstName, lastName, email, phone, hashedPassword) {
        const sql = `INSERT INTO volunteer (first_name, last_name, email, phone, password, registration_date) VALUES (?, ?, ?, ?, ?, NOW())`;
        const params = [firstName, lastName, email, phone || null, hashedPassword];
        // if caller passed a connection/pool as first arg
        if (connOrPool && typeof connOrPool.execute === 'function') {
            const [result] = await connOrPool.execute(sql, params);
            return result.insertId;
        }
        // otherwise use the instance db (pool)
        if (this.db && typeof this.db.execute === 'function') {
            const [result] = await this.db.execute(sql, params);
            return result.insertId;
        }
        throw new Error('No database connection available for insertVolunteer');
    }

    // Insert volunteer profile (availability and interested_activities are ENUM columns)
    async insertVolunteerProfile(connOrPool, volunteerId, availability, interestedActivities) {
        const sql = `INSERT INTO volunteer_profile (volunteer_id, availability, interested_activities) VALUES (?, ?, ?)`;
        const params = [volunteerId, availability || null, interestedActivities || null];
        if (connOrPool && typeof connOrPool.execute === 'function') {
            await connOrPool.execute(sql, params);
            return;
        }
        if (this.db && typeof this.db.execute === 'function') {
            await this.db.execute(sql, params);
            return;
        }
        throw new Error('No database connection available for insertVolunteerProfile');
    }

    // Insert volunteer consents
    async insertVolunteerConsents(connOrPool, volunteerId, agreedTerms = 0, consentBackgroundCheck = 0, wantsUpdates = 0) {
        const sql = `INSERT INTO volunteer_consents (volunteer_id, agreed_terms, consent_background_check, wants_updates) VALUES (?, ?, ?, ?)`;
        const params = [volunteerId, agreedTerms ? 1 : 0, consentBackgroundCheck ? 1 : 0, wantsUpdates ? 1 : 0];
        if (connOrPool && typeof connOrPool.execute === 'function') {
            await connOrPool.execute(sql, params);
            return;
        }
        if (this.db && typeof this.db.execute === 'function') {
            await this.db.execute(sql, params);
            return;
        }
        throw new Error('No database connection available for insertVolunteerConsents');
    }

    // Lowercase find method that accepts connOrPool as first arg
    async findVolunteerByEmail(connOrPool, email) {
        const sql = `SELECT id, password, first_name, last_name FROM volunteer WHERE email = ? LIMIT 1`;
        if (connOrPool && typeof connOrPool.execute === 'function') {
            const [rows] = await connOrPool.execute(sql, [email]);
            return rows && rows.length ? rows[0] : null;
        }
        if (this.db && typeof this.db.execute === 'function') {
            const [rows] = await this.db.execute(sql, [email]);
            return rows && rows.length ? rows[0] : null;
        }
        throw new Error('No database connection available for findVolunteerByEmail');
    }

    // Keep old-cased method for backward compatibility with your code
    async FindVolunteerByEmail(email) {
        // use instance db if available
        if (this.db && typeof this.db.execute === 'function') {
            const [rows] = await this.db.execute(`SELECT id, password, first_name, last_name FROM volunteer WHERE email = ? LIMIT 1`, [email]);
            return rows && rows.length ? rows[0] : null;
        }
        // otherwise no-op
        return null;
    }
}

module.exports = VolunteerRepository;
