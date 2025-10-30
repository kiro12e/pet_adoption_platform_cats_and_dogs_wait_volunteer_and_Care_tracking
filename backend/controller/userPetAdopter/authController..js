const { UserDb } = require('../../config/user/userDatabase');

async function signUpUser(req, res) {
  const {
    adopterFName,
    adopterLName,
    adopterEmail,
    adopterPhone,
    adopterPassword,
    livingSituation,
    petExperience,
    consents
  } = req.body;

  try {
    const pool = await UserDb();
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    // Insert into adopters
    const [adopterResult] = await conn.execute(
      `INSERT INTO adopters (first_name, last_name, email, phone, password, registration_date)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [adopterFName, adopterLName, adopterEmail, adopterPhone, adopterPassword]
    );

    const adopterId = adopterResult.insertId;

    // Insert into adopter_profile
    await conn.execute(
      `INSERT INTO adopter_profile (adopter_id, living_situation, pet_experience)
       VALUES (?, ?, ?)`,
      [adopterId, livingSituation, petExperience.join(',')]
    );

    // Parse consents
    const agreed_term = consents.includes('terms_agreed');
    const consent_background_check = consents.includes('background_check');
    const wants_update = consents.includes('receive_updates');

    // Insert into adopter_consents
    await conn.execute(
      `INSERT INTO adopter_consents (adopter_id, agreed_term, consent_background_check, wants_update)
       VALUES (?, ?, ?, ?)`,
      [adopterId, agreed_term, consent_background_check, wants_update]
    );

    await conn.commit();
    conn.release();

    res.json({ success: true, message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { signUpUser };
