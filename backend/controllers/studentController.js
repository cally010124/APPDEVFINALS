const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel');

exports.login = async (req, res) => {
  const { student_id } = req.body;
  const student = await Student.findByStudentId(student_id);
  if (!student) return res.status(400).json({ message: 'Invalid student ID' });

  const token = jwt.sign({ id: student.id, student_id: student.student_id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};

exports.create = async (req, res) => {
  const { name, course, year, section } = req.body;
  const student_id = await Student.getNextStudentId();
  const id = await Student.create(student_id, name, course, year, section);
  res.status(201).json({ id, student_id, name, course, year, section });
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
