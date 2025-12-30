const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length === 4;
      },
      message: 'Each question must have exactly 4 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  marks: {
    type: Number,
    default: 1,
  },
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a test title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Please provide test duration in seconds'],
    min: 60,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'Test must have at least one question',
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Test', testSchema);


