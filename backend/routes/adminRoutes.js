const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/login', adminController.login);
router.post('/', verifyToken, isAdmin, adminController.create);
router.get('/', verifyToken, isAdmin, adminController.getAll);
router.put('/:id', verifyToken, isAdmin, adminController.update);
router.delete('/:id', verifyToken, isAdmin, adminController.delete);

module.exports = router;
