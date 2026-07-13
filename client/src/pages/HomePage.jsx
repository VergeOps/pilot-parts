import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setFeatured((data.products || []).slice(0, 8)));
  }, []);

  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1>Aviation Parts &amp; Supplies</h1>
          <p>Trusted by pilots and mechanics for avionics, hardware, tools, and pilot supplies.</p>
          <Link to="/products" className="btn btn-secondary">Shop All Products</Link>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="section-title">Featured Products</div>
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to="/products" className="btn btn-primary">View All 25 Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
