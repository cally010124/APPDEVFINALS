const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');

// Admin CRUD
router.post('/', verifyToken, isAdmin, gradeController.create);
router.get('/', verifyToken, isAdmin, gradeController.getAll);
router.put('/:id', verifyToken, isAdmin, gradeController.update);
router.delete('/:id', verifyToken, isAdmin, gradeController.delete);

// Student view
router.get('/student/:student_id', verifyToken, isStudent, gradeController.getByStudentId);

module.exports = router;
