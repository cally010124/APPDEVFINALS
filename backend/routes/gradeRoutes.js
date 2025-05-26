const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Admin CRUD
router.post('/', verifyToken, isAdmin, gradeController.create);
router.get('/', verifyToken, isAdmin, gradeController.getAll);
router.put('/:id', verifyToken, isAdmin, gradeController.update);
router.delete('/:id', verifyToken, isAdmin, gradeController.delete);

// Student view
router.get('/student/:student_id', verifyToken, (req, res, next) => {
  if (req.user && req.user.role === 'student') return next();
  return res.status(403).json({ message: 'Student access required' });
}, gradeController.getByStudentId);

module.exports = router;
