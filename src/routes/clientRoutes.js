const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, clientController.getAll);
router.get('/:id', verifyToken, clientController.getById);
router.post('/', verifyToken, clientController.create);
router.put('/:id', verifyToken, clientController.update);

module.exports = router;