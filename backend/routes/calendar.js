const express = require('express');

const calendarController = require('../controllers/calendar');

const router = express.Router();

router.get('/login', calendarController.login);
router.get('/status', calendarController.status);

router.get('/oauth2callback', calendarController.loginRedirect);

router.post('/create', calendarController.create);

router.post('/update', calendarController.update);

router.get('/delete', calendarController.delete);

module.exports = router;