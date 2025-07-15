// models/AssignmentSubmission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissionFileUrl: String,
  grade: String,
  feedback: String,
  isSubmitted: { type: Boolean, default: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignmentSubmission', submissionSchema);
