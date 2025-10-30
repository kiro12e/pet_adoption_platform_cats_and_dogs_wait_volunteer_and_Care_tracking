const mysql = require('mysql2/promise');

async function UserDb() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'stray_cats_dog_adoption',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    return pool;
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

module.exports = { UserDb };
