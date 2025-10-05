# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://blog-post-website-backend.onrender.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### Login User
Authenticate and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Get Current User
Get authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Blog Post Endpoints

### Get All Posts
Retrieve all blog posts with optional filters.

**Endpoint:** `GET /blog-posts`

**Query Parameters:**
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| page | number | Page number (default: 1) | No |
| limit | number | Posts per page (default: 10) | No |
| status | string | Filter by status (Draft/Published/Scheduled) | No |
| author | string | Filter by author ID | No |
| search | string | Search in title and summary | No |
| category | string | Filter by category | No |

**Example Request:**
```
GET /blog-posts?page=1&limit=10&status=Published&category=Technology
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "title": "Getting Started with React",
      "summary": "A comprehensive guide to React...",
      "blog_content": "React is a JavaScript library...",
      "image": {
        "url": "https://res.cloudinary.com/...",
        "filename": "blog-image.jpg",
        "publicId": "blog-posts/abc123"
      },
      "categories": ["React", "JavaScript"],
      "tags": ["frontend", "tutorial"],
      "author_name": "DeshIt-BD Team",
      "status": "Published",
      "views": 150,
      "is_featured": true,
      "publish_date": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1
  }
}
```

---

### Get Post by ID
Retrieve a single blog post by ID.

**Endpoint:** `GET /blog-posts/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "title": "Getting Started with React",
    "summary": "A comprehensive guide...",
    "blog_content": "React is a JavaScript library...",
    "image": {
      "url": "https://res.cloudinary.com/...",
      "filename": "blog-image.jpg"
    },
    "categories": ["React", "JavaScript"],
    "tags": ["frontend", "tutorial"],
    "author_name": "DeshIt-BD Team",
    "status": "Published",
    "views": 150,
    "slug": "getting-started-with-react",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Blog post not found"
}
```

---

### Get Post by Slug
Retrieve a blog post by its URL slug (also increments views).

**Endpoint:** `GET /blog-posts/slug/:slug`

**Example:**
```
GET /blog-posts/slug/getting-started-with-react
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "title": "Getting Started with React",
    "slug": "getting-started-with-react",
    "views": 151,
    // ... other fields
  }
}
```

---

### Create Post
Create a new blog post (requires authentication).

**Endpoint:** `POST /blog-posts`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "title": "My New Blog Post",
  "summary": "A brief summary of the post",
  "blog_content": "Full content of the blog post...",
  "categories": ["Technology", "Web Development"],
  "tags": ["coding", "tutorial"],
  "author_name": "DeshIt-BD Team",
  "is_featured": false,
  "meta_description": "SEO description",
  "publish_date": "2024-01-01",
  "publish_time": "10:00",
  "image": {
    "url": "https://res.cloudinary.com/...",
    "filename": "image.jpg"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "title": "My New Blog Post",
    "status": "Draft",
    "slug": "my-new-blog-post",
    // ... other fields
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Title, summary, and blog content are required"
}
```

---

### Update Post
Update an existing blog post (requires authentication).

**Endpoint:** `PUT /blog-posts/:id`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "summary": "Updated summary",
  "blog_content": "Updated content",
  "categories": ["Updated Category"],
  "tags": ["updated", "tags"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Blog post updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "title": "Updated Title",
    "updatedAt": "2024-01-02T00:00:00.000Z",
    // ... other fields
  }
}
```

---

### Publish Post
Change post status to Published (requires authentication).

**Endpoint:** `PATCH /blog-posts/:id/publish`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Blog post published successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "status": "Published",
    "publish_date": "2024-01-02T00:00:00.000Z",
    // ... other fields
  }
}
```

---

### Delete Post
Delete a blog post (requires authentication).

**Endpoint:** `DELETE /blog-posts/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Blog post not found"
}
```

---

## Upload Endpoints

### Upload Image
Upload an image to Cloudinary (requires authentication).

**Endpoint:** `POST /upload/image`

**Headers:**
```json
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
- Form data with field name: `image`
- Accepted formats: jpg, jpeg, png, gif, webp
- Max file size: 5MB

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/blog-posts/image.jpg",
    "publicId": "blog-posts/image",
    "width": 1200,
    "height": 630
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

---

### Delete Image
Delete an image from Cloudinary (requires authentication).

**Endpoint:** `DELETE /upload/image/:publicId`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Error Responses

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting for production:
- Login attempts: 5 per minute
- API requests: 100 per minute per user
- File uploads: 10 per hour per user

---

## Best Practices

1. **Always include error handling** in your client code
2. **Store tokens securely** (httpOnly cookies or secure localStorage)
3. **Refresh tokens** before they expire
4. **Validate input** on the client side before sending requests
5. **Handle network errors** gracefully
6. **Use pagination** for large datasets
7. **Compress images** before uploading
8. **Cache responses** when appropriate

---

## Example Usage (JavaScript)

### Using Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
};

// Get all posts
const getAllPosts = async (params) => {
  try {
    const response = await api.get('/blog-posts', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Create post
const createPost = async (postData) => {
  try {
    const response = await api.post('/blog-posts', postData);
    return response.data;
  } catch (error) {
    console.error('Create error:', error);
    throw error;
  }
};

// Upload image
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

---

