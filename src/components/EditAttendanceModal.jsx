import React, { useState, useEffect } from 'react';
import api from '../api';

const EditAttendanceModal = ({ open, onClose, attendance, fetchAttendance }) => {
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (attendance) {
      setTask(attendance.task || '');
      setStatus(attendance.status || '');
    }
  }, [attendance]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance', {
        employee: attendance._id,
        date: new Date().toISOString().split('T')[0],
        status,
        task,
      });
      if (fetchAttendance) fetchAttendance();
      onClose();
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const isFormInvalid = !status || !task;

  const renderInput = (label, value) => (
    <div className="add-candidate-input-group has-value">
      <input type="text" value={value || ''} disabled />
      <label className="add-candidate-input-label">{label} <span className="required-star">*</span></label>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="edit-employee-modal">
        <div className="edit-employee-modal-top">
          <span className="edit-employee-modal-title">Edit Attendance</span>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form className="edit-employee-form" onSubmit={handleSubmit}>
          <div className="edit-employee-form-fields">
            {renderInput('Employee Name', attendance.name)}
            {renderInput('Position', attendance.position)}
            {renderInput('Department', attendance.department)}
            <div className={`add-candidate-input-group ${task ? 'has-value' : ''}`}>
              <input
                id="task"
                name="task"
                type="text"
                placeholder=" "
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <label htmlFor="task" className="add-candidate-input-label">Task <span className="required-star">*</span></label>
            </div>
            <div className={`add-candidate-input-group ${status ? 'has-value' : ''}`}>
              <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="" disabled hidden></option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="on-leave">On Leave</option>
              </select>
              <label htmlFor="status" className="add-candidate-input-label">Status <span className="required-star">*</span></label>
            </div>
          </div>
          <button className="edit-employee-save-btn" type="submit" disabled={isFormInvalid}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditAttendanceModal; 