const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');

const allowAdminOrProfessor = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'professor')) return next();
  return res.status(403).json({ message: 'Admin or professor access required' });
};

router.post('/login', studentController.login);
router.post('/', verifyToken, allowAdminOrProfessor, studentController.create);
router.get('/', verifyToken, allowAdminOrProfessor, studentController.getAll);
router.put('/:id', verifyToken, allowAdminOrProfessor, studentController.update);
router.delete('/:id', verifyToken, allowAdminOrProfessor, studentController.delete);
router.get('/me', verifyToken, isStudent, studentController.getMe);

// Get last ID number for a specific year and course
router.get('/last-id/:yearCourse', verifyToken, isAdmin, studentController.getLastIdNumber);

module.exports = router;
