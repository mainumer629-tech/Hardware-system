import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const PurchasesPage = ({ auth }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const load = async () => {
      const [supplierRes, productRes] = await Promise.all([
        axios.get('/api/suppliers', { headers: { Authorization: `Bearer ${auth.token}` } }),
        axios.get('/api/products', { headers: { Authorization: `Bearer ${auth.token}` } })
      ]);
      setSuppliers(supplierRes.data);
      setProducts(productRes.data);
    };
    load();
  }, [auth]);

  const addItem = () => {
    setItems([...items, { productId: '', qtyPurchased: 1, unitCost: 0 }]);
  };

  const updateItem = (index, field, value) => {
    setItems(items.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index) => setItems(items.filter((_, idx) => idx !== index));

  const onSubmit = async (data) => {
    const totalAmount = items.reduce((sum, item) => sum + item.qtyPurchased * item.unitCost, 0);
    await axios.post('/api/purchases', {
      supplierId: data.supplierId || null,
      items,
      totalAmount,
      paidAmount: data.paidAmount || 0,
      purchaseDate: new Date().toISOString()
    }, { headers: { Authorization: `Bearer ${auth.token}` } });
    setItems([]);
    reset();
    alert('Purchase created successfully');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Purchases</h2>
          <button onClick={addItem} className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">Add Item</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <select {...register('supplierId')} className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900">
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.supplierName}</option>)}
            </select>
            <input type="number" step="0.01" {...register('paidAmount')} placeholder="Paid amount" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" />
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-4 rounded-xl border border-slate-200 p-4">
              <select value={item.productId} onChange={(e) => updateItem(index, 'productId', e.target.value)} className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900">
                <option value="">Product</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.productName}</option>)}
              </select>
              <input type="number" min="1" value={item.qtyPurchased} onChange={(e) => updateItem(index, 'qtyPurchased', Number(e.target.value))} className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" placeholder="Qty" />
              <input type="number" step="0.01" value={item.unitCost} onChange={(e) => updateItem(index, 'unitCost', Number(e.target.value))} className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" placeholder="Unit cost" />
              <button type="button" onClick={() => removeItem(index)} className="rounded bg-rose-500 px-3 py-2 text-white">Remove</button>
            </div>
          ))}
          <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">Save Purchase</button>
        </form>
      </div>
    </div>
  );
};

export default PurchasesPage;
