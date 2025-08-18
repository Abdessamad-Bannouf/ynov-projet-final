const express = require('express');
const candidateController = require('../controllers/candidate');
const pagination = require('../middlewares/pagination'); // si tu l’utilises
const { requireAuth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');

const router = express.Router();

// Lecture
router.get('/', requireAuth, requireRole('rh','recruiter','admin'), pagination, candidateController.showAll);
router.get('/:id', requireAuth, requireRole('rh','recruiter','admin'), candidateController.show);

// Écriture
router.post('/', requireAuth, requireRole('rh','recruiter','admin'), candidateController.create);
router.put('/:id', requireAuth, requireRole('rh','recruiter','admin'), candidateController.update);
router.delete('/:id', requireAuth, requireRole('rh','admin'), candidateController.delete);

module.exports = router;
