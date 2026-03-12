const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Admission = require('../models/Admission');
const User = require('../models/User');

// POST /api/admission/apply
router.post('/apply', protect, authorize('admission'), async (req, res) => {
  try {
    const existing = await Admission.findOne({ applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'Application already submitted' });
    const { dob, address, qualification, marks, category, course } = req.body;
    const admission = await Admission.create({
      applicant: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      dob, address, qualification, marks, category,
      course: course || req.user.course,
    });
    res.status(201).json(admission);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/admission/status
router.get('/status', protect, authorize('admission'), async (req, res) => {
  try {
    const admission = await Admission.findOne({ applicant: req.user._id });
    res.json(admission);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
