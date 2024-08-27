import Employee from '../models/Employee.model.js'; // Import the Employee model

const createEmployee = async (req, res) => {
  try {
    // Creating a new employee using the entire request body
    const newEmployee = await Employee.create(req.body);

    // Responding with the newly created employee data
    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee,
    });
  } catch (error) {
    // Handling errors
    console.error('Error creating employee:', error);
    res.status(500).json({
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

//Get All Employees
const getAllEmployees = async (req, res) => {
  try {
    // Fetch all employees from the database
    const employees = await Employee.findAll();

    // Respond with the list of employees
    res.status(200).json(employees);
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};
//Get Employee By EmployeeId
const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params; // Extract the employeeId from the request parameters

    // Fetch the employee by primary key (employeeId)
    const employee = await Employee.findByPk(employeeId);

    if (employee) {
      // If the employee is found, respond with the employee data
      return res.status(200).json(employee);
    } else {
      // If the employee is not found, respond with a 404 status code
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({ message: 'Error fetching employee', error });
  }
};

//Update the employee Details

const updateEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params; // Extract the employeeId from the request parameters
    const updateData = req.body; // Extract the fields to be updated from the request body

    // Find the employee by employeeId
    const employee = await Employee.findByPk(employeeId);

    if (employee) {
      // Update the employee's details with the data provided in the request body
      await employee.update(updateData);

      // Respond with the updated employee data
      res.status(200).json({ message: 'Employee details updated successfully', employee });
    } else {
      // If the employee is not found, respond with a 404 status code
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the update
    res.status(500).json({ message: 'Error updating employee details', error });
  }
};




export{
  createEmployee,
  getAllEmployees,
  getEmployeeById
 
};
