const express = require('express');
const router = express.Router();
const {
  getTestLeaderboard,
  getOverallLeaderboard,
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getOverallLeaderboard);
router.get('/test/:testId', protect, getTestLeaderboard);

module.exports = router;


