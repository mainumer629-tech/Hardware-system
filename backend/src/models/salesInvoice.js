const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SalesInvoice = sequelize.define('SalesInvoice', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  customerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  subTotal: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  discount: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0.00 },
  tax: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0.00 },
  grandTotal: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  paymentType: { type: DataTypes.ENUM('Cash', 'Bank', 'Khata/Credit', 'JazzCash', 'EasyPaisa'), allowNull: false, defaultValue: 'Cash' },
  amountReceived: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  balanceDue: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0.00 },
  invoiceDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'sales_invoices',
  timestamps: false
});

module.exports = { SalesInvoice };
