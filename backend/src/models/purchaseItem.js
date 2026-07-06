const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PurchaseItem = sequelize.define('PurchaseItem', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  purchaseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  qtyPurchased: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  unitCost: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  totalCost: { type: DataTypes.DECIMAL(14, 2), allowNull: false }
}, {
  tableName: 'purchase_items',
  timestamps: false
});

module.exports = { PurchaseItem };
