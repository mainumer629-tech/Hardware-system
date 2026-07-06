const { User } = require('./user');
const { Category } = require('./category');
const { Brand } = require('./brand');
const { Product } = require('./product');
const { Supplier } = require('./supplier');
const { Customer } = require('./customer');
const { Purchase } = require('./purchase');
const { PurchaseItem } = require('./purchaseItem');
const { SalesInvoice } = require('./salesInvoice');
const { SalesInvoiceItem } = require('./salesInvoiceItem');

const initializeModels = () => {
  Category.hasMany(Product, { foreignKey: 'categoryId' });
  Brand.hasMany(Product, { foreignKey: 'brandId' });
  Product.belongsTo(Category, { foreignKey: 'categoryId' });
  Product.belongsTo(Brand, { foreignKey: 'brandId' });

  Supplier.hasMany(Purchase, { foreignKey: 'supplierId' });
  Purchase.belongsTo(Supplier, { foreignKey: 'supplierId' });
  Purchase.hasMany(PurchaseItem, { foreignKey: 'purchaseId' });
  PurchaseItem.belongsTo(Purchase, { foreignKey: 'purchaseId' });
  Product.hasMany(PurchaseItem, { foreignKey: 'productId' });
  PurchaseItem.belongsTo(Product, { foreignKey: 'productId' });

  Customer.hasMany(SalesInvoice, { foreignKey: 'customerId' });
  User.hasMany(SalesInvoice, { foreignKey: 'userId' });
  SalesInvoice.belongsTo(Customer, { foreignKey: 'customerId' });
  SalesInvoice.belongsTo(User, { foreignKey: 'userId' });
  SalesInvoice.hasMany(SalesInvoiceItem, { foreignKey: 'invoiceId' });
  SalesInvoiceItem.belongsTo(SalesInvoice, { foreignKey: 'invoiceId' });
  Product.hasMany(SalesInvoiceItem, { foreignKey: 'productId' });
  SalesInvoiceItem.belongsTo(Product, { foreignKey: 'productId' });
};

module.exports = {
  initializeModels,
  User,
  Category,
  Brand,
  Product,
  Supplier,
  Customer,
  Purchase,
  PurchaseItem,
  SalesInvoice,
  SalesInvoiceItem
};
