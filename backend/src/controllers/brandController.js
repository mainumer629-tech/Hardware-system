const { body, validationResult } = require('express-validator');
const { Brand } = require('../models/brand');

const brandValidations = [
  body('brandName').trim().notEmpty().withMessage('Brand name is required')
];

const listBrands = async (req, res, next) => {
  try {
    const brands = await Brand.findAll({ order: [['brandName', 'ASC']] });
    res.json(brands);
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const brand = await Brand.create({ brandName: req.body.brandName });
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    brand.brandName = req.body.brandName;
    await brand.save();
    res.json(brand);
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    await brand.destroy();
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { brandValidations, listBrands, createBrand, updateBrand, deleteBrand };
