class StaffRepository {
  constructor(database) {
    this.database = database;
  }

  async insertStaff(connOrPool, firstName, lastName, email, hashedPassword, emergencyNumber) {
    const sql = `
      INSERT INTO staff (first_name, last_name, email, PASSWORD, emergency_number, registration_date)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const params = [firstName, lastName, email, hashedPassword, emergencyNumber || null];

    try {
      const [result] = await connOrPool.execute(sql, params);
      return result; // Return insert staff result
    } catch (err) {
      console.error('Error inserting staff:', err);
      throw err;
    }
  }

  async insertStaffConsents(connOrPool, staffID, agreed_term = 0, consent_background_check = 0, wants_updates = 0) {
    const sql = `
      INSERT INTO staff_consents (staff_id, agreed_terms, consents_background_check, wants_updates, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const params = [staffID, agreed_term, consent_background_check, wants_updates];

    try {
      const [result] = await connOrPool.execute(sql, params);
      return result; // Return insert consent result
    } catch (err) {
      console.error(' Error inserting staff consents:', err);
      throw err;
    }
  }

  async findStaffByEmail(connOrPool, email) {
    const sql = `SELECT id, password, first_name, last_name FROM staff WHERE email = ? LIMIT 1`;

    if (connOrPool && typeof connOrPool.execute === 'function') {
      const [rows] = await connOrPool.execute(sql, [email]);
      return rows && rows.length ? rows[0] : null;
    }

    if (this.database && typeof this.database.execute === 'function') {
      const [rows] = await this.database.execute(sql, [email]);
      return rows && rows.length ? rows[0] : null;
    }

    throw new Error('No database connection available for findStaffByEmail');
  }
}

module.exports = StaffRepository;
