import { NavLink, Outlet } from 'react-router-dom';
import { LogOut, Home, Tag, Box, Truck, Users2, ShoppingCart, FileText } from 'lucide-react';

const menu = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/brands', label: 'Brands', icon: Box },
  { to: '/products', label: 'Products', icon: ShoppingCart },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/customers', label: 'Customers', icon: Users2 },
  { to: '/purchases', label: 'Purchases', icon: FileText },
  { to: '/sales', label: 'Sales', icon: ShoppingCart },
  { to: '/reports', label: 'Reports', icon: FileText }
];

const Layout = ({ auth, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">Garment POS</h1>
            <p className="text-sm text-slate-500">Welcome, {auth?.user?.name || auth?.name}</p>
          </div>
          <button onClick={onLogout} className="inline-flex items-center gap-2 rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-600">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>
      <div className="container mx-auto grid grid-cols-12 gap-4 px-4 py-6">
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <nav className="space-y-1">
              {menu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                    <Icon size={16} /> {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="col-span-12 lg:col-span-9 xl:col-span-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
