import express from 'express';
import bcrypt from 'bcrypt';
import { validateRegister, validateLogin } from './validation/authValidator.js';
import sessionMiddleware from './middleware/sessionMiddleware.js';
import pool from './middleware/databaseConnection.js';

const app = express();

sessionMiddleware(app);

// ✅ REGISTRATION
app.post('/register', validateRegister, async (req, res) => {
  const { email, password, username } = req.body;

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
app.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;

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

    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: { id: user.id, username: user.username, role: user.role }
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