import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cart, updateQuantity, removeItem, totalAmount, totalItems } =
    useCart();
  const navigate = useNavigate();

  const deliveryFee = totalAmount >= 199 ? 0 : 30;
  const grandTotal = totalAmount + deliveryFee;

  const handleIncrement = async (productId, qty) => {
    try {
      await updateQuantity(productId, qty + 1);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDecrement = async (productId, qty) => {
    try {
      await updateQuantity(productId, qty - 1);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <span className="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add items to your cart to get started</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart ({totalItems} items)</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => {
            return (
              <div className="cart-item" key={item.id}>
                <img style={{ width: "30px" }} src={item.images} width="150" />
                {/* <img src={img} alt={item.name} className="cart-item-img" /> */}
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>
                    {item.brand} • {item.weight}
                  </p>
                  <p className="cart-item-price">
                    ₹{item.price_at_time} × {item.quantity}
                  </p>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleDecrement(item.product_id, item.quantity)
                      }
                    >
                      <FiMinus />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleIncrement(item.product_id, item.quantity)
                      }
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <span className="cart-item-total">
                    ₹{(item.price_at_time * item.quantity).toFixed(0)}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.product_id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalAmount.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>
              {deliveryFee === 0 ? (
                <span className="free-text">FREE</span>
              ) : (
                `₹${deliveryFee}`
              )}
            </span>
          </div>
          {totalAmount < 199 && (
            <p className="delivery-hint">
              Add ₹{(199 - totalAmount).toFixed(0)} more for free delivery
            </p>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(0)}</span>
          </div>
          <button
            className="btn-checkout"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
