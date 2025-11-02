async function findAdopterByEmail(connOrPool, email) {
  // connOrPool can be either a connection (has execute) or a pool (has execute via getConnection)
  if (connOrPool.execute) {
    const [rows] = await connOrPool.execute(`SELECT id, password, first_name, last_name FROM adopters WHERE email = ? LIMIT 1`, [email]);
    return rows;
  }
  // if pool provided, use getConnection and release
  const conn = await connOrPool.getConnection();
  try {
    const [rows] = await conn.execute(`SELECT id, password, first_name, last_name FROM adopters WHERE email = ? LIMIT 1`, [email]);
    return rows;
  } finally {
    conn.release();
  }
}

async function insertAdopter(conn, firstName, lastName, email, phone, hashedPassword) {
  const [adopterResult] = await conn.execute(
    `INSERT INTO adopters (first_name, last_name, email, phone, password, registration_date) VALUES (?, ?, ?, ?, ?, NOW())`,
    [firstName, lastName, email, phone || null, hashedPassword]
  );
  return adopterResult.insertId;
}

async function insertAdopterProfile(conn, adopterId, livingSituation, petExperienceValue) {
  await conn.execute(
    `INSERT INTO adopter_profile (adopter_id, living_situation, pet_experience) VALUES (?, ?, ?)`,
    [adopterId, livingSituation || null, petExperienceValue]
  );
}

async function insertAdopterConsents(conn, adopterId, agreed_terms, consent_background_check, wants_updates) {
  await conn.execute(
    `INSERT INTO adopter_consents (adopter_id, agreed_terms, consent_background_check, wants_updates) VALUES (?, ?, ?, ?)`,
    [adopterId, agreed_terms, consent_background_check, wants_updates]
  );
}

module.exports = {
  findAdopterByEmail,
  insertAdopter,
  insertAdopterProfile,
  insertAdopterConsents
};
