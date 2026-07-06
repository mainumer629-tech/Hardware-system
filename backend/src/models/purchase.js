const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Purchase = sequelize.define('Purchase', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  supplierId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  totalAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  paidAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  dueAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  purchaseDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'purchases',
  timestamps: false
});

module.exports = { Purchase };
