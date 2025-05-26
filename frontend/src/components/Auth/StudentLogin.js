import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/students/login', { student_id: studentId });
      localStorage.setItem('token', res.data.token);
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Student Login</h2>
          <button className="btn btn-link mb-3" onClick={() => navigate('/')}>Back to Home</button>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Student ID:</label>
              <input 
                type="text" 
                className="form-control" 
                value={studentId}
                onChange={e => setStudentId(e.target.value)} 
                required 
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary mt-3" type="submit">Enter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
