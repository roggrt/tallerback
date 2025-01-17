const express = require('express');
const router = express.Router();
const serviceOrderDetailController = require('../controllers/serviceOrderDetailController');
const verifyToken = require('../middleware/auth');

router.get('/order/:service_order_id', verifyToken, serviceOrderDetailController.getByOrderId);
router.post('/order/:service_order_id', verifyToken, serviceOrderDetailController.addService);
router.put('/:id', verifyToken, serviceOrderDetailController.updateServiceStatus);

module.exports = router;