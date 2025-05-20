const db = require('../config/db');

exports.findByStudentId = async (student_id) => {
  const [rows] = await db.query('SELECT * FROM students WHERE student_id = ?', [student_id]);
  return rows[0];
};

exports.create = async (student_id, name, course, year, section) => {
  const [result] = await db.query('INSERT INTO students (student_id, name, course, year, section) VALUES (?, ?, ?, ?, ?)', [student_id, name, course, year, section]);
  return result.insertId;
};

exports.getAll = async () => {
  const [rows] = await db.query('SELECT id, student_id, name, course, year, section FROM students');
  return rows;
};

exports.update = async (id, student_id, name, course, year, section) => {
  await db.query('UPDATE students SET student_id = ?, name = ?, course = ?, year = ?, section = ? WHERE id = ?', [student_id, name, course, year, section, id]);
};

exports.delete = async (id) => {
  await db.query('DELETE FROM students WHERE id = ?', [id]);
};

exports.getNextStudentId = async () => {
  const [rows] = await db.query("SELECT student_id FROM students WHERE student_id LIKE 'S2425%' ORDER BY student_id DESC LIMIT 1");
  if (rows.length === 0) return 'S242501';
  const lastId = rows[0].student_id;
  const num = parseInt(lastId.slice(5)) + 1;
  return 'S2425' + num.toString().padStart(2, '0');
};
