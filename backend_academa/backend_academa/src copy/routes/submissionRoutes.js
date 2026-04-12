const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { submitAssignment, getSubmissionById, gradeSubmission, getMySubmissions, getCourseSubmissions } = require('../controllers/submissionController');

router.post('/', authenticate, authorize(['student']), upload.single('file'), submitAssignment);
router.get('/my-submissions', authenticate, authorize(['student']), getMySubmissions);
router.get('/course/:courseId', authenticate, authorize(['faculty','admin']), getCourseSubmissions);
router.get('/:id', authenticate, getSubmissionById);
router.put('/:id/grade', authenticate, authorize(['faculty','admin']), gradeSubmission);

module.exports = router;
