const express = require('express');

const feedbackController = require('../controllers/feedback');

const pagination = require('../middlewares/pagination');
const { requireAuth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const sanitize = require('../middlewares/sanitize');

const router = express.Router();

router.get('/interviews/:interviewId', pagination, feedbackController.getFeedbacksByInterview);
router.get('/reviewer/:reviewerId', requireAuth, requireRole('rh','recruiter','admin'), pagination, feedbackController.getFeedbacksByReviewer);
router.get('/', requireAuth, requireRole('rh','recruiter','admin'), pagination, feedbackController.showAll);

router.post('/', requireAuth, requireRole('recruiter','rh','admin'), sanitize, feedbackController.create);
router.get('/:id', requireAuth, requireRole('rh','recruiter','admin'), feedbackController.show);
router.put('/:id', requireAuth, requireRole('recruiter','rh','admin'), sanitize, feedbackController.update);
router.delete('/:id', requireAuth, requireRole('rh','admin'), feedbackController.delete);

module.exports = router;
