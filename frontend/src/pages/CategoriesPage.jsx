import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const CategoriesPage = ({ auth }) => {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const loadCategories = async () => {
    const response = await axios.get('/api/categories', { headers: { Authorization: `Bearer ${auth.token}` } });
    setCategories(response.data);
  };

  useEffect(() => { loadCategories(); }, [auth]);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await axios.put(`/api/categories/${editing.id}`, data, { headers: { Authorization: `Bearer ${auth.token}` } });
      } else {
        await axios.post('/api/categories', data, { headers: { Authorization: `Bearer ${auth.token}` } });
      }
      reset();
      setEditing(null);
      loadCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleEdit = (category) => {
    setEditing(category);
    reset({ categoryName: category.categoryName });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await axios.delete(`/api/categories/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } });
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Categories</h2>
          <button onClick={() => { setEditing(null); reset(); }} className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">New</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input {...register('categoryName')} placeholder="Category name" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required />
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
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="border-b px-4 py-3">{category.categoryName}</td>
                <td className="border-b px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(category)} className="rounded bg-amber-500 px-3 py-1 text-white">Edit</button>
                  <button onClick={() => handleDelete(category.id)} className="rounded bg-rose-500 px-3 py-1 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
