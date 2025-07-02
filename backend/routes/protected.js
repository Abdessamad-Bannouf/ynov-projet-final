const express = require('express');
const authenticateToken = require('../middlewares/authToken');

const router = express.Router();

// Route protégée
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Bienvenue ${req.user.username} ! Ceci est un contenu protégé.` });
});

module.exports = router;
