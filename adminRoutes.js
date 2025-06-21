const express = require('express');
const router = express.Router();

// Middleware
const { jwtAuthMiddleware } = require('../middlewares/auth');

// Controllers
const {
  addStudent,
  addTeacher,
  addDepartment,
  getDepartments,
  getStudents,
  getTeachers
} = require('../controllers/adminController');

const { getReportStats } = require('../controllers/adminReportController');

// === POST routes ===
router.post('/add-dept', jwtAuthMiddleware, addDepartment);
router.post('/add-student', jwtAuthMiddleware, addStudent);
router.post('/add-teacher', jwtAuthMiddleware, addTeacher);

// === GET routes ===
router.get('/departments', jwtAuthMiddleware, getDepartments);
router.get('/students', jwtAuthMiddleware, getStudents);
router.get('/teachers', jwtAuthMiddleware, getTeachers);

// === REPORT ===
router.get('/report/stats', jwtAuthMiddleware, getReportStats);

module.exports = router;
