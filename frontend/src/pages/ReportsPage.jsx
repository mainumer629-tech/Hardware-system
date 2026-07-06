import { useEffect, useState } from 'react';
import axios from 'axios';

const ReportsPage = ({ auth }) => {
  const [report, setReport] = useState([]);
  const [type, setType] = useState('daily');

  useEffect(() => {
    const load = async () => {
      const endpoint = type === 'daily' ? '/api/reports/daily-sales' : type === 'monthly' ? '/api/reports/monthly-sales' : '/api/reports/yearly-sales';
      const response = await axios.get(endpoint, { headers: { Authorization: `Bearer ${auth.token}` } });
      setReport(response.data);
    };
    load();
  }, [auth, type]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Reports</h2>
        <p className="mt-2 text-slate-500">View sales reports by day, month, or year.</p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setType('daily')} className={`rounded px-4 py-2 ${type === 'daily' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Daily</button>
          <button onClick={() => setType('monthly')} className={`rounded px-4 py-2 ${type === 'monthly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Monthly</button>
          <button onClick={() => setType('yearly')} className={`rounded px-4 py-2 ${type === 'yearly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Yearly</button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead>
              <tr>
                <th className="border-b px-4 py-3">Invoice ID</th>
                <th className="border-b px-4 py-3">Customer ID</th>
                <th className="border-b px-4 py-3">Total</th>
                <th className="border-b px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {report.map((item) => (
                <tr key={item.id}>
                  <td className="border-b px-4 py-3">{item.id}</td>
                  <td className="border-b px-4 py-3">{item.customerId || 'Guest'}</td>
                  <td className="border-b px-4 py-3">{item.grandTotal}</td>
                  <td className="border-b px-4 py-3">{new Date(item.invoiceDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
