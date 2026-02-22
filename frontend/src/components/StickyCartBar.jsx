import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag, FiChevronRight } from 'react-icons/fi';

const StickyCartBar = () => {
  const { totalItems, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || totalItems === 0) return null;

  const freeDelivery = totalAmount >= 199;

  return (
    <div className="sticky-cart-bar">
      <div className="sticky-cart-inner">
        <div className="sticky-cart-left">
          <FiShoppingBag className="sticky-cart-icon" />
          <div className="sticky-cart-info">
            <span className="sticky-cart-delivery">
              {freeDelivery ? '✅ Free delivery unlocked!' : `Add ₹${(199 - totalAmount).toFixed(0)} more for free delivery`}
            </span>
            <span className="sticky-cart-summary">
              {totalItems} item{totalItems > 1 ? 's' : ''} • ₹{totalAmount.toFixed(0)}
            </span>
          </div>
        </div>
        <button className="sticky-cart-btn" onClick={() => navigate('/cart')}>
          View Cart <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default StickyCartBar;
