const { body, validationResult } = require('express-validator');
const { SalesInvoice } = require('../models/salesInvoice');
const { SalesInvoiceItem } = require('../models/salesInvoiceItem');
const { Product } = require('../models/product');
const { Customer } = require('../models/customer');
const { User } = require('../models/user');

const salesValidations = [
  body('userId').isInt().withMessage('User ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Sales items are required'),
  body('subTotal').isFloat({ gt: 0 }).withMessage('Sub total must be greater than 0'),
  body('grandTotal').isFloat({ gt: 0 }).withMessage('Grand total must be greater than 0'),
  body('paymentType').isIn(['Cash', 'Bank', 'Khata/Credit', 'JazzCash', 'EasyPaisa']).withMessage('Invalid payment type')
];

const listSales = async (req, res, next) => {
  try {
    const invoices = await SalesInvoice.findAll({
      include: [{ model: SalesInvoiceItem, include: [Product] }, Customer, User],
      order: [['invoiceDate', 'DESC']]
    });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

const createSale = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { customerId, userId, items, subTotal, discount, tax, grandTotal, paymentType, amountReceived, invoiceDate } = req.body;
    const balanceDue = parseFloat(grandTotal) - parseFloat(amountReceived || 0);
    const customer = customerId ? await Customer.findByPk(customerId) : null;
    if (customerId && !customer) return res.status(400).json({ message: 'Customer not found' });
    const user = await User.findByPk(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const sale = await SalesInvoice.create({
      customerId: customerId || null,
      userId,
      subTotal,
      discount: discount || 0,
      tax: tax || 0,
      grandTotal,
      paymentType,
      amountReceived: amountReceived || 0,
      balanceDue,
      invoiceDate: invoiceDate || new Date()
    });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) throw new Error(`Product not found ${item.productId}`);
      const qtySold = parseFloat(item.qtySold);
      const totalPrice = parseFloat(item.unitPrice) * qtySold;
      await SalesInvoiceItem.create({ invoiceId: sale.id, productId: product.id, qtySold, unitPrice: item.unitPrice, totalPrice });
      product.currentStockQty = parseFloat(product.currentStockQty) - qtySold;
      await product.save();
    }

    res.status(201).json(sale);
  } catch (error) {
    next(error);
  }
};

module.exports = { salesValidations, listSales, createSale };
