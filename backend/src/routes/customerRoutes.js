const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { listCustomers, createCustomer, updateCustomer, deleteCustomer, customerValidations } = require('../controllers/customerController');
const router = express.Router();

router.use(authenticate);
router.get('/', listCustomers);
router.post('/', authorize(['Admin', 'Manager']), customerValidations, createCustomer);
router.put('/:id', authorize(['Admin', 'Manager']), customerValidations, updateCustomer);
router.delete('/:id', authorize(['Admin']), deleteCustomer);

module.exports = router;
