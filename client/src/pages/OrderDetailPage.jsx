import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetch(`/api/orders/${id}`, { headers: { 'X-User-Id': String(user.id) } })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else { setOrder(data.order); setItems(data.items); }
      });
  }, [id, user, navigate]);

  if (!user) return null;
  if (error) return <div className="page-content"><div className="container"><div className="alert alert-error">{error}</div></div></div>;
  if (!order) return <div className="page-content"><div className="container">Loading...</div></div>;

  const addr = JSON.parse(order.shipping_address);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Order #{order.id}</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> &rsaquo; <Link to="/account">Account</Link> &rsaquo; Order #{order.id}
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Order Date</div>
              <div style={{ fontWeight: 'bold' }}>{new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Status</div>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Order Total</div>
              <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', fontSize: 16 }}>${order.total.toFixed(2)}</div>
            </div>
          </div>

          <div className="section-title">Items Ordered</div>
          <table className="orders-table" style={{ marginBottom: 24 }}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.sku}</td>
                  <td>
                    <Link to={`/products/${item.product_id}`}>{item.name}</Link>
                  </td>
                  <td>${item.unit_price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td style={{ fontWeight: 'bold' }}>${(item.unit_price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} style={{ padding: '8px 10px', textAlign: 'right' }}>Subtotal:</td>
                <td style={{ padding: '8px 10px' }}>${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} style={{ padding: '8px 10px', textAlign: 'right' }}>Tax (7%):</td>
                <td style={{ padding: '8px 10px' }}>${order.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} style={{ padding: '8px 10px', fontWeight: 'bold', textAlign: 'right' }}>Total:</td>
                <td style={{ padding: '8px 10px', fontWeight: 'bold', color: 'var(--color-primary)' }}>${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="section-title">Shipping Address</div>
          <div style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', padding: 14, fontSize: 14, marginBottom: 24, display: 'inline-block', minWidth: 220 }}>
            {addr.fullName}<br />
            {addr.address1}{addr.address2 ? <><br />{addr.address2}</> : ''}<br />
            {addr.city}, {addr.state} {addr.zip}<br />
            {addr.country}
          </div>

          <div>
            <Link to="/account" className="btn btn-secondary">&larr; Back to Order History</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
