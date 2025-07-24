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
  getTeachers,
  updateStudent,
  updateTeacher
} = require('../controllers/adminController');

const { getReportStats } = require('../controllers/adminReportController');
const { addUser } = require('../controllers/authControllers');

// === POST routes ===
router.post('/add-dept', jwtAuthMiddleware, addDepartment);
router.post('/add-student', jwtAuthMiddleware, addStudent);
router.post('/add-teacher', jwtAuthMiddleware, addTeacher);

// === PUT ROUTES ===
router.put('/update-student',jwtAuthMiddleware,updateStudent);
router.put('/update-teacher',jwtAuthMiddleware,updateTeacher);

// === GET routes ===
router.get('/departments', jwtAuthMiddleware, getDepartments);
router.get('/students', jwtAuthMiddleware, getStudents);
router.get('/teachers', jwtAuthMiddleware, getTeachers);

// === REPORT ===
router.get('/report/stats', jwtAuthMiddleware, getReportStats);

module.exports = router;
