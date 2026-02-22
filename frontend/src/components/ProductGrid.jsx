import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, title }) => {
  return (
    <section className="product-section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="empty-state">
          <p>No products found.</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
