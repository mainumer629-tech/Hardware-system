const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { listPurchases, createPurchase, purchaseValidations } = require('../controllers/purchaseController');
const router = express.Router();

router.use(authenticate);
router.get('/', listPurchases);
router.post('/', authorize(['Admin', 'Manager']), purchaseValidations, createPurchase);

module.exports = router;
