import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiUpload, FiSearch } from 'react-icons/fi';
import api from '../api';
import './EditEmployeeModal.css';

const AddLeaveModal = ({ open, onClose, fetchLeaves, employees: presentEmployees }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveDate, setLeaveDate] = useState(null);
  const [reason, setReason] = useState('');
  const [docs, setDocs] = useState(null);
  const [docName, setDocName] = useState('');

  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setSelectedEmployee(null);
      setLeaveDate(null);
      setReason('');
      setDocs(null);
      setDocName('');
      setEmployees(presentEmployees || []);
    }
  }, [open, presentEmployees]);

  if (!open) return null;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedEmployee(null);
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchTerm(employee.name);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocs(file);
      setDocName(file.name);
    }
  };

  const filteredEmployees = searchTerm && !selectedEmployee
    ? employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !leaveDate || !reason) {
      alert('Please fill all required fields');
      return;
    }
    const formData = new FormData();
    formData.append('employee', selectedEmployee._id);
    formData.append('date', leaveDate.toISOString());
    formData.append('reason', reason);
    if (docs) {
      formData.append('docs', docs);
    }

    try {
      await api.post('/leaves', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchLeaves();
      onClose();
    } catch (error) {
      console.error('Error creating leave:', error);
    }
  };

  const isFormInvalid = !selectedEmployee || !leaveDate || !reason;

  return (
    <div className="modal-overlay">
      <div className="edit-employee-modal">
        <div className="edit-employee-modal-top">
          <span className="edit-employee-modal-title">Add Leave</span>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form className="edit-employee-form" onSubmit={handleSubmit}>
          <div className="edit-employee-form-fields">
            <div className={`add-candidate-input-group ${searchTerm ? 'has-value' : ''}`}>
              <div className="with-search-icon">
                <FiSearch className="input-icon search-icon" style={{ top: '22px'}} />
                <input
                  id="employeeName"
                  type="text"
                  placeholder=" "
                  value={searchTerm}
                  onChange={handleSearch}
                  required
                  autoComplete="off"
                  style={{ paddingLeft: 52 }}
                />
              </div>
              <label htmlFor="employeeName" className="add-candidate-input-label">Employee Name <span className="required-star">*</span></label>
              {filteredEmployees.length > 0 && (
                <ul className="search-results">
                  {filteredEmployees.map(emp => (
                    <li key={emp._id} onClick={() => handleSelectEmployee(emp)}>
                      {emp.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className={`add-candidate-input-group ${selectedEmployee ? 'has-value' : ''}`}>
              <input
                id="designation"
                type="text"
                placeholder=" "
                value={selectedEmployee ? selectedEmployee.position : ''}
                readOnly
                required
              />
              <label htmlFor="designation" className="add-candidate-input-label">Designation</label>
            </div>

            <div className={`add-candidate-input-group leave-date-group ${leaveDate ? 'has-value' : ''}`}>
                <div className="with-calendar-icon">
                    <DatePicker
                        id="leaveDate"
                        selected={leaveDate}
                        onChange={date => setLeaveDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText=" "
                        required
                    />
                    <FiCalendar className="input-icon" />
                </div>
              <label htmlFor="leaveDate" className="add-candidate-input-label">Leave Date <span className="required-star">*</span></label>
            </div>

            <div className={`add-candidate-input-group ${reason ? 'has-value' : ''}`}>
              <input
                id="reason"
                type="text"
                placeholder=" "
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
              <label htmlFor="reason" className="add-candidate-input-label">Reason <span className="required-star">*</span></label>
            </div>

            <div className={`add-candidate-input-group with-calendar-icon upload-group ${docName ? 'has-value' : ''}`}>
              <input
                type="text"
                id="doc-display"
                value={docName}
                readOnly
                placeholder=" "
                onClick={() => document.getElementById('docs').click()}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="doc-display" className="add-candidate-input-label">Upload Document</label>
              <FiUpload 
                className="input-icon" 
                onClick={() => document.getElementById('docs').click()}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              <input
                id="docs"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <button className="edit-employee-save-btn" type="submit" disabled={isFormInvalid}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddLeaveModal; 