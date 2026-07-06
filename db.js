const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
const dbPath = path.join(dataPath, 'hardware_shop.db');
const db = new sqlite3.Database(dbPath);

const createTables = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('Admin','Manager','Salesman')) NOT NULL DEFAULT 'Salesman',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_name TEXT NOT NULL,
      phone TEXT,
      current_ledger_balance REAL DEFAULT 0.00
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT,
      credit_limit REAL DEFAULT 50000.00,
      current_khata_balance REAL DEFAULT 0.00
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      brand_id INTEGER,
      product_name TEXT NOT NULL,
      sku_barcode TEXT UNIQUE,
      unit TEXT CHECK(unit IN ('Pcs','Kg','Feet','Bag','Roll')) NOT NULL DEFAULT 'Pcs',
      purchase_price REAL NOT NULL,
      selling_price REAL NOT NULL,
      current_stock_qty REAL DEFAULT 0.00,
      min_stock_alert REAL DEFAULT 5.00,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (brand_id) REFERENCES brands(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER,
      total_amount REAL NOT NULL,
      paid_amount REAL NOT NULL,
      due_amount REAL NOT NULL,
      purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER,
      product_id INTEGER,
      qty_purchased REAL NOT NULL,
      unit_cost REAL NOT NULL,
      total_cost REAL NOT NULL,
      FOREIGN KEY (purchase_id) REFERENCES purchases(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sales_invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      user_id INTEGER,
      sub_total REAL NOT NULL,
      discount REAL DEFAULT 0.00,
      grand_total REAL NOT NULL,
      payment_type TEXT CHECK(payment_type IN ('Cash','Bank','Khata/Credit')) NOT NULL DEFAULT 'Cash',
      amount_received REAL NOT NULL,
      balance_due REAL DEFAULT 0.00,
      invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sales_invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      product_id INTEGER,
      qty_sold REAL NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES sales_invoices(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`);

    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (id, name, email, password_hash, role)
      VALUES (1, 'Admin', 'admin@example.com', ?, 'Admin')`, [adminPassword]);

    // Seed Categories
    db.run(`INSERT OR IGNORE INTO categories (id, category_name) VALUES
      (1, 'Hand Tools'), (2, 'Power Tools'), (3, 'Safety Equipment'),
      (4, 'Building Materials'), (5, 'Fasteners'), (6, 'Paints & Coatings'),
      (7, 'Plumbing'), (8, 'Electrical')`, []);

    // Seed Brands
    db.run(`INSERT OR IGNORE INTO brands (id, brand_name) VALUES
      (1, 'Stanley'), (2, 'Black+Decker'), (3, 'Bosch'), (4, 'Dewalt'),
      (5, 'Makita'), (6, '3M'), (7, 'Hilti'), (8, 'Milwaukee')`, []);

    // Seed Products
    db.run(`INSERT OR IGNORE INTO products (id, category_id, brand_id, product_name, sku_barcode, unit, purchase_price, selling_price, current_stock_qty, min_stock_alert) VALUES
      (1, 1, 1, 'Hammer 16oz', 'SKU-001', 'Pcs', 800, 1200, 45, 10),
      (2, 1, 1, 'Screwdriver Set', 'SKU-002', 'Pcs', 1500, 2500, 28, 8),
      (3, 1, 2, 'Adjustable Wrench', 'SKU-003', 'Pcs', 600, 1000, 35, 10),
      (4, 2, 3, 'Drill Machine 13mm', 'SKU-004', 'Pcs', 4500, 6500, 12, 5),
      (5, 2, 4, 'Circular Saw', 'SKU-005', 'Pcs', 7500, 10500, 8, 3),
      (6, 2, 5, 'Impact Driver', 'SKU-006', 'Pcs', 6000, 8500, 15, 5),
      (7, 3, 6, 'Safety Helmet', 'SKU-007', 'Pcs', 250, 450, 150, 30),
      (8, 3, 6, 'Work Gloves Pair', 'SKU-008', 'Pcs', 150, 300, 200, 50),
      (9, 3, 6, 'Safety Goggles', 'SKU-009', 'Pcs', 200, 400, 100, 20),
      (10, 4, 7, 'Cement Bag 50kg', 'SKU-010', 'Bag', 350, 500, 500, 100),
      (11, 4, 7, 'Brick Standard Red', 'SKU-011', 'Pcs', 6, 10, 5000, 500),
      (12, 4, 7, 'Sand 50kg Bag', 'SKU-012', 'Bag', 200, 350, 300, 50),
      (13, 5, 1, 'Nail 2 inch 1kg', 'SKU-013', 'Kg', 80, 150, 120, 20),
      (14, 5, 1, 'Screw 1 inch Box', 'SKU-014', 'Pcs', 250, 450, 80, 15),
      (15, 5, 2, 'Bolt M10 100pcs', 'SKU-015', 'Pcs', 400, 700, 60, 10),
      (16, 6, 1, 'Wall Paint White 1L', 'SKU-016', 'Pcs', 600, 950, 75, 15),
      (17, 6, 1, 'Enamel Paint Red 500ml', 'SKU-017', 'Pcs', 350, 600, 50, 10),
      (18, 6, 6, 'Putty Knife', 'SKU-018', 'Pcs', 200, 400, 40, 10),
      (19, 7, 2, 'PVC Pipe 1 inch 1m', 'SKU-019', 'Feet', 15, 30, 200, 40),
      (20, 7, 2, 'Tap Faucet Brass', 'SKU-020', 'Pcs', 1200, 1800, 25, 8),
      (21, 8, 1, 'Wire Cable 1.5sqmm', 'SKU-021', 'Pcs', 5, 12, 500, 100),
      (22, 8, 8, 'Light Bulb LED 9W', 'SKU-022', 'Pcs', 200, 350, 120, 30),
      (23, 8, 8, 'Switch Board 2 way', 'SKU-023', 'Pcs', 350, 600, 60, 15)`, []);

    // Seed Suppliers
    db.run(`INSERT OR IGNORE INTO suppliers (id, supplier_name, phone, current_ledger_balance) VALUES
      (1, 'ABC Hardware Co.', '03001234567', 50000),
      (2, 'XYZ Building Supplies', '03009876543', 75000),
      (3, 'Elite Tools Ltd.', '03005551234', 100000),
      (4, 'Premium Materials Inc.', '03004441111', 45000)`, []);

    // Seed Customers
    db.run(`INSERT OR IGNORE INTO customers (id, customer_name, phone, credit_limit, current_khata_balance) VALUES
      (1, 'Ali Construction', '03001111111', 100000, 15000),
      (2, 'Kareem Shop', '03002222222', 50000, 0),
      (3, 'Hassan Builders', '03003333333', 75000, 25000),
      (4, 'Fatima Hardware Store', '03004444444', 60000, 10000),
      (5, 'Muhammad Contractors', '03005555555', 80000, 0)`, []);
  });
};

createTables();

module.exports = db;
