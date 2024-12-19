import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';

// Set the base directory for uploads
const uploadDirectory = path.resolve('uploads');

// Multer storage setup
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { employeeId } = req.body;

      if (!employeeId) {
        return cb(new Error('Employee ID is required'), null);
      }

      // Create the employee-specific folder if it doesn't exist
      const employeeFolder = path.join(uploadDirectory, employeeId);
      await fs.ensureDir(employeeFolder);

      cb(null, employeeFolder); // Set destination folder to the employee's folder
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const { employeeId } = req.body;

    if (!employeeId) {
      return cb(new Error('Employee ID is required'), null);
    }

    // Construct filename: realname + today's date + employeeId + extension
    const originalName = path.parse(file.originalname).name; // Extract file name without extension
    const extension = path.extname(file.originalname); // Extract file extension
    const today = moment().format('YYYY-MM-DD-HHMMss'); // Today's date in YYYYMMDD format
    const newFilename = `${originalName}_${today}_${employeeId}${extension}`;

    cb(null, newFilename);
  },
});

// Initialize multer for multiple file uploads
const upload = multer({
  storage,
}).any(); // Accept multiple files with any field name

// Middleware to handle file upload
const fileUploadMiddleware = async (req, res, next) => {
  console.log('Incoming Request Body:', req.body);

  upload(req, res, (err) => {
    if (err) {
      console.log('Error during file upload:', err.message);
      return res.status(400).json({ error: err.message });
    }

    if (req.files && req.files.length > 0) {
      console.log('Files uploaded successfully');

      // Collect the file paths for each uploaded file
      req.body.uploadedFiles = req.files.map((file) => {
        // Extract the relative path for static access (e.g., '/uploads/{employeeId}/{filename}')
        const filePath = file.path.replace(/^.*[\\\/](uploads[\\\/])/i, '$1');
        return {
          fieldName: file.fieldname,
          originalName: file.originalname,
          savedPath: `/${filePath.replace(/\\/g, '/')}`, // Ensures proper path for URL
        };
      });
    } else {
      console.log('No files uploaded');
    }

    next(); // Proceed to the next middleware or route handler
  });
};

export default fileUploadMiddleware;
