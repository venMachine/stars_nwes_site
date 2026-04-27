const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const pexelsController = require('../controllers/pexelsController');

router.get('/search', protect, pexelsController.searchImages);

module.exports = router;