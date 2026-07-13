import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function CartPage() {
  const { items, updateQty, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!user) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="cart-empty">
            <h2>Please log in</h2>
            <p style={{ marginBottom: 16 }}>You need to be logged in to view your cart.</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p style={{ marginBottom: 16 }}>Browse our catalog and add some parts.</p>
            <Link to="/products" className="btn btn-primary">Shop Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <div className="breadcrumb"><Link to="/">Home</Link> &rsaquo; Cart</div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <table className="cart-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}></th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.product_id}>
                  <td>
                    <Link to={`/products/${item.product_id}`}>
                      <img src={item.image_url} alt={item.name} className="cart-item-img" />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/products/${item.product_id}`} style={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Link>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.sku}</div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="cart-qty-control">
                      <button onClick={() => updateQty(item.product_id, item.quantity - 1)}>-</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => removeItem(item.product_id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <div className="cart-summary-box">
              <div className="cart-summary-row">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span style={{ color: 'var(--color-text-muted)' }}>Calculated at checkout</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Order Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 14 }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              <Link to="/products" className="btn btn-secondary" style={{ width: '100%', marginTop: 8, textAlign: 'center', display: 'block' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
