import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const BrandsPage = ({ auth }) => {
  const [brands, setBrands] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const loadBrands = async () => {
    const response = await axios.get('/api/brands', { headers: { Authorization: `Bearer ${auth.token}` } });
    setBrands(response.data);
  };

  useEffect(() => { loadBrands(); }, [auth]);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await axios.put(`/api/brands/${editing.id}`, data, { headers: { Authorization: `Bearer ${auth.token}` } });
      } else {
        await axios.post('/api/brands', data, { headers: { Authorization: `Bearer ${auth.token}` } });
      }
      reset();
      setEditing(null);
      loadBrands();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleEdit = (brand) => {
    setEditing(brand);
    reset({ brandName: brand.brandName });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return;
    await axios.delete(`/api/brands/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } });
    loadBrands();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Brands</h2>
          <button onClick={() => { setEditing(null); reset(); }} className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">New</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input {...register('brandName')} placeholder="Brand name" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required />
          <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">{editing ? 'Update' : 'Create'}</button>
        </form>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead>
            <tr>
              <th className="border-b px-4 py-3">Name</th>
              <th className="border-b px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td className="border-b px-4 py-3">{brand.brandName}</td>
                <td className="border-b px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(brand)} className="rounded bg-amber-500 px-3 py-1 text-white">Edit</button>
                  <button onClick={() => handleDelete(brand.id)} className="rounded bg-rose-500 px-3 py-1 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandsPage;
