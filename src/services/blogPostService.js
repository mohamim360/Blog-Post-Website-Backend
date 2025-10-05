const BlogPost = require("../models/BlogPost");

class BlogPostService {
  async createBlogPost(postData, userId, userName) {
    // Normalize image field
    if (postData.image) {
      if (typeof postData.image === "string") {
        // If image is a string, convert to object
        postData.image = {
          url: postData.image,
          filename: null,
          publicId: null,
        };
      } else if (!postData.image.url) {
        // If image object doesn't have url, remove it
        delete postData.image;
      }
    }

    const blogPost = new BlogPost({
      ...postData,
      author: userId,
      author_name: userName,
      created_by: userId,
    });

    await blogPost.save();
    return blogPost;
  }

async getAllBlogPosts(filters = {}, pagination = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    author,
    search,
    category,
  } = filters;

  const query = {};

  // filter by status (case-insensitive)
  if (status) {
    query.status = new RegExp(`^${status}$`, 'i');
  }

  // filter by author
  if (author) {
    query.author = author;
  }

  // filter by category
  if (category && category.toLowerCase() !== 'all') {
    query.categories = { $in: [category] };
  }

  // search by title or summary
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [posts, totalCount] = await Promise.all([
    BlogPost.find(query)
      .sort({ publish_date: -1, createdAt: -1 }) // recent first
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "name avatar"),
    BlogPost.countDocuments(query),
  ]);

  return {
    posts,
    pagination: {
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
  };
}


  async getBlogPostById(postId) {
    const post = await BlogPost.findById(postId)
      .populate("author", "name email")
      .populate("created_by", "name email")
      .populate("updated_by", "name email");

    if (!post) {
      throw new Error("Blog post not found");
    }

    return post;
  }

  async getBlogPostBySlug(slug) {
    const post = await BlogPost.findOne({ slug }).populate(
      "author",
      "name email"
    );

    if (!post) {
      throw new Error("Blog post not found");
    }

    // Increment views
    post.views += 1;
    await post.save();

    return post;
  }

  async updateBlogPost(postId, updateData, userId) {
    const post = await BlogPost.findById(postId);

    if (!post) {
      throw new Error("Blog post not found");
    }

    // Normalize image field
    if (updateData.image) {
      if (typeof updateData.image === "string") {
        updateData.image = {
          url: updateData.image,
          filename: null,
          publicId: null,
        };
      } else if (!updateData.image.url) {
        delete updateData.image;
      }
    }

    Object.assign(post, updateData);
    post.updated_by = userId;

    await post.save();
    return post;
  }

  async deleteBlogPost(postId) {
    const post = await BlogPost.findByIdAndDelete(postId);

    if (!post) {
      throw new Error("Blog post not found");
    }

    return { message: "Blog post deleted successfully" };
  }

  async publishBlogPost(postId, userId) {
    const post = await BlogPost.findById(postId);

    if (!post) {
      throw new Error("Blog post not found");
    }

    post.status = "Published";
    post.publish_date = new Date();
    post.updated_by = userId;

    await post.save();
    return post;
  }


}

module.exports = new BlogPostService();
