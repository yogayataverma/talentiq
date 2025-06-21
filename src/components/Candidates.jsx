import React, { useState, useEffect } from 'react';
import { FiMoreVertical, FiUpload } from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';
import api from '../api';

const AddCandidateModal = ({ open, onClose, fetchCandidates }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    agree: false,
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    try {
      await api.post('/candidates', formData);
      fetchCandidates();
      onClose();
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  const isFormInvalid = !form.name || !form.email || !form.phone || !form.position || !form.experience || !form.resume || !form.agree;

  const renderInput = (name, type, placeholder, accept = null) => {
    if (type === 'file') {
      return (
        <div className="add-candidate-input-group file-input-group">
          <label htmlFor={name} className="add-candidate-file-label">
            <span>
              {form.resume ? form.resume.name : (
                <>
                  {placeholder} <span className="required-star">*</span>
                </>
              )}
            </span>
            <FiUpload />
          </label>
          <input
            id={name}
            name={name}
            type="file"
            onChange={handleChange}
            required
            accept={accept}
          />
        </div>
      );
    }
    return (
      <div className={`add-candidate-input-group ${form[name] ? 'has-value' : ''}`}>
        <input
          id={name}
          name={name}
          type={type}
          placeholder=" "
          onChange={handleChange}
          required
          {...(type !== 'file' && { value: form[name] })}
          {...(accept && { accept })}
        />
        <label htmlFor={name} className="add-candidate-input-label">
          {placeholder} <span className="required-star">*</span>
        </label>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="add-candidate-modal">
        <div className="add-candidate-modal-top">
          <span className="add-candidate-modal-title">Add Candidate</span>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form className="add-candidate-form" onSubmit={handleSubmit}>
          <div className="add-candidate-form-fields">
            {renderInput('name', 'text', 'Full Name')}
            {renderInput('email', 'email', 'Email Address')}
            {renderInput('phone', 'text', 'Phone Number')}
            {renderInput('position', 'text', 'Position')}
            {renderInput('experience', 'text', 'Experience')}
            {renderInput('resume', 'file', 'Resume', '.pdf,.doc,.docx')}
          </div>
          <div className="add-candidate-checkbox-row">
            <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} required />
            <label htmlFor="agree" className="add-candidate-checkbox-label">
              I hereby declare that the above information is true to the best of my knowledge and belief
            </label>
          </div>
          <button className="add-candidate-save-btn" type="submit" disabled={isFormInvalid}>Save</button>
        </form>
      </div>
    </div>
  );
};

const Candidates = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [candidateData, setCandidateData] = useState([]);
  const { showAddCandidateModal, setShowAddCandidateModal, filters, setPageOptions } = useOutletContext();

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidateData(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    const defaultStatuses = ['All Statuses', 'new', 'selected', 'rejected', 'scheduled', 'ongoing'];
    const defaultPositions = ['All Positions', 'Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'];

    if (candidateData.length > 0) {
      const uniqueStatuses = ['All Statuses', ...new Set(candidateData.map(c => c.status))];
      const uniquePositions = ['All Positions', ...new Set(candidateData.map(c => c.position))];
      setPageOptions({
        status: uniqueStatuses.length > 1 ? uniqueStatuses : defaultStatuses,
        position: uniquePositions.length > 1 ? uniquePositions : defaultPositions
      });
    } else {
      setPageOptions({
        status: defaultStatuses,
        position: defaultPositions
      });
    }
  }, [candidateData, setPageOptions]);

  const handleMenuClick = (idx) => {
    setOpenMenu(openMenu === idx ? null : idx);
  };

  const handleOptionClick = async (option, candidate) => {
    setOpenMenu(null);
    if (option === 'Delete Candidate') {
      try {
        await api.delete(`/candidates/${candidate._id}`);
        fetchCandidates();
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    } else if (option === 'Download Resume') {
      window.open(`https://talentiq-jwlg.onrender.com/${candidate.resume}`);
    } else {
      alert(`${option} for ${candidate.name}`);
    }
  };

  const handleStatusChange = async (idx, value) => {
    const candidate = candidateData[idx];
    try {
      await api.put(`/candidates/${candidate._id}/status`, { status: value });
      fetchCandidates();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredCandidates = candidateData.filter(candidate => {
    if (!filters) return true;
    const statusMatch = !filters.status || filters.status === 'Status' || candidate.status === filters.status;
    const positionMatch = !filters.position || filters.position === 'Position' || candidate.position === filters.position;
    const searchTermMatch = !filters.searchTerm ||
      Object.values(candidate).some(val =>
        String(val).toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    return statusMatch && positionMatch && searchTermMatch;
  });

  console.log('Candidate filters:', filters);

  return (
    <>
      {showAddCandidateModal && (
        <AddCandidateModal open={showAddCandidateModal} onClose={() => setShowAddCandidateModal(false)} fetchCandidates={fetchCandidates} />
      )}
      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Sr no</th>
              <th>Candidate Name</th>
              <th>Email Address</th>
              <th>Phone number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((c, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.position}</td>
                <td>
                  <select
                    className={`status-dropdown status-${c.status}`}
                    value={c.status}
                    onChange={e => handleStatusChange(candidateData.indexOf(c), e.target.value)}
                    style={{
                      color:
                        c.status === 'selected' ? '#4D007D' :
                        c.status === 'rejected' ? '#f44336' :
                        c.status === 'new' ? '#222' :
                        c.status === 'scheduled' ? '#E8B000' :
                        c.status === 'ongoing' ? '#008413' :
                        '#222',
                      border: `2px solid ${
                        c.status === 'selected' ? '#4D007D' :
                        c.status === 'rejected' ? '#f44336' :
                        c.status === 'new' ? '#222' :
                        c.status === 'scheduled' ? '#E8B000' :
                        c.status === 'ongoing' ? '#008413' :
                        '#ccc'
                      }`,
                      backgroundColor: 'white'
                    }}
                  >
                    {['new', 'selected', 'rejected', 'scheduled', 'ongoing'].map(opt => (
                      <option
                        key={opt}
                        value={opt}
                        style={{
                          color:
                            opt === 'selected' ? '#222' :
                            opt === 'rejected' ? '#222' :
                            opt === 'new' ? '#222' :
                            opt === 'scheduled' ? '#222' :
                            opt === 'ongoing' ? '#222' :
                            '#222'
                        }}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{c.experience}</td>
                <td style={{ position: 'relative' }}>
                  <button className="action-menu-btn" onClick={() => handleMenuClick(i)}>
                    <FiMoreVertical size={20} />
                  </button>
                  {openMenu === i && (
                    <div className="action-menu-dropdown">
                      <div onClick={() => handleOptionClick('Download Resume', c)} className="action-menu-item">Download Resume</div>
                      <div onClick={() => handleOptionClick('Delete Candidate', c)} className="action-menu-item delete">Delete Candidate</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Candidates; 