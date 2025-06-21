const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require('../middlewares/auth');
const {addStudent,addTeacher,addDepartment}=require('../controllers/adminController');


router.post('/add-dept', jwtAuthMiddleware, addDepartment);
router.post('/add-student',jwtAuthMiddleware,addStudent);
router.post('/add-teacher',jwtAuthMiddleware,addTeacher);


module.exports = router;