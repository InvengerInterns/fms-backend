import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';
import mime from 'mime-types'; // To validate file extensions
import Employee from '../models/employee.model.js';

// Allowed MIME types
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Set the base directory for uploads
const uploadDirectory = path.resolve('uploads');

// Max file size (in bytes): e.g., 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Multer storage setup
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { employeeId } = req.body;

      const existingEmployee = await Employee.findOne({
        where: { employeeId },
      });

      if (existingEmployee) {
        return cb(new Error('Employee ID already exists'), null);
      }

      if (!employeeId) {
        return cb(new Error('Employee ID is required'), null);
      }

      // Sanitize employeeId to prevent directory traversal attacks
      const sanitizedEmployeeId = employeeId.replace(/[^a-zA-Z0-9_-]/g, '');
      if (!sanitizedEmployeeId) {
        return cb(new Error('Invalid Employee ID'), null);
      }

      // Create the employee-specific folder if it doesn't exist
      const employeeFolder = path.join(uploadDirectory, sanitizedEmployeeId);
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

    // Sanitize file name to prevent injection attacks
    const sanitizedFileName = path
      .parse(file.originalname)
      .name.replace(/[^a-zA-Z0-9_-]/g, '');

    if (!sanitizedFileName) {
      return cb(new Error('Invalid file name'), null);
    }

    const extension = path.extname(file.originalname); // Extract file extension
    const today = moment().format('YYYY-MM-DD-HHMMss'); // Today's date in YYYYMMDD format
    const newFilename = `${sanitizedFileName}_${today}_${employeeId}${extension}`;

    cb(null, newFilename);
  },
});

// Initialize multer for multiple file uploads
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // Set file size limit
  },
  fileFilter: (req, file, cb) => {
    const mimetype = file.mimetype;
    const extension = mime.extension(mimetype);

    if (!allowedMimeTypes.includes(mimetype) || !extension) {
      return cb(new Error('Unsupported file type'), false);
    }

    cb(null, true);
  },
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
