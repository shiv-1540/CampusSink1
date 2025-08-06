// models/Seminar.js
const mongoose = require('mongoose');

const seminarSchema = new mongoose.Schema({
  title: String,
  description: String,
  speaker: String,
  mode: { type: String, enum: ['online', 'offline'] },
  venue: String,
  link: String,
  datetime: Date,
  branch: String,
  year: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seminar', seminarSchema);
