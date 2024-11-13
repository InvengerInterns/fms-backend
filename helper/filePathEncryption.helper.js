import { decrypt } from '../utils/fileEncryption.util.js';

// Function to decrypt all file path fields dynamically
const decryptFilePaths = (employee) => {
  const decryptedEmployee = { ...employee.toJSON() };

  // Get all fields in the employee record
  const employeeFields = Object.keys(decryptedEmployee);

  // Loop through all fields, decrypt those whose name starts with "upload" (or any other pattern)
  employeeFields.forEach((field) => {
    if (field.startsWith('upload') && decryptedEmployee[field]) {
      decryptedEmployee[field] = decrypt(decryptedEmployee[field]);
    }
  });

  return decryptedEmployee;
};

export { decryptFilePaths };
