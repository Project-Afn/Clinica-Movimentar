
const express = require('express');
const router = express.Router();
const { 
  loginUser, 
  registerUser, 
  getUsers, 
  getUserProfile 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.route('/').post(protect, admin, registerUser).get(protect, admin, getUsers);
router.get('/profile', protect, getUserProfile);

module.exports = router;
