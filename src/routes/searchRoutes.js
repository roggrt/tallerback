const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const verifyToken = require('../middleware/auth');

router.get('/clients', verifyToken, searchController.searchClients);
router.get('/vehicles', verifyToken, searchController.searchVehicles);
router.get('/orders', verifyToken, searchController.searchOrders);

module.exports = router;