import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // ignore
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="product-card-img"
        />
      </Link>
      <div className="product-card-body">
        <div className="product-card-sku">{product.sku}</div>
        <div className="product-card-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </div>
        <div className="product-card-price">${product.price.toFixed(2)}</div>
      </div>
      <div className="product-card-footer">
        <button
          className="btn btn-primary"
          onClick={handleAddToCart}
          disabled={adding}
        >
          {added ? 'Added!' : adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
