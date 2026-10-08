const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// POST /api/predict
router.post('/predict', predictionController.predictYield);

// POST /api/predict/compare
router.post('/predict/compare', (req, res, next) => {
  req.body.mode = 'compare';
  req.body.model = 'compare';
  predictionController.predictYield(req, res, next);
});

// POST /api/predict/single
router.post('/predict/single', (req, res, next) => {
  req.body.mode = 'single';
  predictionController.predictYield(req, res, next);
});

module.exports = router;
