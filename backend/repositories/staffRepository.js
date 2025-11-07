class StaffRepository {
  constructor(database) {
    this.database = database;
  }

  async getStaffByEmail(connOrPool, email) {
    const sql = `SELECT id, password, first_name, last_name FROM staff WHERE email = ? LIMIT 1`;
    const [rows] = await connOrPool.execute(sql, [email]);
    return rows && rows.length ? rows[0] : null;
  }

  async insertStaff(connOrPool, firstName, lastName, email, hashedPassword, phone) {
    const sql = `INSERT INTO staff (first_name, last_name, email, password, phone, registration_date) VALUES (?, ?, ?, ?, ?, NOW())`;
    const params = [firstName, lastName, email, hashedPassword, phone];
    const [result] = await connOrPool.execute(sql, params);
    return result.insertId;
  }

  async insertStaffConsents(connOrPool, staffID, agreed_terms = 0, consents_background_check = 0, wants_updates = 0) {
    const sql = `INSERT INTO staff_consents (staff_id, agreed_terms, consents_background_check, wants_updates) VALUES (?, ?, ?, ?)`;
    const params = [staffID, agreed_terms, consents_background_check, wants_updates];
    await connOrPool.execute(sql, params);
  }

  async findStaffByEmail(connOrPool, email) {
    const sql = `SELECT id, password, first_name, last_name FROM staff WHERE email = ? LIMIT 1`;
    const [rows] = await connOrPool.execute(sql, [email]);
    return rows && rows.length ? rows[0] : null;
  }
}

module.exports = StaffRepository;