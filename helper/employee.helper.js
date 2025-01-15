import BusinessUnitMaster from '../models/buisnessUnitMaster.model.js';
import { encryptFilePath } from './filePathEncryption.helper.js';

const extractUploadedFiles = (employeeData) => {
  let uploadedFiles = [];
  if (typeof employeeData.uploadedFiles === 'string') {
    uploadedFiles = JSON.parse(employeeData.uploadedFiles);
  } else if (Array.isArray(employeeData.uploadedFiles)) {
    uploadedFiles = employeeData.uploadedFiles;
  }
  return uploadedFiles;
};

const encryptFilePaths = (uploadedFiles) => {
  return uploadedFiles.map((file) => {
    if (typeof file.savedPath === 'string') {
      return {
        ...file,
        savedPath: encryptFilePath(file.savedPath),
      };
    } else {
      throw new Error('Invalid savedPath format. Expected a string.');
    }
  });
};

// Update employee Files.
const processUploadedFilesData = (updateData) => {
  let uploadedFiles = [];
  if (typeof updateData.uploadedFiles === 'string') {
    uploadedFiles = JSON.parse(updateData.uploadedFiles);
  } else if (Array.isArray(updateData.uploadedFiles)) {
    uploadedFiles = updateData.uploadedFiles;
  }

  if (uploadedFiles.length > 0) {
    const fileMap = processUploadedFiles(uploadedFiles);
    Object.assign(updateData, fileMap);
  }
};

const updateBusinessUnitAndEmployeeStatus = async (
  employeeContext,
  businessUnitContext,
  transaction
) => {
  const { employee, employeeId } = employeeContext;

  const {
    mostRecentBusinessUnit,
    updateData,
    updateStartDate,
    mostRecentStartDate,
  } = businessUnitContext;

  if (updateData.endDate && mostRecentBusinessUnit) {
    if (
      mostRecentStartDate === updateStartDate &&
      mostRecentBusinessUnit.status === 'Active'
    ) {
      await mostRecentBusinessUnit.update(
        {
          endDate: updateData.endDate,
          status: 'Served',
        },
        { transaction }
      );
      await employee.update(
        {
          status: 2,
        },
        { transaction }
      );
    }
  }

  if (
    shouldCreateNewBusinessUnit.call(
      this,
      mostRecentBusinessUnit,
      mostRecentStartDate,
      updateStartDate
    )
  ) {
    await BusinessUnitMaster.create(
      {
        employeeId,
        startDate: updateStartDate,
        ...updateData,
      },
      { transaction }
    );
    await employee.update(
      {
        status: 1,
      },
      { transaction }
    );
  }
};

function shouldCreateNewBusinessUnit(
  mostRecentBusinessUnit,
  mostRecentStartDate,
  updateStartDate
) {
  return (
    !mostRecentBusinessUnit ||
    (mostRecentStartDate !== updateStartDate &&
      mostRecentBusinessUnit.status !== 'Active')
  );
}

export {
  extractUploadedFiles,
  encryptFilePaths,
  processUploadedFilesData,
  updateBusinessUnitAndEmployeeStatus,
};
