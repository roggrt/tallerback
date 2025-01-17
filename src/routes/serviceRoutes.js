const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, serviceController.getAll);
router.post('/', verifyToken, serviceController.create);
router.get('/:id', verifyToken, serviceController.getById);
router.put('/:id', verifyToken, serviceController.update);

module.exports = router;