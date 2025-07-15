const express = require('express');

const feedbackController = require('../controllers/feedback');

const pagination = require('../middlewares/pagination');

const router = express.Router();

router.post('/', pagination, feedbackController.createFeedback);

router.get('/interview/:interviewId', pagination, feedbackController.getFeedbacksByInterview);
router.get('/reviewer/:reviewerId', pagination, feedbackController.getFeedbacksByReviewer);

module.exports = router;