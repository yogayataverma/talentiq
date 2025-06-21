const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');

router.get('/', attendanceController.getAllAttendance);
router.post('/', attendanceController.createOrUpdateAttendance);

module.exports = router; 