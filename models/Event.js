const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String },
  category: { type: String, enum: ['cultural', 'academic', 'sports', 'workshop', 'seminar', 'other'], default: 'other' },
  image: { type: String },
  isUpcoming: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
