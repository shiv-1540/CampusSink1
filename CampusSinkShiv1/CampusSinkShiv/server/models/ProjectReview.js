// models/ProjectReview.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: String,
  description: String,
  scheduledAt: Date,
  year: String,
  branch: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProjectReview', reviewSchema);
