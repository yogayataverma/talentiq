import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FiUserPlus, FiUsers, FiBarChart, FiSun, FiLogOut } from 'react-icons/fi';
import api from '../api';

const sidebarData = [
  {
    category: 'Recruitment',
    links: [
      {
        to: 'candidates',
        icon: <FiUserPlus />,
        text: 'Candidates',
      },
    ],
  },
  {
    category: 'Organization',
    links: [
      {
        to: 'employees',
        icon: <FiUsers />,
        text: 'Employees',
      },
      {
        to: 'attendance',
        icon: <FiBarChart />,
        text: 'Attendance',
      },
      {
        to: 'leaves',
        icon: <FiSun />,
        text: 'Leaves',
      },
    ],
  },
  {
    category: 'Other',
    links: [
      {
        to: '/',
        icon: <FiLogOut />,
        text: 'Logout',
      },
    ],
  },
];

function LogoutModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="edit-employee-modal" style={{ width: 1080, height: 223, minHeight: 0 }}>
        <div className="edit-employee-modal-top">
          <span className="edit-employee-modal-title">Logout</span>
          <button className="modal-close-btn" onClick={onCancel}>×</button>
        </div>
        <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="popup-message" style={{ marginBottom: 24 }}>Are you sure you want to log out?</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              style={{
                background: '#a084ca',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '8px 24px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              style={{
                background: '#fff',
                color: '#f44336',
                border: '2px solid #f44336',
                borderRadius: '50px',
                padding: '8px 24px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={onConfirm}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const DashboardToolbar = ({
  onAddCandidate,
  onAddLeave,
  filters,
  setFilters,
  pageOptions,
}) => {
  const location = useLocation();
  const path = location.pathname;
  const isCandidates = path.startsWith('/dashboard/candidates');
  const isEmployees = path.startsWith('/dashboard/employees');
  const isAttendance = path.startsWith('/dashboard/attendance');
  const isLeaves = path.startsWith('/dashboard/leaves');

  const handleStatusChange = (e) => setFilters({ ...filters, status: e.target.value });
  const handlePositionChange = (e) => setFilters({ ...filters, position: e.target.value });
  const handleSearchChange = (e) => setFilters({ ...filters, searchTerm: e.target.value });

  return (
    <div className="dashboard-toolbar">
      <div className="dashboard-toolbar-left">
        {(isCandidates || isAttendance || isLeaves) && (
          <select className="dashboard-dropdown" value={filters.status} onChange={handleStatusChange}>
            {pageOptions?.status?.map(option => <option key={option} value={option}>{capitalize(option)}</option>)}
          </select>
        )}
        {(isCandidates || isEmployees) && (
          <select className="dashboard-dropdown" value={filters.position} onChange={handlePositionChange}>
            {pageOptions?.position?.map(option => <option key={option} value={option}>{capitalize(option)}</option>)}
          </select>
        )}
      </div>
      <div className="dashboard-toolbar-right">
        {(isCandidates || isEmployees || isAttendance || isLeaves) && (
          <>
            <input className="dashboard-toolbar-search" type="text" placeholder="Search..." value={filters.searchTerm} onChange={handleSearchChange} />
            {isCandidates && (
              <button className="dashboard-toolbar-btn" style={{ marginLeft: '12px' }} onClick={onAddCandidate}>Add Candidate</button>
            )}
          </>
        )}
        {isLeaves && (
          <button className="dashboard-toolbar-btn" onClick={onAddLeave}>Add Leave</button>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [candidateFilters, setCandidateFilters] = useState({ status: 'Status', position: 'Position', searchTerm: '' });
  const [employeeFilters, setEmployeeFilters] = useState({ position: 'Position', searchTerm: '' });
  const [attendanceFilters, setAttendanceFilters] = useState({ status: 'Status', searchTerm: '' });
  const [leavesFilters, setLeavesFilters] = useState({ status: 'Status', searchTerm: '' });

  const [pageOptions, setPageOptions] = useState({});
  const [presentEmployees, setPresentEmployees] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentEmployees = async () => {
      try {
        const [employeesRes, attendanceRes] = await Promise.all([
          api.get('/employees'),
          api.get('/attendance')
        ]);
        
        const employees = employeesRes.data;
        const attendance = attendanceRes.data;

        const today = new Date().toISOString().split('T')[0];
        const presentEmployeeIds = new Set(
          attendance
            .filter(a => a.date.startsWith(today) && a.status === 'present')
            .map(a => a.employee._id)
        );

        const presentEmps = employees.filter(e => presentEmployeeIds.has(e._id));
        setPresentEmployees(presentEmps);

      } catch (error) {
        console.error('Failed to fetch present employees:', error);
      }
    };

    if (location.pathname.startsWith('/dashboard/leaves')) {
      fetchPresentEmployees();
    }
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    const attendanceStatusOptions = ['All Statuses', 'Present', 'Absent', 'On Leave'];
    const leavesStatusOptions = ['All Statuses', 'Pending', 'Approved', 'Rejected'];

    if (path.startsWith('/dashboard/attendance')) {
      setPageOptions(prev => ({ ...prev, status: attendanceStatusOptions }));
    } else if (path.startsWith('/dashboard/leaves')) {
      setPageOptions(prev => ({ ...prev, status: leavesStatusOptions }));
    }
  }, [location.pathname]);

  let filters, setFilters;

  const path = location.pathname;

  if (path.startsWith('/dashboard/candidates')) {
    [filters, setFilters] = [candidateFilters, setCandidateFilters];
  } else if (path.startsWith('/dashboard/employees')) {
    [filters, setFilters] = [employeeFilters, setEmployeeFilters];
  } else if (path.startsWith('/dashboard/attendance')) {
    [filters, setFilters] = [attendanceFilters, setAttendanceFilters];
  } else if (path.startsWith('/dashboard/leaves')) {
    [filters, setFilters] = [leavesFilters, setLeavesFilters];
  } else {
    [filters, setFilters] = [{}, () => {}];
  }

  const outletContext = {
    showAddCandidateModal,
    setShowAddCandidateModal,
    showAddLeaveModal,
    setShowAddLeaveModal,
    filters,
    setFilters,
    setPageOptions,
    presentEmployees,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/');
  };

  const [search, setSearch] = useState('');
  const filteredData = sidebarData
    .map(cat => {
      if (cat.category.toLowerCase().includes(search.toLowerCase())) {
        return cat;
      }
      const filteredLinks = cat.links.filter(link =>
        link.text.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredLinks.length > 0) {
        return { ...cat, links: filteredLinks };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="dashboard-main-layout">
      <div className="sidebar">
        <div className="sidebar-logo-container">
          <img src="/logo.svg" alt="TalentIQ Logo" className="sidebar-logo-icon-img" />
          <span className="sidebar-logo-text">TalentIQ</span>
        </div>
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="sidebar-section">
          {filteredData.length === 0 ? (
            <div style={{ padding: '0 20px', color: '#A4A4A4' }}>No results</div>
          ) : (
            filteredData.map(cat => (
              <React.Fragment key={cat.category}>
                <div className="sidebar-category">{cat.category}</div>
                {cat.links.map(link =>
                  link.text === 'Logout' ? (
                    <div
                      key={link.text}
                      className="sidebar-link"
                      style={{ cursor: 'pointer' }}
                      onClick={e => {
                        e.preventDefault();
                        setShowLogoutModal(true);
                      }}
                    >
                      <span className="sidebar-link-icon">{link.icon}</span>
                      <span className="sidebar-link-text">{link.text}</span>
                    </div>
                  ) : (
                    <NavLink
                      key={link.text}
                      to={link.to}
                      className={({ isActive }) =>
                        isActive ? 'sidebar-link active' : 'sidebar-link'
                      }
                    >
                      <span className="sidebar-link-icon">{link.icon}</span>
                      <span className="sidebar-link-text">{link.text}</span>
                    </NavLink>
                  )
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
      <LogoutModal
        open={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      <div className="dashboard-content">
        <DashboardToolbar 
          onAddCandidate={() => setShowAddCandidateModal(true)}
          onAddLeave={() => setShowAddLeaveModal(true)}
          filters={filters} 
          setFilters={setFilters} 
          pageOptions={pageOptions} />
        <Outlet context={outletContext} />
      </div>
    </div>
  );
};

export default Dashboard; 