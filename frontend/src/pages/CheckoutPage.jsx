import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { cart, totalAmount, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  });

  const deliveryFee = totalAmount >= 199 ? 0 : 30;
  const grandTotal = totalAmount + deliveryFee;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await createOrderAPI({ address, payment_method: 'cod' });
      toast.success('🎉 Order placed successfully!');
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Nothing to checkout</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>Go Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery Address</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={address.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={address.phone} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label>Address Line 1 *</label>
              <input name="line1" value={address.line1} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label>Address Line 2</label>
              <input name="line2" value={address.line2} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input name="city" value={address.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input name="state" value={address.state} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>PIN Code *</label>
              <input name="pincode" value={address.pincode} onChange={handleChange} required />
            </div>
          </div>

          <h2>Payment Method</h2>
          <div className="payment-option selected">
            <input type="radio" checked readOnly /> Cash on Delivery (COD)
          </div>

          <button type="submit" className="btn-checkout" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order • ₹${grandTotal.toFixed(0)}`}
          </button>
        </form>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          {cart.map(item => (
            <div className="summary-item" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price_at_time * item.quantity).toFixed(0)}</span>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>₹{totalAmount.toFixed(0)}</span></div>
          <div className="summary-row"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{grandTotal.toFixed(0)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
