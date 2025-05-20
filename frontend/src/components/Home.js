import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed-landing-box text-center">
      <h1>Student Grading System</h1>
      <button className="btn btn-primary m-3" onClick={() => navigate('/admin-login')}>Admin</button>
      <button className="btn btn-secondary m-3" onClick={() => navigate('/student-login')}>Student</button>
    </div>
  );
};

export default Home;
