import { useEffect, useState } from 'react';
import axios from 'axios';

const SalesPage = ({ auth }) => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentType, setPaymentType] = useState('Cash');
  const [amountReceived, setAmountReceived] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [productRes, customerRes] = await Promise.all([
        axios.get('/api/products', { headers: { Authorization: `Bearer ${auth.token}` } }),
        axios.get('/api/customers', { headers: { Authorization: `Bearer ${auth.token}` } })
      ]);
      setProducts(productRes.data);
      setCustomers(customerRes.data);
    };
    load();
  }, [auth]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      setCart(cart.map((item) => item.productId === product.id ? { ...item, qtySold: item.qtySold + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, productName: product.productName, unitPrice: product.sellingPrice, qtySold: 1 }]);
    }
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return;
    setCart(cart.map((item) => item.productId === productId ? { ...item, qtySold: qty } : item));
  };

  const removeItem = (productId) => setCart(cart.filter((item) => item.productId !== productId));

  const subTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qtySold, 0);
  const tax = subTotal * 0.1;
  const discount = 0;
  const grandTotal = subTotal + tax - discount;

  const handleSubmit = async () => {
    if (!cart.length) return alert('Cart is empty');
    await axios.post('/api/sales', {
      customerId: selectedCustomer || null,
      userId: auth.user.id,
      items: cart,
      subTotal,
      discount,
      tax,
      grandTotal,
      paymentType,
      amountReceived,
      invoiceDate: new Date().toISOString()
    }, { headers: { Authorization: `Bearer ${auth.token}` } });
    setCart([]);
    alert('Sale created successfully');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Sales POS</h2>
        <p className="mt-2 text-slate-500">Add products, choose a customer, and complete the sale.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-semibold">Products</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold">{product.productName}</h4>
                <p className="text-sm text-slate-500">Price: {product.sellingPrice}</p>
                <button onClick={() => addToCart(product)} className="mt-3 w-full rounded bg-slate-900 px-3 py-2 text-white hover:bg-slate-700">Add</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Cart</h3>
          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <div key={item.productId} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-slate-500">{item.unitPrice} x {item.qtySold}</p>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="rounded bg-rose-500 px-2 py-1 text-white">Remove</button>
                </div>
                <input type="number" min="1" value={item.qtySold} onChange={(e) => updateQty(item.productId, Number(e.target.value))} className="mt-2 w-full rounded border border-slate-200 px-2 py-1 outline-none" />
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{subTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-slate-600"><span>Tax (10%)</span><span>{tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm font-semibold text-slate-900"><span>Total</span><span>{grandTotal.toFixed(2)}</span></div>
          </div>
          <div className="mt-4 space-y-3">
            <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900">
              <option value="">Guest</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.customerName}</option>)}
            </select>
            <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900">
              {['Cash', 'Bank', 'Khata/Credit', 'JazzCash', 'EasyPaisa'].map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <input type="number" min="0" value={amountReceived} onChange={(e) => setAmountReceived(Number(e.target.value))} placeholder="Amount received" className="w-full rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" />
            <button onClick={handleSubmit} className="w-full rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">Complete Sale</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
