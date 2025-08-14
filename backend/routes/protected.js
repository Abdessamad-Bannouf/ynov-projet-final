const router = require('express').Router();
const { requireAuth } = require('../middlewares/auth');

router.get('/protected/ping', requireAuth, (req, res) => {
    res.json({ ok: true, user: req.auth });
});

module.exports = router;