import express from 'express';
import { validateRegister, validateLogin } from '../validation/authValidator.js';
import { createUser, getUserByEmail } from '../model/userModel.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// ✅ REGISTER
router.post('/register', validateRegister, async (req, res) => {
  const { email, password, username } = req.body;

  try {
    await createUser({ email, password, username });
    res.status(201).json({ success: true, message: 'Registration successful!' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Error registering user' });
  }
});

// ✅ LOGIN
router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
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
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// ✅ GET CURRENT USER
router.get('/get-user', (req, res) => {
  if (req.session.user) {
    return res.json({ success: true, user: req.session.user });
  }
  res.json({ success: false, user: null });
});

// ✅ LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

export default router;