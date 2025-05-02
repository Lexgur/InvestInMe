import pool from '../middleware/databaseConnection.js';
import bcrypt from 'bcrypt';

export async function createUser({ email, password, username }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    'INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, username, 'user']
  );

  return result;
}

export async function getUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}