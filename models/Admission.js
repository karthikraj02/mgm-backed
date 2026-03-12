const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  dob: { type: String },
  address: { type: String },
  qualification: { type: String },
  marks: { type: String },
  category: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'Other'], default: 'General' },
  course: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminRemarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
