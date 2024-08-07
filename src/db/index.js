const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectDB = async () => {
  try {
    // Test the connection
    await pool.query('SELECT NOW()');
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

// TODO Create a function insert query and update query to execution on DB


module.exports = { pool, connectDB };
