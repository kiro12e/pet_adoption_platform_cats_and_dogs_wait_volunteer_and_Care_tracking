const bcrypt = require('bcryptjs');
const { UserDb } = require('../config/user/userDatabase');
const repo = require('../repositories/adopterRepository');

function mapPetExperienceToEnum(petExperience) {
  const petExpArray = Array.isArray(petExperience) ? petExperience : (typeof petExperience === 'string' ? [petExperience] : []);
  const mapExp = (v) => {
    if (!v) return null;
    const lower = String(v).toLowerCase();
    if (lower === 'dogs') return 'Dogs';
    if (lower === 'cats') return 'Cats';
    if (lower === '1st_time_owner' || lower === '1st time owner' || lower === '1sttimeowner') return '1st time owner';
    return null;
  };
  const mapped = petExpArray.map(mapExp).filter(Boolean);
  return mapped.length ? mapped[0] : null;
}

async function signUp(payload) {
  const {
    adopterFName,
    adopterLName,
    adopterEmail,
    adopterPhone,
    adopterPassword,
    livingSituation,
    petExperience = [],
    consents = []
  } = payload;

  const pool = await UserDb();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // email uniqueness
    const existing = await repo.findAdopterByEmailcons(conn, adopterEmail);
    if (existing && existing.length) {
      await conn.rollback();
      conn.release();
      const e = new Error('Email already in use.');
      e.status = 409;
      throw e;
    }

    const hashedPassword = await bcrypt.hash(adopterPassword, 10);
    const adopterId = await repo.insertAdopter(conn, adopterFName, adopterLName, adopterEmail, adopterPhone, hashedPassword);

    const petExpValue = mapPetExperienceToEnum(petExperience);
    await repo.insertAdopterProfile(conn, adopterId, livingSituation, petExpValue);

    const consentArray = Array.isArray(consents) ? consents : (typeof consents === 'string' ? [consents] : []);
    const agreed_terms = consentArray.includes('terms_agreed') ? 1 : 0;
    const consent_background_check = consentArray.includes('background_check') ? 1 : 0;
    const wants_updates = consentArray.includes('receive_updates') ? 1 : 0;

    await repo.insertAdopterConsents(conn, adopterId, agreed_terms, consent_background_check, wants_updates);

    await conn.commit();
    conn.release();
    return { adopterId };
  } catch (err) {
    if (conn) {
      try { await conn.rollback(); conn.release(); } catch (e) { /* ignore */ }
    }
    // bubble up error; controller will format response
    throw err;
  }
}

async function login({ adopterEmail, adopterPassword }) {
  const pool = await UserDb();
  // use repository to fetch by email
  const rows = await repo.findAdopterByEmail(pool, adopterEmail);
  if (!rows || !rows.length) {
    const e = new Error('Invalid credentials.');
    e.status = 401;
    throw e;
  }
  const user = rows[0];
  const match = await bcrypt.compare(adopterPassword, user.password);
  if (!match) {
    const e = new Error('Invalid credentials.');
    e.status = 401;
    throw e;
  }
  return { adopterId: user.id, name: `${user.first_name} ${user.last_name}` };
}

module.exports = { signUp, login };
