const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ROUTES = {
  products: {
    list: `${API_BASE_URL}/api/products`,
    get: (id) => `${API_BASE_URL}/api/products/${id}`,
  },
  cart: {
    list: (sessionId) =>
      `${API_BASE_URL}/api/cart?sessionId=${sessionId}`,
    addItem: `${API_BASE_URL}/api/cart`,
    updateItem: (id) => `${API_BASE_URL}/api/cart/${id}`,
    removeItem: (id) => `${API_BASE_URL}/api/cart/${id}`,
    clear: (sessionId) =>
      `${API_BASE_URL}/api/cart/clear?sessionId=${sessionId}`,
  },
};
