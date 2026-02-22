import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛒</span>
          <span className="brand-text">ShopCode</span>
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder='Search for grocery items...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-cart-btn">
                <FiShoppingCart />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
              <div className="nav-user-menu">
                <button className="nav-user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  <FiUser />
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                    <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-login-btn">Login</Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
