import Employee from '../models/employee.model.js';
import {
  decryptFilePathsInEmployeeData,
} from '../helper/filePathEncryption.helper.js';
import { Op } from 'sequelize';
import EmployeeProfessionalDetailsMaster from '../models/employeeProfessionalMaster.model.js';
import {
  checkClientData,
  getCustomQueryResults,
} from '../utils/customQuery.util.js';
import { employeeStatus } from '../constants.js';
import BusinessUnitMaster from '../models/buisnessUnitMaster.model.js';
import sequelize from '../config/dbConnection.config.js';
import {
  encryptFilePaths,
  extractUploadedFiles,
  processUploadedFilesData,
  updateBusinessUnitAndEmployeeStatus,
} from '../helper/employee.helper.js';
import { calculateEmployeeWorkStatus } from '../helper/business-master.helper.js';
import { sendResponse } from '../utils/index.util.js';
import moment from 'moment/moment.js';

//Helper function to process uploaded files.
const processUploadedFiles = (uploadedFiles) => {
  return uploadedFiles.reduce((fileMap, file) => {
    fileMap[file.fieldName] = file.savedPath.replace('/', 'uploads/');
    return fileMap;
  }, {});
};

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;

    const uploadedFiles = extractUploadedFiles(employeeData);

    if (uploadedFiles.length > 0) {
      const encryptedFiles = encryptFilePaths(uploadedFiles);
      const fileMap = await processUploadedFiles(encryptedFiles);
      Object.assign(employeeData, fileMap);
    }

    if (
      !(await checkClientData(
        employeeData.clientId,
        employeeData.businessUnitId
      ))
    ) {
      return res.status(400).json({
        message: 'Client with ID is not associated with the business unit',
      });
    }

    if (employeeData.clientId && employeeData.businessUnitId) {
      employeeData.status = 1;
    }

    const newEmployee = await Employee.create(employeeData);
    await EmployeeProfessionalDetailsMaster.create(employeeData);
    await BusinessUnitMaster.create(employeeData);

    return sendResponse(res,200,`Employee profile of ${ newEmployee.firstName+""+newEmployee.lastName } Created Successfully`,"")
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

//Update Employee Details
const updateEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = req.body;

    if (updateData.status) {
      delete updateData.status;
    }

    await processUploadedFilesData(updateData);

    const employee = await Employee.findOne({ where: { employeeId } });
    const employeeProfile = await EmployeeProfessionalDetailsMaster.findOne({
      where: { employeeId },
    });
    const mostRecentBusinessUnit = await BusinessUnitMaster.findOne({
      where: { employeeId, endDate: null },
      order: [['createdAt', 'DESC']],
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const isValidClient = await checkClientData(
      updateData.clientId,
      updateData.businessUnitId
    );
    if (!isValidClient) {
      return res.status(400).json({
        message: 'Client with ID is not associated with the business unit',
      });
    }

    if (!updateData.startDate) {
      return res
        .status(400)
        .json({ message: 'Missing startDate in the update data' });
    }

    const normalizeDate = (date) => {
      return moment(date).local().format('YYYY-MM-DD'); // Adjusts to local time and formats correctly
    };

    const updateStartDate = normalizeDate(updateData.startDate);
    const mostRecentStartDate = mostRecentBusinessUnit
      ? normalizeDate(mostRecentBusinessUnit.startDate)
      : null;

    await sequelize.transaction(async (transaction) => {
      await employee.update(updateData, { transaction });

      await employeeProfile.update(updateData, { transaction });

      const employeeContext = { employee, employeeId };

      const businessUnitContext = {
        mostRecentBusinessUnit,
        updateData,
        updateStartDate,
        mostRecentStartDate,
      };

      await updateBusinessUnitAndEmployeeStatus(
        employeeContext,
        businessUnitContext,
        transaction
      );
    });

    return sendResponse(res,200,"Employee Details Updated Successfully","")
  } catch (error) {
    return sendResponse(res,500,"Error",error.message)
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

    return sendResponse(res,200,"",{
      employee: decryptedEmployee,
      employeeProfile: decryptedEmployeeProfile,
    });
  } catch (error) {
    return sendResponse(res,500,"Error",error.message)
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

    const decryptedEmployees = results.map((result) => {
      const decryptedData = decryptFilePathsInEmployeeData(result);
      return {
        ...decryptedData,
        statusText:
          decryptedData.status === 1
            ? employeeStatus.ACTIVE
            : decryptedData.status === 0
              ? employeeStatus.RELIEVED
              : decryptedData.status === 2
                ? employeeStatus.ACTIVE_IDLE
                : 'Unknown', // Default case for unexpected status
      };
    });

    return sendResponse(res,200,"",decryptedEmployees);
  } catch (error) {
    return sendResponse(res,500,"Error",error.message)
  }
};

// Get Employee Client History Based on their employee ID
const getEmployeeClientHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const tables = [
      'business_unit_masters',
      'employees',
      'clientdetails',
      'business_units',
    ];
    const joins = [
      {
        joinType: 'INNER',
        onCondition: 'business_unit_masters.employeeId = employees.employeeId',
      },
      {
        joinType: 'INNER',
        onCondition: 'business_unit_masters.clientId = clientdetails.clientId',
      },
      {
        joinType: 'INNER',
        onCondition:
          'business_unit_masters.businessUnitId = business_units.businessId',
      },
    ];
    const attributes = [
      'employees.employeeId',
      'employees.employeeImage',
      'CONCAT(employees.firstName, " ", employees.lastName) AS employeeName',
      'clientdetails.clientName',
      'business_units.businessName',
      'business_unit_masters.startDate',
      'business_unit_masters.endDate',
      'business_unit_masters.status AS businessUnitStatus',
      'employees.status AS employeeStatus',
    ];
    const whereCondition = `business_unit_masters.employeeId = ${employeeId}`;

    const employeeClientHistory = await getCustomQueryResults(
      tables,
      joins,
      attributes,
      whereCondition
    );

    const enhancedDetails = employeeClientHistory.map((record) => {
      const employeeWorkStatus = calculateEmployeeWorkStatus(record);

      const employeeData = record
        ? decryptFilePathsInEmployeeData(record)
        : null;

      return {
        employeeData, // Include all other fields except `employeeStatus` and `businessUnitStatus`
        employeeWorkStatus, // Add `employeeWorkStatus`
      };
    });

    return sendResponse(res,200,"",enhancedDetails)
  } catch (error) {
    return sendResponse(res,500,"Error",error.message)
  }
};

const updateEmployeeStatus = async (req, res) => {};

export {
  getEmployeeById,
  getAllEmployees,
  updateEmployeeDetails,
  createEmployee,
  updateEmployeeStatus,
  getEmployeeClientHistory,
};
