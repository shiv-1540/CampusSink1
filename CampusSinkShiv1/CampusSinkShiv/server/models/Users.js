// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  prn: { type: String }, // Only for students
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  year: { type: String },       // For students
  division: { type: String },   // For students
  department: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    name: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
