const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  categoryName: { type: DataTypes.STRING(120), allowNull: false }
}, {
  tableName: 'categories',
  timestamps: false
});

module.exports = { Category };
