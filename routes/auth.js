const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: generateToken(user._id), user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/student/login
router.post('/student/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    const user = await User.findOne({ rollNumber, role: 'student' });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid roll number or password' });
    res.json({ token: generateToken(user._id), user: { id: user._id, rollNumber: user.rollNumber, name: user.name, course: user.course, year: user.year } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/admission/register
router.post('/admission/register', async (req, res) => {
  try {
    const { name, email, password, phone, course } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, course, role: 'admission' });
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, email: user.email, name: user.name, course: user.course } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/admission/login
router.post('/admission/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admission' });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: generateToken(user._id), user: { id: user._id, email: user.email, name: user.name, course: user.course } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
