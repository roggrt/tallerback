const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, vehicleController.getAll);
router.get('/client/:clientId', verifyToken, vehicleController.getByClient);
router.post('/', verifyToken, vehicleController.create);
router.put('/:id', verifyToken, vehicleController.update);

module.exports = router;