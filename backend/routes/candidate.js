const express = require('express');

const candidateController = require('../controllers/candidate');

const upload = require('../middlewares/upload');

const pagination = require('../middlewares/pagination');

const router = express.Router();

router.post('/', upload.single('cv'), candidateController.create);

router.get('/', pagination, candidateController.getCandidates);

router.get('/:id', candidateController.getCandidateById);

router.put('/:id', candidateController.update);

router.delete('/:id', candidateController.delete);

module.exports = router;