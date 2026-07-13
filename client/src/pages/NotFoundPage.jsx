import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-content">
      <div className="container not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    </div>
  );
}
