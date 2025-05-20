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

module.exports = router;
