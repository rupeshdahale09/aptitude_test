const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
    index: true,
  },
  answers: {
    type: Map,
    of: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number,
    required: true,
    min: 0,
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
testAttemptSchema.index({ userId: 1, testId: 1, createdAt: -1 });

module.exports = mongoose.model('TestAttempt', testAttemptSchema);


