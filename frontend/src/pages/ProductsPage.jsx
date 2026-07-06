import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const ProductsPage = ({ auth }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const loadData = async () => {
    const [productRes, categoriesRes, brandsRes] = await Promise.all([
      axios.get('/api/products', { headers: { Authorization: `Bearer ${auth.token}` } }),
      axios.get('/api/categories', { headers: { Authorization: `Bearer ${auth.token}` } }),
      axios.get('/api/brands', { headers: { Authorization: `Bearer ${auth.token}` } })
    ]);
    setProducts(productRes.data);
    setCategories(categoriesRes.data);
    setBrands(brandsRes.data);
  };

  useEffect(() => { loadData(); }, [auth]);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await axios.put(`/api/products/${editing.id}`, data, { headers: { Authorization: `Bearer ${auth.token}` } });
      } else {
        await axios.post('/api/products', data, { headers: { Authorization: `Bearer ${auth.token}` } });
      }
      reset();
      setEditing(null);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    reset({
      categoryId: product.categoryId || '',
      brandId: product.brandId || '',
      productName: product.productName,
      skuBarcode: product.skuBarcode || '',
      unit: product.unit,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      currentStockQty: product.currentStockQty,
      minStockAlert: product.minStockAlert
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Products</h2>
            <p className="text-sm text-slate-500">Manage inventory and pricing.</p>
          </div>
          <button onClick={() => { setEditing(null); reset(); }} className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">New Product</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 lg:grid-cols-2">
          <select {...register('categoryId')} className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900">
            <option value="">Select Category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.categoryName}</option>)}
          </select>
          <select {...register('brandId')} className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900">
            <option value="">Select Brand</option>
            {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.brandName}</option>)}
          </select>
          <input {...register('productName')} placeholder="Product name" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required />
          <input {...register('skuBarcode')} placeholder="SKU / Barcode" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" />
          <select {...register('unit')} className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required>
            {['Pcs', 'Kg', 'Feet', 'Bag', 'Roll'].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <input type="number" step="0.01" {...register('purchasePrice')} placeholder="Purchase price" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required />
          <input type="number" step="0.01" {...register('sellingPrice')} placeholder="Selling price" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required />
          <input type="number" step="0.01" {...register('currentStockQty')} placeholder="Stock qty" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" />
          <input type="number" step="0.01" {...register('minStockAlert')} placeholder="Min stock alert" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" />
          <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">{editing ? 'Update' : 'Create Product'}</button>
        </form>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-600">
          <thead>
            <tr>
              <th className="border-b px-4 py-3">Name</th>
              <th className="border-b px-4 py-3">Category</th>
              <th className="border-b px-4 py-3">Brand</th>
              <th className="border-b px-4 py-3">Stock</th>
              <th className="border-b px-4 py-3">Price</th>
              <th className="border-b px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border-b px-4 py-3">{product.productName}</td>
                <td className="border-b px-4 py-3">{product.Category?.categoryName || '-'}</td>
                <td className="border-b px-4 py-3">{product.Brand?.brandName || '-'}</td>
                <td className="border-b px-4 py-3">{product.currentStockQty}</td>
                <td className="border-b px-4 py-3">{product.sellingPrice}</td>
                <td className="border-b px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(product)} className="rounded bg-amber-500 px-3 py-1 text-white">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="rounded bg-rose-500 px-3 py-1 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
