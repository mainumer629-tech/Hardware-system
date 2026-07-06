const { body, validationResult } = require('express-validator');
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const { Brand } = require('../models/brand');

const productValidations = [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('purchasePrice').isFloat({ gt: 0 }).withMessage('Purchase price must be greater than 0'),
  body('sellingPrice').isFloat({ gt: 0 }).withMessage('Selling price must be greater than 0'),
  body('unit').isIn(['Pcs', 'Kg', 'Feet', 'Bag', 'Roll']).withMessage('Invalid unit')
];

const listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [Category, Brand],
      order: [['productName', 'ASC']]
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: [Category, Brand] });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const product = await Product.create({
      categoryId: req.body.categoryId || null,
      brandId: req.body.brandId || null,
      productName: req.body.productName,
      skuBarcode: req.body.skuBarcode || null,
      unit: req.body.unit,
      purchasePrice: req.body.purchasePrice,
      sellingPrice: req.body.sellingPrice,
      currentStockQty: req.body.currentStockQty || 0,
      minStockAlert: req.body.minStockAlert || 5
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    Object.assign(product, {
      categoryId: req.body.categoryId || null,
      brandId: req.body.brandId || null,
      productName: req.body.productName,
      skuBarcode: req.body.skuBarcode || null,
      unit: req.body.unit,
      purchasePrice: req.body.purchasePrice,
      sellingPrice: req.body.sellingPrice,
      currentStockQty: req.body.currentStockQty || 0,
      minStockAlert: req.body.minStockAlert || 5
    });
    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const products = await Product.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { productName: { [require('sequelize').Op.like]: `%${query}%` } },
          { skuBarcode: { [require('sequelize').Op.like]: `%${query}%` } }
        ]
      },
      include: [Category, Brand],
      limit: 50
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = { productValidations, listProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProducts };
