const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// GET /api/predictions (with search & filters)
router.get('/predictions', historyController.getHistory);

// DELETE /api/predictions/:id
router.delete('/predictions/:id', historyController.deletePrediction);

module.exports = router;
