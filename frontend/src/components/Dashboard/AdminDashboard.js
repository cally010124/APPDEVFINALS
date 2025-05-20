import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAccounts from './AdminAccounts';
import StudentAccounts from './StudentAccounts';
import GradeManagement from './GradeManagement';

const AdminDashboard = () => {
  const [tab, setTab] = useState('admins');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <div className="dashboard-container">
      <h2>Admin</h2>
      <button className="btn btn-outline-danger mb-3" onClick={handleLogout}>
        Log out
      </button>
      <ul className="nav nav-tabs dashboard-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'admins' ? 'active' : ''}`} onClick={() => setTab('admins')}>Admin Accounts</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>Student Accounts</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'grades' ? 'active' : ''}`} onClick={() => setTab('grades')}>Grades</button>
        </li>
      </ul>
      <div className="dashboard-content">
      {tab === 'admins' && <AdminAccounts />}
      {tab === 'students' && <StudentAccounts />}
      {tab === 'grades' && <GradeManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
