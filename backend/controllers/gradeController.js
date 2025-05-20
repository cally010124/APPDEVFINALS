const Grade = require('../models/gradeModel');

exports.create = async (req, res) => {
  const { student_id, subject_code, subject, grade, remarks, units } = req.body;
  const id = await Grade.create(student_id, subject_code, subject, grade, remarks, units);
  res.status(201).json({ id, student_id, subject_code, subject, grade, remarks, units });
};

exports.getByStudentId = async (req, res) => {
  const { student_id } = req.params;
  const grades = await Grade.getByStudentId(student_id);
  res.json(grades);
};

exports.getAll = async (req, res) => {
  const grades = await Grade.getAll();
  res.json(grades);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { subject_code, subject, grade, remarks, units } = req.body;
  await Grade.update(id, subject_code, subject, grade, remarks, units);
  res.json({ message: 'Grade updated' });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Grade.delete(id);
  res.json({ message: 'Grade deleted' });
};
