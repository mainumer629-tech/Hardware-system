const { SalesInvoice } = require('../models/salesInvoice');
const { Purchase } = require('../models/purchase');
const { Product } = require('../models/product');
const { Customer } = require('../models/customer');
const { Supplier } = require('../models/supplier');

const dailySales = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    const results = await SalesInvoice.findAll({
      where: { invoiceDate: { [require('sequelize').Op.between]: [start, end] } }
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const monthlySales = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year || new Date().getFullYear(), 10);
    const month = parseInt(req.query.month || new Date().getMonth() + 1, 10);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    const results = await SalesInvoice.findAll({
      where: { invoiceDate: { [require('sequelize').Op.between]: [start, end] } }
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const yearlySales = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year || new Date().getFullYear(), 10);
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    const results = await SalesInvoice.findAll({
      where: { invoiceDate: { [require('sequelize').Op.between]: [start, end] } }
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const inventoryReport = async (req, res, next) => {
  try {
    const products = await Product.findAll({ order: [['productName', 'ASC']] });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const customerReport = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({ order: [['customerName', 'ASC']] });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

const supplierReport = async (req, res, next) => {
  try {
    const suppliers = await Supplier.findAll({ order: [['supplierName', 'ASC']] });
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

module.exports = { dailySales, monthlySales, yearlySales, inventoryReport, customerReport, supplierReport };
