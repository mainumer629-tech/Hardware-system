const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { listSuppliers, createSupplier, updateSupplier, deleteSupplier, supplierValidations } = require('../controllers/supplierController');
const router = express.Router();

router.use(authenticate);
router.get('/', listSuppliers);
router.post('/', authorize(['Admin', 'Manager']), supplierValidations, createSupplier);
router.put('/:id', authorize(['Admin', 'Manager']), supplierValidations, updateSupplier);
router.delete('/:id', authorize(['Admin']), deleteSupplier);

module.exports = router;
