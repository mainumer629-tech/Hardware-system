const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  supplierName: { type: DataTypes.STRING(180), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  currentLedgerBalance: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0.00 }
}, {
  tableName: 'suppliers',
  timestamps: false
});

module.exports = { Supplier };
