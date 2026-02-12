//routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const { getDB, ObjectId } = require('../database/db');

const router = express.Router();

function validateEmail(email) {
  return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

//POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');

    const { name, email, password } = req.body;
    if (!name || !validateEmail(email) || !password || password.length < 6) {
      return res.status(400).json({ error: 'Invalid registration data' });
    }

    const lowerEmail = email.toLowerCase();
    const existing = await users.findOne({ email: lowerEmail });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      name: name.trim(),
      email: lowerEmail,
      password: hashed,
      role: 'user', 
      createdAt: new Date()
    };

    const r = await users.insertOne(newUser);

    
    req.session.userId = String(r.insertedId);
    req.session.role = newUser.role;

    
    res.status(201).json({
      _id: r.insertedId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

//POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');

    const { email, password } = req.body;
    if (!validateEmail(email) || !password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    
    req.session.userId = String(user._id);
    req.session.role = user.role || 'user';

    
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

//POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    res.clearCookie('connect.sid', { httpOnly: true });
    res.json({ message: 'Logged out' });
  });
});

//GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) return res.status(200).json(null);

    const db = getDB();
    const users = db.collection('users');

    const user = await users.findOne(
      { _id: new ObjectId(req.session.userId) },
      { projection: { password: 0 } }
    );

    
    if (!user) {
      req.session.destroy(() => {});
      return res.status(200).json(null);
    }

    res.json(user);
  } catch (err) {
    console.error('GET /me error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
