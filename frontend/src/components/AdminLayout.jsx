import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiPackage, FiShoppingBag, FiLogOut } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/admin/products', label: 'Products', icon: <FiPackage /> },
    { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Link to="/">
            <span className="brand-icon">🛒</span>
            <span>ShopCode</span>
          </Link>
          <span className="admin-label">ADMIN</span>
        </div>

        <nav className="admin-nav">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`admin-nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span>{user?.name}</span>
            <small>{user?.email}</small>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
