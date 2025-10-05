const cloudinary = require('../config/cloudinary');

class UploadController {
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: req.file.path, 
          publicId: req.file.filename,
          width: req.file.width,
          height: req.file.height
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image'
      });
    }
  }

  async deleteImage(req, res) {
    try {
      const { publicId } = req.params;
      
      await cloudinary.uploader.destroy(publicId);
      
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  }
}

module.exports = new UploadController();