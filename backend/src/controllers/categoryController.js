const { body, validationResult } = require('express-validator');
const { Category } = require('../models/category');

const categoryValidations = [
  body('categoryName').trim().notEmpty().withMessage('Category name is required')
];

const listCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['categoryName', 'ASC']] });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const category = await Category.create({ categoryName: req.body.categoryName });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    category.categoryName = req.body.categoryName;
    await category.save();
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { categoryValidations, listCategories, createCategory, updateCategory, deleteCategory };
