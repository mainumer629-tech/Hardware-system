const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { listCategories, createCategory, updateCategory, deleteCategory, categoryValidations } = require('../controllers/categoryController');
const router = express.Router();

router.use(authenticate);
router.get('/', listCategories);
router.post('/', authorize(['Admin', 'Manager']), categoryValidations, createCategory);
router.put('/:id', authorize(['Admin', 'Manager']), categoryValidations, updateCategory);
router.delete('/:id', authorize(['Admin']), deleteCategory);

module.exports = router;
