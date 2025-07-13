const express = require('express');
const router = express.Router();
const { addUser ,login, forgotPassword, verifyOtp, resetPassword, getStudentInfo} = require('../controllers/authControllers');
const {jwtAuthMiddleware}=require('../middlewares/auth');
const { getWorkloadCnt } = require('../controllers/assiController');


// Only allow admins to add users
router.post('/add', jwtAuthMiddleware, (req, res, next) => {
   if (req.user.role !== 'admin') {
   return res.status(403).json(
      { message: 'Only admins can add users' }
    );
}
 next(); 
}, addUser);

// router.post('/add',addUser);

router.post('/signup',addUser)
router.post('/login',login);
router.post('/forgot-password',forgotPassword);
router.post('/verify-otp',verifyOtp);
router.post('/reset-password',resetPassword);

router.get('/load',getWorkloadCnt);
router.post('/getstudinfo',jwtAuthMiddleware,getStudentInfo);

module.exports = router;