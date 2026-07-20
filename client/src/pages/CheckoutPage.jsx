import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { calculateTax } from '../utils/tax';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

function validate(fields) {
  const errors = {};
  if (!fields.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!fields.address1.trim()) errors.address1 = 'Address is required.';
  if (!fields.city.trim()) errors.city = 'City is required.';
  if (!fields.state) errors.state = 'State is required.';
  if (!fields.zip.trim()) errors.zip = 'ZIP code is required.';
  if (!fields.cardName.trim()) errors.cardName = 'Cardholder name is required.';
  if (!/^\d{13,19}$/.test(fields.cardNumber.replace(/\s/g, ''))) errors.cardNumber = 'Enter a valid 13-19 digit card number.';
  if (!/^\d{2}\/\d{2}$/.test(fields.expiry)) errors.expiry = 'Use MM/YY format.';
  if (!/^\d{3,4}$/.test(fields.cvv)) errors.cvv = 'Enter a 3 or 4 digit CVV.';
  return errors;
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    fullName: '', address1: '', address2: '', city: '', state: '', zip: '', country: 'USA',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  function set(field) {
    return e => setFields(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setApiError('');
    try {
      const shippingAddress = {
        fullName: fields.fullName,
        address1: fields.address1,
        address2: fields.address2,
        city: fields.city,
        state: fields.state,
        zip: fields.zip,
        country: fields.country,
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(user.id),
        },
        body: JSON.stringify({ shippingAddress, paymentInfo: { cardName: fields.cardName } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed.');
      clearCart();
      navigate(`/order-confirmation/${data.orderId}`);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="alert alert-error">Please <Link to="/login">sign in</Link> to check out.</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="alert alert-error">Your cart is empty. <Link to="/products">Shop now</Link>.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> &rsaquo; <Link to="/cart">Cart</Link> &rsaquo; Checkout
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <form onSubmit={handleSubmit} noValidate>
            <div className="checkout-layout">
              <div>
                <div className="checkout-section">
                  <h2>Shipping Address</h2>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input className={`form-control${errors.fullName ? ' error' : ''}`} value={fields.fullName} onChange={set('fullName')} />
                    {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                  </div>
                  <div className="form-group">
                    <label>Address Line 1</label>
                    <input className={`form-control${errors.address1 ? ' error' : ''}`} value={fields.address1} onChange={set('address1')} />
                    {errors.address1 && <div className="form-error">{errors.address1}</div>}
                  </div>
                  <div className="form-group">
                    <label>Address Line 2 (Optional)</label>
                    <input className="form-control" value={fields.address2} onChange={set('address2')} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input className={`form-control${errors.city ? ' error' : ''}`} value={fields.city} onChange={set('city')} />
                      {errors.city && <div className="form-error">{errors.city}</div>}
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <select className={`form-control${errors.state ? ' error' : ''}`} value={fields.state} onChange={set('state')}>
                        <option value="">Select...</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <div className="form-error">{errors.state}</div>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input className={`form-control${errors.zip ? ' error' : ''}`} value={fields.zip} onChange={set('zip')} />
                      {errors.zip && <div className="form-error">{errors.zip}</div>}
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input className="form-control" value={fields.country} onChange={set('country')} />
                    </div>
                  </div>
                </div>

                <div className="checkout-section">
                  <h2>Payment Information</h2>
                  <div className="demo-banner">
                    &#9888; Demo Mode — No real payment is processed. Enter any card number.
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input className={`form-control${errors.cardName ? ' error' : ''}`} value={fields.cardName} onChange={set('cardName')} />
                    {errors.cardName && <div className="form-error">{errors.cardName}</div>}
                  </div>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input className={`form-control${errors.cardNumber ? ' error' : ''}`} value={fields.cardNumber} onChange={set('cardNumber')} placeholder="0000 0000 0000 0000" maxLength={19} />
                    {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry (MM/YY)</label>
                      <input className={`form-control${errors.expiry ? ' error' : ''}`} value={fields.expiry} onChange={set('expiry')} placeholder="MM/YY" maxLength={5} />
                      {errors.expiry && <div className="form-error">{errors.expiry}</div>}
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input className={`form-control${errors.cvv ? ' error' : ''}`} value={fields.cvv} onChange={set('cvv')} placeholder="123" maxLength={4} />
                      {errors.cvv && <div className="form-error">{errors.cvv}</div>}
                    </div>
                  </div>
                </div>

                {apiError && <div className="alert alert-error">{apiError}</div>}
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ minWidth: 180 }}>
                  {submitting ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                </button>
              </div>

              <div>
                <div className="order-summary-box">
                  <h3>Order Summary</h3>
                  {items.map(item => (
                    <div key={item.product_id} className="order-summary-item">
                      <span>{item.name} &times;{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="order-summary-item">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="order-summary-item">
                    <span>Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="order-summary-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
