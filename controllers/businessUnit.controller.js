import BusinessUnit from '../models/businessUnit.model.js';
import { getCustomQueryResults } from '../utils/customQuery.util.js';
import { decryptFilePathsInEmployeeData } from '../helper/filePathEncryption.helper.js';
import { calculateEmployeeWorkStatus } from '../helper/business-master.helper.js';

// Create a new business unit
const createBusinessUnit = async (req, res) => {
  try {
    const { businessName } = req.body;
    const newBusinessUnit = await BusinessUnit.create({ businessName });
    res.status(201).json(newBusinessUnit);
  } catch (error) {
    res.status(500).json({ message: 'Error creating business unit', error });
  }
};

//update business unit
const updateBusinessUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessName } = req.body;
    const businessUnit = await BusinessUnit.findOne({
      where: {
        businessId: id,
      },
    });

    console.log(businessUnit);

    if (businessUnit) {
      businessUnit.businessName = businessName;
      await businessUnit.save();
      res.json({ message: 'updated successfully', data: businessUnit });
    } else {
      res.status(404).json({ message: 'Business Unit not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete business unit
const deleteBusinessUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const businessUnit = await BusinessUnit.findByPk(id);
    if (businessUnit) {
      await businessUnit.destroy();
      res.status(204).json({ message: 'Business Unit deleted' });
    } else {
      res.status(404).json({ message: 'Business Unit not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Display all business units
const getBusinessUnits = async (req, res) => {
  try {
    const businessUnits = await BusinessUnit.findAll({
      attributes: ['businessId', 'businessName'],
    });
    res.json(businessUnits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business units', error });
  }
};

const getBusinessUnitMasterDetails = async (req, res) => {
  try {
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
    const whereCondition = null;

    const businessUnitMasterDetails = await getCustomQueryResults(
      tables,
      joins,
      attributes,
      whereCondition
    );

    if (!businessUnitMasterDetails || businessUnitMasterDetails.length === 0) {
      return res
        .status(404)
        .json({ message: 'No business unit master details found' });
    }

    // Add employeeWorkStatus to each record and exclude unwanted fields
    const enhancedDetails = businessUnitMasterDetails.map((record) => {
      const employeeWorkStatus = calculateEmployeeWorkStatus(record);

      const employeeData = record
        ? decryptFilePathsInEmployeeData(record)
        : null;

      return {
        employeeData, // Include all other fields except `employeeStatus` and `businessUnitStatus`
        employeeWorkStatus, // Add `employeeWorkStatus`
      };
    });

    res.status(200).json(enhancedDetails);
  } catch (error) {
    console.error('Error fetching business unit master details:', error);
    res
      .status(500)
      .json({ message: 'Error fetching business unit master details', error });
  }
};

export {
  createBusinessUnit,
  updateBusinessUnit,
  deleteBusinessUnit,
  getBusinessUnits,
  getBusinessUnitMasterDetails,
};
