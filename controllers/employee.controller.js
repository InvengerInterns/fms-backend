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

export{
  createEmployee,
  getAllEmployees
 
};

