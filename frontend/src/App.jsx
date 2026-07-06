import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import BrandsPage from './pages/BrandsPage';
import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';
import CustomersPage from './pages/CustomersPage';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import ReportsPage from './pages/ReportsPage';
import Layout from './components/Layout';

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (data) => {
    setAuth(data);
    localStorage.setItem('auth', JSON.stringify(data));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/" element={auth ? <Layout auth={auth} onLogout={handleLogout} /> : <Navigate to="/login" />}>
        <Route index element={<DashboardPage auth={auth} />} />
        <Route path="categories" element={<CategoriesPage auth={auth} />} />
        <Route path="brands" element={<BrandsPage auth={auth} />} />
        <Route path="products" element={<ProductsPage auth={auth} />} />
        <Route path="suppliers" element={<SuppliersPage auth={auth} />} />
        <Route path="customers" element={<CustomersPage auth={auth} />} />
        <Route path="sales" element={<SalesPage auth={auth} />} />
        <Route path="purchases" element={<PurchasesPage auth={auth} />} />
        <Route path="reports" element={<ReportsPage auth={auth} />} />
      </Route>
      <Route path="*" element={<Navigate to={auth ? '/' : '/login'} />} />
    </Routes>
  );
}

export default App;
