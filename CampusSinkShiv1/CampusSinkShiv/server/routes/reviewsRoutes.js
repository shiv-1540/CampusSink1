const express = require('express');
const { CreateReview, GetAllReviews, UpdateReviewById, MarkReviewAsCompleted, DeleteReviewById } = require('../controllers/reviewControllers');
const router = express.Router();
const {jwtAuthMiddleware}=require('../middlewares/auth')

// Create a new review
router.post('/',jwtAuthMiddleware ,CreateReview);

// Get all reviews
router.get('/',jwtAuthMiddleware ,GetAllReviews);

// Update review by ID
router.put('/:id',jwtAuthMiddleware ,UpdateReviewById);

// ✅ Mark review as completed
router.put('/:id/complete',jwtAuthMiddleware, MarkReviewAsCompleted);

// Delete review by ID
router.delete('/:id',jwtAuthMiddleware,DeleteReviewById);

module.exports = router;
