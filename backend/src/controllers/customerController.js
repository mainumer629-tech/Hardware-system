const { body, validationResult } = require('express-validator');
const { Customer } = require('../models/customer');

const customerValidations = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required')
];

const listCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({ order: [['customerName', 'ASC']] });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const customer = await Customer.create({
      customerName: req.body.customerName,
      phone: req.body.phone || null,
      creditLimit: req.body.creditLimit || 50000.00
    });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    customer.customerName = req.body.customerName;
    customer.phone = req.body.phone || null;
    customer.creditLimit = req.body.creditLimit || 50000.00;
    await customer.save();
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.destroy();
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { customerValidations, listCustomers, createCustomer, updateCustomer, deleteCustomer };
