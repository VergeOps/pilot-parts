import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/account">My Account</Link></li>
          </ul>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} PilotParts &mdash; Demo App. Not a real store.
          </p>
        </div>
      </div>
    </footer>
  );
}
