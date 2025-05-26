import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAccounts = ({ role }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({});
  const navigate = useNavigate();

  // Fetch admins on mount and after changes
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const res = await axios.get('http://localhost:5000/api/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        alert('Session expired or unauthorized. Please log in again.');
        navigate('/admin-login');
      } else {
        alert('Failed to fetch admins');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admins', {
        email: newEmail,
        password: newPassword,
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewEmail('');
      setNewPassword('');
      setNewRole('admin');
      setLoading(true);
      await fetchAdmins();
    } catch (err) {
      alert('Failed to create admin');
    }
    setCreating(false);
  };

  const handleEdit = (admin) => {
    setEditId(admin.id);
    setEditEmail(admin.email);
    setEditPassword('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admins/${editId}`, {
        email: editEmail,
        password: editPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      setEditEmail('');
      setEditPassword('');
      setLoading(true);
      await fetchAdmins();
    } catch (err) {
      alert('Failed to update admin');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admin?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete admin');
    }
  };

  const togglePasswordVisibility = (adminId) => {
    setShowPasswords(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };

  return (
    <div>
      <h4>Admin Accounts Management</h4>
      {role === 'admin' && (
        <form className="mb-3" onSubmit={handleCreate}>
          <div className="row g-2 align-items-center">
            <div className="col-auto">
              <input
                type="email"
                className="form-control"
                placeholder="New admin email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-auto">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-auto">
              <select
                className="form-control"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="professor">Professor</option>
              </select>
            </div>
            <div className="col-auto">
              <button className="btn btn-success" type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </div>
        </form>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.role}</td>
                <td>
                  {editId === admin.id ? (
                    <form className="d-flex" onSubmit={handleUpdate}>
                      <input
                        type="email"
                        className="form-control me-2"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        className="form-control me-2"
                        placeholder="New password"
                        value={editPassword}
                        onChange={e => setEditPassword(e.target.value)}
                        required
                      />
                      <button className="btn btn-primary btn-sm me-2" type="submit">Save</button>
                      <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditId(null)}>Cancel</button>
                    </form>
                  ) : (
                    admin.email
                  )}
                </td>
                <td>
                  {editId !== admin.id && (
                    <div style={{ position: 'relative', width: '180px', minWidth: '150px' }}>
                      <input
                        type={showPasswords[admin.id] ? "text" : "password"}
                        className="form-control"
                        value={admin.password || ""}
                        readOnly
                        style={{
                          width: '100%',
                          paddingRight: '1.8rem',
                          fontSize: '1.05rem',
                          borderRadius: '0.5rem',
                          background: '#f3f6fa',
                          border: '1px solid #d1d5db',
                          height: '2.1rem',
                          boxShadow: 'none',
                          color: '#222',
                        }}
                      />
                      <button
                        style={{
                          position: 'absolute',
                          right: '0.3rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          padding: 0,
                          margin: 0,
                          width: '1.3rem',
                          height: '1.3rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          color: '#888',
                          cursor: 'pointer',
                        }}
                        onClick={() => togglePasswordVisibility(admin.id)}
                        type="button"
                        tabIndex={-1}
                        aria-label={showPasswords[admin.id] ? 'Hide password' : 'Show password'}
                      >
                        <i className={`fas fa-${showPasswords[admin.id] ? 'eye-slash' : 'eye'}`}></i>
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  {editId !== admin.id && (
                    <>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(admin)}>Edit</button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(admin.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAccounts;
