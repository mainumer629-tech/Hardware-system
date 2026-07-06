import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const CustomersPage = ({ auth }) => {
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const loadCustomers = async () => {
    const response = await axios.get('/api/customers', { headers: { Authorization: `Bearer ${auth.token}` } });
    setCustomers(response.data);
  };

  useEffect(() => { loadCustomers(); }, [auth]);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await axios.put(`/api/customers/${editing.id}`, data, { headers: { Authorization: `Bearer ${auth.token}` } });
      } else {
        await axios.post('/api/customers', data, { headers: { Authorization: `Bearer ${auth.token}` } });
      }
      reset();
      setEditing(null);
      loadCustomers();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleEdit = (customer) => {
    setEditing(customer);
    reset({ customerName: customer.customerName, phone: customer.phone || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    await axios.delete(`/api/customers/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } });
    loadCustomers();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customers</h2>
          <button onClick={() => { setEditing(null); reset(); }} className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">New Customer</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 md:grid-cols-2">
          <input {...register('customerName')} placeholder="Customer name" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required />
          <input {...register('phone')} placeholder="Phone" className="rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" />
          <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">{editing ? 'Update' : 'Create'}</button>
        </form>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-600">
          <thead>
            <tr>
              <th className="border-b px-4 py-3">Name</th>
              <th className="border-b px-4 py-3">Phone</th>
              <th className="border-b px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="border-b px-4 py-3">{customer.customerName}</td>
                <td className="border-b px-4 py-3">{customer.phone || '-'}</td>
                <td className="border-b px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(customer)} className="rounded bg-amber-500 px-3 py-1 text-white">Edit</button>
                  <button onClick={() => handleDelete(customer.id)} className="rounded bg-rose-500 px-3 py-1 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;
