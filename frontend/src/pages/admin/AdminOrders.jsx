import React, { useState, useEffect } from 'react';
import { getAdminOrdersAPI, updateOrderStatusAPI } from '../../services/api';
import { toast } from 'react-toastify';

const statusOptions = ['processing', 'shipped', 'delivered', 'cancelled'];
const paymentOptions = ['pending', 'paid', 'failed', 'refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await getAdminOrdersAPI(filterStatus);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const handleStatusUpdate = async (orderId, field, value) => {
    try {
      await updateOrderStatusAPI(orderId, { [field]: value });
      toast.success('Status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders ({orders.length})</h1>
        <div className="filter-group">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="orders-list admin-orders-list">
        {orders.map(order => (
          <div className="order-card admin-order-card" key={order.id}>
            <div className="order-header">
              <div>
                <span className="order-id">Order #{order.id}</span>
                <span className="order-user">{order.user_name} ({order.user_email})</span>
                <span className="order-date">
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <span className="order-total">₹{parseFloat(order.total_amount).toFixed(0)}</span>
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            {order.address && (
              <div className="order-address">
                <strong>Address:</strong> {order.address.name}, {order.address.line1}, {order.address.city} - {order.address.pincode}
              </div>
            )}

            <div className="order-controls">
              <div className="control-group">
                <label>Delivery Status:</label>
                <select
                  value={order.delivery_status}
                  onChange={e => handleStatusUpdate(order.id, 'delivery_status', e.target.value)}
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="control-group">
                <label>Payment Status:</label>
                <select
                  value={order.payment_status}
                  onChange={e => handleStatusUpdate(order.id, 'payment_status', e.target.value)}
                >
                  {paymentOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="control-group">
                <label>Payment Method:</label>
                <span className="payment-method">{order.payment_method?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="empty-state">
            <p>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
