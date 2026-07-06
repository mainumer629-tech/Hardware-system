const { body, validationResult } = require('express-validator');
const { Purchase } = require('../models/purchase');
const { PurchaseItem } = require('../models/purchaseItem');
const { Product } = require('../models/product');

const purchaseValidations = [
  body('supplierId').optional().isInt().withMessage('Supplier ID must be a number'),
  body('items').isArray({ min: 1 }).withMessage('Purchase items are required'),
  body('totalAmount').isFloat({ gt: 0 }).withMessage('Total amount must be greater than 0'),
  body('paidAmount').isFloat({ min: 0 }).withMessage('Paid amount must be 0 or more')
];

const listPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({ include: [{ model: PurchaseItem, include: [Product] }], order: [['purchaseDate', 'DESC']] });
    res.json(purchases);
  } catch (error) {
    next(error);
  }
};

const createPurchase = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { supplierId, items, totalAmount, paidAmount, purchaseDate } = req.body;
    const dueAmount = parseFloat(totalAmount) - parseFloat(paidAmount || 0);
    const purchase = await Purchase.create({ supplierId: supplierId || null, totalAmount, paidAmount, dueAmount, purchaseDate: purchaseDate || new Date() });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) throw new Error(`Product not found ${item.productId}`);
      const qtyPurchased = parseFloat(item.qtyPurchased);
      const totalCost = parseFloat(item.unitCost) * qtyPurchased;
      await PurchaseItem.create({ purchaseId: purchase.id, productId: product.id, qtyPurchased, unitCost: item.unitCost, totalCost });
      product.currentStockQty = parseFloat(product.currentStockQty) + qtyPurchased;
      await product.save();
    }

    res.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
};

module.exports = { purchaseValidations, listPurchases, createPurchase };
