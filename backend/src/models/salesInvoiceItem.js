const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SalesInvoiceItem = sequelize.define('SalesInvoiceItem', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  invoiceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  qtySold: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  totalPrice: { type: DataTypes.DECIMAL(14, 2), allowNull: false }
}, {
  tableName: 'sales_invoice_items',
  timestamps: false
});

module.exports = { SalesInvoiceItem };
