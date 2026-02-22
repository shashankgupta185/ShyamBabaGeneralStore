import React, { useState, useEffect } from "react";
import { getCategoriesAPI, getProductsAPI } from "../services/api";
import CategoryGrid from "../components/CategoryGrid";
import ProductGrid from "../components/ProductGrid";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategoriesAPI(),
          getProductsAPI(),
        ]);
        setCategories(catRes.data);
        // debugger;

        setFeatured(prodRes.data.filter((p) => p.is_featured).slice(0, 12));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>
            Groceries delivered in <span className="highlight">minutes</span>
          </h1>
          <p>Get fresh groceries, snacks & essentials at the best prices.</p>
        </div>
        <div className="hero-offers">
          <div className="offer-card offer-yellow">
            <span className="offer-tag">FLAT 25% OFF</span>
            <span className="offer-text">on first order</span>
          </div>
          <div className="offer-card offer-green">
            <span className="offer-tag">FREE DELIVERY</span>
            <span className="offer-text">on orders above ₹199</span>
          </div>
          <div className="offer-card offer-orange">
            <span className="offer-tag">FRESH DEALS</span>
            <span className="offer-text">updated daily</span>
          </div>
        </div>
      </section>

      <CategoryGrid categories={categories} />
      <ProductGrid products={featured} title="⭐ Featured Products" />
    </div>
  );
};

export default Home;
