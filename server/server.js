import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import pkg from '../config/config.js';
import bcrypt from 'bcrypt';

const app = express();
const { db } = pkg;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

(async () => {
  try {
    const pool = await mysql.createPool(db);

    console.log("Mes prijungem prie DB");

    // REGISTRATION STARTS
    app.post('/register', async (req, res) => {
      const { email, password, username } = req.body;

      // Validiation
      if (!email || !password || !username) {
        return res.status(400).json({ message: "All fields are required." });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
          'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
          [email, hashedPassword, username]
        );

        res.status(201).json({ message: 'Registration successful!' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
      }
    });
    //REGISTRATION ENDS

    // ✅ LOGIN
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      try {
        const [rows] = await pool.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );

        if (rows.length === 0) {
          return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Login successful!' });

      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
      }
    });
    const port = 3000;
    app.listen(port, () => {
      console.log(`Serveris klauso ${port} porto.`);
    });

  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();
