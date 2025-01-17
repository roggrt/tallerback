const express = require('express');
const router = express.Router();
const serviceOrderController = require('../controllers/serviceOrderController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, serviceOrderController.create);
router.get('/', verifyToken, serviceOrderController.getAll);
router.get('/client/:clientId', verifyToken, serviceOrderController.getByClient);
router.get('/:id', verifyToken, serviceOrderController.getById);
router.put('/:id/status', verifyToken, serviceOrderController.updateStatus);

module.exports = router;