// models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  year: String,
  branch: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline: Date,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
