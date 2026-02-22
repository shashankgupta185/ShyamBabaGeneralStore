import React, { useState, useEffect } from 'react';
import { getAdminStatsAPI } from '../../services/api';
import { FiDollarSign, FiShoppingBag, FiPackage, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getAdminStatsAPI();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;
  if (!stats) return <div className="admin-error">Failed to load stats</div>;

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: '#10b981' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag />, color: '#3b82f6' },
    { label: 'Total Products', value: stats.totalProducts, icon: <FiPackage />, color: '#f59e0b' },
    { label: 'Total Customers', value: stats.totalUsers, icon: <FiUsers />, color: '#8b5cf6' },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        {/* Sales Chart */}
        <div className="admin-card">
          <h2>Sales (Last 30 Days)</h2>
          {stats.dailySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
                <YAxis />
                <Tooltip formatter={(v) => `₹${v}`} />
                <Bar dataKey="revenue" fill="#f8cb46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No sales data yet</p>
          )}
        </div>

        {/* Top Products */}
        <div className="admin-card">
          <h2>Top Selling Products</h2>
          {stats.topProducts.length > 0 ? (
            <div className="top-products-list">
              {stats.topProducts.map((p, i) => (
                <div className="top-product-item" key={p.id}>
                  <span className="top-rank">#{i + 1}</span>
                  <div>
                    <span className="top-name">{p.name}</span>
                    <span className="top-brand">{p.brand}</span>
                  </div>
                  <span className="top-sold">{p.total_sold} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No sales data yet</p>
          )}
        </div>
      </div>

      <div className="admin-grid-2">
        {/* Low Stock */}
        <div className="admin-card">
          <h2><FiAlertTriangle className="warning-icon" /> Low Stock Products</h2>
          {stats.lowStock.length > 0 ? (
            <div className="low-stock-list">
              {stats.lowStock.map(p => (
                <div className="low-stock-item" key={p.id}>
                  <span>{p.name}</span>
                  <span className={`stock-count ${p.stock <= 5 ? 'critical' : 'warning'}`}>{p.stock} left</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">All products well stocked 👍</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <h2>Recent Orders</h2>
          {stats.recentOrders.length > 0 ? (
            <div className="recent-orders-list">
              {stats.recentOrders.map(o => (
                <div className="recent-order-item" key={o.id}>
                  <div>
                    <span className="ro-id">#{o.id}</span>
                    <span className="ro-user">{o.user_name}</span>
                  </div>
                  <div>
                    <span className="ro-amount">₹{parseFloat(o.total_amount).toFixed(0)}</span>
                    <span className={`status-badge status-${o.delivery_status}`}>{o.delivery_status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
