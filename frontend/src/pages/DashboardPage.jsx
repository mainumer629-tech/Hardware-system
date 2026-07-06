import { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = ({ auth }) => {
  const [summary, setSummary] = useState({ products: 0, customers: 0, suppliers: 0, invoices: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, customers, suppliers, invoices] = await Promise.all([
          axios.get('/api/products', { headers: { Authorization: `Bearer ${auth.token}` } }),
          axios.get('/api/customers', { headers: { Authorization: `Bearer ${auth.token}` } }),
          axios.get('/api/suppliers', { headers: { Authorization: `Bearer ${auth.token}` } }),
          axios.get('/api/sales', { headers: { Authorization: `Bearer ${auth.token}` } })
        ]);
        setSummary({ products: products.data.length, customers: customers.data.length, suppliers: suppliers.data.length, invoices: invoices.data.length });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [auth]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="mt-2 text-slate-600">Overview of stock, customers, suppliers, and invoices.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Products', value: summary.products },
          { label: 'Customers', value: summary.customers },
          { label: 'Suppliers', value: summary.suppliers },
          { label: 'Invoices', value: summary.invoices }
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
