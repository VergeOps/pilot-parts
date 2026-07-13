import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Avionics', 'Pilot Supplies', 'Hardware', 'Tools', 'Engines & Parts', 'Safety Equipment'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false); });
  }, [search, category]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const val = e.target.elements.search.value.trim();
    setSearch(val);
    setCategory('');
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>All Products</h1>
          <div className="breadcrumb"><a href="/">Home</a> &rsaquo; Products</div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              name="search"
              type="text"
              className="form-control"
              placeholder="Search by name, SKU, or description..."
              defaultValue={search}
              key={search}
            />
            <button type="submit" className="btn btn-primary">Search</button>
            {search && (
              <button type="button" className="btn btn-secondary" onClick={() => setSearch('')}>
                Clear
              </button>
            )}
          </form>

          <div className="filter-bar">
            <span style={{ fontSize: 13, fontWeight: 'bold', marginRight: 4 }}>Category:</span>
            <button
              className={`filter-btn${category === '' ? ' active' : ''}`}
              onClick={() => setCategory('')}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-btn${category === cat ? ' active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ color: 'var(--color-text-muted)', padding: '20px 0' }}>Loading...</p>
          ) : products.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', padding: '20px 0' }}>No products found.</p>
          ) : (
            <>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
