import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders/${id}`, { headers: { 'X-User-Id': String(user.id) } })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else { setOrder(data.order); setItems(data.items); }
      });
  }, [id, user]);

  if (!user) return <div className="page-content"><div className="container"><div className="alert alert-error">Please log in.</div></div></div>;
  if (error) return <div className="page-content"><div className="container"><div className="alert alert-error">{error}</div></div></div>;
  if (!order) return <div className="page-content"><div className="container">Loading...</div></div>;

  const addr = JSON.parse(order.shipping_address);

  return (
    <div className="page-content">
      <div className="container">
        <div className="confirmation-box">
          <div className="confirmation-icon">&#10003;</div>
          <h1>Thank You for Your Order!</h1>
          <div className="confirmation-order-num">Order #{order.id}</div>
          <p style={{ marginBottom: 20, color: 'var(--color-text-muted)' }}>
            Your order has been placed and is being processed.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '8px' }}>Product</th>
                <th style={{ padding: '8px' }}>Qty</th>
                <th style={{ padding: '8px' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px' }}>{item.name}</td>
                  <td style={{ padding: '8px' }}>{item.quantity}</td>
                  <td style={{ padding: '8px' }}>${(item.unit_price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} style={{ padding: '8px', textAlign: 'right' }}>Subtotal:</td>
                <td style={{ padding: '8px' }}>${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: '8px', textAlign: 'right' }}>Tax (7%):</td>
                <td style={{ padding: '8px' }}>${order.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>Order Total:</td>
                <td style={{ padding: '8px', fontWeight: 'bold', color: 'var(--color-primary)' }}>${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style={{ textAlign: 'left', background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', padding: 12, marginBottom: 20, fontSize: 13 }}>
            <strong>Shipping To:</strong><br />
            {addr.fullName}<br />
            {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}<br />
            {addr.city}, {addr.state} {addr.zip}, {addr.country}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
            <Link to="/account" className="btn btn-secondary">View Order History</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
