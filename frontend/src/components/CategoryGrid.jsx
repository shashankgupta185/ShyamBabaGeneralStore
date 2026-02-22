import React from "react";
import { Link } from "react-router-dom";

const CategoryGrid = ({ categories }) => {
  return (
    <section className="category-section">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            to={`/category/${cat.slug}`}
            key={cat.id}
            className="category-card"
          >
            <div className="category-icon-wrapper">
              <img
                className="category-emoji"
                src={cat.image}
                alt={cat.name}
                width="150"
              />
            </div>
            <span className="category-name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
