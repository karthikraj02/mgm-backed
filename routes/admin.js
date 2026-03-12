const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Admission = require('../models/Admission');
const Event = require('../models/Event');
const Contact = require('../models/Contact');
const Announcement = require('../models/Announcement');

const isAdmin = [protect, authorize('admin')];

// GET /api/admin/stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const students = await User.countDocuments({ role: 'student' });
    const admissions = await Admission.countDocuments();
    const pending = await Admission.countDocuments({ status: 'pending' });
    const contacts = await Contact.countDocuments({ isRead: false });
    res.json({ students, admissions, pending, contacts });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/admin/admissions
router.get('/admissions', isAdmin, async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/admin/admissions/:id
router.patch('/admissions/:id', isAdmin, async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const admission = await Admission.findByIdAndUpdate(
      req.params.id, { status, adminRemarks }, { new: true }
    );
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    res.json(admission);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/admin/contacts
router.get('/contacts', isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/admin/contacts/:id/read
router.patch('/contacts/:id/read', isAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/admin/events
router.post('/events', isAdmin, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/admin/events/:id
router.delete('/events/:id', isAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/admin/announcements
router.post('/announcements', isAdmin, async (req, res) => {
  try {
    const ann = await Announcement.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/admin/announcements/:id
router.delete('/announcements/:id', isAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/admin/students  (create student accounts)
router.post('/students', isAdmin, async (req, res) => {
  try {
    const { name, email, password, rollNumber, course, year } = req.body;
    const exists = await User.findOne({ rollNumber });
    if (exists) return res.status(400).json({ message: 'Roll number already exists' });
    const student = await User.create({ name, email, password, rollNumber, course, year, role: 'student' });
    res.status(201).json({ id: student._id, name: student.name, rollNumber: student.rollNumber });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
