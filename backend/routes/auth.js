const express = require('express');

const authController = require('../controllers/auth');

const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', requireAuth, authController.me);

router.post('/login', authController.postLogin);

router.post('/register', authController.postRegister);

module.exports = router;