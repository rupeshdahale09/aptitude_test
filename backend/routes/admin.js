const express = require('express');
const router = express.Router();
const {
  getUsers,
  getAllAttempts,
  getAdminStats,
  getAdminLeaderboard,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/attempts', getAllAttempts);
router.get('/stats', getAdminStats);
router.get('/leaderboard', getAdminLeaderboard);

module.exports = router;


