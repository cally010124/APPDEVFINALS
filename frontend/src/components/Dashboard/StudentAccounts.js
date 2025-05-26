import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';

const StudentAccounts = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newSection, setNewSection] = useState('');
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editSection, setEditSection] = useState('');
  const [multiSearch, setMultiSearch] = useState('');
  const navigate = useNavigate();

  // Fetch students on mount and after changes
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
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/students', {
        name: newName,
        course: newCourse,
        year: newYear,
        section: newSection
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewName('');
      setNewCourse('');
      setNewYear('');
      setNewSection('');
      setLoading(true);
      await fetchStudents();
    } catch (err) {
      alert('Failed to create student');
    }
    setCreating(false);
  };

  const handleEdit = (student) => {
    setEditId(student.id);
    setEditName(student.name || '');
    setEditCourse(student.course || '');
    setEditYear(student.year || '');
    setEditSection(student.section || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/students/${editId}`, {
        student_id: students.find(s => s.id === editId).student_id,
        name: editName,
        course: editCourse,
        year: editYear,
        section: editSection
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      setEditName('');
      setEditCourse('');
      setEditYear('');
      setEditSection('');
      setLoading(true);
      await fetchStudents();
    } catch (err) {
      alert('Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  // Multi-field search: split by comma, trim, and match case-insensitive in any field
  const searchTerms = multiSearch.split(',').map(s => s.trim()).filter(Boolean);
  const filteredStudents = searchTerms.length > 0
    ? students.filter(student =>
        searchTerms.some(term =>
          (student.name && student.name.toLowerCase().includes(term.toLowerCase())) ||
          (student.course && student.course.toLowerCase().includes(term.toLowerCase())) ||
          (student.year && student.year.toLowerCase().includes(term.toLowerCase())) ||
          (student.section && student.section.toLowerCase().includes(term.toLowerCase())) ||
          (student.student_id && student.student_id.toLowerCase().includes(term.toLowerCase()))
    )
      )
    : students;

  return (
    <div>
      <h4>Student Accounts</h4>
      <form className="create-student-form-row" onSubmit={handleCreate}>
            <input
              type="text"
              className="form-control"
              placeholder="Student name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Course"
              value={newCourse}
              onChange={e => setNewCourse(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Year"
              value={newYear}
              onChange={e => setNewYear(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Section"
              value={newSection}
              onChange={e => setNewSection(e.target.value)}
              required
            />
            <button className="btn btn-success" type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Student'}
            </button>
      </form>
      <div className="mb-3 d-flex justify-content-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search: name, course, year, section, student ID"
            value={multiSearch}
            onChange={e => setMultiSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Year</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.student_id}</td>
                <td>
                  {editId === student.id ? (
                    <form className="d-flex" onSubmit={handleUpdate}>
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editCourse}
                        onChange={e => setEditCourse(e.target.value)}
                        placeholder="Course"
                        required
                      />
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editYear}
                        onChange={e => setEditYear(e.target.value)}
                        placeholder="Year"
                        required
                      />
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editSection}
                        onChange={e => setEditSection(e.target.value)}
                        placeholder="Section"
                        required
                      />
                      <button className="btn btn-primary btn-sm me-2" type="submit">Save</button>
                      <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditId(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      {student.name}
                    </>
                  )}
                </td>
                <td>{editId === student.id ? editCourse : student.course}</td>
                <td>{editId === student.id ? editYear : student.year}</td>
                <td>{editId === student.id ? editSection : student.section}</td>
                <td>
                  {editId !== student.id && (
                    <>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(student)}>Edit</button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(student.id)}>Delete</button>
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

export default StudentAccounts;
