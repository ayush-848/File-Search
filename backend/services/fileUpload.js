const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
require('dotenv').config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Allowed file formats
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'pdf'];

// Custom storage engine (in-memory)
const storage = multer.memoryStorage();

// Create multer instance with file filter and size limit
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const format = file.mimetype.split('/')[1];  // Get file format
    if (ALLOWED_FORMATS.includes(format)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file format. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'uploads',
        resource_type: 'auto',  // Automatically detects the resource type
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);  // Log Cloudinary error
          reject(error); // Reject if there's an error during upload
        } else {
          resolve(result);  // Resolve with the result if successful
        }
      }
    );

    // Create readable stream from the file buffer
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);  // Pipe to Cloudinary upload stream
  });
};

// Middleware to handle file upload
const handleFileUpload = async (req, res, next) => {
  console.log('Received file:', req.file);  // Log the received file information

  if (!req.file) {
    console.log('No file uploaded, skipping Cloudinary upload');
    next();  // No file uploaded, proceed with the next middleware
    return;
  }

  try {
    const result = await uploadToCloudinary(req.file);  // Upload the file to Cloudinary
    console.log('Cloudinary upload successful, file details:', result);

    // Update the file details with Cloudinary response
    req.file.filename = result.public_id;
    req.file.path = result.secure_url;
    req.file.size = result.bytes;
    next();  // Continue to the next middleware
  } catch (error) {
    console.error('Error during file upload:', error.message);  // Log the error message
    res.status(500).json({
      success: false,
      message: "Error uploading file to Cloudinary",
      error: error.message,  // Include the error message from the upload attempt
    });
  }
};

module.exports = {
  upload,
  handleFileUpload
};
