const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');

router.post('/login', studentController.login);
router.post('/', verifyToken, isAdmin, studentController.create);
router.get('/', verifyToken, isAdmin, studentController.getAll);
router.put('/:id', verifyToken, isAdmin, studentController.update);
router.delete('/:id', verifyToken, isAdmin, studentController.delete);
router.get('/me', verifyToken, isStudent, studentController.getMe);

// Get last ID number for a specific year and course
router.get('/last-id/:yearCourse', verifyToken, isAdmin, studentController.getLastIdNumber);

module.exports = router;
