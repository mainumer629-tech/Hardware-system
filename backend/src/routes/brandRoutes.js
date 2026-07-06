const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { listBrands, createBrand, updateBrand, deleteBrand, brandValidations } = require('../controllers/brandController');
const router = express.Router();

router.use(authenticate);
router.get('/', listBrands);
router.post('/', authorize(['Admin', 'Manager']), brandValidations, createBrand);
router.put('/:id', authorize(['Admin', 'Manager']), brandValidations, updateBrand);
router.delete('/:id', authorize(['Admin']), deleteBrand);

module.exports = router;
