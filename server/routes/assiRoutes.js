const express = require('express');
const router = express.Router();
const db = require('../db');
const {CreateNewAssignment,GetAllAssignments,SearchAssiByTitle,GetAssiById,UpdateAssiById,deleteAssiById,UpdateAssignmentDeadline, getWorkloadCnt} =require('../controllers/assiController');
const { jwtAuthMiddleware } = require('../middlewares/auth');

// ✅ Create new assignment
router.post('/',jwtAuthMiddleware ,CreateNewAssignment );

// ✅ Get all assignments with optional filters
router.get('/',jwtAuthMiddleware,GetAllAssignments );

// 🔍 Search assignment by title (case-insensitive partial match)
router.get('/search',jwtAuthMiddleware,SearchAssiByTitle );

// ✅ Get assignment by ID
router.get('/:id',jwtAuthMiddleware,GetAssiById);

// ✅ Update assignment by ID
router.put('/:id',jwtAuthMiddleware, UpdateAssiById);

// ✅ Delete assignment by ID
router.delete('/:id',jwtAuthMiddleware, deleteAssiById);

router.put('/:id/deadline', jwtAuthMiddleware, UpdateAssignmentDeadline);

router.post('/load',jwtAuthMiddleware,getWorkloadCnt);

module.exports = router;
