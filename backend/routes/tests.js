const express = require('express');
const router = express.Router();
const {
  getTests,
  getTest,
  createTest,
  submitTest,
  updateTest,
  deleteTest,
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getTests);
router.get('/:id', protect, getTest);
router.post('/', protect, authorize('admin'), createTest);
router.post('/:id/submit', protect, submitTest);
router.put('/:id', protect, authorize('admin'), updateTest);
router.delete('/:id', protect, authorize('admin'), deleteTest);

module.exports = router;


