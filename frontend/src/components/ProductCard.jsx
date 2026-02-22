import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiPlus, FiMinus, FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const quantity = getItemQuantity(product.id);

  const discountPercent = product.discount_price
    ? Math.round(
        ((product.price - product.discount_price) / product.price) * 100,
      )
    : 0;

  const displayPrice = product.discount_price || product.price;
  const imageUrl = product.images;

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add");
    }
  };

  const handleIncrement = async () => {
    try {
      await updateQuantity(product.id, quantity + 1);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update");
    }
  };

  const handleDecrement = async () => {
    try {
      await updateQuantity(product.id, quantity - 1);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update");
    }
  };
  return (
    <div className="product-card">
      {discountPercent > 0 && (
        <span className="discount-badge">{discountPercent}% OFF</span>
      )}

      <div className="product-image-wrapper">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>

      {product.rating > 0 && (
        <div className="rating-badge">
          <FiStar className="star-icon" /> {product.rating}
        </div>
      )}

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-weight">
          {product.brand} • {product.weight}
        </p>

        <div className="product-price-row">
          <div className="price-group">
            <span className="discount-price">₹{displayPrice}</span>
            {product.discount_price && (
              <span className="original-price">₹{product.price}</span>
            )}
          </div>

          {quantity === 0 ? (
            <button className="add-btn" onClick={handleAdd}>
              ADD
            </button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={handleDecrement}>
                <FiMinus />
              </button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={handleIncrement}>
                <FiPlus />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
