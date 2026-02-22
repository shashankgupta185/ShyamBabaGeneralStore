import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getCartAPI, addToCartAPI, updateCartAPI, removeFromCartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { setCart([]); return; }
    try {
      setLoading(true);
      const { data } = await getCartAPI();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId) => {
    try {
      await addToCartAPI({ product_id: productId, quantity: 1 });
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateCartAPI({ product_id: productId, quantity });
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCartAPI({ product_id: productId });
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const getItemQuantity = (productId) => {
    const item = cart.find(i => i.product_id === productId);
    return item ? item.quantity : 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart, loading, addToCart, updateQuantity, removeItem,
      getItemQuantity, totalItems, totalAmount, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
