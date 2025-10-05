const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { protect } = require('../middleware/authMiddleware');


router.post('/', protect, blogPostController.createPost);
router.get('/', blogPostController.getAllPosts);

router.get('/:id', blogPostController.getPostById);
router.get('/slug/:slug', blogPostController.getPostBySlug);
router.put('/:id', protect, blogPostController.updatePost);
router.delete('/:id', protect, blogPostController.deletePost);
router.patch('/:id/publish', protect, blogPostController.publishPost);

module.exports = router;