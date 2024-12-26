import Employee from '../models/employee.model.js';
import {
  encryptFilePath,
  decryptFilePath,
} from '../helper/filePathEncryption.helper.js';
import { Op } from 'sequelize';
import EmployeeProfessionalDetailsMaster from '../models/employeeProfessionalMaster.model.js';
import { getCustomQueryResults } from '../utils/customQuery.util.js';

//Helper function to process uploaded files.
const processUploadedFiles = (uploadedFiles) => {
  return uploadedFiles.reduce((fileMap, file) => {
    fileMap[file.fieldName] = file.savedPath.replace('/', 'uploads/');
    return fileMap;
  }, {});
};

// Helper function to decrypt file paths in employee data
const decryptFilePathsInEmployeeData = (employeeData) => {
  const fieldsToDecrypt = [
    'employeeImage',
    'passportphotoLink',
    'normalphotoLink',
    'resumelink',
  ];

  const decryptedData = { ...employeeData };

  for (const field of fieldsToDecrypt) {
    if (decryptedData[field]) {
      try {
        decryptedData[field] = decryptFilePath(decryptedData[field]);
      } catch (error) {
        console.error(
          `Error decrypting file path for field "${field}":`,
          error
        );
      }
    }
  }

  return decryptedData;
};

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body; // Extract employee data from the request body

    // If uploadedFiles exist, process them
    let uploadedFiles = [];
    if (typeof employeeData.uploadedFiles === 'string') {
      uploadedFiles = JSON.parse(employeeData.uploadedFiles); // Parse if it's a string
    } else if (Array.isArray(employeeData.uploadedFiles)) {
      uploadedFiles = employeeData.uploadedFiles; // Use directly if it's already an array
    }

    if (uploadedFiles.length > 0) {
      // Encrypt file paths before storing
      const encryptedFiles = uploadedFiles.map((file) => {
        if (typeof file.savedPath === 'string') {
          return {
            ...file,
            savedPath: encryptFilePath(file.savedPath), // Encrypt the savedPath
          };
        } else {
          throw new Error('Invalid savedPath format. Expected a string.');
        }
      });

      const fileMap = await processUploadedFiles(encryptedFiles); // Map field names to paths
      console.log('fileMap:', fileMap);
      Object.assign(employeeData, fileMap); // Merge file paths into employee data
    }

    // Create a new employee
    const newEmployee = await Employee.create(employeeData);

    const newEmployeeProfile =
      await EmployeeProfessionalDetailsMaster.create(employeeData);

    res.status(201).json({
      message: 'Employee created successfully',
      employeeData: {
        'basic-details': newEmployee,
        'professional-details': newEmployeeProfile,
      },
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

// Update employee details.
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

    const employee = await Employee.findOne({
      where: {
        employeeId,
      },
    }); // Fetch employee by ID

    const employeeProfile = await EmployeeProfessionalDetailsMaster.findOne({
      where: {
        employeeId,
      },
    });

    if (employee) {
      await employee.update(updateData); // Update employee details
      await employeeProfile.update(updateData); // Update employee professional details
      
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

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get the employee ID from request parameters

    // Fetch the employee by ID
    const employee = await Employee.findOne({
      where: {
        employeeId,
        status: {
          [Op.ne]: 0, // status is not equal to 0
        },
      },
    });

    const employeeProfile = await EmployeeProfessionalDetailsMaster.findOne({
      where: {
        employeeId,
      },
    });

    if (!employee) {
      return res.status(404).json({
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    // Decrypt the file paths for the employee data
    const decryptedEmployee = decryptFilePathsInEmployeeData(
      employee.dataValues
    );

    const decryptedEmployeeProfile = decryptFilePathsInEmployeeData(
      employeeProfile.dataValues
    );

    res.status(200).json({
      'basic-details': decryptedEmployee,
      'professional-details': decryptedEmployeeProfile,
    }); //Send the decrypted data
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      message: 'Error fetching employee',
      error: error.message,
    });
  }
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const tables = ['employees', 'employee_professional_details_masters'];
    const joins = [
      {
        joinType: '',
        onCondition:
          'employees.employeeId = employee_professional_details_masters.employeeId',
      },
    ];
    const attributes = null;
    const whereCondition = `employees.status != 0`;

    const results = await getCustomQueryResults(
      tables,
      joins,
      attributes,
      whereCondition
    );

    const decryptedEmployees = results.map((result) =>
      decryptFilePathsInEmployeeData(result)
    ); // Decrypt file paths for each employee

    res.status(200).json(decryptedEmployees); // Send the decrypted data
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      message: 'Error fetching employees',
      error: error.message,
    });
  }
};

const updateEmployeeStatus = async (req, res) => {};

export {
  getEmployeeById,
  getAllEmployees,
  updateEmployeeDetails,
  createEmployee,
  updateEmployeeStatus,
};
