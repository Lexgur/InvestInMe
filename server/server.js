import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import pkg from '../config/config.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mysqlSessionFactory from 'express-mysql-session';

const MySQLStore = mysqlSessionFactory(session);
const app = express();
const { db } = pkg;

// Initialize MySQL pool
(async () => {
  try {
    const pool = await mysql.createPool(db);
    console.log("Connected to the database");

    // Initialize MySQL session store
    const sessionStore = new MySQLStore({
      createDatabaseTable: true, // Automatically create the sessions table
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
        }
      }
    }, pool);

    // Middleware setup
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(session({
      secret: 'secretsesssionkey', // Hardcoded secret (not recommended for production)
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      }
    }));

    // Helper function to get user without password
    const getUserWithoutPassword = (user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    };

    // ✅ REGISTRATION
    app.post('/register', async (req, res) => {
      const { email, password, username } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
          'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
          [email, hashedPassword, username]
        );

        res.status(201).json({
          success: true,
          message: 'Registration successful!'
        });
      } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error registering user' });
      }
    });

    // ✅ LOGIN
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
          });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
          });
        }

        // Store user data in the session
        req.session.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        };

        res.status(200).json({
          success: true,
          message: 'Login successful!',
          user: { id: user.id, username: user.username } // Only return safe info
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          success: false,
          message: 'Error logging in'
        });
      }
    });

    // ✅ GET CURRENT USER
    app.get('/get-user', (req, res) => {
      if (req.session.user) {
        return res.json({
          success: true,
          user: req.session.user
        });
      }
      res.json({
        success: false,
        user: null
      });
    });

    // ✅ LOGOUT
    app.post('/logout', (req, res) => {
      req.session.destroy(err => {
        if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({ success: false });
        }
        res.clearCookie('connect.sid', {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: false
        });
        res.json({ success: true });
      });
    });

    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });

  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();