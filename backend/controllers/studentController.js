const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { student_id } = req.body;
  const student = await Student.findByStudentId(student_id);
  if (!student) return res.status(400).json({ message: 'Invalid student ID' });

  const token = jwt.sign({ id: student.id, student_id: student.student_id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};

exports.create = async (req, res) => {
  try {
    const { name, course, year, section } = req.body;
    const id = await Student.create(name, course, year, section);
    const student = await Student.findByStudentId(await Student.getNextStudentId(course));
    res.status(201).json(student);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ message: 'Failed to create student' });
  }
};

exports.getAll = async (req, res) => {
  const students = await Student.getAll();
  res.json(students);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { student_id, name, course, year, section } = req.body;
  await Student.update(id, student_id, name, course, year, section);
  res.json({ message: 'Student updated' });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Student.delete(id);
  res.json({ message: 'Student deleted' });
};

exports.getMe = async (req, res) => {
  const student = await Student.findByStudentId(req.user.student_id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json({ student_id: student.student_id, name: student.name, course: student.course, year: student.year, section: student.section });
};

exports.getLastIdNumber = async (req, res) => {
  try {
    const { yearCourse } = req.params;
    const [rows] = await db.query(
      `SELECT student_id FROM students 
       WHERE student_id LIKE ? 
       ORDER BY student_id DESC 
       LIMIT 1`,
      [`${yearCourse}-%`]
    );

    if (rows.length === 0) {
      return res.json({ lastNumber: 0 });
    }

    const lastId = rows[0].student_id;
    const lastNumber = parseInt(lastId.split('-')[1]);
    res.json({ lastNumber });
  } catch (err) {
    console.error('Error getting last ID number:', err);
    res.status(500).json({ error: 'Failed to get last ID number' });
  }
};
