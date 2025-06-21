import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi';
import './EditEmployeeModal.css';
import api from '../api';

const EditEmployeeModal = ({ open, onClose, employee, fetchEmployees }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    dateOfJoining: '',
  });

  const positionOptions = ['Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'];

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        dateOfJoining: employee.dateOfJoining ? new Date(employee.dateOfJoining).toISOString().split('T')[0] : '',
      });
    }
  }, [employee]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/employees/${employee._id}`, form);
      fetchEmployees();
      onClose();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const isFormInvalid = !form.name || !form.email || !form.phone || !form.position || !form.department || !form.dateOfJoining;

  return (
    <div className="modal-overlay">
      <div className="edit-employee-modal">
        <div className="edit-employee-modal-top">
          <span className="edit-employee-modal-title">Edit Employee</span>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form className="edit-employee-form" onSubmit={handleSubmit}>
          <div className="edit-employee-form-fields">
            <div className={`add-candidate-input-group ${form.name ? 'has-value' : ''}`}>
              <input id="name" name="name" type="text" placeholder=" " value={form.name} onChange={handleChange} required />
              <label htmlFor="name" className="add-candidate-input-label">Full Name <span className="required-star">*</span></label>
            </div>
            <div className={`add-candidate-input-group ${form.email ? 'has-value' : ''}`}>
              <input id="email" name="email" type="email" placeholder=" " value={form.email} onChange={handleChange} required />
              <label htmlFor="email" className="add-candidate-input-label">Email Address <span className="required-star">*</span></label>
            </div>
            <div className={`add-candidate-input-group ${form.phone ? 'has-value' : ''}`}>
              <input id="phone" name="phone" type="text" placeholder=" " value={form.phone} onChange={handleChange} required />
              <label htmlFor="phone" className="add-candidate-input-label">Phone number <span className="required-star">*</span></label>
            </div>
            <div className={`add-candidate-input-group ${form.position ? 'has-value' : ''}`}>
              <select id="position" name="position" value={form.position} onChange={handleChange} required>
                <option value="" disabled hidden></option>
                {positionOptions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
              <label htmlFor="position" className="add-candidate-input-label">Position <span className="required-star">*</span></label>
            </div>
            <div className={`add-candidate-input-group ${form.department ? 'has-value' : ''}`}>
              <input id="department" name="department" type="text" placeholder=" " value={form.department} onChange={handleChange} required />
              <label htmlFor="department" className="add-candidate-input-label">Department <span className="required-star">*</span></label>
            </div>
            <div className={`add-candidate-input-group with-calendar-icon ${form.dateOfJoining ? 'has-value' : ''}`}>
              <DatePicker
                id="dateOfJoining"
                selected={form.dateOfJoining ? new Date(form.dateOfJoining) : null}
                onChange={date => setForm({ ...form, dateOfJoining: date ? date.toISOString().split('T')[0] : '' })}
                dateFormat="yyyy-MM-dd"
                placeholderText=" "
                required
              />
              <label htmlFor="dateOfJoining" className="add-candidate-input-label">Date of Joining <span className="required-star">*</span></label>
              <FiCalendar className="input-icon" />
            </div>
          </div>
          <button className="edit-employee-save-btn" type="submit" disabled={isFormInvalid}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal; 