import Department from '../models/department.model.js'; // Import the Department model

// Create Department

const createDepartment = async (req, res) => {
  try {
    // Creating a new department using the request body
    const newDepartment = await Department.create(req.body);

    // Responding with the newly created department data
    res.status(201).json({
      message: 'Department created successfully',
      department: newDepartment,
    });
  } catch (error) {
    // Handling errors
    console.error('Error creating department:', error);
    res.status(500).json({
      message: 'Failed to create department',
      error: error.message,
    });
  }
};

// Update Department

const updateDepartmentDetails = async (req, res) => {
  try {
    const { departmentId } = req.params; // Extract the departmentId from request parameters
    const { managerId, departmentName } = req.body; // Extract the fields to update from request body

    // Find the department by departmentId
    const department = await Department.findByPk(departmentId);

    if (department) {
      // Update the department's managerId and departmentName
      await department.update({
        managerId: managerId || department.managerId, // If managerId is provided, update it
        departmentName: departmentName || department.departmentName, // If departmentName is provided, update it
      });

      // Respond with the updated department data
      res.status(200).json({
        message: 'Department details updated successfully',
        department,
      });
    } else {
      // If the department is not found, respond with a 404 status code
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the update
    res.status(500).json({
      message: 'Error updating department details',
      error: error.message,
    });
  }
};

export {
  createDepartment,
  updateDepartmentDetails,
};
