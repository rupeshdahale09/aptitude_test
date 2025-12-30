const User = require('../models/User');
const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all test attempts with filters
// @route   GET /api/admin/attempts
// @access  Private/Admin
exports.getAllAttempts = async (req, res) => {
  try {
    const { userId, testId, startDate, endDate } = req.query;

    // Build filter object
    const filter = {};
    if (userId) filter.userId = userId;
    if (testId) filter.testId = testId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const attempts = await TestAttempt.find(filter)
      .populate('userId', 'name email')
      .populate('testId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTests = await Test.countDocuments();
    const totalAttempts = await TestAttempt.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Get recent attempts
    const recentAttempts = await TestAttempt.find()
      .populate('userId', 'name email')
      .populate('testId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTests,
        totalAttempts,
        adminUsers,
        recentAttempts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get leaderboard for admin
// @route   GET /api/admin/leaderboard
// @access  Private/Admin
exports.getAdminLeaderboard = async (req, res) => {
  try {
    const { testId } = req.query;
    const limit = parseInt(req.query.limit) || 10;

    if (testId) {
      // Test-specific leaderboard
      const test = await Test.findById(testId);
      if (!test) {
        return res.status(404).json({
          success: false,
          message: 'Test not found',
        });
      }

      const leaderboard = await TestAttempt.aggregate([
        {
          $match: { testId: test._id },
        },
        {
          $sort: { score: -1, timeTaken: 1 },
        },
        {
          $group: {
            _id: '$userId',
            bestAttempt: { $first: '$$ROOT' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            userName: '$user.name',
            userEmail: '$user.email',
            score: '$bestAttempt.score',
            timeTaken: '$bestAttempt.timeTaken',
            accuracy: '$bestAttempt.accuracy',
            submittedAt: '$bestAttempt.submittedAt',
          },
        },
        {
          $sort: { score: -1, timeTaken: 1 },
        },
        {
          $limit: limit,
        },
      ]);

      const leaderboardWithRank = leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry,
      }));

      return res.status(200).json({
        success: true,
        count: leaderboardWithRank.length,
        data: leaderboardWithRank,
      });
    } else {
      // Overall leaderboard
      const leaderboard = await TestAttempt.aggregate([
        {
          $sort: { score: -1, timeTaken: 1 },
        },
        {
          $group: {
            _id: { userId: '$userId', testId: '$testId' },
            bestAttempt: { $first: '$$ROOT' },
          },
        },
        {
          $group: {
            _id: '$_id.userId',
            totalScore: { $sum: '$bestAttempt.score' },
            avgTime: { $avg: '$bestAttempt.timeTaken' },
            testCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            userName: '$user.name',
            userEmail: '$user.email',
            totalScore: '$totalScore',
            avgTime: { $round: ['$avgTime', 2] },
            testCount: '$testCount',
          },
        },
        {
          $sort: { totalScore: -1, avgTime: 1 },
        },
        {
          $limit: limit,
        },
      ]);

      const leaderboardWithRank = leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry,
      }));

      return res.status(200).json({
        success: true,
        count: leaderboardWithRank.length,
        data: leaderboardWithRank,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

