const TestAttempt = require('../models/TestAttempt');
const Test = require('../models/Test');

// @desc    Get all attempts for current user
// @route   GET /api/attempts
// @access  Private
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ userId: req.user.id })
      .populate('testId', 'title description duration')
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

// @desc    Get attempts for a specific test
// @route   GET /api/attempts/test/:testId
// @access  Private
exports.getTestAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({
      userId: req.user.id,
      testId: req.params.testId,
    })
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

// @desc    Get single attempt
// @route   GET /api/attempts/:id
// @access  Private
exports.getAttempt = async (req, res) => {
  try {
    const attempt = await TestAttempt.findById(req.params.id).populate(
      'testId',
      'title description'
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found',
      });
    }

    // Check if user owns this attempt or is admin
    if (attempt.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this attempt',
      });
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get comparative analysis for a test
// @route   GET /api/attempts/test/:testId/compare
// @access  Private
exports.getComparativeAnalysis = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;

    // Get last two attempts for this test
    const attempts = await TestAttempt.find({
      userId,
      testId,
    })
      .sort({ createdAt: -1 })
      .limit(2)
      .populate('testId', 'title');

    if (attempts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No attempts found for this test',
      });
    }

    const latest = attempts[0];
    const previous = attempts[1];

    let comparison = {
      latest: {
        score: latest.score,
        totalMarks: latest.totalMarks,
        timeTaken: latest.timeTaken,
        accuracy: latest.accuracy,
        submittedAt: latest.submittedAt,
      },
      hasPrevious: false,
      scoreChange: 0,
      scoreChangePercent: 0,
      timeChange: 0,
      timeChangePercent: 0,
      accuracyChange: 0,
      accuracyChangePercent: 0,
      improvement: null,
    };

    if (previous) {
      comparison.hasPrevious = true;
      comparison.previous = {
        score: previous.score,
        totalMarks: previous.totalMarks,
        timeTaken: previous.timeTaken,
        accuracy: previous.accuracy,
        submittedAt: previous.submittedAt,
      };

      // Calculate changes
      comparison.scoreChange = latest.score - previous.score;
      comparison.scoreChangePercent =
        previous.score > 0
          ? ((latest.score - previous.score) / previous.score) * 100
          : latest.score > 0
          ? 100
          : 0;

      comparison.timeChange = latest.timeTaken - previous.timeTaken;
      comparison.timeChangePercent =
        previous.timeTaken > 0
          ? ((latest.timeTaken - previous.timeTaken) / previous.timeTaken) * 100
          : 0;

      comparison.accuracyChange = latest.accuracy - previous.accuracy;
      comparison.accuracyChangePercent =
        previous.accuracy > 0
          ? ((latest.accuracy - previous.accuracy) / previous.accuracy) * 100
          : latest.accuracy > 0
          ? 100
          : 0;

      // Determine overall improvement
      const scoreImproved = latest.score > previous.score;
      const timeImproved = latest.timeTaken < previous.timeTaken;
      const accuracyImproved = latest.accuracy > previous.accuracy;

      const improvements = [scoreImproved, timeImproved, accuracyImproved].filter(
        (x) => x
      ).length;

      if (improvements >= 2) {
        comparison.improvement = 'improved';
      } else if (improvements === 1) {
        comparison.improvement = 'mixed';
      } else {
        comparison.improvement = 'declined';
      }
    }

    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/attempts/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all attempts
    const attempts = await TestAttempt.find({ userId })
      .populate('testId', 'title')
      .sort({ createdAt: 1 });

    // Calculate trends
    const scoreTrend = attempts.map((attempt) => ({
      date: attempt.createdAt,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      testTitle: attempt.testId?.title || 'Unknown',
    }));

    const timeTrend = attempts.map((attempt) => ({
      date: attempt.createdAt,
      timeTaken: attempt.timeTaken,
      testTitle: attempt.testId?.title || 'Unknown',
    }));

    const accuracyTrend = attempts.map((attempt) => ({
      date: attempt.createdAt,
      accuracy: attempt.accuracy,
      testTitle: attempt.testId?.title || 'Unknown',
    }));

    // Calculate summary stats
    const totalAttempts = attempts.length;
    const avgScore =
      attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        : 0;
    const avgAccuracy =
      attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length
        : 0;
    const avgTimeTaken =
      attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.timeTaken, 0) / attempts.length
        : 0;
    const bestScore = attempts.length > 0
      ? Math.max(...attempts.map((a) => a.score))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalAttempts,
          avgScore: Math.round(avgScore * 100) / 100,
          avgAccuracy: Math.round(avgAccuracy * 100) / 100,
          avgTimeTaken: Math.round(avgTimeTaken * 100) / 100,
          bestScore,
        },
        trends: {
          score: scoreTrend,
          time: timeTrend,
          accuracy: accuracyTrend,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


