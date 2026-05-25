const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Run database migrations on initialization
const initDb = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Alter links table to include user_id
    await pool.query(`
      ALTER TABLE links ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
    `);

    console.log("Database schema initialized successfully.");
  } catch (err) {
    console.error("Failed to run database migrations:", err);
  }
};

initDb();

module.exports = pool;
