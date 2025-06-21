const Attendance = require('../models/attendance');

exports.getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      const searchDate = new Date(date);
      const startDate = new Date(searchDate.setUTCHours(0, 0, 0, 0));
      const endDate = new Date(searchDate.setUTCHours(23, 59, 59, 999));
      query.date = { $gte: startDate, $lte: endDate };
    }
    const attendance = await Attendance.find(query).populate('employee');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrUpdateAttendance = async (req, res) => {
  const { employee, date, status, task } = req.body;

  try {
    const searchDate = new Date(date);
    const startDate = new Date(searchDate.setUTCHours(0, 0, 0, 0));
    const endDate = new Date(searchDate.setUTCHours(23, 59, 59, 999));

    let attendance = await Attendance.findOne({ 
      employee, 
      date: { $gte: startDate, $lte: endDate } 
    });

    if (attendance) {
      attendance.status = status;
      if(task !== undefined) attendance.task = task;
    } else {
      attendance = new Attendance({
        employee,
        date: startDate,
        status,
        task
      });
    }

    const updatedAttendance = await attendance.save();
    await updatedAttendance.populate('employee');
    res.status(201).json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 