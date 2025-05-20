const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findByEmail(email);
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};

exports.create = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const id = await Admin.create(email, hash);
  res.status(201).json({ id, email });
};

exports.getAll = async (req, res) => {
  const admins = await Admin.getAll();
  res.json(admins);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await Admin.update(id, email, hash);
  res.json({ message: 'Admin updated' });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Admin.delete(id);
  res.json({ message: 'Admin deleted' });
};
