import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setProduct(data.product);
        setLoading(false);
      });
  }, [id]);

  async function handleAddToCart() {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <div className="page-content"><div className="container">Loading...</div></div>;
  if (error || !product) return <div className="page-content"><div className="container"><div className="alert alert-error">{error || 'Product not found.'}</div></div></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>{product.name}</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> &rsaquo; <Link to="/products">Products</Link> &rsaquo; {product.name}
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="product-detail">
            <div>
              <img src={product.image_url} alt={product.name} className="product-detail-img" />
            </div>
            <div className="product-detail-info">
              <div className="product-detail-sku">SKU: {product.sku}</div>
              <div className="product-detail-name">{product.name}</div>
              <div className="product-detail-price">${product.price.toFixed(2)}</div>
              <div>
                <span className="product-detail-category">{product.category}</span>
              </div>
              <div className="product-detail-desc">{product.description}</div>
              {added && <div className="alert alert-success">Item added to cart!</div>}
              {error && <div className="alert alert-error">{error}</div>}
              <div className="qty-selector">
                <label htmlFor="qty">Qty:</label>
                <input
                  id="qty"
                  type="number"
                  className="qty-input"
                  value={qty}
                  min={1}
                  max={99}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={adding}
                  style={{ minWidth: 160 }}
                >
                  {added ? 'Added to Cart!' : adding ? 'Adding...' : 'Add to Cart'}
                </button>
                <Link to="/products" className="btn btn-secondary">Back to Products</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
