import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetch('/api/orders', { headers: { 'X-User-Id': String(user.id) } })
      .then(r => r.json())
      .then(data => { setOrders(data.orders || []); setOrdersLoading(false); });
  }, [user, navigate]);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    if (!name.trim() || !email.trim()) { setProfileError('Name and email are required.'); return; }
    setProfileSaving(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': String(user.id) },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Account</h1>
          <div className="breadcrumb"><Link to="/">Home</Link> &rsaquo; Account</div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="account-layout">
            <div className="account-tabs">
              <button className={`account-tab${tab === 'profile' ? ' active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
              <button className={`account-tab${tab === 'orders' ? ' active' : ''}`} onClick={() => setTab('orders')}>Order History</button>
            </div>

            <div className="account-panel">
              {tab === 'profile' && (
                <div>
                  <h2>Profile</h2>
                  {profileError && <div className="alert alert-error">{profileError}</div>}
                  {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
                  <form onSubmit={handleProfileSave} style={{ maxWidth: 400 }}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {tab === 'orders' && (
                <div>
                  <h2>Order History</h2>
                  {ordersLoading ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
                  ) : orders.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>No orders yet. <Link to="/products">Start shopping</Link>.</p>
                  ) : (
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td><StatusBadge status={order.status} /></td>
                            <td>${order.total.toFixed(2)}</td>
                            <td>
                              <Link to={`/account/orders/${order.id}`} className="btn btn-secondary btn-sm">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
