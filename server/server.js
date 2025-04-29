import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import db from '../config/config.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

(async () => {
  try {
    const pool = await mysql.createPool(db);

    console.log("Mes prijungem prie DB");

    // REGISTER
    app.post('/register', async (req, res) => {
      const { email, password, username } = req.body;

      // Validiation
      if (!email || !password || !username) {
        return res.status(400).json({ message: "All fields are required." });
      }

      try {
        const [result] = await pool.query(
          'INSERT INTO users (email, password, username) VALUES (?, ?, ?)', 
          [email, password, username]
        );

        res.status(201).json({ message: 'Registration successful!' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
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
