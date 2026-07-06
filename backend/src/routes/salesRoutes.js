const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { listSales, createSale, salesValidations } = require('../controllers/salesController');
const router = express.Router();

router.use(authenticate);
router.get('/', listSales);
router.post('/', authorize(['Admin', 'Manager', 'Salesman']), salesValidations, createSale);

module.exports = router;
