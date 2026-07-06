const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Brand = sequelize.define('Brand', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  brandName: { type: DataTypes.STRING(120), allowNull: false }
}, {
  tableName: 'brands',
  timestamps: false
});

module.exports = { Brand };
