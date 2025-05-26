const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');

const allowAdminOrProfessor = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'professor')) return next();
  return res.status(403).json({ message: 'Admin or professor access required' });
};

// Admin and Professor CRUD
router.post('/', verifyToken, allowAdminOrProfessor, gradeController.create);
router.get('/', verifyToken, isAdmin, gradeController.getAll);
router.put('/:id', verifyToken, allowAdminOrProfessor, gradeController.update);
router.delete('/:id', verifyToken, allowAdminOrProfessor, gradeController.delete);

// Student view
router.get('/student/:student_id', verifyToken, isStudent, gradeController.getByStudentId);

module.exports = router;
