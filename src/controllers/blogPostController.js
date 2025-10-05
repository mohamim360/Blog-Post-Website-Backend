const blogPostService = require('../services/blogPostService');

class BlogPostController {
  async createPost(req, res) {
    try {
      const { title, summary, blog_content, tags, categories, is_featured, meta_description } = req.body;
      
      // Validation
      if (!title || !summary || !blog_content) {
        return res.status(400).json({
          success: false,
          message: 'Title, summary, and blog content are required'
        });
      }

      const postData = {
        title,
        summary,
        blog_content,
        tags: tags || [],
        categories: categories || [],
        is_featured: is_featured || false,
        meta_description,
        status: 'Draft'
      };

      const post = await blogPostService.createBlogPost(
        postData,
        req.user.id,
        req.user.name
      );

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: post
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create blog post'
      });
    }
  }

 async getAllPosts(req, res) {
  try {
    const { page, limit, status, author, search, category } = req.query;

    const result = await blogPostService.getAllBlogPosts(
      { status, author, search, category },
      { page, limit }
    );

    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
    });
  }
}

  async getPostById(req, res) {
    try {
      const post = await blogPostService.getBlogPostById(req.params.id);

      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Get post error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Blog post not found'
      });
    }
  }

  async getPostBySlug(req, res) {
    try {
      const post = await blogPostService.getBlogPostBySlug(req.params.slug);

      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Get post by slug error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Blog post not found'
      });
    }
  }

  async updatePost(req, res) {
    try {
      const post = await blogPostService.updateBlogPost(
        req.params.id,
        req.body,
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: post
      });
    } catch (error) {
      console.error('Update post error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update blog post'
      });
    }
  }

  async deletePost(req, res) {
    try {
      await blogPostService.deleteBlogPost(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Blog post not found'
      });
    }
  }

  async publishPost(req, res) {
    try {
      const post = await blogPostService.publishBlogPost(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Blog post published successfully',
        data: post
      });
    } catch (error) {
      console.error('Publish post error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to publish blog post'
      });
    }
  }


}

module.exports = new BlogPostController();