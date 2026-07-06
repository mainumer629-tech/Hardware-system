const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  customerName: { type: DataTypes.STRING(180), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  creditLimit: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 50000.00 },
  currentKhataBalance: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0.00 }
}, {
  tableName: 'customers',
  timestamps: false
});

module.exports = { Customer };
