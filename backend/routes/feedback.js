const express = require('express');

const feedbackController = require('../controllers/feedback');

const pagination = require('../middlewares/pagination');

const router = express.Router();

router.get('/interviews/:interviewId', pagination, feedbackController.getFeedbacksByInterview);
router.get('/reviewer/:reviewerId', pagination, feedbackController.getFeedbacksByReviewer);
router.get('/', pagination, feedbackController.showAll);

router.post('/', feedbackController.create);

router.get('/:id', feedbackController.show);

router.put('/:id', feedbackController.update);

router.delete('/:id', feedbackController.delete);

module.exports = router;