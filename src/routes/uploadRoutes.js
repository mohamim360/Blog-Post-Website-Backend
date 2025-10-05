const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/image', protect, upload.single('image'), uploadController.uploadImage);

router.delete('/image/:filename', protect, uploadController.deleteImage);

module.exports = router;