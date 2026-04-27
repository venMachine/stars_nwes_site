const express = require('express');
const router = express.Router();
const { uploadImageFromUrl } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/from-url', protect, uploadImageFromUrl);

module.exports = router;