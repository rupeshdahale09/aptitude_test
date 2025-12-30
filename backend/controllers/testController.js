const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find().select('-questions.options -questions.correctAnswer').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single test (without answers)
// @route   GET /api/tests/:id
// @access  Private
exports.getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Remove correct answers before sending
    const testData = test.toObject();
    testData.questions = testData.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      marks: q.marks,
    }));

    res.status(200).json({
      success: true,
      data: testData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create test
// @route   POST /api/tests
// @access  Private/Admin
exports.createTest = async (req, res) => {
  try {
    // Calculate total marks
    const totalMarks = req.body.questions.reduce(
      (sum, q) => sum + (q.marks || 1),
      0
    );

    const test = await Test.create({
      ...req.body,
      totalMarks,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit test attempt
// @route   POST /api/tests/:id/submit
// @access  Private
exports.submitTest = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const testId = req.params.id;
    const userId = req.user.id;

    // Get test with correct answers
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Validate time taken
    if (timeTaken < 0 || timeTaken > test.duration) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time taken',
      });
    }

    // Validate answers format
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format',
      });
    }

    // Calculate score
    let score = 0;
    const answersMap = new Map();

    test.questions.forEach((question, index) => {
      const questionId = question._id.toString();
      const userAnswer = answers[questionId];
      
      answersMap.set(questionId, userAnswer !== undefined ? userAnswer : -1);

      if (userAnswer === question.correctAnswer) {
        score += question.marks || 1;
      }
    });

    // Calculate accuracy
    const totalQuestions = test.questions.length;
    const correctAnswers = test.questions.filter(
      (q, index) => answers[q._id.toString()] === q.correctAnswer
    ).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Create test attempt
    const attempt = await TestAttempt.create({
      userId,
      testId,
      answers: answersMap,
      score,
      totalMarks: test.totalMarks,
      timeTaken,
      accuracy: Math.round(accuracy * 100) / 100,
    });

    // Populate test details
    await attempt.populate('testId', 'title');

    res.status(201).json({
      success: true,
      data: {
        attemptId: attempt._id,
        score,
        totalMarks: test.totalMarks,
        timeTaken,
        accuracy: attempt.accuracy,
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update test
// @route   PUT /api/tests/:id
// @access  Private/Admin
exports.updateTest = async (req, res) => {
  try {
    let test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Recalculate total marks if questions are updated
    if (req.body.questions) {
      req.body.totalMarks = req.body.questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
      );
    }

    test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    await Test.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Test deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


