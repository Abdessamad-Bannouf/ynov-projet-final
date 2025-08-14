const express = require('express');

const calendarController = require('../controllers/calendar');

const { requireAuth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');


const router = express.Router();

router.get('/login', calendarController.login);
router.get('/status', calendarController.status);

router.get('/oauth2callback', calendarController.loginRedirect);

router.post('/create', requireAuth, requireRole('rh','recruiter','admin'), calendarController.create);

router.post('/update', requireAuth, requireRole('rh','recruiter','admin'), calendarController.update);

router.get('/delete', requireAuth, requireRole('rh','recruiter','admin'), calendarController.delete);

module.exports = router;