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
    const port = 3000;
    app.listen(port, () => {
      console.log(`Serveris klauso ${port} porto.`);
    });

  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();
