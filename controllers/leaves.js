const Leave = require('../models/leave');

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'name profileImage');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLeave = async (req, res) => {
    const { employee, date, reason } = req.body;
    const leave = new Leave({
      employee,
      date,
      reason,
      docs: req.file ? req.file.path : null,
    });
  
    try {
      const newLeave = await leave.save();
      res.status(201).json(newLeave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.updateLeaveStatus = async (req, res) => {
    try {
      const leave = await Leave.findById(req.params.id);
      if (leave == null) {
        return res.status(404).json({ message: 'Cannot find leave' });
      }
  
      if (req.body.status != null) {
        leave.status = req.body.status;
      }
  
      const updatedLeave = await leave.save();
      res.json(updatedLeave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.deleteLeave = async (req, res) => {
    try {
      const leave = await Leave.findById(req.params.id);
      if (leave == null) {
        return res.status(404).json({ message: 'Cannot find leave' });
      }
  
      await Leave.deleteOne({ _id: req.params.id });
      res.json({ message: 'Deleted Leave' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }; 