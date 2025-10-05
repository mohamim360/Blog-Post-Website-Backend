const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    image: {
      url: { type: String, default: null },
      filename: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    publish_date: {
      type: Date,
      default: Date.now,
    },
    publish_time: {
      type: String,
      default: "00:00",
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     
    },
    author_name: {
      type: String,
      
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      maxlength: [500, "Summary cannot exceed 500 characters"],
    },
    meta_description: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    blog_content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Scheduled"],
      default: "Draft",
    },
    views: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
blogPostSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  }
  next();
});

// Index for faster queries
blogPostSchema.index({ status: 1, publish_date: -1 });
blogPostSchema.index({ author: 1 });
blogPostSchema.index({ slug: 1 });

module.exports = mongoose.model("BlogPost", blogPostSchema);
