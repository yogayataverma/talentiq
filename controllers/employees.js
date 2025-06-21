const Employee = require('../models/employee');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  const employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    position: req.body.position,
    department: req.body.department,
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({ message: 'Cannot find employee' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({ message: 'Cannot find employee' });
    }

    if (req.body.name != null) {
      employee.name = req.body.name;
    }
    if (req.body.email != null) {
      employee.email = req.body.email;
    }
    if (req.body.position != null) {
      employee.position = req.body.position;
    }
    if (req.body.department != null) {
      employee.department = req.body.department;
    }

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({ message: 'Cannot find employee' });
    }

    await Employee.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Employee' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 