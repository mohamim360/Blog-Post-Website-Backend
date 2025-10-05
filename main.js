const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const blogPostRoutes = require('./src/routes/blogPostRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes'); 

// Connect to database
connectDB();

const app = express();
const path = require('path');

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog-posts', blogPostRoutes)
app.use('/api/upload', uploadRoutes); 

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  // Handle multer errors
  if (error.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});