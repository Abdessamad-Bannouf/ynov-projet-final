const express = require('express');

const candidateController = require('../controllers/candidate');

const router = express.Router();

router.post('/', candidateController.create);

router.get('/', candidateController.getCandidates);

router.get('/:id', candidateController.getCandidateById);

router.put('/:id', candidateController.update);

router.delete('/:id', candidateController.delete);

module.exports = router;