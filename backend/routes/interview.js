const express = require('express');

const interviewController = require('../controllers/interview');

const pagination = require('../middlewares/pagination');

const router = express.Router();

router.get('/:id', interviewController.show);
router.get('/', pagination, interviewController.showAll);

router.post('/', interviewController.create);

router.put('/:id', interviewController.update);

router.delete('/:id', interviewController.delete);

module.exports = router;