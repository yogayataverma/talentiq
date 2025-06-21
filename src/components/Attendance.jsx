import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import api from '../api';
import EditAttendanceModal from './EditAttendanceModal';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const { filters, setPageOptions } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const [employeesRes, attendanceRes] = await Promise.all([
          api.get('/employees'),
          api.get(`/attendance?date=${today}`)
        ]);

        const attendanceMap = attendanceRes.data.reduce((acc, attendance) => {
          acc[attendance.employee._id] = attendance;
          return acc;
        }, {});

        const mergedData = employeesRes.data.map(employee => {
          const attendance = attendanceMap[employee._id];
          return {
            ...employee,
            status: attendance ? attendance.status : 'absent',
            task: attendance ? attendance.task : '',
            img: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
          };
        });

        setAttendanceData(mergedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (attendanceData.length > 0) {
      const uniqueStatuses = ['All Statuses', ...new Set(attendanceData.map(a => a.status))];
      setPageOptions({ status: uniqueStatuses });
    }
  }, [attendanceData, setPageOptions]);

  const handleStatusChange = async (employeeId, value) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        await api.post('/attendance', {
            employee: employeeId,
            date: today,
            status: value,
        });

        setAttendanceData(prev => prev.map(a => a._id === employeeId ? { ...a, status: value } : a));
    } catch (err) {
        console.error('Error updating attendance:', err);
        setError('Failed to update attendance.');
    }
  };

  const handleMenuClick = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const handleOptionClick = (option, attendance) => {
    setOpenMenu(null);
    if (option === 'Edit Attendance') {
      setSelectedAttendance(attendance);
      setIsModalOpen(true);
    } else if (option === 'Delete') {
      console.log('Delete attendance:', attendance);
    }
  };

  const filteredAttendance = attendanceData.filter(item => {
    const statusMatch = !filters.status || filters.status === 'Status' || item.status === filters.status;
    const searchTermMatch = !filters.searchTerm ||
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    return statusMatch && searchTermMatch;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Employee Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Task</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.map((a) => (
            <tr key={a._id}>
              <td><img src={a.img} alt={a.name} style={{width:32, height:32, borderRadius:'50%'}} /></td>
              <td>{a.name}</td>
              <td>{a.position}</td>
              <td>{a.department}</td>
              <td>{a.task || '-'}</td>
              <td>
                <select
                  className={`status-dropdown status-${a.status}`}
                  value={a.status}
                  onChange={e => handleStatusChange(a._id, e.target.value)}
                  style={{
                    color: a.status === 'present' ? '#1db954' : a.status === 'absent' ? '#ff4d4f' : undefined,
                    borderColor: a.status === 'present' ? '#1db954' : a.status === 'absent' ? '#ff4d4f' : '#A4A4A4'
                  }}
                >
                  <option value="present" style={{ color: '#222' }}>Present</option>
                  <option value="absent" style={{ color: '#222' }}>Absent</option>
                </select>
              </td>
              <td style={{ position: 'relative' }}>
                <button className="action-menu-btn" onClick={() => handleMenuClick(a._id)}>
                  <FiMoreVertical size={20} />
                </button>
                {openMenu === a._id && (
                  <div className="action-menu-dropdown">
                    <div onClick={() => handleOptionClick('Edit Attendance', a)} className="action-menu-item">Edit</div>
                    <div onClick={() => handleOptionClick('Delete', a)} className="action-menu-item delete">Delete</div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAttendanceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        attendance={selectedAttendance}
      />
    </div>
  );
};

export default Attendance; 