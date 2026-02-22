import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProductsAPI } from '../services/api';
import ProductGrid from '../components/ProductGrid';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!query) { setProducts([]); setLoading(false); return; }
      try {
        setLoading(true);
        const { data } = await searchProductsAPI(query);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [query]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="search-page">
      <h1 className="page-title">Search results for "{query}"</h1>
      <p className="results-count">{products.length} products found</p>
      <ProductGrid products={products} />
    </div>
  );
};

export default SearchPage;
