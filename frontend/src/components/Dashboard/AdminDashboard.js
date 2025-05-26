import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAccounts from './AdminAccounts';
import StudentAccounts from './StudentAccounts';
import GradeManagement from './GradeManagement';

function getRoleFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

const AdminDashboard = () => {
  const roleFromToken = getRoleFromToken();
  const [tab, setTab] = useState(roleFromToken === 'admin' ? 'admins' : 'students');
  const [role, setRole] = useState(roleFromToken);
  const navigate = useNavigate();

  useEffect(() => {
    // If not admin, default to 'students' tab
    if (role !== 'admin' && tab === 'admins') setTab('students');
  }, [role, tab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <div className="admin-main-container">
      <h2>{role === 'admin' ? 'Admin' : role === 'professor' ? 'Professor' : 'Dashboard'}</h2>
      <button className="btn btn-outline-danger mb-3" onClick={handleLogout}>
        Log out
      </button>
      <ul className="nav nav-tabs dashboard-tabs mb-4">
        {role === 'admin' && (
        <li className="nav-item">
          <button className={`nav-link ${tab === 'admins' ? 'active' : ''}`} onClick={() => setTab('admins')}>Admin Accounts</button>
        </li>
        )}
        <li className="nav-item">
          <button className={`nav-link ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>Student Accounts</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'grades' ? 'active' : ''}`} onClick={() => setTab('grades')}>Grades</button>
        </li>
      </ul>
      {tab === 'admins' && role === 'admin' && <AdminAccounts role={role} />}
      {tab === 'students' && <StudentAccounts role={role} />}
      {tab === 'grades' && <GradeManagement role={role} />}
    </div>
  );
};

export default AdminDashboard;
