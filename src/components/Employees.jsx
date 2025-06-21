import React, { useState, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';
import api from '../api';
import EditEmployeeModal from './EditEmployeeModal';

const Employees = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { filters, setPageOptions } = useOutletContext();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      const uniquePositions = ['All Positions', ...new Set(employees.map(e => e.position))];
      setPageOptions({ position: uniquePositions });
    }
  }, [employees, setPageOptions]);

  const handleMenuClick = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const handleOptionClick = async (option, employee) => {
    setOpenMenu(null);
    if (option === 'Edit') {
      setSelectedEmployee(employee);
      setIsModalOpen(true);
    } else if (option === 'Delete Employee') {
      try {
        await api.delete(`/employees/${employee._id}`);
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const positionMatch = !filters.position || filters.position === 'Position' || employee.position === filters.position;
    const searchTermMatch = !filters.searchTerm ||
      Object.values(employee).some(val =>
        String(val).toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    return positionMatch && searchTermMatch;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const positionOptions = ['Position', ...new Set(employees.map(e => e.position))];

  return (
    <>
      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e._id}>
                <td><img src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" alt={e.name} style={{width:32, height:32, borderRadius:'50%'}} /></td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.phone}</td>
                <td>{e.position}</td>
                <td>{e.department}</td>
                <td>{new Date(e.dateOfJoining).toLocaleDateString()}</td>
                <td style={{ position: 'relative' }}>
                  <button className="action-menu-btn" onClick={() => handleMenuClick(e._id)}>
                    <FiMoreVertical size={20} />
                  </button>
                  {openMenu === e._id && (
                    <div className="action-menu-dropdown">
                      <div onClick={() => handleOptionClick('Edit', e)} className="action-menu-item">Edit</div>
                      <div onClick={() => handleOptionClick('Delete Employee', e)} className="action-menu-item delete">Delete</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditEmployeeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        fetchEmployees={fetchEmployees}
        positionOptions={positionOptions.slice(1)}
      />
    </>
  );
};

export default Employees; 