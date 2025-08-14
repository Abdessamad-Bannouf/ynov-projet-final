const express = require('express');

const interviewController = require('../controllers/interview');

const pagination = require('../middlewares/pagination');
const { requireRole } = require('../middlewares/role');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/:id', requireAuth, requireRole('rh','recruiter','admin'), interviewController.show);
router.get('/', requireAuth, requireRole('rh','recruiter','admin'), pagination, interviewController.showAll);

router.post('/', requireAuth, requireRole('rh','recruiter','admin'),  interviewController.create);

router.put('/:id', requireAuth, requireRole('rh','recruiter','admin'), requireRole('rh','recruiter','admin'), interviewController.update);

router.delete('/:id', requireAuth, requireRole('rh','recruiter','admin'),  interviewController.delete);

module.exports = router;