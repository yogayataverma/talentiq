import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Leaves.css';
import api from '../api';
import AddLeaveModal from './AddLeaveModal';
import { useOutletContext } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';

const Leaves = () => {
  const [date, setDate] = useState(new Date());
  const [leavesData, setLeavesData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const { showAddLeaveModal, setShowAddLeaveModal, filters, presentEmployees } = useOutletContext();

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leaves');
      setLeavesData(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filteredLeaves = leavesData.filter(leave => {
    if (!filters) return true;

    const statusFilter = filters.status?.toLowerCase();
    const statusMatch = !statusFilter || statusFilter === 'status' || leave.status.toLowerCase() === statusFilter;

    const searchTerm = (filters.searchTerm || '').toLowerCase();
    const searchTermMatch = !searchTerm ||
      (leave.employee?.name || '').toLowerCase().includes(searchTerm) ||
      (leave.reason || '').toLowerCase().includes(searchTerm) ||
      new Date(leave.date).toLocaleDateString().includes(searchTerm);

    return statusMatch && searchTermMatch;
  });

  const approvedLeaves = filteredLeaves.filter(leave => leave.status === 'approved');

  const leaveCountsByDate = approvedLeaves.reduce((acc, leave) => {
    const dateStr = new Date(leave.date).toDateString();
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/leaves/${id}`, { status: newStatus });
      setLeavesData(leavesData.map(leave => (leave._id === id ? { ...leave, status: newStatus } : leave)));
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();
      if (leaveCountsByDate[dateStr]) {
        return 'has-leave';
      }
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();
      const leaveCount = leaveCountsByDate[dateStr];
      if (leaveCount > 0) {
        return <div className="leave-count-circle">{leaveCount}</div>;
      }
    }
    return null;
  };

  const handleDownload = (docsUrl) => {
    if (!docsUrl) {
      alert('No document available.');
      return;
    }
    window.open(`https://talentiq-jwlg.onrender.com/${docsUrl}`);
  };

  return (
    <>
      <AddLeaveModal 
        open={showAddLeaveModal}
        onClose={() => setShowAddLeaveModal(false)}
        fetchLeaves={fetchLeaves}
        employees={presentEmployees}
      />
      <div className="leaves-page-layout">
        <div className="leaves-table-section leaves-page-table-section">
          <div className="dashboard-table-wrapper">
            <h3 className="section-title applied-leaves-title">Applied Leaves</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Docs</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave, idx) => (
                  <tr key={leave._id}>
                    <td><img src={leave.employee.profileImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} alt={leave.employee.name} className="profile-image" /></td>
                    <td>{leave.employee.name}</td>
                    <td>{new Date(leave.date).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <select
                        value={leave.status}
                        onChange={(e) => handleStatusChange(leave._id, e.target.value)}
                        className={`status-dropdown status-${leave.status}`}
                        style={{
                          backgroundColor: '',
                          color:
                            leave.status === 'approved' ? '#4caf50' :
                            leave.status === 'rejected' ? '#f44336' :
                            leave.status === 'pending' ? '#222' : '',
                          border: `2px solid ${
                            leave.status === 'approved' ? '#4caf50' :
                            leave.status === 'rejected' ? '#f44336' :
                            leave.status === 'pending' ? '#222' : '#ccc'
                          }`,
                        }}
                      >
                        <option value="approved" style={{ color: '#222' }}>Approved</option>
                        <option value="pending" style={{ color: '#222' }}>Pending</option>
                        <option value="rejected" style={{ color: '#222' }}>Reject</option>
                      </select>
                    </td>
                    <td style={{ position: 'relative' }}>
                      <button className="action-menu-btn" onClick={() => setOpenMenu(openMenu === idx ? null : idx)}>
                        <FiMoreVertical size={20} />
                      </button>
                      {openMenu === idx && (
                        <div className="action-menu-dropdown">
                          <div onClick={() => { handleDownload(leave.docs); setOpenMenu(null); }} className="action-menu-item">Download Docs</div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="leaves-calendar-section">
          <h3 className="section-title applied-leaves-title">Leave Calendar</h3>
          <div className="calendar-group">
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={tileClassName}
              tileContent={tileContent}
            />
            <div className="approved-leaves-section">
              <h3 className="section-title approved-leaves-title-unique">Approved Leaves</h3>
              <div className="dashboard-table-wrapper approved-leaves-table-wrapper">
                <table className="dashboard-table">
                  <tbody>
                    {approvedLeaves.map(leave => (
                      <tr key={leave._id}>
                        <td><img src={leave.employee.profileImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} alt={leave.employee.name} className="profile-image" /></td>
                        <td>{leave.employee.name}</td>
                        <td className="approved-leave-date">{new Date(leave.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaves; 