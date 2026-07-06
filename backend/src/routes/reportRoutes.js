const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { dailySales, monthlySales, yearlySales, inventoryReport, customerReport, supplierReport } = require('../controllers/reportController');
const router = express.Router();

router.use(authenticate);
router.get('/daily-sales', dailySales);
router.get('/monthly-sales', monthlySales);
router.get('/yearly-sales', yearlySales);
router.get('/inventory', inventoryReport);
router.get('/customers', customerReport);
router.get('/suppliers', supplierReport);

module.exports = router;
