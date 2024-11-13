import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';

const uploadDirectory = path.resolve('uploads');

// File filter to allow PDFs, Word documents, and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs, Word documents, and images are allowed'), false);
  }
};

// Multer storage setup
const storage = multer.memoryStorage(); // Store files in memory for processing

// Initialize multer with storage, file filter, and limits
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max for incoming files
}).any(); // Accept files from any form field name

// Middleware to handle file upload, processing, and directory management
const fileUploadMiddleware = async (req, res, next) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  // Create employee-specific folder if it doesn't exist
  const employeeFolder = path.join(uploadDirectory, employeeId);
  await fs.ensureDir(employeeFolder);

  // Proceed with multer file handling
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const filePromises = req.files.map(async (file) => {
      const documentName = file.fieldname; // Use fieldname as document name
      const today = moment().format('YYYYMMDD_HHmmss'); // Date format
      const fileExt = path.extname(file.originalname);
      const newFileName = `${employeeId}_${documentName}_${today}${fileExt}`;
      const newFilePath = path.join(employeeFolder, newFileName);

      try {
        if (file.mimetype.startsWith('image/') && file.size > 1 * 1024 * 1024) {
          // Compress images larger than 1MB
          await sharp(file.buffer)
            .resize({ width: 1024 }) // Optional resize for large images
            .toFormat(file.mimetype === 'image/png' ? 'png' : 'jpeg') // Keep original format or convert to jpeg
            .jpeg({ quality: 70 }) // Adjust quality
            .toFile(newFilePath);
        } else {
          // For non-image files or smaller images, save directly
          await fs.writeFile(newFilePath, file.buffer);
        }

        if (!req.filePaths) req.filePaths = [];
        req.filePaths.push(newFilePath);

      } catch (error) {
        console.error('File processing error:', error);
        return res.status(500).json({ error: 'Failed to process file' });
      }
    });

    await Promise.all(filePromises);
    next();
  });
};

export default fileUploadMiddleware;
