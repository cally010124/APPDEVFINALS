const generateStudentId = (course) => {
  const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
  const courseCode = course.toUpperCase();
  
  // Get the last used number
  const getLastNumber = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/students/last-id/${currentYear}${courseCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.lastNumber || 0;
    } catch (err) {
      console.error('Error fetching last number:', err);
      return 0;
    }
  };

  // Generate the new ID
  const generateId = async () => {
    const lastNumber = await getLastNumber();
    const newNumber = lastNumber + 1;
    return `${currentYear}${courseCode}-${String(newNumber).padStart(4, '0')}`;
  };

  return generateId();
};

const handleCreate = async (e) => {
  e.preventDefault();
  setCreating(true);
  try {
    const token = localStorage.getItem('token');
    const studentId = await generateStudentId(newCourse);
    await axios.post('http://localhost:5000/api/students', {
      student_id: studentId,
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