const db = require('../config/db');

exports.findByStudentId = async (student_id) => {
  const [rows] = await db.query('SELECT * FROM students WHERE student_id = ?', [student_id]);
  return rows[0];
};

exports.create = async (name, course, year, section) => {
  try {
    const student_id = await this.getNextStudentId(course);
    const [result] = await db.query(
      'INSERT INTO students (student_id, name, course, year, section) VALUES (?, ?, ?, ?, ?)',
      [student_id, name, course, year, section]
    );
  return result.insertId;
  } catch (err) {
    console.error('Error creating student:', err);
    throw err;
  }
};

exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM students');
  return rows;
};

exports.update = async (id, student_id, name, course, year, section) => {
  await db.query(
    'UPDATE students SET student_id = ?, name = ?, course = ?, year = ?, section = ? WHERE id = ?',
    [student_id, name, course, year, section, id]
  );
};

exports.delete = async (id) => {
  await db.query('DELETE FROM students WHERE id = ?', [id]);
};

exports.getNextStudentId = async (course) => {
  try {
    const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
    const courseCode = course.toUpperCase();
    
    // Get the last used number for this year and course
    const [rows] = await db.query(
      `SELECT student_id FROM students 
       WHERE student_id LIKE ? 
       ORDER BY student_id DESC 
       LIMIT 1`,
      [`${currentYear}${courseCode}-%`]
    );

    let lastNumber = 0;
    if (rows.length > 0) {
  const lastId = rows[0].student_id;
      lastNumber = parseInt(lastId.split('-')[1]);
    }

    const newNumber = lastNumber + 1;
    return `${currentYear}${courseCode}-${String(newNumber).padStart(4, '0')}`;
  } catch (err) {
    console.error('Error generating student ID:', err);
    throw err;
  }
};
