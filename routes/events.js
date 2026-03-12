const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events - all events
router.get('/', async (req, res) => {
  try {
    const { category, upcoming } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (upcoming === 'true') filter.date = { $gte: new Date() };
    const events = await Event.find(filter).sort({ date: -1 });
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/events/:slug
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
