import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategoryAPI, getCategoriesAPI } from "../services/api";
import ProductGrid from "../components/ProductGrid";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          getProductsByCategoryAPI(slug),
          getCategoriesAPI(),
        ]);
        // debugger;
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  const brands = [...new Set(products.map((p) => p.brand))];

  let filtered = [...products];
  if (filter === "big-packs") {
    filtered = filtered.filter((p) => {
      const w = p.weight.toLowerCase();
      return (
        w.includes("kg") ||
        w.includes("l ") ||
        w.includes("1 l") ||
        w.includes("5 l") ||
        w.includes("10")
      );
    });
  }
  if (priceRange === "under100")
    filtered = filtered.filter((p) => (p.discount_price || p.price) < 100);
  else if (priceRange === "100to300")
    filtered = filtered.filter((p) => {
      const pr = p.discount_price || p.price;
      return pr >= 100 && pr <= 300;
    });
  else if (priceRange === "above300")
    filtered = filtered.filter((p) => (p.discount_price || p.price) > 300);

  if (brandFilter !== "all")
    filtered = filtered.filter((p) => p.brand === brandFilter);

  const currentCat = categories.find((c) => c.slug === slug);

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="category-page">
      <aside className="category-sidebar">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="sidebar-list">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                to={`/category/${c.slug}`}
                className={`sidebar-link ${c.slug === slug ? "active" : ""}`}
              >
                {/* {c.image} {c.name} */}
                <img
                  style={{ width: "30px" }}
                  // className="category-emoji"
                  src={c.image}
                  // alt={c.name}
                  width="150"
                />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="sidebar-title">Filter</h3>
        <ul className="sidebar-list">
          <li>
            <button
              className={`sidebar-link ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </li>
          <li>
            <button
              className={`sidebar-link ${filter === "big-packs" ? "active" : ""}`}
              onClick={() => setFilter("big-packs")}
            >
              Big Packs
            </button>
          </li>
        </ul>

        <h3 className="sidebar-title">Price Range</h3>
        <ul className="sidebar-list">
          <li>
            <button
              className={`sidebar-link ${priceRange === "all" ? "active" : ""}`}
              onClick={() => setPriceRange("all")}
            >
              All Prices
            </button>
          </li>
          <li>
            <button
              className={`sidebar-link ${priceRange === "under100" ? "active" : ""}`}
              onClick={() => setPriceRange("under100")}
            >
              Under ₹100
            </button>
          </li>
          <li>
            <button
              className={`sidebar-link ${priceRange === "100to300" ? "active" : ""}`}
              onClick={() => setPriceRange("100to300")}
            >
              ₹100 - ₹300
            </button>
          </li>
          <li>
            <button
              className={`sidebar-link ${priceRange === "above300" ? "active" : ""}`}
              onClick={() => setPriceRange("above300")}
            >
              Above ₹300
            </button>
          </li>
        </ul>

        {brands.length > 0 && (
          <>
            <h3 className="sidebar-title">Brand</h3>
            <ul className="sidebar-list">
              <li>
                <button
                  className={`sidebar-link ${brandFilter === "all" ? "active" : ""}`}
                  onClick={() => setBrandFilter("all")}
                >
                  All Brands
                </button>
              </li>
              {brands.map((b) => (
                <li key={b}>
                  <button
                    className={`sidebar-link ${brandFilter === b ? "active" : ""}`}
                    onClick={() => setBrandFilter(b)}
                  >
                    {b}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      <div className="category-main">
        {/* <h1 className="page-title">
          {currentCat?.image} {currentCat?.name || slug}
        </h1> */}
        <img
          className="page-title"
          src={currentCat}
          alt={currentCat.name}
          width="150"
        />
        <p className="results-count">{filtered.length} products found</p>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
};

export default CategoryPage;
