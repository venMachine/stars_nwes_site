const express = require('express');
const router = express.Router();
const unsplashController = require('../controllers/unsplashController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, unsplashController.searchImages);

module.exports = router;