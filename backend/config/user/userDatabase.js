const mysql = require('mysql2/promise');

/**
 * Creates and returns a MySQL pool using environment variables.
 * Expected env:
 *  DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT
 */
async function UserDb() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'stray_cats_dog_adoption',
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
      queueLimit: 0
    });

    // test a simple connection to fail fast if credentials are wrong
    await pool.getConnection().then(conn => conn.release());

    return pool;
  } catch (err) {
    console.error('DB pool creation error:', err && err.message ? err.message : err);
    throw err; // let caller decide how to handle this
  }
}

module.exports = { UserDb };
