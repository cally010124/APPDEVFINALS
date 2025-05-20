const db = require('../config/db');

exports.create = async (student_id, subject_code, subject, grade, remarks, units) => {
  const [result] = await db.query(
    'INSERT INTO grades (student_id, subject_code, subject, grade, remarks, units) VALUES (?, ?, ?, ?, ?, ?)',
    [student_id, subject_code, subject, grade, remarks, units]
  );
  return result.insertId;
};

exports.getByStudentId = async (student_id) => {
  const [rows] = await db.query('SELECT * FROM grades WHERE student_id = ?', [student_id]);
  return rows;
};

exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM grades');
  return rows;
};

exports.update = async (id, subject_code, subject, grade, remarks, units) => {
  await db.query('UPDATE grades SET subject_code = ?, subject = ?, grade = ?, remarks = ?, units = ? WHERE id = ?', [subject_code, subject, grade, remarks, units, id]);
};

exports.delete = async (id) => {
  await db.query('DELETE FROM grades WHERE id = ?', [id]);
};
