const express = require('express');
const router = express.Router();
const {
  getMyAttempts,
  getTestAttempts,
  getAttempt,
  getComparativeAnalysis,
  getDashboardStats,
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyAttempts);
router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/test/:testId', protect, getTestAttempts);
router.get('/test/:testId/compare', protect, getComparativeAnalysis);
router.get('/:id', protect, getAttempt);

module.exports = router;


