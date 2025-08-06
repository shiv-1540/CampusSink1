const express = require('express');
const router = express.Router();
const db = require('../db');
const {CreateSeminar,GetAllSeminars,GetSeminarById,UpdateSeminarById,DeleteSeminarById} =require('../controllers/seminarControllers');
const { jwtAuthMiddleware } = require('../middlewares/auth');


// Create Seminar
router.post('/',jwtAuthMiddleware,CreateSeminar );

// Get All Seminars
router.get('/',jwtAuthMiddleware,GetAllSeminars );

// Get Seminar by ID
router.get('/:id', jwtAuthMiddleware,GetSeminarById);

// Update Seminar by ID
router.put('/:id', jwtAuthMiddleware,UpdateSeminarById);

// Delete Seminar by ID
router.delete('/:id', jwtAuthMiddleware,DeleteSeminarById);

module.exports = router;