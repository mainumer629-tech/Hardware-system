const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'hardware-shop-secret',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: dataPath })
}));

const authRequired = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.render('login', { error: 'Invalid email or password.' });
    }
    req.session.user = { id: user.id, name: user.name, role: user.role, email: user.email };
    res.redirect('/dashboard');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.get('/dashboard', authRequired, (req, res) => {
  db.serialize(() => {
    db.get('SELECT COUNT(*) AS count FROM products', (err, products) => {
      db.get('SELECT COUNT(*) AS count FROM customers', (err2, customers) => {
        db.get('SELECT COUNT(*) AS count FROM suppliers', (err3, suppliers) => {
          db.get('SELECT COUNT(*) AS count FROM sales_invoices', (err4, invoices) => {
            res.render('dashboard', {
              user: req.session.user,
              summary: {
                products: products?.count || 0,
                customers: customers?.count || 0,
                suppliers: suppliers?.count || 0,
                invoices: invoices?.count || 0
              }
            });
          });
        });
      });
    });
  });
});

const renderList = (view, query, callback) => {
  db.all(query, callback);
};

app.get('/categories', authRequired, (req, res) => {
  renderList('categories', 'SELECT * FROM categories', (err, rows) => {
    res.render('categories/index', { user: req.session.user, categories: rows || [] });
  });
});

app.post('/categories', authRequired, (req, res) => {
  db.run('INSERT INTO categories (category_name) VALUES (?)', [req.body.category_name || ''], () => res.redirect('/categories'));
});

app.get('/brands', authRequired, (req, res) => {
  renderList('brands', 'SELECT * FROM brands', (err, rows) => {
    res.render('brands/index', { user: req.session.user, brands: rows || [] });
  });
});

app.post('/brands', authRequired, (req, res) => {
  db.run('INSERT INTO brands (brand_name) VALUES (?)', [req.body.brand_name || ''], () => res.redirect('/brands'));
});

app.get('/suppliers', authRequired, (req, res) => {
  renderList('suppliers', 'SELECT * FROM suppliers', (err, rows) => {
    res.render('suppliers/index', { user: req.session.user, suppliers: rows || [] });
  });
});

app.post('/suppliers', authRequired, (req, res) => {
  db.run('INSERT INTO suppliers (supplier_name, phone) VALUES (?, ?)', [req.body.supplier_name || '', req.body.phone || ''], () => res.redirect('/suppliers'));
});

app.get('/customers', authRequired, (req, res) => {
  renderList('customers', 'SELECT * FROM customers', (err, rows) => {
    res.render('customers/index', { user: req.session.user, customers: rows || [] });
  });
});

app.post('/customers', authRequired, (req, res) => {
  db.run('INSERT INTO customers (customer_name, phone) VALUES (?, ?)', [req.body.customer_name || '', req.body.phone || ''], () => res.redirect('/customers'));
});

app.post('/customers/delete', authRequired, (req, res) => {
  const customerId = req.body.customer_id;
  if (!customerId) return res.redirect('/customers');

  db.serialize(() => {
    db.run('UPDATE sales_invoices SET customer_id = NULL WHERE customer_id = ?', [customerId]);
    db.run('DELETE FROM customers WHERE id = ?', [customerId], () => res.redirect('/customers'));
  });
});

app.get('/products', authRequired, (req, res) => {
  db.all(`SELECT p.*, c.category_name, b.brand_name FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id`, [], (err, rows) => {
    db.all('SELECT * FROM categories', [], (e1, categories) => {
      db.all('SELECT * FROM brands', [], (e2, brands) => {
        res.render('products/index', {
          user: req.session.user,
          products: rows || [],
          categories: categories || [],
          brands: brands || []
        });
      });
    });
  });
});

app.post('/products', authRequired, (req, res) => {
  const { product_name, sku_barcode, category_id, brand_id, unit, purchase_price, selling_price, current_stock_qty, min_stock_alert } = req.body;
  db.run(`INSERT INTO products (product_name, sku_barcode, category_id, brand_id, unit, purchase_price, selling_price, current_stock_qty, min_stock_alert)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [product_name, sku_barcode, category_id || null, brand_id || null, unit || 'Pcs', purchase_price || 0, selling_price || 0, current_stock_qty || 0, min_stock_alert || 5], () => res.redirect('/products'));
});

app.post('/products/delete', authRequired, (req, res) => {
  const productId = req.body.product_id;
  if (!productId) return res.redirect('/products');

  db.serialize(() => {
    db.run('DELETE FROM purchase_items WHERE product_id = ?', [productId]);
    db.run('DELETE FROM sales_invoice_items WHERE product_id = ?', [productId]);
    db.run('DELETE FROM products WHERE id = ?', [productId], () => res.redirect('/products'));
  });
});

app.get('/purchases', authRequired, (req, res) => {
  db.all(`SELECT p.*, s.supplier_name FROM purchases p
    LEFT JOIN suppliers s ON p.supplier_id = s.id ORDER BY p.purchase_date DESC`, [], (err, purchases) => {
    db.all('SELECT * FROM suppliers', [], (e1, suppliers) => {
      db.all('SELECT * FROM products', [], (e2, products) => {
        res.render('purchases/index', {
          user: req.session.user,
          purchases: purchases || [],
          suppliers: suppliers || [],
          products: products || []
        });
      });
    });
  });
});

app.post('/purchases', authRequired, (req, res) => {
  const supplier_id = req.body.supplier_id || null;
  const qty = parseFloat(req.body.qty_purchased) || 0;
  const unitCost = parseFloat(req.body.unit_cost) || 0;
  const total_amount = qty * unitCost;
  const paid_amount = parseFloat(req.body.paid_amount) || 0;
  const due_amount = total_amount - paid_amount;
  db.run('INSERT INTO purchases (supplier_id, total_amount, paid_amount, due_amount) VALUES (?, ?, ?, ?)', [supplier_id, total_amount, paid_amount, due_amount], function () {
    const purchaseId = this.lastID;
    const productId = req.body.product_id;
    const totalCost = qty * unitCost;
    if (productId && qty > 0) {
      db.run('INSERT INTO purchase_items (purchase_id, product_id, qty_purchased, unit_cost, total_cost) VALUES (?, ?, ?, ?, ?)', [purchaseId, productId, qty, unitCost, totalCost]);
      db.run('UPDATE products SET current_stock_qty = current_stock_qty + ? WHERE id = ?', [qty, productId]);
    }
    res.redirect('/purchases');
  });
});

app.get('/sales', authRequired, (req, res) => {
  const printInvoiceId = req.query.print_invoice_id;
  db.all(`SELECT s.*, c.customer_name, u.name AS salesman FROM sales_invoices s
    LEFT JOIN customers c ON s.customer_id = c.id
    LEFT JOIN users u ON s.user_id = u.id ORDER BY s.invoice_date DESC`, [], (err, invoices) => {
    db.all('SELECT * FROM customers', [], (e1, customers) => {
      db.all('SELECT * FROM products', [], (e2, products) => {
        const renderSales = (printInvoice) => {
          res.render('sales/index', {
            user: req.session.user,
            invoices: invoices || [],
            customers: customers || [],
            products: products || [],
            printInvoice: printInvoice || null
          });
        };

        if (!printInvoiceId) return renderSales(null);

        db.get(`SELECT s.*, c.customer_name, c.phone AS customer_phone, u.name AS cashier FROM sales_invoices s
          LEFT JOIN customers c ON s.customer_id = c.id
          LEFT JOIN users u ON s.user_id = u.id WHERE s.id = ?`, [printInvoiceId], (errInv, invoice) => {
          if (!invoice) return renderSales(null);

          db.all(`SELECT si.*, p.product_name FROM sales_invoice_items si
            LEFT JOIN products p ON si.product_id = p.id WHERE si.invoice_id = ?`, [printInvoiceId], (errItems, invoiceItems) => {
            renderSales({
              ...invoice,
              items: invoiceItems || []
            });
          });
        });
      });
    });
  });
});

app.post('/sales', authRequired, (req, res) => {
  const customer_id = req.body.customer_id || null;
  const product_id = req.body.product_id;
  const qty_sold = parseFloat(req.body.qty_sold) || 0;
  const unit_price = parseFloat(req.body.unit_price) || 0;
  const total_price = qty_sold * unit_price;
  const discount = parseFloat(req.body.discount) || 0;
  const sub_total = total_price;
  const grand_total = sub_total - discount;
  const amount_received = parseFloat(req.body.amount_received) || 0;
  const balance_due = Math.max(0, grand_total - amount_received);

  db.run(`INSERT INTO sales_invoices (customer_id, user_id, sub_total, discount, grand_total, payment_type, amount_received, balance_due)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [customer_id, req.session.user.id, sub_total, discount, grand_total, req.body.payment_type || 'Cash', amount_received, balance_due], function () {
    const invoiceId = this.lastID;
    if (product_id && qty_sold > 0) {
      db.run('INSERT INTO sales_invoice_items (invoice_id, product_id, qty_sold, unit_price, total_price) VALUES (?, ?, ?, ?, ?)', [invoiceId, product_id, qty_sold, unit_price, total_price]);
      db.run('UPDATE products SET current_stock_qty = current_stock_qty - ? WHERE id = ?', [qty_sold, product_id]);
    }
    if (balance_due > 0) {
      db.run('UPDATE customers SET current_khata_balance = current_khata_balance + ? WHERE id = ?', [balance_due, customer_id]);
    }
    res.redirect(`/sales/invoice/${invoiceId}`);
  });
});

app.get('/sales/invoice/:id', authRequired, (req, res) => {
  const invoiceId = req.params.id;
  db.get(`SELECT s.*, c.customer_name, c.phone AS customer_phone, u.name AS cashier FROM sales_invoices s
    LEFT JOIN customers c ON s.customer_id = c.id
    LEFT JOIN users u ON s.user_id = u.id WHERE s.id = ?`, [invoiceId], (errInv, invoice) => {
    if (errInv || !invoice) return res.redirect('/sales');
    db.all(`SELECT si.*, p.product_name FROM sales_invoice_items si
      LEFT JOIN products p ON si.product_id = p.id WHERE si.invoice_id = ?`, [invoiceId], (errItems, invoiceItems) => {
      res.render('sales/invoice', {
        user: req.session.user,
        invoice: {
          ...invoice,
          items: invoiceItems || []
        }
      });
    });
  });
});

app.post('/sales/delete', authRequired, (req, res) => {
  const invoiceId = req.body.invoice_id;
  if (!invoiceId) return res.redirect('/sales');

  db.serialize(() => {
    db.run('DELETE FROM sales_invoice_items WHERE invoice_id = ?', [invoiceId]);
    db.run('DELETE FROM sales_invoices WHERE id = ?', [invoiceId]);
  });

  res.redirect('/sales');
});

app.get('/reports', authRequired, (req, res) => {
  db.serialize(() => {
    db.all('SELECT * FROM products WHERE current_stock_qty <= min_stock_alert', [], (err, lowStock) => {
      db.all('SELECT * FROM sales_invoices ORDER BY invoice_date DESC LIMIT 10', [], (err2, recentSales) => {
        res.render('reports/index', { user: req.session.user, lowStock: lowStock || [], recentSales: recentSales || [] });
      });
    });
  });
});

const server = app.listen(PORT, () => {
  console.log(`Hardware Shop Management System is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop any other application using port ${PORT} or set a different PORT environment variable.`);
    process.exit(1);
  }
  throw err;
});
