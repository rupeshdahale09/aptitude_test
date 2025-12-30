const TestAttempt = require('../models/TestAttempt');
const Test = require('../models/Test');

// @desc    Get leaderboard for a specific test
// @route   GET /api/leaderboard/test/:testId
// @access  Private
exports.getTestLeaderboard = async (req, res) => {
  try {
    const { testId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Verify test exists
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Aggregation pipeline to get best attempt per user
    // Strategy: Sort by score desc, then timeTaken asc, then group by userId and take first
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

    // Add rank
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.status(200).json({
      success: true,
      count: leaderboardWithRank.length,
      data: leaderboardWithRank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get overall leaderboard (all tests combined)
// @route   GET /api/leaderboard
// @access  Private
exports.getOverallLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get best attempt per user per test, then aggregate
    // Strategy: Sort by score desc, then timeTaken asc, then group by userId+testId and take first
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

    // Add rank
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.status(200).json({
      success: true,
      count: leaderboardWithRank.length,
      data: leaderboardWithRank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

