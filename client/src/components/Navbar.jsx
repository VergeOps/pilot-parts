import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    clearCart();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="container">
          <Link to="/" className="site-logo">PilotParts</Link>
          <span className="header-tagline">Aviation Parts &amp; Supplies</span>
        </div>
      </div>
      <nav className="header-nav">
        <div className="container">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            {user && <li><Link to="/account">Account</Link></li>}
          </ul>
          <div className="nav-right">
            <Link to="/cart" className="cart-link">
              &#128722; Cart
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
            {user ? (
              <button className="nav-auth-btn" onClick={handleLogout}>
                Logout ({user.name.split(' ')[0]})
              </button>
            ) : (
              <button className="nav-auth-btn" onClick={() => navigate('/login')}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
