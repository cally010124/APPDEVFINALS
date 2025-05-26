const db = require('../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
  return rows[0];
};

exports.create = async (email, password, role = 'admin') => {
  const [result] = await db.query('INSERT INTO admins (email, password, role) VALUES (?, ?, ?)', [email, password, role]);
  return result.insertId;
};

exports.getAll = async () => {
  const [rows] = await db.query('SELECT id, email, password, role FROM admins');
  return rows;
};

exports.update = async (id, email, password) => {
  await db.query('UPDATE admins SET email = ?, password = ? WHERE id = ?', [email, password, id]);
};

exports.delete = async (id) => {
  await db.query('DELETE FROM admins WHERE id = ?', [id]);
};
