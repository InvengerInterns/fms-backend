import Employee from '../models/employee.model.js';

/**
 * Helper function to process uploaded files.
 * Maps field names to their respective saved paths.
 * @param {Array} uploadedFiles - Array of uploaded file objects
 * @returns {Object} - Object mapping field names to file paths
 */
const processUploadedFiles = (uploadedFiles) => {
  return uploadedFiles.reduce((fileMap, file) => {
    fileMap[file.fieldName] = file.savedPath.replace(
      'C:\\\\Users\\\\Nishanth Shivananda\\\\Desktop\\\\Projects\\\\Office-Based\\\\Node-JS\\\\fms-backend\\\\',
      'uploads/'
    );
    return fileMap;
  }, {});
};

/**
 * Create a new employee.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body; // Extract employee data from the request body
    console.log('Employee Data:', employeeData);

    // If uploadedFiles exist, process them
    let uploadedFiles = [];
    if (typeof employeeData.uploadedFiles === 'string') {
      uploadedFiles = JSON.parse(employeeData.uploadedFiles); // Parse if it's a string
    } else if (Array.isArray(employeeData.uploadedFiles)) {
      uploadedFiles = employeeData.uploadedFiles; // Use directly if it's already an array
    }

    if (uploadedFiles.length > 0) {
      const fileMap = await processUploadedFiles(uploadedFiles); // Map field names to paths
      Object.assign(employeeData, fileMap); // Merge file paths into employee data
    }

    // Create a new employee
    const newEmployee = await Employee.create(employeeData);

    // Respond with the newly created employee data
    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

/**
 * Update employee details.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params; // Extract employeeId from request parameters
    const updateData = req.body; // Extract fields to update from request body
    delete updateData.status; // Exclude 'status' from update data

    // If uploadedFiles exist, process them
    let uploadedFiles = [];
    if (typeof updateData.uploadedFiles === 'string') {
      uploadedFiles = JSON.parse(updateData.uploadedFiles); // Parse if it's a string
    } else if (Array.isArray(updateData.uploadedFiles)) {
      uploadedFiles = updateData.uploadedFiles; // Use directly if it's already an array
    }

    if (uploadedFiles.length > 0) {
      const fileMap = processUploadedFiles(uploadedFiles); // Map field names to paths
      Object.assign(updateData, fileMap); // Merge file paths into update data
    }

    const employee = await Employee.findByPk(employeeId); // Fetch employee by ID

    if (employee) {
      await employee.update(updateData); // Update employee details
      res
        .status(200)
        .json({ message: 'Employee details updated successfully', employee });
    } else {
      res.status(404).json({ message: 'Employee not found' }); // Employee not found
    }
  } catch (error) {
    console.error('Error updating employee details:', error);
    res.status(500).json({
      message: 'Error updating employee details',
      error: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {};

const getAllEmployees = async (req, res) => {};

const updateEmployeeStatus = async (req, res) => {};

export {
  getEmployeeById,
  getAllEmployees,
  updateEmployeeDetails,
  createEmployee,
  updateEmployeeStatus,
};
