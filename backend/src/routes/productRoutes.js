const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProducts, productValidations } = require('../controllers/productController');
const router = express.Router();

router.use(authenticate);
router.get('/', listProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);
router.post('/', authorize(['Admin', 'Manager']), productValidations, createProduct);
router.put('/:id', authorize(['Admin', 'Manager']), productValidations, updateProduct);
router.delete('/:id', authorize(['Admin']), deleteProduct);

module.exports = router;
