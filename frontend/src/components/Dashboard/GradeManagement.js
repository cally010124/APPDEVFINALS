import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GradeManagement = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newRemarks, setNewRemarks] = useState('');
  const [newUnits, setNewUnits] = useState('');
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editSubjectCode, setEditSubjectCode] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editGrade, setEditGrade] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [editUnits, setEditUnits] = useState('');
  const [copying, setCopying] = useState(false);
  const [sourceStudentId, setSourceStudentId] = useState('');
  const [targetStudentId, setTargetStudentId] = useState('');

  // Add S.Y. state globally for the component, persisted in localStorage and synced with backend
  const LOCAL_STORAGE_SY_KEY = 'grades_sy_value';
  const getInitialSy = () => localStorage.getItem(LOCAL_STORAGE_SY_KEY) || '1st Semester S.Y. 2024-2025';
  const [sy, setSy] = useState(getInitialSy());
  const [syInput, setSyInput] = useState(getInitialSy());
  const [sySaved, setSySaved] = useState(true);
  const [syLoading, setSyLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch S.Y. from backend on mount
  useEffect(() => {
    const fetchSy = async () => {
      setSyLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await axios.get('http://localhost:5000/api/settings/sy', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.sy) {
          setSy(res.data.sy);
          setSyInput(res.data.sy);
          localStorage.setItem(LOCAL_STORAGE_SY_KEY, res.data.sy);
        }
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          alert('Session expired or unauthorized. Please log in again.');
          navigate('/admin-login');
        }
        // fallback to localStorage (already set)
      }
      setSyLoading(false);
    };
    fetchSy();
    // eslint-disable-next-line
  }, [navigate]);

  // Save S.Y. to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SY_KEY, sy);
  }, [sy]);

  // Fetch grades and students on mount and after changes
  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const res = await axios.get('http://localhost:5000/api/grades', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrades(res.data);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        alert('Session expired or unauthorized. Please log in again.');
        navigate('/admin-login');
      } else {
      alert('Failed to fetch grades');
      }
    }
    setLoading(false);
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const res = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        alert('Session expired or unauthorized. Please log in again.');
        navigate('/admin-login');
      } else {
      alert('Failed to fetch students');
      }
    }
  };

  useEffect(() => {
    fetchGrades();
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  // Filter students for dropdown (case-insensitive, partial match in any field)
  const searchTerms = studentSearch.split(',').map(s => s.trim()).filter(Boolean);
  const filteredStudents = searchTerms.length > 0
    ? students.filter(student => {
        // Convert search terms to lowercase for case-insensitive comparison
        const searchTerm = studentSearch.toLowerCase();
        
        // Check if any of the student's fields match the search term
        const matchesName = student.name?.toLowerCase().includes(searchTerm);
        const matchesCourse = student.course?.toLowerCase().includes(searchTerm);
        const matchesYear = student.year?.toLowerCase().includes(searchTerm);
        const matchesSection = student.section?.toLowerCase().includes(searchTerm);
        const matchesId = student.student_id?.toLowerCase().includes(searchTerm);

        // Return true if any field matches
        return matchesName || matchesCourse || matchesYear || matchesSection || matchesId;
      })
    : [];

  // Get grades for all filtered students
  const filteredStudentGrades = filteredStudents.map(student => ({
    student,
    grades: grades.filter(g => g.student_id === student.student_id)
  }));

  // Helper for automatic remarks
  const getAutoRemarks = (grade) => {
    const num = parseFloat(grade);
    if (!isNaN(num)) {
      if (num >= 1 && num <= 3) return 'PASSED';
      if (num >= 4 && num <= 5) return 'FAILED';
    }
    return '';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/grades', {
        student_id: filteredStudents[0].student_id,
        subject_code: newSubjectCode,
        subject: newSubject,
        grade: newGrade || 'N/A',
        remarks: newRemarks,
        units: newUnits
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewSubjectCode('');
      setNewSubject('');
      setNewGrade('');
      setNewRemarks('');
      setNewUnits('');
      setLoading(true);
      await fetchGrades();
    } catch (err) {
      alert('Failed to create grade');
    }
    setCreating(false);
  };

  const handleEdit = (grade) => {
    setEditId(grade.id);
    setEditSubjectCode(grade.subject_code || '');
    setEditSubject(grade.subject);
    setEditGrade(grade.grade);
    setEditRemarks(grade.remarks || '');
    setEditUnits(grade.units || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/grades/${editId}`, {
        subject_code: editSubjectCode,
        subject: editSubject,
        grade: editGrade || 'N/A',
        remarks: editRemarks,
        units: editUnits
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      setEditSubjectCode('');
      setEditSubject('');
      setEditGrade('');
      setEditRemarks('');
      setEditUnits('');
      setLoading(true);
      await fetchGrades();
    } catch (err) {
      alert('Failed to update grade');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this grade?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/grades/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrades(grades.filter(g => g.id !== id));
    } catch (err) {
      alert('Failed to delete grade');
    }
  };

  // Handler to update S.Y. on blur or Enter
  const handleSyChange = (e) => {
    setSyInput(e.target.value);
    if (e.target.value !== sy) setSySaved(false);
  };
  const saveSy = async () => {
    if (syInput !== sy) {
      setSy(syInput);
      setSySaved(true);
      localStorage.setItem(LOCAL_STORAGE_SY_KEY, syInput);
      setSyLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/settings/sy', { sy: syInput }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Success: no notification needed
      } catch (err) {
        let msg = 'Failed to update S.Y. on server';
        if (err.response) {
          console.error('Server error:', err.response.status, err.response.data);
          if (err.response.data && err.response.data.error) {
            msg += `: ${err.response.data.error}`;
          }
        } else if (err.request) {
          console.error('No response from server:', err.request);
          msg += ': No response from server.';
        } else {
          console.error('Error', err.message);
          msg += `: ${err.message}`;
        }
        alert(msg);
      }
      setSyLoading(false);
    } else {
      setSySaved(true);
    }
  };
  const handleSyKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveSy();
      e.target.blur();
    }
  };
  const handleSyBlur = () => {
    saveSy();
  };

  const handleCopySubjects = async () => {
    if (!sourceStudentId || !targetStudentId) {
      alert('Please select both source and target students');
      return;
    }

    if (sourceStudentId === targetStudentId) {
      alert('Source and target students cannot be the same');
      return;
    }

    setCopying(true);
    try {
      const token = localStorage.getItem('token');
      // Get source student's grades
      const sourceGrades = grades.filter(g => g.student_id === sourceStudentId);
      
      // Create new grades for target student
      for (const grade of sourceGrades) {
        await axios.post('http://localhost:5000/api/grades', {
          student_id: targetStudentId,
          subject_code: grade.subject_code,
          subject: grade.subject,
          grade: 'N/A',
          remarks: '',
          units: grade.units
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      alert('Subjects copied successfully!');
      await fetchGrades();
    } catch (err) {
      alert('Failed to copy subjects');
    }
    setCopying(false);
    setSourceStudentId('');
    setTargetStudentId('');
  };

  // Debug logs
  console.log('Students:', students);
  console.log('Filtered:', filteredStudents);
  console.log('Student Search:', studentSearch);

  return (
    <div>
      <h4>Grades</h4>
      {/* Global S.Y. input - above search bar */}
      <div className="d-flex justify-content-center mb-3 align-items-center">
        <label style={{ fontWeight: 'bold', marginRight: 8 }}>S.Y.:</label>
        <input
          type="text"
          value={syInput}
          onChange={handleSyChange}
          onKeyDown={handleSyKeyDown}
          onBlur={handleSyBlur}
          placeholder={sy}
          style={{ width: '260px', display: 'inline-block', marginRight: 8 }}
          disabled={syLoading}
        />
        {syLoading ? (
          <span style={{ color: '#2563eb', fontSize: 18, marginLeft: 4 }} title="Saving...">...</span>
        ) : sySaved && (
          <span style={{ color: 'green', fontSize: 20, marginLeft: 4 }} title="Saved">&#10003;</span>
        )}
      </div>

      {/* Copy Subjects Section */}
      <div className="row mb-3 justify-content-center">
        <div className="col-12 d-flex justify-content-center gap-2">
          <select
            className="form-control"
            style={{ maxWidth: 200 }}
            value={sourceStudentId}
            onChange={(e) => setSourceStudentId(e.target.value)}
          >
            <option value="">Select Source Student</option>
            {students.map(student => (
              <option key={student.student_id} value={student.student_id}>
                {student.name} ({student.student_id})
              </option>
            ))}
          </select>
          <select
            className="form-control"
            style={{ maxWidth: 200 }}
            value={targetStudentId}
            onChange={(e) => setTargetStudentId(e.target.value)}
          >
            <option value="">Select Target Student</option>
            {students.map(student => (
              <option key={student.student_id} value={student.student_id}>
                {student.name} ({student.student_id})
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={handleCopySubjects}
            disabled={copying || !sourceStudentId || !targetStudentId}
          >
            {copying ? 'Copying...' : 'Copy Subjects'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-3 justify-content-center">
        <div className="col-12 d-flex justify-content-center">
          <input
            type="text"
            className="form-control text-center"
            style={{ maxWidth: 350 }}
            placeholder="Search: name, course, year, section, or ID"
            value={studentSearch}
            onChange={e => setStudentSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Student Info and Grades Table */}
      {filteredStudents.length > 0 ? (
        filteredStudentGrades.map(({ student, grades }) => (
          <div key={student.student_id} className="mb-4">
          <div className="mb-3">
              <strong>Student ID:</strong> {student.student_id}<br />
              <strong>Name:</strong> {student.name}<br />
              <strong>Course:</strong> {student.course}<br />
              <strong>Year:</strong> {student.year} Year<br />
              <strong>Section:</strong> {student.section}<br />
              <strong>S.Y.:</strong> {sy}
          </div>
            {grades.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject</th>
                  <th>Grade</th>
                  <th>Units</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                  {grades.map(grade => (
                  <tr key={grade.id}>
                    {editId === grade.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={editSubjectCode}
                            onChange={e => setEditSubjectCode(e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={editSubject}
                            onChange={e => setEditSubject(e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={editGrade}
                            onChange={e => setEditGrade(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={editUnits}
                            onChange={e => setEditUnits(e.target.value)}
                            required
                          />
                        </td>
                        <td>{getAutoRemarks(editGrade)}</td>
                        <td>
                          <button className="btn btn-primary btn-sm me-2" onClick={handleUpdate}>Save</button>
                          <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditId(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{grade.subject_code}</td>
                        <td>{grade.subject}</td>
                        <td>{grade.grade}</td>
                        <td>{grade.units}</td>
                        <td>{getAutoRemarks(grade.grade)}</td>
                        <td>
                            <button className="btn-action btn-edit" onClick={() => handleEdit(grade)}>Edit</button>
                            <button className="btn-action btn-delete" onClick={() => handleDelete(grade.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No grades found for this student.</p>
          )}
          {/* Create Grade Form */}
            <form className="grade-form-row" onSubmit={handleCreate}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject Code"
                  value={newSubjectCode}
                  onChange={e => setNewSubjectCode(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Grade"
                  value={newGrade}
                  onChange={e => setNewGrade(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Units"
                  value={newUnits}
                  onChange={e => setNewUnits(e.target.value)}
                  required
                />
                <button className="btn btn-success" type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Add Grade'}
                </button>
            </form>
              </div>
        ))
      ) : studentSearch ? (
        <p>No students found matching your search.</p>
      ) : null}
    </div>
  );
};

export default GradeManagement;
