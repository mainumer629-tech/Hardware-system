const { body, validationResult } = require('express-validator');
const { Supplier } = require('../models/supplier');

const supplierValidations = [
  body('supplierName').trim().notEmpty().withMessage('Supplier name is required')
];

const listSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.findAll({ order: [['supplierName', 'ASC']] });
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const supplier = await Supplier.create({ supplierName: req.body.supplierName, phone: req.body.phone || null });
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    supplier.supplierName = req.body.supplierName;
    supplier.phone = req.body.phone || null;
    await supplier.save();
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    await supplier.destroy();
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { supplierValidations, listSuppliers, createSupplier, updateSupplier, deleteSupplier };
