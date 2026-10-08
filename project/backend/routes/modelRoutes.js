const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

// GET /api/models/results
router.get('/models/results', modelController.getModelResults);

// GET /api/models/best
router.get('/models/best', modelController.getBestModel);

// GET /api/eda
router.get('/eda', modelController.getEdaStats);

module.exports = router;
