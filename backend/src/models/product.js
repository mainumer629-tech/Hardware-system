const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  brandId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  productName: { type: DataTypes.STRING(200), allowNull: false },
  skuBarcode: { type: DataTypes.STRING(120), allowNull: true, unique: true },
  unit: { type: DataTypes.ENUM('Pcs', 'Kg', 'Feet', 'Bag', 'Roll'), allowNull: false, defaultValue: 'Pcs' },
  purchasePrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  sellingPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currentStockQty: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  minStockAlert: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 5 }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = { Product };
